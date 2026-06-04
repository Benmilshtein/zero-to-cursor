"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useActivityReporter } from "./types";

type Props = {
  id: string;
  question: string;
  options: string[];
  correct: number; // index
  explanation?: string;
};

export function Quiz({ id, question, options, correct, explanation }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const reporter = useActivityReporter();

  function submit() {
    if (selected === null) return;
    setRevealed(true);
    const isCorrect = selected === correct;
    reporter.report({ id, correct: isCorrect, score: isCorrect ? 100 : 0 });
  }

  function reset() {
    setSelected(null);
    setRevealed(false);
  }

  return (
    <div className="my-6 rounded-2xl border border-ink-600 bg-ink-800 p-6">
      <div className="text-xs uppercase tracking-wider text-brand-500 mb-2">Quiz</div>
      <p className="text-white text-lg font-medium mb-4">{question}</p>
      <div className="space-y-2">
        {options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = revealed && i === correct;
          const isWrong = revealed && isSelected && i !== correct;
          return (
            <button
              key={i}
              type="button"
              disabled={revealed}
              onClick={() => setSelected(i)}
              className={cn(
                "w-full text-left rounded-xl border px-4 py-3 transition",
                "border-ink-600 bg-ink-700 text-zinc-200 hover:border-brand-500",
                isSelected && !revealed && "border-brand-500 bg-ink-600",
                isCorrect && "border-emerald-500 bg-emerald-500/10 text-emerald-200",
                isWrong && "border-red-500 bg-red-500/10 text-red-200",
                revealed && "cursor-default",
              )}
            >
              <span className="font-mono text-xs text-zinc-500 mr-3">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-3">
        {!revealed ? (
          <button
            type="button"
            onClick={submit}
            disabled={selected === null}
            className="rounded-xl bg-brand-500 px-4 py-2 font-medium text-ink hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check
          </button>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="rounded-xl border border-ink-500 px-4 py-2 text-zinc-300 hover:bg-ink-700"
          >
            Try again
          </button>
        )}
        {revealed && explanation && (
          <p className="text-sm text-zinc-400">{explanation}</p>
        )}
      </div>
    </div>
  );
}
