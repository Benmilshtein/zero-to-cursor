# Zero to Cursor

> An open-source, interactive curriculum that takes anyone from absolute zero to shipping with **Cursor** — the AI-first IDE. Inspired by [zero2claude.dev](https://zero2claude.dev).

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## What this is

There are great YouTube videos about Cursor. There are scattered blog posts. There is the official documentation. There is **no structured, interactive, browser-based onramp** that takes someone with zero Cursor experience and walks them through Tab → Cmd+K → Chat → Composer → Agent → rules → MCP in a sensible order.

This is that onramp. **14 levels, targeting ~144 lessons.** Each lesson is short MDX prose plus one or two interactive activities. Free forever. No paywall. No "premium tier." If we ever need money, sponsors — not learners.

## Status

- **Level 1: Cursor Is Not Magic** — published (10 lessons).
- **Levels 2–14** — scaffolded, awaiting contributors.

If you use Cursor and want to teach someone, the fastest path is **writing one lesson**. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Quickstart

```bash
git clone https://github.com/YOUR_FORK/zero-to-cursor
cd zero-to-cursor
pnpm install
cp .env.example .env.local

# Start local Supabase (Postgres + Auth)
pnpm supabase:start
# Copy the printed anon key + service role key into .env.local

# Seed lessons catalog from MDX
pnpm seed

# Run the app
pnpm dev
# → http://localhost:3000
```

The first time you run `pnpm supabase:start`, the Supabase CLI downloads its Docker images. After that, startup is seconds.

### Without Supabase (lighter local dev)

You can browse lessons and play activities without Supabase running. Auth-gated features (progress sync, dashboard, achievements) will be unavailable, but lesson content works.

## Stack

- **Next.js 15** (App Router, RSC)
- **Supabase** — Postgres + Auth, with RLS on every user-owned table
- **Tailwind 3** + a small dark theme
- **MDX** lessons in `content/lessons/`, rendered with `next-mdx-remote`
- **TypeScript** strict everywhere
- **AI Coach: BYOK** — users paste their own Anthropic or OpenAI key, stored in localStorage, calls go direct to the provider. Hosted instances can optionally enable a server-side proxy (`HOSTED_AI_ENABLED=true`).

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a diagram and data flow.

## Project layout

```
app/                 # Next.js routes
components/          # React components
  activities/        # Quiz, FillInBlank, DragMatch, UIHotspot, CursorSim
  lesson/            # LessonShell, ProgressBar
  ai/                # AICoachPanel
  auth/              # Login, signup forms
content/lessons/     # MDX lessons — one file per lesson
lib/                 # supabase clients, MDX loader, AI providers, progress tracker
scripts/             # new-lesson, seed-curriculum, ingest-cursor-docs
supabase/            # migrations + seed.sql + config.toml
docs/                # CURRICULUM, AUTHORING, ARCHITECTURE
```

## Author a lesson

```bash
pnpm new-lesson level-03-tab-completion 05 "Multi-line completions"
# → content/lessons/level-03-tab-completion/05-multi-line-completions.mdx
```

Open the file, write the lesson, run `pnpm dev`, navigate to it, iterate. PR it. See [docs/AUTHORING.md](docs/AUTHORING.md) for tone, structure, and the activity component API.

## License

[MIT](LICENSE). Lesson content is MIT too — translate it, remix it, fork it.

## Credits

Inspired by [zero2claude.dev](https://zero2claude.dev), which proved the model for AI-IDE-as-a-course. This project applies the same shape to Cursor.
