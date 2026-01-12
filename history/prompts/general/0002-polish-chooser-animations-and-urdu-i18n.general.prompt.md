---
id: "0002"
title: "Polish chooser animations and Urdu i18n"
stage: "general"
date: "2026-01-12"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "main"
user: "creativesar"
command: "chat"
labels: ["ui","animation","i18n","urdu","next-intl"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/app/[locale]/(auth)/chooser/page.tsx
  - frontend/messages/en.json
  - frontend/messages/ur.json
tests:
  - frontend: npm test
  - frontend: npm run build
---

## Prompt

@frontend/src/app/[locale]/(auth)/chooser\ isko aur acha banao yar animation etc tou dalo... cards sahi hain par maza nhi ha... aur han ek bat aur urdu translation nhi ho rh ha yeh bhi dhekhna ha

## Response snapshot

Updated the auth chooser page to use next-intl translations instead of hardcoded English text, added missing chooser translations to both en.json and ur.json, and added subtle entrance animations to improve page feel. Confirmed frontend tests and build pass.

## Outcome

- ✅ Impact: Chooser page UI feels more polished (entrance animations) and Urdu locale now properly translates chooser page content via next-intl keys.
- 🧪 Tests: PASS (npm test, npm run build)
- 📁 Files: Updated chooser page and added chooser translation namespace to both locales.
- 🔁 Next prompts: Verify Urdu RTL layout visually on /ur/chooser and tweak wording if needed.
- 🧠 Reflection: If a page does not call useTranslations(), locale switching will only change URL/dir but not the page text; always back UI strings with message keys.

## Evaluation notes (flywheel)

- Failure modes observed: Initially used inline styles for animation delays; adjusted to Tailwind arbitrary properties to match “no inline styles” guideline.
- Graders run and results (PASS/FAIL): PASS - Full prompt preserved, routing correct, metadata populated
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add a CI check to ensure both locale JSON files contain the same key structure (including arrays) to prevent untranslated pages.
