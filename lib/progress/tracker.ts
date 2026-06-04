import { createClient } from "@/lib/supabase/server";

export async function markLessonComplete(lessonSlug: string, score: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauthenticated" as const };

  const { error } = await supabase
    .from("progress")
    .upsert(
      {
        user_id: user.id,
        lesson_slug: lessonSlug,
        status: "completed",
        score,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_slug" },
    );

  if (error) return { ok: false, reason: error.message };

  await updateStreak(user.id);
  await evaluateAchievements(user.id, lessonSlug);
  return { ok: true };
}

async function updateStreak(userId: string) {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: streak } = await supabase
    .from("streaks")
    .select("current_streak, longest_streak, last_active_date")
    .eq("user_id", userId)
    .single();

  if (!streak) return;

  let current = streak.current_streak ?? 0;
  const last = streak.last_active_date;

  if (last === today) {
    return;
  } else if (last && daysBetween(last, today) === 1) {
    current += 1;
  } else {
    current = 1;
  }

  const longest = Math.max(streak.longest_streak ?? 0, current);

  await supabase
    .from("streaks")
    .update({
      current_streak: current,
      longest_streak: longest,
      last_active_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);
}

function daysBetween(a: string, b: string) {
  const da = new Date(a + "T00:00:00Z").getTime();
  const db = new Date(b + "T00:00:00Z").getTime();
  return Math.round((db - da) / 86_400_000);
}

async function evaluateAchievements(userId: string, justCompletedSlug: string) {
  const supabase = await createClient();

  const { count: completedCount } = await supabase
    .from("progress")
    .select("lesson_slug", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "completed");

  const earned: string[] = [];
  if ((completedCount ?? 0) >= 1) earned.push("first-lesson");
  if ((completedCount ?? 0) >= 10) earned.push("ten-lessons");

  const { data: streak } = await supabase
    .from("streaks")
    .select("current_streak")
    .eq("user_id", userId)
    .single();
  if ((streak?.current_streak ?? 0) >= 3) earned.push("streak-3");
  if ((streak?.current_streak ?? 0) >= 7) earned.push("streak-7");

  if (justCompletedSlug.startsWith("level-01-")) {
    const { data: lvl1 } = await supabase
      .from("lessons")
      .select("slug")
      .eq("level_slug", "level-01-cursor-is-not-magic");
    const { data: done } = await supabase
      .from("progress")
      .select("lesson_slug")
      .eq("user_id", userId)
      .eq("status", "completed")
      .like("lesson_slug", "level-01-%");
    if (lvl1 && done && done.length >= lvl1.length) earned.push("level-1-complete");
  }

  for (const slug of earned) {
    await supabase
      .from("user_achievements")
      .upsert(
        { user_id: userId, achievement_slug: slug },
        { onConflict: "user_id,achievement_slug", ignoreDuplicates: true },
      );
  }
}
