import type { ComponentProps } from "react";
import { Quiz } from "@/components/activities/Quiz";
import { FillInBlank } from "@/components/activities/FillInBlank";
import { DragMatch } from "@/components/activities/DragMatch";
import { UIHotspot } from "@/components/activities/UIHotspot";
import { CursorSim } from "@/components/activities/CursorSim";

type H = ComponentProps<"h1">;
type P = ComponentProps<"p">;
type Ul = ComponentProps<"ul">;
type Ol = ComponentProps<"ol">;
type Li = ComponentProps<"li">;
type Code = ComponentProps<"code">;
type Pre = ComponentProps<"pre">;
type A = ComponentProps<"a">;
type BQ = ComponentProps<"blockquote">;

export const mdxComponents = {
  Quiz,
  FillInBlank,
  DragMatch,
  UIHotspot,
  CursorSim,
  h1: (p: H) => <h1 className="text-3xl font-semibold mt-8 mb-4 text-white" {...p} />,
  h2: (p: H) => <h2 className="text-2xl font-semibold mt-8 mb-3 text-white" {...p} />,
  h3: (p: H) => <h3 className="text-xl font-semibold mt-6 mb-2 text-white" {...p} />,
  p: (p: P) => <p className="my-4 leading-7 text-zinc-300" {...p} />,
  ul: (p: Ul) => <ul className="list-disc pl-6 my-4 space-y-2 text-zinc-300" {...p} />,
  ol: (p: Ol) => <ol className="list-decimal pl-6 my-4 space-y-2 text-zinc-300" {...p} />,
  li: (p: Li) => <li className="leading-7" {...p} />,
  code: (p: Code) => (
    <code
      className="font-mono text-[0.9em] px-1.5 py-0.5 rounded bg-ink-700 text-brand-100 border border-ink-600"
      {...p}
    />
  ),
  pre: (p: Pre) => (
    <pre
      className="my-4 p-4 rounded-xl bg-ink-800 border border-ink-600 overflow-x-auto text-sm"
      {...p}
    />
  ),
  a: (p: A) => <a className="text-brand-500 underline underline-offset-2 hover:text-brand-600" {...p} />,
  blockquote: (p: BQ) => (
    <blockquote className="border-l-4 border-brand-500 pl-4 my-4 italic text-zinc-400" {...p} />
  ),
  hr: () => <hr className="my-8 border-ink-600" />,
};
