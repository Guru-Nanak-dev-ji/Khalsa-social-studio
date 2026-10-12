# Duality opening — v0.9

Requested 12 October 2026. Baseline `4be531a0657916d75c80a8174a18752412472491`. Branch `feature/duality-gateway-v09`. Verify PR and Pages status separately; this document does not establish deployment.

## Implemented
- Root `index.html`: Royal Gold/purple yin–yang, orbit rings, chess motifs, two mehrab doors. `studio.html` preserves the previous control room and issue/install controls. Direct links keep tools available without completing the game.
- `4you.world` / `not4you.world` are internal symbolic door labels. No domain ownership or external site connection is claimed.
- Opening: “क्या तुम ईमानदार हो?” / “क्या यह चक्रव्यूह तुम्हारे लिए है?” Both answers are explicit. Light is an action path; shadow is a doubt/reflection path. Neither excludes participants.
- 25 authored Hindi questions (opening plus 12 light and 12 shadow). After the opening, selection prefers the chosen route and current depth, then unvisited questions on that route, then any remaining question. No question repeats during a forward journey. Random ordering can coincide between sessions; it is not guaranteed globally unique or infinite.
- Manual next, break after every six answers, final completion, previous-answer undo, confirmed restart. No forced admission, timer or signup gate.
- Each answer grants 3 points across two of five practice categories: साहस, खुलापन, करुणा, जिम्मेदारी, विवेक. These describe the exercise selected, not the person's inferred honesty, mental condition, belief or worth. All choices have equal total reward. Undo recomputes points, so repeated clicks do not accumulate extra points.
- No live AI connection; UI explicitly labels local rules. Scores do not affect My Neta, cash, coins or any account. No leaderboard.
- Answers and points exist only in page memory. `pagehide` clears them, including back-forward-cache navigation. No storage writes, analytics or network response submission. Existing draft keys are untouched.
- Rotation 48 seconds (default) / 100 seconds (very slow), Pause, hidden-tab suspension and system reduced-motion support. Static without JavaScript; no flashing/strobe, autoplay audio or automatic question advance. Native buttons, keyboard focus, text scores and no-JavaScript tool links.
- SW `v0.9.0` bundles new scripts/styles/control room; PWA identity, icons and native Android app are unchanged.

## Validation and remaining work
- Node: exercise totals, invalid/double click guards, branch selection, varied order, no-repeat exhaustion for three strategies, break cadence and point rollback.
- Python: HTML targets/links, retained control room, no response storage/network calls, heritage styling and prior feature checks.
- jsdom UI simulation: both branches, all 25 questions, breaks/completion, undo/restart, score disclosure, pause/speed, reduced-motion changes, hidden tab and page-exit clearing. This is not a browser screenshot or Android device test.
- Actual phone layout, touch, installed PWA cache refresh and motion need Android confirmation. Keep text readable under large font settings; 320px stacks doors, wider phones show both side-by-side.
- Punjabi/English question translations, approved AI integration, larger authored question pools and cinematic 3D scenes remain future work. No actual AI judging, live social backend or new payment capability is activated here.
- Current first-signup-only Pran requirement is not replaced with a mandatory recurring pledge.

## Continue
Read this file plus `AI_HANDOFF.md`; inspect current main, PR and Pages. Preserve local drafts and the direct Studio entrance. Expand questions with equally respectful paths, explicit rewards and no diagnosis or worth ranking. Add actual AI only with a clear purpose, consent and response-data handling—not by renaming the rule engine. Keep original author writings separate from game content.
