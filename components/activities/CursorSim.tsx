"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useActivityReporter } from "./types";

type Step =
  | { kind: "keypress"; keys: string; label?: string }
  | { kind: "type"; text: string; label?: string }
  | { kind: "click"; target: string; label?: string }
  | { kind: "accept"; label?: string };

type Props = {
  id: string;
  /** Scenario instructions shown above the simulator. */
  scenario: string;
  /** Ordered steps the learner must perform. */
  steps: Step[];
  /** Optional starter code displayed in the editor area. */
  starter?: string;
};

/**
 * A scripted, click-driven mock of the Cursor UI. The learner advances by
 * performing each step in order — pressing the indicated key combo, typing
 * the text into the inline prompt, clicking Accept, etc. We don't try to be
 * a real editor; we just teach the *shape* of the interaction.
 */
export function CursorSim({ id, scenario, steps, starter }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const reporter = useActivityReporter();

  const current = steps[stepIdx];

  function advance() {
    if (stepIdx + 1 >= steps.length) {
      setDone(true);
      reporter.report({ id, correct: true, score: 100 });
    } else {
      setStepIdx(stepIdx + 1);
      setTyped("");
    }
  }

  function reset() {
    setStepIdx(0);
    setTyped("");
    setDone(false);
  }

  return (
    <div className="my-6 rounded-2xl border border-ink-600 bg-ink-800 p-6">
      <div className="text-xs uppercase tracking-wider text-brand-500 mb-2">Try it in Cursor (simulated)</div>
      <p className="text-white text-base mb-4">{scenario}</p>

      <div className="rounded-xl border border-ink-600 bg-ink-900 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-ink-700 bg-ink-800 px-3 py-2">
          <span className="h-3 w-3 rounded-full bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
          <span className="ml-3 text-xs font-mono text-zinc-500">Cursor — my-project</span>
        </div>
        <div className="font-mono text-sm text-zinc-300 p-4 min-h-[160px] whitespace-pre">
          {starter ?? "// click below to follow the steps"}
        </div>

        {!done && current && (
          <div className="border-t border-ink-700 bg-ink-800 p-4 space-y-3">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Step {stepIdx + 1} of {steps.length}
            </p>

            {current.kind === "keypress" && (
              <button
                type="button"
                onClick={advance}
                className="rounded-xl border border-brand-500 px-4 py-2 font-mono text-sm text-brand-100 hover:bg-brand-500/10"
              >
                Press {current.keys}
              </button>
            )}

            {current.kind === "type" && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  placeholder={current.text}
                  className="flex-1 rounded-md border border-ink-500 bg-ink-700 px-3 py-2 text-white font-mono text-sm outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={advance}
                  disabled={typed.trim().toLowerCase() !== current.text.trim().toLowerCase()}
                  className="rounded-xl bg-brand-500 px-3 py-2 text-sm font-medium text-ink disabled:opacity-40"
                >
                  Submit
                </button>
              </div>
            )}

            {current.kind === "click" && (
              <button
                type="button"
                onClick={advance}
                className="rounded-xl border border-brand-500 px-4 py-2 text-sm text-brand-100 hover:bg-brand-500/10"
              >
                Click {current.target}
              </button>
            )}

            {current.kind === "accept" && (
              <button
                type="button"
                onClick={advance}
                className="rounded-xl bg-emerald-500/20 border border-emerald-500 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-500/30"
              >
                Accept ✓
              </button>
            )}

            {current.label && (
              <p className="text-xs text-zinc-500">{current.label}</p>
            )}
          </div>
        )}

        {done && (
          <div className="border-t border-ink-700 bg-emerald-500/10 p-4 flex items-center justify-between">
            <p className="text-sm text-emerald-300">Nice — you&apos;ve completed the interaction.</p>
            <button
              type="button"
              onClick={reset}
              className={cn("text-xs text-emerald-300 underline underline-offset-2")}
            >
              Replay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
