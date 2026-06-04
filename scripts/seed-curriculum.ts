#!/usr/bin/env tsx
/**
 * Sync the MDX content manifest to the Supabase `lessons` table.
 *
 * Reads every level + lesson under content/lessons/, upserts the lessons
 * catalog row. Levels are seeded by supabase/seed.sql; this script handles
 * the per-lesson rows whose source of truth is the MDX files.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in env.
 */

import { createClient } from "@supabase/supabase-js";
import { getAllLevels } from "../lib/mdx/loader";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const levels = await getAllLevels();

  let count = 0;
  for (const lvl of levels) {
    for (const lesson of lvl.lessons) {
      const { error } = await supabase
        .from("lessons")
        .upsert({
          slug: lesson.slug,
          level_slug: lvl.slug,
          ordinal: lesson.ordinal,
          title: lesson.frontmatter.title,
          est_minutes: lesson.frontmatter.estMinutes ?? 3,
          activity_types: lesson.frontmatter.activityTypes ?? [],
          status: lesson.frontmatter.status ?? "published",
        });
      if (error) {
        console.error(`✗ ${lesson.slug}: ${error.message}`);
      } else {
        count++;
      }
    }
  }
  console.log(`✔ Seeded ${count} lessons across ${levels.length} levels.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
