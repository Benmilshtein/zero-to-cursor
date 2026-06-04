# Architecture

A short tour of how the pieces fit.

## Data flow

```
                  ┌────────────────────────────────────────────┐
                  │                  Next.js                   │
                  │                                            │
   user ──HTTP──▶ │  app/page.tsx (RSC) ──┐                    │
                  │                       │ getAllLevels()     │
                  │  app/lessons/[...]    ▼                    │
                  │       │            lib/mdx/loader.ts ──fs─▶│──▶ content/lessons/*.mdx
                  │       │                                    │
                  │       ▼                                    │
                  │  LessonShell (client) ◀── ActivityContext  │
                  │       │                                    │
                  │   [activities report] ──/api/progress────▶ │──▶ Supabase: progress table
                  │                                            │
                  │  AICoachPanel (client) ──┬─ BYOK ───────▶  │──▶ Anthropic / OpenAI (direct)
                  │                          └─ hosted ──────▶ │──▶ /api/ai ──▶ provider
                  │                                            │
                  └────────────────────────────────────────────┘
```

## Why MDX in the repo (not in the DB)

Lessons are the product. Lessons live in `content/lessons/` as MDX files.

This means:

- A contributor adds a lesson the same way they'd add code: PR, review, merge.
- Lessons get version control, blame, history.
- A typo fix is a one-character diff, not a database migration.
- Self-hosters get the curriculum bundled with the app.

The Postgres `lessons` table only stores **catalog metadata** (slug, title, ordinal, status) for fast joins with `progress` and `user_achievements`. It's populated by `pnpm seed`, which reads the MDX manifest. The MDX bodies are never in the DB.

## Why BYOK by default

The project must be free forever. A hosted LLM at scale costs real money. BYOK shifts the cost to the learner's own provider account (often $0 if they're under free tiers).

- **BYOK path:** `loadByok()` reads localStorage → `chat()` in `lib/ai/providers.ts` posts directly to `api.anthropic.com` or `api.openai.com`. The Next.js server never sees the request.
- **Hosted path:** Enabled when `HOSTED_AI_ENABLED=true`. The `AICoachPanel` falls back to `POST /api/ai`, which calls the configured provider with a server-held key, gated by a per-IP daily counter.

A maintainer running their own hosted instance (e.g., `zero2cursor.dev`) can set `HOSTED_AI_ENABLED=true` to offer the coach without forcing users to bring keys.

## Anonymous play

The lesson player works without auth. The `LessonShell.complete()` function checks `isAuthenticated`; if false, it stores completed lesson slugs in `localStorage` under `z2c.anon.progress`. Activities still report results locally; the only thing missing is server-side progress + achievements + streaks.

When a user signs up later, we could migrate localStorage progress into Postgres (not implemented in v1 — open issue).

## RLS

Every user-owned table (`profiles`, `progress`, `user_achievements`, `streaks`) has RLS that restricts rows to `auth.uid() = user_id`. The Supabase anon key in the browser is harmless: it can only read catalog tables and write to the current user's rows.

Catalog tables (`levels`, `lessons`, `achievements`) are world-readable; no writes from the browser.

## File structure cheat sheet

| Path | What lives here |
|---|---|
| `app/` | Next.js App Router routes |
| `components/activities/` | The 5 MDX-callable activity components |
| `components/lesson/` | LessonShell, ProgressBar |
| `components/ai/` | AICoachPanel |
| `components/auth/` | LoginForm, SignupForm |
| `content/lessons/` | MDX — source of truth for lessons |
| `lib/mdx/` | Loader and MDX component map |
| `lib/supabase/` | Browser, server, middleware Supabase clients |
| `lib/ai/` | BYOK storage, provider adapters, coach prompts |
| `lib/progress/` | Markings completion, streaks, achievements |
| `supabase/migrations/` | DDL for the schema |
| `supabase/seed.sql` | Seed levels + achievements |
| `scripts/` | new-lesson, seed-curriculum, ingest-cursor-docs |
