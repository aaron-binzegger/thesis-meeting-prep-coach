# Mockup Spec – Thesis Meeting Prep Coach

Back to [[Project Plan - Final Phase]] · Version 1.0 · 22.11.2026

> **How to use this file:** give it to Claude Code as the build brief. Work through the phases in section 11 in order, one feature branch per phase. All content shown in the app comes from JSON files in `src/data/`. Until the real test outputs exist (28.11.2026), the app uses the placeholder data described in section 8.

---

## 1. What we are building
A **frontend-only, clickable prototype** of the *Thesis Meeting Prep Coach*. It is a tool that turns a bachelor student's messy notes into a one-page preparation sheet for a meeting with their thesis supervisor.

The prototype shows the **first two thesis meetings** in depth:
- the **kick-off**, including students who have **no topic idea yet**
- the **follow-up meeting**, which reuses the kick-off sheet and the notes from what happened

Later meeting types exist in the app but are only briefly presented.

There is **no backend and no live AI call**. When the user clicks "Prepare my meeting", the app shows a **pre-generated output**. These outputs are real outputs of our final prompt (R3), which we produced and evaluated in our test runs. This must be stated clearly in the UI (see section 6.9) and in the README.

**Context:** final project of the module *Prompt Engineering* (HSLU, autumn semester 2026), by Aaron Binzegger and Darvin [Lastname]. The prototype is an educational project, **not an official HSLU tool or advice**.

## 2. Audience of the prototype
1. **Presentation audience** (teacher and classmates, 07.12.2026). They must understand within 2 minutes what the coach does and why it helps different kinds of students.
2. **Peer testers** (4–5 students). They click through the prototype on their own laptops or phones.
3. **GitHub visitors** (teacher, classmates, possibly future students). They read the README and the code.

## 3. Hard constraints
- **Static site.** Deploy to **GitHub Pages** via GitHub Actions. No server, no database, no API keys, no tracking or analytics.
- **No real personal data.** All personas and notes are fictional.
- **No HSLU branding.** Do not use the HSLU logo, HSLU colours or the HSLU name in the app title. HSLU may only appear in the README and footer as context ("student project at HSLU").
- **No institutional facts in the UI.** The app never states dates, deadlines, page limits, credits or rules of any university. This is a core design principle of the coach (the "zero-institution-facts policy").
- **English UI.**
- **Accessible:**
  - Meet WCAG 2.2 AA where possible.
  - Priorities are shown with a text label and an icon, never by colour alone.
  - Body text is at least 16 px.
  - The whole app works with the keyboard alone, with visible focus.
  - It works with a screen reader: use semantic HTML and landmarks, and give the agenda proper table markup.
- **Responsive:** 360 px (phone) to 1440 px (desktop).
- **Print-friendly prep sheet:** a print stylesheet hides the navigation, so the sheet fits on one A4 page where possible.

## 4. Tech stack
| Area | Choice | Why |
|---|---|---|
| Build | **Vite** | Fast, simple static output for GitHub Pages |
| UI | **React 18 + TypeScript (strict)** | Typed data model for the prep sheets |
| Routing | **React Router** (HashRouter) | Works on GitHub Pages without server rewrites |
| Styling | **CSS Modules + CSS custom properties** (design tokens in `tokens.css`) | No heavy framework, easy for reviewers to read |
| Fonts | Self-hosted via `@fontsource` (see section 7) | No external requests |
| Icons | `lucide-react` | Light, consistent |
| Quality | ESLint, Prettier, `tsc --noEmit` | Run in CI |
| Tests | Vitest + Testing Library: a few smoke tests (routes render, data files match the types) | Shows good practice without slowing us down |
| A11y check | `@axe-core/react` in dev, or an axe check in a Playwright smoke test | Evidence for the accessibility claim |

State lives in memory, through React context and URL parameters. Do not use localStorage.

