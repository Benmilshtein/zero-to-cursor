"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useActivityReporter } from "./types";

type Props = {
  id: string;
  /** Prompt with `___` where the blank should be. */
  prompt: string;
  answer: string | string[];
  caseSensitive?: boolean;
  hint?: string;
};

export function FillInBlank({ id, prompt, answer, caseSensitive, hint }: Props) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "correct" | "wrong">("idle");
  const reporter = useActivityReporter();
  const answers = Array.isArray(answer) ? answer : [answer];

  function check() {
    const normalize = (s: string) => (caseSensitive ? s.trim() : s.trim().toLowerCase());
    const ok = answers.some((a) => normalize(a) === normalize(value));
    setState(ok ? "correct" : "wrong");
    reporter.report({ id, correct: ok, score: ok ? 100 : 0 });
  }

  const [before, after] = prompt.split("___");

  return (
    <div className="my-6 rounded-2xl border border-ink-600 bg-ink-800 p-6">
      <div className="text-xs uppercase tracking-wider text-brand-500 mb-2">Fill in the blank</div>
      <div className="flex flex-wrap items-center gap-2 text-lg text-zinc-200 font-mono">
        <span>{before}</span>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setState("idle");
          }}
          className={cn(
            "min-w-[8rem] rounded-md border bg-ink-700 px-3 py-1 text-white outline-none focus:border-brand-500",
            state === "correct" && "border-emerald-500",
            state === "wrong" && "border-red-500",
            state === "idle" && "border-ink-500",
          )}
          placeholder="…"
        />
        <span>{after}</span>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={check}
          disabled={!value.trim()}
          className="rounded-xl bg-brand-500 px-4 py-2 font-medium text-ink hover:bg-brand-600 disabled:opacity-40"
        >
          Check
        </button>
        {hint && state !== "correct" && (
          <p className="text-sm text-zinc-500">Hint: {hint}</p>
        )}
        {state === "correct" && <p className="text-sm text-emerald-400">Correct.</p>}
        {state === "wrong" && <p className="text-sm text-red-400">Not quite — try again.</p>}
      </div>
    </div>
  );
}
