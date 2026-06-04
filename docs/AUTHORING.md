# Authoring Guide

How to write a lesson that fits the rest of the course.

## The shape of a lesson

```mdx
---
title: Short, punchy title that names what you'll learn
estMinutes: 3
activityTypes: ["Quiz", "FillInBlank"]
status: draft
description: One sentence shown on the level overview.
---

Opening — one short paragraph that grounds the reader. What is this thing? Why
should they care? Don't start with "In this lesson we will…"

### A subsection (when needed)

Bullets where they help:

- Concise, parallel
- Not a wall of them

A second paragraph or two of prose.

```bash
# inline code example
echo "this is fine"
```

End with one or two activities. The activity verifies the reader understood
the most important point, not every detail.

<Quiz
  id="q1"
  question="What's the one thing this lesson taught?"
  options={["The wrong answer", "Another wrong one", "The right one", "A distractor"]}
  correct={2}
  explanation="Optional but recommended — explain why."
/>
```

### Frontmatter fields

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Shown in nav, header, dashboard. Keep under 60 chars. |
| `estMinutes` | recommended | Honest estimate of read + activity time. |
| `activityTypes` | recommended | For surfacing variety. Use the component name. |
| `status` | yes | `draft` while you're writing, `published` when ready. |
| `description` | recommended | One sentence for the level overview page. |

## Voice

- **Warm and direct.** Like a senior engineer mentoring a friend.
- **Don't sell.** No "amazing," "powerful," "revolutionary."
- **Don't condescend.** Assume basic literacy. Don't translate every term, just the unfamiliar ones.
- **Be concrete.** "Press Cmd+L to open the chat panel" beats "you can access the conversational interface."
- **Show, then explain.** Code or screenshot first; explanation underneath.

## Length

- **Sweet spot: 200-400 words** of prose + 1-2 activities.
- **Hard ceiling: 600 words.** Past that, split into two lessons.
- **Don't pad.** If you can say it in three sentences, do.

## Activities

All activities are React components callable from MDX. Every activity needs a unique `id` *within the lesson*.

### Quiz

```mdx
<Quiz
  id="q1"
  question="What did this lesson teach?"
  options={["A", "B", "C", "D"]}
  correct={2}
  explanation="Optional but recommended."
/>
```

### FillInBlank

```mdx
<FillInBlank
  id="b1"
  prompt="To open the chat panel, press ___"
  answer={["Cmd+L", "Ctrl+L"]}
  hint="Same key on macOS and Windows but with different modifiers."
/>
```

`answer` can be a string or an array of acceptable strings. Case-insensitive unless `caseSensitive={true}`.

### DragMatch

```mdx
<DragMatch
  id="m1"
  pairs={[
    { left: "Tab", right: "Predictive autocomplete" },
    { left: "Cmd+K", right: "Inline edit" }
  ]}
/>
```

The component shuffles the right side so the answer isn't visible.

### UIHotspot

```mdx
<UIHotspot
  id="h1"
  image="/screenshots/cursor-ui.png"
  prompt="Click the AI chat pane."
  targets={[
    { label: "Sidebar", x: 0, y: 8, w: 18, h: 90 },
    { label: "Editor", x: 18, y: 8, w: 60, h: 90 },
    { label: "AI Pane", x: 78, y: 8, w: 22, h: 90 }
  ]}
  correct={2}
/>
```

`x/y/w/h` are percentages (0-100). Put images under `/public/screenshots/`.

### CursorSim

A scripted mock of the Cursor UI — the learner clicks through a sequence of steps to practice the *shape* of an interaction.

```mdx
<CursorSim
  id="sim1"
  scenario="Open the inline edit prompt and ask for a refactor."
  steps={[
    { kind: "keypress", keys: "Cmd+K", label: "Opens the inline prompt" },
    { kind: "type", text: "extract this into a function" },
    { kind: "accept", label: "Accept Cursor's edit" }
  ]}
  starter="function doStuff() {\n  // ...\n}"
/>
```

Step kinds: `keypress`, `type` (with expected text), `click`, `accept`.

## Don't

- Don't reference future lessons by number (we re-order). Reference by topic.
- Don't include screenshots of paid features without flagging the plan they need.
- Don't link to your own newsletter / blog / Patreon from lessons.
- Don't write a TL;DR or summary at the end. The activity *is* the summary.

## Do

- Link to [docs.cursor.com](https://docs.cursor.com) for deep dives.
- Use `<` and `>` to denote keys: `Cmd+K`, not `⌘K`. Easier to read across platforms.
- When showing a Cursor feature, also note its keyboard shortcut on both macOS and Windows/Linux.
- When in doubt, look at existing Level 1 lessons for tone.
