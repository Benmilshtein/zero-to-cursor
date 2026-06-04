"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { ActivityContext, type ActivityResult } from "@/components/activities/types";
import { ProgressBar } from "./ProgressBar";
import { AICoachPanel } from "@/components/ai/AICoachPanel";

type Neighbor = { slug: string; title: string } | null;

type Props = {
  lesson: {
    slug: string;
    title: string;
    estMinutes: number;
    levelSlug: string;
    levelTitle: string;
    ordinalInLevel: number;
    totalInLevel: number;
  };
  prev: Neighbor;
  next: Neighbor;
  isAuthenticated: boolean;
  children: React.ReactNode;
};

export function LessonShell({ lesson, prev, next, isAuthenticated, children }: Props) {
  const [results, setResults] = useState<Record<string, ActivityResult>>({});
  const [persisted, setPersisted] = useState(false);

  const report = useCallback((result: ActivityResult) => {
    setResults((prev) => ({ ...prev, [result.id]: result }));
  }, []);

  const contextValue = useMemo(() => ({ report }), [report]);

  const totalActivities = Object.keys(results).length;
  const correct = Object.values(results).filter((r) => r.correct).length;
  const allDone = totalActivities > 0 && correct === totalActivities;

  async function complete() {
    if (!isAuthenticated) {
      // Anonymous users: store completion locally so progress shows in this session.
      const key = "z2c.anon.progress";
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (!list.includes(lesson.slug)) {
        list.push(lesson.slug);
        window.localStorage.setItem(key, JSON.stringify(list));
      }
      setPersisted(true);
      return;
    }

    const score = Math.round((correct / Math.max(totalActivities, 1)) * 100);
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lessonSlug: lesson.slug, score }),
    });
    if (res.ok) setPersisted(true);
  }

  return (
    <ActivityContext.Provider value={contextValue}>
      <div className="border-b border-ink-700 bg-ink-800/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-3xl px-6 py-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <Link href={`/levels/${lesson.levelSlug}`} className="hover:text-white">
              ← {lesson.levelTitle}
            </Link>
            <span>
              Lesson {lesson.ordinalInLevel} of {lesson.totalInLevel} · ~{lesson.estMinutes} min
            </span>
          </div>
          <ProgressBar
            value={lesson.ordinalInLevel / lesson.totalInLevel}
            className="mt-2"
          />
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-semibold text-white">{lesson.title}</h1>
        <div className="mt-2 text-sm text-zinc-500">
          Level {lesson.levelSlug.match(/^level-(\d+)/)?.[1]} · {lesson.levelTitle}
        </div>
        <article className="prose-invert mt-6">{children}</article>

        <div className="mt-10 rounded-2xl border border-ink-600 bg-ink-800 p-6">
          {totalActivities === 0 ? (
            <button
              type="button"
              onClick={complete}
              className="w-full rounded-xl bg-brand-500 px-5 py-3 font-medium text-ink hover:bg-brand-600"
            >
              Mark complete →
            </button>
          ) : allDone ? (
            persisted ? (
              <div className="text-center">
                <p className="text-emerald-300 font-medium">Lesson complete.</p>
                {next ? (
                  <Link
                    href={`/lessons/${next.slug}`}
                    className="mt-3 inline-block rounded-xl bg-brand-500 px-5 py-2.5 font-medium text-ink hover:bg-brand-600"
                  >
                    Next: {next.title} →
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="mt-3 inline-block rounded-xl bg-brand-500 px-5 py-2.5 font-medium text-ink hover:bg-brand-600"
                  >
                    See your progress →
                  </Link>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={complete}
                className="w-full rounded-xl bg-brand-500 px-5 py-3 font-medium text-ink hover:bg-brand-600"
              >
                Mark complete · {correct}/{totalActivities} correct
              </button>
            )
          ) : (
            <p className="text-center text-sm text-zinc-400">
              Finish the activities above to complete this lesson. ({correct}/{totalActivities})
            </p>
          )}
        </div>

        <nav className="mt-6 flex items-center justify-between text-sm">
          {prev ? (
            <Link
              href={`/lessons/${prev.slug}`}
              className="rounded-xl border border-ink-500 px-4 py-2 text-zinc-300 hover:bg-ink-700"
            >
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/lessons/${next.slug}`}
              className="rounded-xl border border-ink-500 px-4 py-2 text-zinc-300 hover:bg-ink-700"
            >
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </main>

      <AICoachPanel lessonTitle={lesson.title} />
    </ActivityContext.Provider>
  );
}
