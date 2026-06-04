"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useActivityReporter } from "./types";

type Target = {
  /** Display name shown to the user. */
  label: string;
  /** Bounding box as percentages (0-100). */
  x: number;
  y: number;
  w: number;
  h: number;
};

type Props = {
  id: string;
  /** Image URL or path. */
  image: string;
  alt?: string;
  /** Which target the user must click. */
  prompt: string;
  targets: Target[];
  /** Index in `targets` of the correct one. */
  correct: number;
};

export function UIHotspot({ id, image, alt, prompt, targets, correct }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const reporter = useActivityReporter();

  function pick(i: number) {
    setPicked(i);
    const ok = i === correct;
    reporter.report({ id, correct: ok, score: ok ? 100 : 0 });
  }

  return (
    <div className="my-6 rounded-2xl border border-ink-600 bg-ink-800 p-6">
      <div className="text-xs uppercase tracking-wider text-brand-500 mb-2">Find it</div>
      <p className="text-white text-lg font-medium mb-4">{prompt}</p>
      <div className="relative w-full overflow-hidden rounded-xl border border-ink-600">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={alt ?? ""} className="block w-full" />
        {targets.map((t, i) => {
          const isPicked = picked === i;
          const isCorrect = picked !== null && i === correct;
          const isWrong = isPicked && i !== correct;
          return (
            <button
              key={i}
              type="button"
              onClick={() => pick(i)}
              aria-label={t.label}
              className={cn(
                "absolute rounded-md border-2 transition",
                "border-transparent hover:border-brand-500/60",
                isPicked && !isCorrect && !isWrong && "border-brand-500",
                isCorrect && "border-emerald-500 bg-emerald-500/20",
                isWrong && "border-red-500 bg-red-500/20",
              )}
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                width: `${t.w}%`,
                height: `${t.h}%`,
              }}
            />
          );
        })}
      </div>
      {picked !== null && (
        <p
          className={cn(
            "mt-4 text-sm",
            picked === correct ? "text-emerald-400" : "text-red-400",
          )}
        >
          {picked === correct
            ? `That's the ${targets[correct]!.label}.`
            : `Not quite — you picked the ${targets[picked]!.label}. Try again.`}
        </p>
      )}
    </div>
  );
}
