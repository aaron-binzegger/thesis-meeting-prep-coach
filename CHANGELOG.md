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

### Changed

- The layout scales with the screen: 16 px base up to laptop width, growing to 20 px on large monitors and projectors.
- Calmer prep sheet: two typefaces, four text sizes, the margin column holds labels and notes, colour only on priority icons and the "Verify first" highlighter.
- On wide screens the sheet actions sit in a sticky rail next to the sheet.

[Unreleased]: https://github.com/aaron-binzegger/thesis-meeting-prep-coach/commits/main
