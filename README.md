# Thesis Meeting Prep Coach

Turn messy notes into a one-page prep sheet for your next thesis supervisor meeting, even if you don't have a topic yet.

[![CI](https://github.com/aaron-binzegger/thesis-meeting-prep-coach/actions/workflows/ci.yml/badge.svg)](https://github.com/aaron-binzegger/thesis-meeting-prep-coach/actions/workflows/ci.yml)
[![Deploy](https://github.com/aaron-binzegger/thesis-meeting-prep-coach/actions/workflows/deploy.yml/badge.svg)](https://github.com/aaron-binzegger/thesis-meeting-prep-coach/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**Live demo:** https://aaron-binzegger.github.io/thesis-meeting-prep-coach/

<!-- TODO: screenshot or GIF of the main flow (docs/screenshots/) -->

> TODO: add a screenshot or GIF of the main flow.

## The problem

Students arrive at thesis meetings with messy notes, forget questions and leave without clear next steps.

TODO: expand with one or two sentences from our project report.

## What the coach does

- Turns your notes into an **agenda**
- **Ranks your questions** (Must / Should / If time)
- Builds a **"Verify first"** list
- Lists what **your supervisor decides**
- Suggests **one next step**

## Focus: the first two meetings

TODO: explain the focus on the kick-off (including students without a topic idea) and the follow-up meeting, and how context is carried from meeting 1 to meeting 2.

## How it works

TODO: prompt workflow diagram (baseline → R1 → R2 → R3) and link to [`docs/prompts/`](docs/prompts/).

> Prototype: the sheets shown are real outputs of our final prompt, generated in our test runs. The prototype itself does not call an AI.

## Use it in your own AI

TODO: short intro and link to [`docs/skill/`](docs/skill/).

## Evaluation in short

TODO: key results and link to [`docs/evaluation.md`](docs/evaluation.md).

## Prototype limitations

- The outputs are **pre-generated**; there is **no live AI** call.
- All personas and notes are **fictional**.
- This is a student project, **not official HSLU advice**.
- TODO: add further limitations found during testing.

## Run locally

Requirements: Node.js 20 or newer.

```sh
npm install
npm run dev
```

| Script                 | What it does                                  |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Start the dev server                          |
| `npm run build`        | Typecheck and build the static site to `dist` |
| `npm run preview`      | Serve the production build locally            |
| `npm run lint`         | Run ESLint                                    |
| `npm run format`       | Format all files with Prettier                |
| `npm run format:check` | Check formatting without writing              |
| `npm run typecheck`    | Run the TypeScript compiler without emitting  |
| `npm run test`         | Run the Vitest test suite once                |
| `npm run test:watch`   | Run Vitest in watch mode                      |

## Project structure

```
src/
├─ pages/        one folder per screen
├─ test/         test setup and helpers
├─ App.tsx       routes (HashRouter)
└─ main.tsx      entry point
docs/            build spec, prompts, skill, evaluation (TODO)
.github/         CI, deploy workflow, PR template
```

TODO: update once `components/`, `data/`, `types/` and `styles/` exist.

## Responsible use and privacy

- Don't enter real names, grades or confidential company data.
- The app runs entirely in your browser. It stores nothing and sends nothing.
- TODO: add notes on human oversight (the student and supervisor check every sheet).

## AI-use disclosure

The app code was written with **Claude Code**. TODO: short summary and link to [`docs/ai-use-disclosure.md`](docs/ai-use-disclosure.md).

## Authors

- Aaron Binzegger
- Darvin Windlin

Final project of the module _Prompt Engineering_, student project at HSLU, autumn semester 2026.

Licensed under the [MIT License](LICENSE).
