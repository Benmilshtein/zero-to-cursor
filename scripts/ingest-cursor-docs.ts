#!/usr/bin/env tsx
/**
 * Fetch a page from docs.cursor.com and produce a draft MDX lesson skeleton.
 *
 * Usage:
 *   pnpm ingest-cursor-docs https://docs.cursor.com/cmdk
 *
 * Writes to: drafts/<slugified-url>.mdx
 *
 * This is a SKELETON GENERATOR — the output is always a draft. A human must
 * edit, fact-check, restructure, and add activities before publishing.
 */

import fs from "node:fs/promises";
import path from "node:path";

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error("Usage: pnpm ingest-cursor-docs <docs.cursor.com URL>");
    process.exit(1);
  }
  if (!url.startsWith("https://docs.cursor.com")) {
    console.error("URL must be on docs.cursor.com");
    process.exit(1);
  }

  console.log(`Fetching ${url}…`);
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Fetch failed: ${res.status}`);
    process.exit(1);
  }
  const html = await res.text();

  // Crude extraction: grab <title>, headings, and paragraph text.
  // (For production, swap for proper HTML parsing — kept dep-free here.)
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.replace(/\s*\|.*$/, "").trim() ?? "Untitled";
  const slug = url
    .replace(/^https:\/\/docs\.cursor\.com\/?/, "")
    .replace(/\/$/, "")
    .replace(/[^a-z0-9-]/gi, "-")
    .toLowerCase() || "index";

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 60)
    .join("\n\n");

  const draftDir = path.join(process.cwd(), "drafts");
  await fs.mkdir(draftDir, { recursive: true });
  const filePath = path.join(draftDir, `${slug}.mdx`);

  const body = `---
title: ${title}
estMinutes: 3
activityTypes: ["Quiz"]
status: draft
description: Draft generated from ${url}
source: ${url}
---

> **⚠️ Draft.** Generated from \`${url}\`. Rewrite in the course's voice, verify
> every Cursor feature against the current product, and add at least one
> activity before merging.

${text.slice(0, 2000)}

---

### Suggested activity

<Quiz
  id="q1"
  question="Replace with a real question."
  options={["A", "B", "C", "D"]}
  correct={0}
/>
`;

  await fs.writeFile(filePath, body, "utf8");
  console.log(`✔ Wrote draft to ${path.relative(process.cwd(), filePath)}`);
  console.log("  → Edit, fact-check, then move to content/lessons/<level>/NN-slug.mdx");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