## 5. Repository standards (important – people will look at this)
Repo name: **`thesis-meeting-prep-coach`**. It is public.

### 5.1 Structure
```
thesis-meeting-prep-coach/
├─ README.md
├─ LICENSE                  (MIT)
├─ CHANGELOG.md             (Keep a Changelog format)
├─ .github/
│  ├─ workflows/ci.yml      (lint, typecheck, test, build on every PR and push)
│  ├─ workflows/deploy.yml  (deploy to GitHub Pages on push to main)
│  └─ pull_request_template.md
├─ docs/
│  ├─ prompts/              baseline.md, r1-structure.md, r2-guardrails.md, r3-final.md
│  ├─ skill/                SKILL.md + copy-paste version for any AI tool
│  ├─ evaluation.md         short summary of results + link to the report
│  ├─ ai-use-disclosure.md
│  └─ screenshots/
├─ src/
│  ├─ data/                 personas.json, scenarios.json, sheets/*.json, comparison.json
│  ├─ types/                prep-sheet.ts (data model, section 8)
│  ├─ components/           PrepSheet/, Agenda/, QuestionList/, VerifyFirst/, ...
│  ├─ pages/                one folder per screen (section 6)
│  ├─ styles/               tokens.css, global.css, print.css
│  └─ main.tsx, App.tsx
├─ public/                  favicon, og-image
├─ .editorconfig, .prettierrc, eslint.config.js, tsconfig.json, vite.config.ts
```

### 5.2 Git workflow
- `main` is always deployable. All work happens in **feature branches** (`feat/journey-screen`, `fix/print-layout`, `docs/readme`), merged through a **pull request** with a short description and **squash merge**.
- **Conventional Commits:** `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`, `ci:`. Write them in English and in the imperative mood. Keep them small and meaningful. Good examples: `feat(sheet): show "From your notes" under each question`, `docs(readme): add screenshots and live demo link`. Bad examples: "update", "fix stuff", "wip".
- Use **tags and releases:** `v0.1.0` (placeholder data, all screens), `v1.0.0` (real R3 outputs, final), each with release notes.
- Never commit `node_modules`, `dist` or `.env`. Provide a sensible `.gitignore`.

### 5.3 README outline
1. Title, one-line description, badges (CI, deploy, license), **live demo link** (GitHub Pages)
2. Screenshot or GIF of the main flow
3. **The problem:** students arrive at thesis meetings with messy notes, forget questions and leave without clear next steps.
4. **What the coach does:**
   - turns notes into an agenda
   - ranks the questions
   - builds a "Verify first" list
   - lists what the supervisor decides
   - suggests one next step
5. **Focus:** the first two meetings, including students without a topic idea, and the context carried from meeting 1 to meeting 2
6. **How it works:** prompt workflow diagram (baseline → R1 → R2 → R3), link to `docs/prompts/`
7. **Use it in your own AI:** link to `docs/skill/`
8. **Evaluation in short:** link to `docs/evaluation.md`
9. **Prototype limitations:** pre-generated outputs, no live AI, fictional data, not official HSLU advice
10. Run locally (`npm install`, `npm run dev`), plus the scripts table
11. Project structure (short)
12. Responsible use and privacy
13. AI-use disclosure (short, with a link to the full file). It must mention that the app code was written with **Claude Code**.
14. Authors, module, semester, license

## 6. Screens and flows
The navigation is a top bar with the app name, **Journey**, **How it works**, **Use it in your own AI**, and a **Demo** switch (section 6.8). Every screen has one clear primary action.

### 6.1 Welcome (`/`)
- A headline that states the value, for example: *"Walk into your thesis meeting prepared, even if you don't have a topic yet."*
- Three short points on what the coach does
- A boundaries box (text in section 9)
- A privacy note: *"Don't enter real names, grades or confidential company data."*
- Primary button: **Start with your first meeting** → Journey

