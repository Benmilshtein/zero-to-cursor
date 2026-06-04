# Contributing to Zero to Cursor

Three ways to help, in order of impact.

## 1. Author a lesson (highest impact)

Pick any planned level (2–14). Pick a slot. Write 200-400 words of clear prose plus one or two activities.

```bash
pnpm new-lesson level-03-tab-completion 05 "Multi-line completions"
```

Then read [docs/AUTHORING.md](docs/AUTHORING.md) — it covers the voice, the structure, and the activity components.

Submit a PR. Smaller PRs (one lesson at a time) merge faster than monster PRs (a whole level at once).

## 2. Improve an activity component

Activities live in `components/activities/`. The current set:

- `Quiz` — multiple choice
- `FillInBlank` — single input
- `DragMatch` — click-to-match pairs
- `UIHotspot` — click a region of an image
- `CursorSim` — scripted mock of the Cursor UI

Ideas welcome:

- A code-diff activity (show two versions, pick the better one).
- A sort-the-steps activity.
- A keyboard-shortcut listener (press the actual key combo).
- Improvements to existing components.

## 3. Translate

Once we have a level that's substantively complete, we want to translate it. There's no translation infrastructure yet — first contributor here gets to design it.

---

## Ground rules

- **Don't invent Cursor features.** If you can't find it in [docs.cursor.com](https://docs.cursor.com) or directly in the editor, don't claim it exists. If it's recent and unverified, flag it for review in your PR.
- **Keep it short.** A great lesson is 200-400 words plus one or two activities. If a lesson is growing past 600 words, it's probably two lessons.
- **Write peer-to-peer, not professor-to-student.** Imagine a friend who's curious but doesn't have a CS background. Be warm. Don't condescend.
- **No bullet-point soup.** Use bullets where they help, but most paragraphs should be paragraphs.
- **Test your activities.** Run `pnpm dev`, complete your activity, make sure it reports correct/incorrect properly.

## Development workflow

```bash
pnpm install
pnpm supabase:start   # optional, only for auth/progress
pnpm dev
```

Type-check before you push:

```bash
pnpm type-check
pnpm lint
```

PRs that fail type-check or lint will be flagged in CI.

## License

By contributing, you agree your work is MIT-licensed.
