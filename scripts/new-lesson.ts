#!/usr/bin/env tsx
/**
 * Scaffold a new lesson MDX file.
 *
 * Usage:
 *   pnpm new-lesson level-03-tab-completion 05 "Multi-line completions"
 *   pnpm new-lesson level-03-tab-completion/05-multi-line-completions
 *
 * If the second form is used, the title is derived from the slug.
 */

import fs from "node:fs/promises";
import path from "node:path";

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: pnpm new-lesson <level-slug> <ordinal> [title]");
    console.error("   or: pnpm new-lesson <level-slug>/<NN-lesson-slug> [title]");
    process.exit(1);
  }

  let levelSlug: string;
  let ordinal: string;
  let lessonSlug: string;
  let title: string;

  if (args[0]!.includes("/")) {
    const [lvl, file] = args[0]!.split("/");
    levelSlug = lvl!;
    const m = file!.match(/^(\d+)-(.+)$/);
    if (!m) {
      console.error("Lesson slug must start with NN- (e.g. 05-multi-line-tab)");
      process.exit(1);
    }
    ordinal = m[1]!.padStart(2, "0");
    lessonSlug = `${ordinal}-${m[2]}`;
    title = args[1] ?? m[2]!.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
  } else {
    levelSlug = args[0]!;
    ordinal = (args[1] ?? "01").padStart(2, "0");
    title = args[2] ?? "Untitled lesson";
    lessonSlug = `${ordinal}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
  }

  const dir = path.join(process.cwd(), "content", "lessons", levelSlug);
  await fs.mkdir(dir, { recursive: true });

  const filePath = path.join(dir, `${lessonSlug}.mdx`);
  try {
    await fs.access(filePath);
    console.error(`File already exists: ${filePath}`);
    process.exit(1);
  } catch {
    // OK
  }

  const body = `---
title: ${title}
estMinutes: 3
activityTypes: ["Quiz"]
status: draft
description: One-line description of what this lesson teaches.
---

Write the lesson body here. Keep it short — 200-400 words is the sweet spot.

Use bullets and short paragraphs. Code samples in fenced blocks:

\`\`\`ts
function example() {
  return "hi";
}
\`\`\`

End with one or two activities. Here's a sample quiz:

<Quiz
  id="q1"
  question="What's the answer?"
  options={["A", "B", "C", "D"]}
  correct={1}
  explanation="Optional explanation."
/>
`;

  await fs.writeFile(filePath, body, "utf8");
  console.log(`✔ Created ${path.relative(process.cwd(), filePath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
