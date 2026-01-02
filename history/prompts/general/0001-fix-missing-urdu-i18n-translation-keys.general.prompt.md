---
id: "0001"
title: "Fix missing Urdu i18n translation keys"
stage: "general"
date: "2026-01-02"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "main"
user: "creativesar"
command: "/sp.phr"
labels: ["i18n","urdu","translation"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - phase-2-web-app/frontend/messages/ur.json
tests:
  - none
---

## Prompt

--title "Fix missing Urdu i18n translation keys" --stage misc --feature none --labels ["i18n","urdu","translation"]

## Response snapshot

Fixed missing i18n keys in Urdu translation file by adding: greeting.evening, tasks.deleteTitle, tasks.deleteMessage, tasks.keepIt, common.delete, list.tasksRemaining, common.loading, and nav.logout.

## Outcome

- ✅ Impact: All Urdu translation keys now match the English file structure, resolving console errors for missing messages
- 🧪 Tests: none
- 📁 Files: phase-2-web-app/frontend/messages/ur.json
- 🔁 Next prompts: none
- 🧠 Reflection: Adding complete translation sets upfront for all supported locales prevents runtime errors when components use i18n keys

## Evaluation notes (flywheel)

- Failure modes observed: Script rejected 'misc' stage without feature context; had to use 'general' stage instead
- Graders run and results (PASS/FAIL): PASS - Full prompt preserved, routing correct, metadata populated
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Create a validation script to check all i18n files have matching keys across locales before build
