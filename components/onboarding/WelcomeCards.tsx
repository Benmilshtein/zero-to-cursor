"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const CARDS = [
  {
    emoji: "🎉",
    title: "100% Free, Forever",
    body: "Every lesson, every level. No credit card, no trial period, no upsell. Completely free.",
  },
  {
    emoji: "🤖",
    title: "AI-Powered Learning",
    body: "Bring your own API key. Get a personal coach inside every lesson. Hands-on exercises teach you by doing.",
  },
  {
    emoji: "🤝",
    title: "Open Source",
    body: "MIT-licensed. Run it locally, fork it, contribute lessons. Built by people who use Cursor every day.",
  },
];

export function WelcomeCards() {
  const [idx, setIdx] = useState(0);
  const card = CARDS[idx]!;
  const isLast = idx === CARDS.length - 1;

  return (
    <div className="w-full max-w-md rounded-2xl border border-ink-600 bg-ink-800/90 p-6 shadow-2xl backdrop-blur">
      <div className="flex items-center gap-3 mb-4">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500/20 text-brand-500 text-lg">
          ✦
        </div>
        <div>
          <p className="font-semibold text-white">Welcome!</p>
          <p className="text-xs text-zinc-400">Let&apos;s get you started</p>
        </div>
      </div>
      <div className="py-2 text-center">
        <div className="text-4xl mb-2">{card.emoji}</div>
        <h3 className="text-lg font-semibold text-white">{card.title}</h3>
        <p className="mt-2 text-sm text-zinc-400">{card.body}</p>
      </div>
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {CARDS.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === idx ? "w-6 bg-brand-500" : "w-1.5 bg-ink-500",
            )}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIdx(Math.max(0, idx - 1))}
          disabled={idx === 0}
          className="flex-1 rounded-xl border border-ink-500 px-3 py-2 text-sm text-zinc-300 disabled:opacity-40 hover:bg-ink-700"
        >
          Back
        </button>
        {isLast ? (
          <Link
            href="/auth/signup"
            className="flex-1 rounded-xl bg-brand-500 px-3 py-2 text-center text-sm font-medium text-ink hover:bg-brand-600"
          >
            Create Free Account
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setIdx(idx + 1)}
            className="flex-1 rounded-xl bg-brand-500 px-3 py-2 text-sm font-medium text-ink hover:bg-brand-600"
          >
            Next
          </button>
        )}
      </div>
      <p className="mt-3 text-center text-xs text-zinc-500">
        Or{" "}
        <Link href="/lessons/level-01-cursor-is-not-magic/01-what-is-an-editor" className="text-brand-500 hover:underline">
          try the first lesson without an account
        </Link>
      </p>
    </div>
  );
}
