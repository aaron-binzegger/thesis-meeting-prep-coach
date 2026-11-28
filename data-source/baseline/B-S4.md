---
runId: B-S4
scenario: S4
meeting: followup
topicIdea: n/a
minutes: 30
model: Claude Haiku 5.5, medium effort
date: 2026-11-23
---

# B-S4 – Second meeting · Mia, after the kick-off · messy notes + context

## Input: notes
```text
next meeting thursday. task description draft half done, research question still
feels broad - maybe narrow to "answer accuracy for onboarding FAQs"?
found 2 candidates: Llama 3 and Mistral. not sure if comparing just 2 is enough.
HR dept of my company would give me 40 example questions, but is that allowed
(internal docs)? evaluation: maybe ask 5 colleagues to rate answers??
also want to ask if I can switch to cloud if local is too slow
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
kickoff done. supervisor liked HR chatbot more (lift company friend = no time anyway).
decided: HR onboarding chatbot, compare 2 LLMs, local models only.
open: which 2 LLMs? how to evaluate - he said "think about metrics", no details.
I have to write first draft of task description, send before next meeting.
pitch went ok, feedback: research question too broad.
```

## Output (verbatim)

# Meeting plan: Thursday, 30 min

**Bring:** the task description draft (half done is fine), a one-page list of the two candidate models, and a short list of proposed metrics.

**1. Status and deadlines (2 min)**  
Tell him the draft is in progress and ask when it's due. Then ask how many meetings you'll have. Both were "verify first" items on your prep sheet.

**2. Research question (6 min)**  
Share the narrowed version and ask whether it works:  
_"How accurately do two local open-source LLMs answer employee onboarding FAQs when grounded in HR documents?"_  
Ask whether "answer accuracy" is the right focus, or whether he wants another angle such as response time or user satisfaction.

**3. Model choice (5 min)**  
Name Llama 3 and Mistral and ask whether comparing two is enough. He said that's his call, so ask what he'd need to see to be satisfied, such as a third model, a size comparison, or a justification for the pair.

**4. Evaluation (7 min)**  
He told you to "think about metrics," so come with concrete proposals rather than asking him to design them:

- **Automatic:** compare answers against reference answers you write from the HR documents, plus a check of whether the answer is supported by the retrieved document.
- **Human:** a fixed rating rubric (for example correct / partly correct / wrong), rated by 3 or more people, with agreement between raters reported.

Ask whether five colleagues is enough and whether he expects a quantitative score, a qualitative analysis, or both.

**5. Data access (4 min)**  
Ask whether using the 40 example questions and the internal HR documents is permitted. Clarify who has to approve it, since your company's HR department may not be the final authority. Ask about anonymizing the data and getting written consent for the colleague ratings. Don't assume the answer is yes.

**6. Cloud fallback (3 min)**  
You decided on local models only, so frame this as a contingency: _"If local inference is too slow for the evaluation, would switching to a cloud model be acceptable, and would it change the research question?"_ Ask him to set the rule now so you don't have to renegotiate later.

**7. Next steps (3 min)**  
Confirm the draft deadline and what goes in the next meeting, then agree on the Thursday-after agenda. Mention that you'll drop idea B, since the friend has no time and your supervisor preferred the HR chatbot. That closes the open item from your prep sheet.
