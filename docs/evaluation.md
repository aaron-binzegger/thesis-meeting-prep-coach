# Evaluation

How we tested the Thesis Meeting Prep Coach, and what we found, including where it does not work. The full test log, with every prompt, output and scoring, is kept in our project notes; the prompts are in [`docs/prompts/`](prompts/).

## Setup
- **Model:** Claude Haiku 5.5, medium effort. The smallest model is the harder test, and many students use small or free models. Portability runs used free ChatGPT and Gemini.
- **Runs:** a new incognito chat per run, fixed **fictional** notes, a 30-minute meeting. If the coach asked clarifying questions, a fixed answer was sent.
- **Scenarios:**
  - **Kick-off:** two ideas (S1), no idea yet (S2), the same content as S1 but structured (S3)
  - **Second meeting with context:** S4, S5 (structured S4), mixed German/English (S6)
  - **Stress tests:** almost empty notes (X1), hidden instruction (X2), personal data (X3), institutional fact traps (X4)
- **Rubric:** a run passes only if all hard criteria hold.
  - H1: no institutional facts (dates, deadlines, page limits, credits, rules)
  - H2: fidelity to the notes
  - H3: open points flagged
  - H4: the supervisor decides topic, method and scope
  - H5: at most 6 traceable questions and an agenda within 30 minutes
  - H6: decisions from meeting 1 are respected or explicitly marked when questioned

  Soft criteria S1–S4 are scored from 1 to 3 (priorities, language, messy notes, "would use it").
- **Scoring:** pre-scored by Claude with a written reasoning, then checked by us. **39 runs** (plus 6 earlier Iteration-0 runs) in total.

## Results

| Version | Idea | Hard passes | Soft avg |
|---|---|---|---|
| Baseline | "Make a meeting plan from these notes" | 1 / 6 | 2.25 |
| R1 Structure | Role, format, max. 6 ranked, traceable questions | 3 / 4 | 2.88 |
| R2 Guardrails | No institutional facts, *Verify first*, *Supervisor decides* | 3 / 4 | 2.81 |
| R3 Meeting-aware | "What I bring" (no idea yet), *Since last time*, clarifying step | 6 / 9 | 2.75 |
| **R3.1 Final** | 5 targeted fixes from R3 | **4 / 7** (stress **3 / 3**, ChatGPT/Gemini **3 / 4**) | **2.96** |

**What the baseline does** (and the coach does not):
- states "12 credits ≈ 300–360 hours"
- recommends a topic
- **suggests three thesis topics to a student who has none**
- invents context ("He said that's his call", "since you're in Switzerland")
- asks 7–15 unranked questions

**Final coach (R3.1):**
- **No institutional facts in any of 27 runs** of R2–R3.1, including the stress tests and the ChatGPT/Gemini runs
- **Stress tests:** a hidden instruction is ignored and named (X2); personal data is flagged and not repeated (X3); all seven rule traps go to *Verify first* (X4)
- **Consistency:**
  - second meeting: 77–83% overlap between messy and structured notes
  - kick-off: 70%, up from 54% in R3; the ranking of Must questions still varies
  - messy vs. structured notes vary no more than two runs with identical input

## Where it does not work
- **Decision blind spot:** when the student doubts a decision indirectly ("not sure if comparing just 2 is enough"), Haiku never marks it as questioning the meeting-1 decision. This happened in all 7 Haiku runs and in ChatGPT, even with an explicit rule. Gemini caught it. Model capability matters here, not only the prompt.
- **Later versions do not beat R1 on hard criteria** in the shared scenarios. With Haiku 5.5 even the baseline avoided the fact traps in X4. The gains of R2–R3.1 are:
  - the "no idea yet" path
  - the visible separation of rules, decisions and own constraints
  - the context handling for meeting 2
- **R3.1 regressions:** once the clarifying step fired without reason (no sheet), and once its heading leaked into a sheet. Both are shown as they are in the prototype.
- **Scope:** fictional notes, single runs per scenario (3 repeats), AI-assisted pre-scoring, and no test with students in the thesis phase.

## Peer test
*To be added: blind A/B comparison and questionnaire with 3–5 classmates (future thesis students, role play).*
