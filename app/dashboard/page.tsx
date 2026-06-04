import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import { getAllLevels } from "@/lib/mdx/loader";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/dashboard");

  const [{ data: progress }, { data: achievements }, { data: streak }, levels] = await Promise.all([
    supabase.from("progress").select("lesson_slug, status, completed_at").eq("user_id", user.id),
    supabase
      .from("user_achievements")
      .select("achievement_slug, earned_at, achievements(title, description, icon)")
      .eq("user_id", user.id),
    supabase.from("streaks").select("current_streak, longest_streak").eq("user_id", user.id).single(),
    getAllLevels(),
  ]);

  const completed = new Set(
    (progress ?? []).filter((p) => p.status === "completed").map((p) => p.lesson_slug),
  );

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-semibold text-white">Your progress</h1>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <Stat label="Lessons completed" value={completed.size} />
          <Stat label="Current streak" value={`${streak?.current_streak ?? 0}d`} />
          <Stat label="Achievements" value={achievements?.length ?? 0} />
        </div>

        <h2 className="mt-10 text-xl font-semibold text-white">Levels</h2>
        <div className="mt-4 space-y-3">
          {levels.map((lvl) => {
            const total = lvl.lessons.length;
            const done = lvl.lessons.filter((l) => completed.has(l.slug)).length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <Link
                key={lvl.slug}
                href={`/levels/${lvl.slug}`}
                className="block rounded-xl border border-ink-600 bg-ink-800 p-4 hover:border-brand-500"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">
                    <span className="font-mono text-brand-500 mr-2">
                      {String(lvl.ordinal).padStart(2, "0")}
                    </span>
                    {lvl.title}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {done}/{total || "—"}
                  </p>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {achievements && achievements.length > 0 && (
          <>
            <h2 className="mt-10 text-xl font-semibold text-white">Achievements</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {achievements.map((a) => {
                const meta = Array.isArray(a.achievements) ? a.achievements[0] : a.achievements;
                return (
                  <div
                    key={a.achievement_slug}
                    className="rounded-xl border border-ink-600 bg-ink-800 p-4"
                  >
                    <p className="font-medium text-white">
                      {meta?.title ?? a.achievement_slug}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {meta?.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-ink-600 bg-ink-800 p-4">
      <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