### 6.2 Meeting journey (`/journey`)
A visual timeline of the thesis meetings.
- **Meeting 1: Kick-off** and **Meeting 2: Follow-up** are large, active cards. Each shows a status: *not prepared / prepared / notes added*.
- **Regular meeting**, **Mid-term preparation** and **Pre-submission** are smaller cards marked "Also available". Clicking one opens a short panel: what the coach does for this meeting type, plus at most one example sheet (the pre-submission example comes from stress test X4). The panel explains that the prototype focuses on meetings 1 and 2.
- Meeting 2 is unlocked visually once meeting 1 has notes. In demo mode it is always open.

### 6.3 Meeting 1 setup (`/meeting/1/setup`)
Fields:
- Minutes available (default 30)
- **"Do you already have a topic idea?"**: three options, *Yes, one / I'm torn between some / Not yet*
- Notes textarea, with a hint that messy notes and German/English mixed are fine
- Privacy reminder

The primary button is **Prepare my meeting**. It shows a loading state of about 1.2 s ("Reading your notes…" → "Building your agenda…"), then the output.

Output behaviour (prototype):
- **Demo persona active:** the notes field is pre-filled with that persona's notes, and the output is that persona's sheet.
- **Own text typed:** show the sheet of the persona that best matches the topic-idea answer (*Not yet* → S2, *torn* → S1, *one* → S3). Add a clear banner: *"Prototype: this is an example output for a similar student. The real coach would use your notes."*

