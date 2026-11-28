# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Project setup: Vite, React 18, TypeScript (strict) and React Router (HashRouter).
- ESLint, Prettier, `.editorconfig` and `.gitattributes` for consistent code style.
- Vitest and Testing Library with a smoke test for the start page.
- CI workflow (lint, format check, typecheck, test, build) and GitHub Pages deploy workflow.
- Pull request template, MIT license, README skeleton and this changelog.
- Minimal start page that shows the app name.
- Design system "the ruled notebook": colour, type, spacing, radius and motion tokens in `tokens.css`, with self-hosted Newsreader and Atkinson Hyperlegible Next fonts.
- App shell with skip link, top navigation (collapsible on phones), Demo switch control and footer with the prototype note.
- UI components: Button and ButtonLink, Card, Sheet with margin notes, PriorityBadge (icon and label), text fields, ruled notes field, radio group, Callout and Highlight.
- A4 print stylesheet that hides navigation and actions.
- Dev-only `/styleguide` route with a sample prep sheet and every component.
- Page for unknown routes.
- Tests for colour contrast of all text tokens, priority badges, navigation behaviour and an axe-core accessibility check.
- Data model (`src/types/prep-sheet.ts`) with typed data access in `src/data/index.ts`.
- Placeholder data: four personas, scenarios S1–S6 and X4 with sheets, meeting types and prompt comparison, all marked `PLACEHOLDER`.
- Data validation test: every JSON file matches the types, at most 6 questions, agenda fits the minutes, and no institutional facts in sheets.
- Core flow: Welcome, Journey, Meeting 1 setup, Prep sheet, After the meeting, Meeting 2 setup and sheet, with in-memory session state (no browser storage).
- Prep sheet with agenda table and time bar, grouped questions with notes in the margin, Verify first, supervisor decisions, next step, copy as text and print to one A4 page.
- Example banner when typed notes are answered with a similar student's sheet, and a placeholder badge for placeholder data.
- Axe checks on every core-flow screen.
- Demo mode: persona panel (Mia, Luca, Sara, Jonas) that pre-fills every form, shareable `?persona=` links, and a "Compare with a plain AI prompt" switch.
- Compare view: plain AI output next to the coach sheet, with annotated differences, laid out for a 1280 px projector.
- "Also available" panels on the Journey, including the pre-submission example sheet (X4).
- How it works page: workflow diagram, what the coach never does, prompt iterations and key results, privacy and limitations.
- Use it in your own AI page: copy-paste prompt and a downloadable `SKILL.md` (placeholders until the final prompt is in).
- Real test outputs in `data-source/` (coach runs R3.1-S1, S2, S5, S6 and R3-X1; baselines B-S1, S2, S4, S5, S6).
- Prep sheet fields for real outputs: verbatim extra blocks, "What I bring", agenda times as written, a note under the agenda, "From your notes" under Verify first, and decisions without listed options.
- Clarifying state (R3-X1): the questions first, then "Use example answers" shows the fixed answer and the sheet. Shown for typed kick-off notes under 15 words and on How it works.
- `src/data/fallbacks.json`: which example sheet typed notes get. The first ready scenario in each list wins, so S3 and S4b take over once their files are added.
- Data tests: every sheet's runId matches a file in `data-source/coach/`, model and minutes come from the front matter, and every text is copied verbatim from its source.

### Changed

- The layout scales with the screen: 16 px base up to laptop width, growing to 20 px on large monitors and projectors.
- Calmer prep sheet: two typefaces, four text sizes, the margin column holds labels and notes, colour only on priority icons and the "Verify first" highlighter.
- On wide screens the sheet actions sit in a sticky rail next to the sheet.
- The sheets of S1, S2, S5 and S6 are the real R3.1 outputs, copied verbatim. Scenario notes, context and baselines are the real test inputs and outputs, with reviewed compare annotations.
- The one-line goal on the sheet is optional, because the real outputs have none.
- "From your notes" shows the coach's text as written, without added quotation marks.
- Demo personas show only the meetings that have a real output: Mia and Luca the kick-off, Sara and Jonas the follow-up for now. The pre-submission example stays hidden until X4 is in.
- The institutional-facts check allows a phrase only if it is the student's own words from the notes and the sheet shows it under Verify first.

### Removed

- Placeholder sheets S3, S4 and X4.

[Unreleased]: https://github.com/aaron-binzegger/thesis-meeting-prep-coach/commits/main
