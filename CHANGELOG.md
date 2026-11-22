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

[Unreleased]: https://github.com/aaron-binzegger/thesis-meeting-prep-coach/commits/main
