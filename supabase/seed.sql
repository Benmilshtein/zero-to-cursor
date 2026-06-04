-- =============================================================================
-- Zero to Cursor — seed catalog data
-- =============================================================================
-- This file seeds the levels list and the starter achievement catalog.
-- Lesson rows are seeded by `pnpm seed` (scripts/seed-curriculum.ts) which
-- reads the MDX manifest from content/ and upserts the catalog.
-- =============================================================================

insert into public.levels (slug, ordinal, title, description, status) values
  ('level-01-cursor-is-not-magic', 1, 'Cursor Is Not Magic', 'What an editor is, how Cursor is different, install, sign in, take a tour.', 'published'),
  ('level-02-first-30-minutes', 2, 'Your First 30 Minutes in Cursor', 'Opening projects, command palette, settings, themes — the working surface.', 'planned'),
  ('level-03-tab-completion', 3, 'Tab Completion', 'Cursor Tab: accept, partial-accept, multi-line, when to reject.', 'planned'),
  ('level-04-cmd-k', 4, 'Inline Edits with Cmd+K', 'Generate, refactor, transform selections, follow-up prompts.', 'planned'),
  ('level-05-chat-sidebar', 5, 'The AI Chat Sidebar', 'Cmd+L, @-mentions, asking questions about code.', 'planned'),
  ('level-06-codebase-awareness', 6, 'Codebase Awareness', '@Codebase, indexing, semantic search, .cursorignore.', 'planned'),
  ('level-07-composer', 7, 'Composer & Multi-file Edits', 'Cmd+I, normal vs agent, apply / diff / revert.', 'planned'),
  ('level-08-agent-mode', 8, 'Agent Mode — Autonomous Coding', 'Tool use, terminal access, approvals, when to trust.', 'planned'),
  ('level-09-rules', 9, 'Rules — Teaching Cursor Your Style', '.cursorrules and .cursor/rules/*.mdc, scoping.', 'planned'),
  ('level-10-mcp', 10, 'MCP — Connect Cursor to Everything', 'Installing MCP servers, tools, real examples.', 'planned'),
  ('level-11-context-mastery', 11, 'Context Mastery', '@Files, @Folders, @Docs, @Web, @Git, notepads.', 'planned'),
  ('level-12-advanced', 12, 'Cursor Advanced', 'Background agents, Bug Bot, PR review, model selection, cost.', 'planned'),
  ('level-13-junior-dev-patterns', 13, 'Junior Developer Patterns', 'Debugging with AI, deployment, professional workflows.', 'planned'),
  ('level-14-capstone', 14, 'The Project — Ship a Real App', 'Capstone: a full small app, start to finish.', 'planned')
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  status = excluded.status;

insert into public.achievements (slug, title, description, icon, criteria_kind) values
  ('first-lesson', 'First Step', 'Completed your very first lesson.', 'sparkles', 'first_lesson'),
  ('level-1-complete', 'Cursor Awakened', 'Finished Level 1 — you know what Cursor is and why it matters.', 'trophy', 'level_completed'),
  ('streak-3', 'On a Roll', 'Three days in a row.', 'flame', 'streak_days'),
  ('streak-7', 'Week One', 'Seven days in a row.', 'flame', 'streak_days'),
  ('ten-lessons', 'Double Digits', 'Completed ten lessons.', 'medal', 'lessons_completed')
on conflict (slug) do nothing;