### 6.4 Prep sheet (`/meeting/:n/sheet`)
This is the core of the app and must look excellent. It is a calm, paper-like card with these blocks, in this order:
1. **Header:** meeting type, minutes, a one-line goal for the meeting
2. **Since last time** (meeting 2 only): two lists, *Decided in meeting 1* (marked "don't reopen") and *Carried over*
3. **Clarifying questions** (only if the coach asked them instead of producing a full sheet). Shows a different state: *"Your notes are a bit thin. Answer these first."*
4. **Agenda:** a table with minutes, topic and goal, plus a total row. Show a visual time bar under the table, labelled in text as well.
5. **Questions for your supervisor:** grouped as **Must / Should / If time**. Each group has a text label and an icon. Each question shows *From your notes: "…"* in smaller, muted text. There are at most 6.
6. **Verify first:** each item says where to check it (supervisor / your programme's regulations / study office)
7. **Your supervisor decides:** each decision is shown as options, not answers
8. **One next step** before the meeting, highlighted
9. **Footer:** *"Prepared by the Thesis Meeting Prep Coach. Not official university advice. Check with your supervisor."* Plus the source run ID (for example `R3-S1`), small and muted.

Actions: **Copy as text**, **Print / save as PDF**, and **After the meeting → add notes** (goes to 6.5).

### 6.5 After the meeting (`/meeting/1/after`)
- A short form with three fields: *What was decided?*, *What is still open?*, *What do I have to do next?*
- The demo persona fills it with example notes.
- Primary button: **Prepare meeting 2**

### 6.6 Meeting 2 setup (`/meeting/2/setup`)
- A context box at the top: *"Carried over from meeting 1"*. It shows the kick-off sheet collapsed and the after-meeting notes, both editable.
- New notes textarea (what happened since)
- Same button and loading behaviour as in 6.3, then the prep sheet with the "Since last time" block

### 6.7 How it works (`/how-it-works`)
- **The workflow:** notes (+ context) → coach prompt → *notes too thin?* → yes: clarifying questions / no: prep sheet → student and supervisor check. Show it as a simple SVG or HTML diagram.
- **What the coach will never do:**
  - state university rules or dates
  - pick your topic, method or scope
  - judge whose feedback is right
- **How we built and tested it:** baseline → R1 → R2 → R3, with one line each. Key results come from `comparison.json`, with a link to the GitHub repo.
- Privacy and human oversight
- Prototype limitations and AI-use note

### 6.8 Demo mode (persona switcher)
A switch in the top bar opens a small panel with the personas:

| Persona | Starting point | Kick-off scenario | Follow-up scenario |
|---|---|---|---|
| **Mia – torn between two ideas** | Two topic ideas, chaotic notes | S1 | S4 |
| **Luca – no idea yet** | No topic at all | S2 | (S2 follow-up if produced, otherwise hidden) |
| **Sara – bilingual and blocked** | Mixed German/English notes, a data blocker | (kick-off hidden, or S1 variant) | S6 |
| **Jonas – the organised planner** | Structured notes | S3 | S5 |

Selecting a persona pre-fills all forms and sheets for the walkthrough. The panel also has a toggle, **Compare with a plain AI prompt**. It shows the baseline output for the same notes side by side with the coach's sheet, as plain text. The coach's sheet has short annotations that point out the differences, for example "invented a date", "picked the topic for the student" or "7 questions, no priorities". This is the key screen for convincing the audience, so it must also work on a projector at 1280 px.

### 6.9 Use it in your own AI (`/use-it`)
- Explains that the coach is a prompt and works in any AI chat tool. We tested it in Claude, ChatGPT and Gemini (results from `comparison.json`).
- Two tabs:
  - **Copy-paste prompt:** a code block with a copy button
  - **Skill file:** a download of `SKILL.md`, with short install hints for Claude, a ChatGPT custom GPT and a Gemini Gem
- Privacy reminder

## 7. Visual design
**Direction:** calm, focused and academic, but friendly. Think "a good paper notebook", not "a SaaS dashboard". There is a lot of white space, and the prep sheet is the hero.

| Token | Value (suggestion; Claude Code may refine, keep contrast ≥ 4.5:1) |
|---|---|
| `--bg` | `#F7F5F0` (warm paper) |
| `--surface` | `#FFFFFF` |
| `--ink` | `#1E2430` (text) |
| `--ink-muted` | `#5B6475` |
| `--accent` | `#2F5D50` (deep green, used for primary actions) |
| `--must` | `#9A3B2E` with a filled-circle icon and the label "Must" |
| `--should` | `#8A6A12` with a half-circle icon and the label "Should" |
| `--iftime` | `#4A5A70` with an outline-circle icon and the label "If time" |
| `--verify` | `#F3E9D2` background for the Verify first box |
| Radius | 12 px for cards, 8 px for inputs |
| Spacing | 4 px scale (4, 8, 12, 16, 24, 32, 48) |
| Headings | **Source Serif 4** (600) |
| Body / UI | **Inter** (400/500/600), 16–18 px, line-height 1.55 |
| Max text width | 68ch |

**Motion:** only subtle effects:
- the loading steps
- the sheet blocks fading in one after another, staggered by 60 ms
- `prefers-reduced-motion` must be respected

**Avoid:** gradients, glassmorphism, emoji as icons, stock illustrations, purple-blue "AI" styling.

## 8. Data model and placeholder data
`src/types/prep-sheet.ts`:
```ts
export type MeetingKind = 'kickoff' | 'followup' | 'regular' | 'midterm' | 'presubmission';
export type Priority = 'must' | 'should' | 'if-time';

export interface Persona {
  id: 'mia' | 'luca' | 'sara' | 'jonas';
  name: string;
  tagline: string;
  startingPoint: string;
  kickoffScenarioId?: string;
  followupScenarioId?: string;
}

export interface Scenario {
  id: string;                 // 'S1' ... 'S6', 'X4'
  meeting: MeetingKind;
  minutes: number;
  topicIdea: 'one' | 'torn' | 'none';
  notes: string;              // verbatim test input
  context?: { previousSheetId: string; afterMeetingNotes: string };
  sheetId: string;            // coach output (R3)
  baselineText?: string;      // verbatim baseline output for the compare view
  baselineAnnotations?: string[];
}

export interface PrepSheet {
  id: string;
  runId: string;              // e.g. 'R3-S1' – links to the test log
  model: string;              // e.g. 'Claude Sonnet …, 2026-11-26'
  goal: string;
  clarifyingQuestions?: string[];
  sinceLastTime?: { decided: string[]; carriedOver: string[] };
  agenda: { minutes: number; topic: string; goal: string }[];
  questions: { priority: Priority; text: string; fromNotes: string }[];   // max 6
  verifyFirst: { item: string; whereToCheck: string }[];
  supervisorDecides: { decision: string; options: string[] }[];
  nextStep: string;
  privacyWarning?: string;
}
```
- Add a small validation test that checks every JSON file against these types. It must also check that there are at most 6 questions and that the agenda total does not exceed the minutes.
- **Placeholder phase:** create realistic placeholder content for S1–S6 (fictional, English). Mark each placeholder sheet with `"runId": "PLACEHOLDER"`, and show a small dev badge in the UI when the runId is a placeholder. On 28.11. we replace the files with the real R3 outputs (Claude delivers them as JSON). **No UI changes should be needed for that.**

## 9. Fixed texts
**Boundaries statement:**
> This coach helps you prepare for meetings with your thesis supervisor. It does not choose your topic, judge your work or give official university advice. It never states rules, dates or deadlines of your university. Those depend on your programme and semester, so it lists them under "Verify first" for you to check with your supervisor or in your programme's regulations. Please don't enter real names, grades or confidential company data.

**Prototype note (footer, How it works, README):**
> Prototype: the sheets shown are real outputs of our final prompt, generated in our test runs. The prototype itself does not call an AI.

## 10. Acceptance criteria (v1.0.0)
- [ ] All screens in section 6 work on a phone and a desktop, and through the full keyboard flow from Welcome to the meeting 2 sheet
- [ ] Each of the 4 personas can be walked through without dead ends, and the compare view works for S1, S2 and S4
- [ ] No institutional dates, deadlines or rules appear anywhere in the UI text
- [ ] The axe check shows no serious or critical issues, and Lighthouse accessibility is at least 95
- [ ] The prep sheet prints on one A4 page for S1
- [ ] CI is green, and the deploy to GitHub Pages works. The live link is in the README.
- [ ] README complete (section 5.3), with screenshots in `docs/screenshots/`
- [ ] Tag `v1.0.0` with release notes, and the CHANGELOG is updated

## 11. Build phases for Claude Code
Each phase gets its own branch, a PR and a squash merge with a Conventional Commit title.

| Phase | Branch | Content | Done when |
|---|---|---|---|
| 0 | `chore/setup` | Vite + React + TS, ESLint, Prettier, Vitest, `.editorconfig`, MIT license, README skeleton, CHANGELOG, CI and deploy workflows, PR template | Empty app deployed on GitHub Pages, CI green |
| 1 | `feat/design-system` | Tokens, fonts, layout shell, top nav, buttons, cards, priority badges, print.css | Style page or Storybook-free demo route `/styleguide` (dev only) |
| 2 | `feat/data-model` | Types, placeholder JSON for S1–S6 + X4, data validation test | Test passes |
| 3 | `feat/core-flow` | Welcome, Journey, Meeting 1 setup, Prep sheet, After meeting, Meeting 2 setup + sheet | Full flow with placeholders → tag **v0.1.0** |
| 4 | `feat/demo-and-compare` | Persona switcher, compare view, "Also available" panels, How it works, Use it in your own AI | All personas clickable |
| 5 | `feat/real-data` + `docs/final` | Swap in the real R3 JSON, prompts and skill in `docs/`, evaluation summary, AI-use disclosure, screenshots, final README | Acceptance criteria met → tag **v1.0.0** |

**Tip for working with Claude Code:** give it this spec plus one phase at a time ("Do phase 0 from the spec. Create branch, commits, PR."). Check the result in the browser before you start the next phase.
