---
runId: B-S5
scenario: S5
meeting: followup
topicIdea: n/a
minutes: 30
model: Claude Haiku 5.5, medium effort
date: 2026-11-23
---

# B-S5 – Second meeting · Jonas (same content as S4) · structured notes + context

## Input: notes
```text
Meeting 2 – Thursday

Progress:
- Task description draft: about half done
- Research question still feels broad. Idea: narrow it to "answer accuracy for onboarding FAQs"
- Candidate models: Llama 3 and Mistral

Open questions:
- Is comparing only 2 models enough?
- The HR department of my company would give me 40 example questions. Am I allowed to use these internal documents?
- Evaluation idea: ask 5 colleagues to rate the answers
- Can I switch to cloud models if local models are too slow?
```

## Input: context from meeting 1
### Prep sheet used last time
```text
PREP SHEET – MEETING 1 (KICK-OFF), 30 MIN
Agenda: 5 min my two ideas · 10 min pitch expectations · 10 min topic feedback · 5 min next steps
Questions:
- Must: What should my pitch contain, and how long should it be?
- Must: Which of my two ideas (HR onboarding chatbot / predictive maintenance for a lift company) has the better scope for a bachelor thesis, in your view?
- Should: Do I need a confirmed client to start?
- Should: When is the task description due, and who writes the first draft?
- If time: How many meetings will we have?
Verify first: task description deadline; number of meetings
Supervisor decides: topic choice; whether comparing two LLMs is enough
Next step: ask my friend whether he has time to support idea B.
```
### What happened
```text
Outcome of meeting 1:
- Supervisor preferred the HR chatbot. Option B (lift company) is dropped; my friend has no time anyway.
- Decided: HR onboarding chatbot, compare 2 LLMs, local models only
- Open: which 2 LLMs; how to evaluate (supervisor: "think about metrics", no details)
- To do: I write the first draft of the task description and send it before the next meeting
- Pitch feedback: research question too broad
```

## Output (verbatim)

# Meeting 2 Plan (30 min, Thursday)

**Goal:** Leave with a narrowed research question, a confirmed model and evaluation approach, a clear answer on the data and cloud-model questions, and a deadline for the task description.

## Before the meeting

- Send the task description draft, even if it's still half done, so the supervisor can react to the direction.
- Check the task description deadline and the number of meetings, which were still "verify first" items from meeting 1. Ask the university's thesis office or check the portal if you can't find them.
- Bring one page with the narrowed research question, Llama 3 and Mistral (exact versions and sizes), and a rough evaluation sketch. Check the license terms of the versions you plan to use.

## Agenda

**0–3 min: Opening.** State the goal: "I'd like to narrow the question, agree on models and evaluation, and settle two open points."

**3–8 min: Progress.** Give a short status update: the task description is about half done, and you'll send the full draft by [date].

**8–15 min: Research question.** Propose "answer accuracy for onboarding FAQs" and ask whether it's narrow enough, and whether it still fits a bachelor-level scope. Ask what the supervisor expects the research question to cover (for example, accuracy only, or also speed and user experience).

**15–23 min: Models and evaluation.** This is the most important block.

- Confirm Llama 3 and Mistral. Ask whether comparing these two is enough, or whether a third model is expected. Meeting 1 decided on two LLMs, so frame this as a check, not a reopening.
- Ask for feedback on evaluation. The supervisor said to "think about metrics," so bring proposals: accuracy against reference answers for the 40 questions, whether answers are grounded in the source documents, and response time on your hardware.
- For the colleague ratings, ask whether 5 raters is enough, and suggest a simple rubric (for example, correctness and completeness on a 1–5 scale). Ask whether raters should be blind to which model produced each answer.

**23–27 min: Data and constraints.**

- Internal HR documents: ask whether you can use the 40 example questions and the source documents, and what approval you need. Mention that the company may require approval, and that data protection rules apply, since you're in Switzerland. Ask whether you should check with the company or the university's data protection office first.
- Cloud models: remind the supervisor that meeting 1 decided on local models only. Ask whether a change would be acceptable if local models prove too slow, and under what conditions, such as documenting the switch and comparing it with the local results.

**27–30 min: Next steps.** Summarize what was decided and read back the action items:

- Your action items (task description draft, evaluation proposal, data approval steps)
- The supervisor's action items (feedback on the research question, approval on cloud models if needed)
- Date of the next meeting and the task description deadline, once confirmed

## Must-leave-with

1. The narrowed research question (or a clear next step to finalize it)
2. Agreement on the two models
3. A direction on evaluation metrics
4. An answer on using the HR documents
5. A decision on the cloud-model question
6. Confirmed deadlines and the next meeting date
