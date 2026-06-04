"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useActivityReporter } from "./types";

type Pair = { left: string; right: string };

type Props = {
  id: string;
  pairs: Pair[];
};

/**
 * Click-to-match (not true drag — better for accessibility and mobile).
 * Click a left item, then a right item to attempt a pair.
 */
export function DragMatch({ id, pairs }: Props) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [wrong, setWrong] = useState<{ l: string; r: string } | null>(null);
  const reporter = useActivityReporter();

  const shuffledRights = useMemo(() => {
    const rs = pairs.map((p) => p.right);
    for (let i = rs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rs[i], rs[j]] = [rs[j]!, rs[i]!];
    }
    return rs;
  }, [pairs]);

  function attempt(left: string, right: string) {
    const expected = pairs.find((p) => p.left === left)?.right;
    if (expected === right) {
      const next = { ...matched, [left]: right };
      setMatched(next);
      setSelectedLeft(null);
      setWrong(null);
      if (Object.keys(next).length === pairs.length) {
        reporter.report({ id, correct: true, score: 100 });
      }
    } else {
      setWrong({ l: left, r: right });
      setTimeout(() => setWrong(null), 500);
    }
  }

  const done = Object.keys(matched).length === pairs.length;

  return (
    <div className="my-6 rounded-2xl border border-ink-600 bg-ink-800 p-6">
      <div className="text-xs uppercase tracking-wider text-brand-500 mb-3">Match the pairs</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {pairs.map((p) => {
            const isMatched = matched[p.left] !== undefined;
            const isSelected = selectedLeft === p.left;
            return (
              <button
                key={p.left}
                type="button"
                disabled={isMatched}
                onClick={() => setSelectedLeft(p.left)}
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-left transition",
                  "border-ink-600 bg-ink-700 text-zinc-200 hover:border-brand-500",
                  isSelected && "border-brand-500 bg-ink-600",
                  isMatched && "opacity-50 line-through cursor-default",
                  wrong?.l === p.left && "border-red-500 animate-pulse",
                )}
              >
                {p.left}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {shuffledRights.map((r) => {
            const isMatched = Object.values(matched).includes(r);
            return (
              <button
                key={r}
                type="button"
                disabled={isMatched || !selectedLeft}
                onClick={() => selectedLeft && attempt(selectedLeft, r)}
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-left transition",
                  "border-ink-600 bg-ink-700 text-zinc-200 hover:border-brand-500",
                  isMatched && "opacity-50 line-through cursor-default",
                  wrong?.r === r && "border-red-500 animate-pulse",
                )}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>
      {done && <p className="mt-4 text-sm text-emerald-400">All matched.</p>}
    </div>
  );
}
