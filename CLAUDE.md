# CLAUDE.md – Thesis Meeting Prep Coach

## Source of truth
- The build brief is **`docs/mockup-spec.md`**. Read the relevant sections before any work. If something here conflicts with the spec, the spec wins; ask if unclear.
- Work **phase by phase** (spec section 11). Do only the phase the user asks for. Never start the next phase without an explicit request.

| Phase | Branch | Content |
|---|---|---|
| 0 | `chore/setup` | Tooling, CI/deploy, license, README skeleton, CHANGELOG |
| 1 | `feat/design-system` | Tokens, fonts, layout shell, nav, buttons, cards, priority badges, print.css, `/styleguide` (dev only) |
| 2 | `feat/data-model` | Types, placeholder JSON S1–S6 + X4, data validation test |
| 3 | `feat/core-flow` | Core screens, full flow with placeholders → tag `v0.1.0` |
| 4 | `feat/demo-and-compare` | Persona switcher, compare view, "Also available", How it works, Use it |
| 5 | `feat/real-data` + `docs/final` | Real R3 JSON, docs, final README → tag `v1.0.0` |

## Tech stack (spec section 4)
- Vite, React 18, TypeScript in **strict** mode
- React Router with **HashRouter** (GitHub Pages, no server rewrites)
- CSS Modules + CSS custom properties (design tokens in `src/styles/tokens.css`). No CSS framework.
- Fonts self-hosted via `@fontsource` (Source Serif 4, Inter). No external requests.
- Icons: `lucide-react`
- Quality: ESLint, Prettier, `tsc --noEmit`. Tests: Vitest + Testing Library.
- State lives in memory (React context + URL parameters). **Never use localStorage/sessionStorage.**
- All content shown in the app comes from JSON in `src/data/`.
- Vite base path: `/thesis-meeting-prep-coach/`

## Hard constraints (spec section 3)
- **Static site only**, deployed to GitHub Pages via GitHub Actions. No backend, no database, no API keys, no live AI calls, no tracking/analytics.
- **No real personal data.** All personas and notes are fictional.
- **No HSLU branding:** no HSLU logo, colours, or name in the app title. "HSLU" may appear only in the README and footer as context ("student project at HSLU").
- **No institutional facts in the UI:** never state dates, deadlines, page limits, credits or rules of any university (zero-institution-facts policy).
- **English UI.**
- **Accessibility (WCAG 2.2 AA where possible):** priorities are shown with a text label + icon, never colour alone; body text ≥ 16 px; full keyboard operation with visible focus; semantic HTML, landmarks, proper table markup for the agenda; respect `prefers-reduced-motion`.
- Responsive from 360 px to 1440 px. Print stylesheet for the prep sheet (one A4 page where possible).

## Git workflow (spec section 5.2)
- `main` is always deployable. Never commit directly to `main`; one **feature branch per phase**.
- **Conventional Commits** in English, imperative mood, small and meaningful: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`, `ci:` (optional scope, e.g. `feat(sheet): …`). Never "update", "fix stuff", "wip".
- Open a **PR** with a short description using `.github/pull_request_template.md`. PRs are **squash merged**. Do not merge PRs yourself; the user reviews first.
- Never commit `node_modules`, `dist`, `.env` or `.claude/settings.local.json`.
- Update `CHANGELOG.md` (Keep a Changelog, `Unreleased` section) with each phase.

## Definition of done
**Before finishing a phase: lint, typecheck, test and build must pass.**

```sh
npm run lint && npm run typecheck && npm run test && npm run build
```
