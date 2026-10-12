# KDN World v0.10 — immersive five-gate opening

Requested 12 October 2026. Baseline c10380c83ed0c79f381f80d831e0b73cd192a2af. Branch feature/immersive-gates-v010. This file describes code and QA, not proof of deployed or device-verified behavior; inspect the PR and Pages.

## User experience

Root, enter.html and world.html are byte-identical aliases; keep them synchronized. A 1.8-second skippable illuminated KDN/emblem entrance leads to a fixed 100dvh scene. The yin–yang fills the background, baaz cross the scene, two gold/purple mehrab doors open and CSS perspective simulates camera movement inside. No full WebGL map, explorable 3D city or photoreal scene is claimed. Other existing app pages get a noninteractive baaz via heritage.css.

All long content and options are in a native modal with its own scrolling; the world page itself stays one viewport. Phones, short screens and landscape have separate layout rules. Motion can pause; reduced-motion disables travel/rotation/flight/splash. Sound is opt-in and synthesized locally through Web Audio. No flashes or audio autoplay.

## Progression and editorial choices

1. Five reflection gates: self, family, neighbourhood/city, country/culture, nature/sarbat. Each offers four options; light/shadow paths supply different follow-up prompts.
2. Full user-supplied pledge is preserved verbatim and labeled as the supplied text. It is voluntary, not a legal signature or a requirement to risk one's life. Accept and consider both continue.
3. Five introduction slides explain shared participation, Sikh Saathi/sharing proposal, cooperative direction, payment proposal and profile entry. Sharing increases access/usefulness, not magical inventory. Factories, 960 million members, houses, schools and jobs are not represented as existing verified benefits.
4. A display name/alias, preferred language and learning interest unlock this local world mode. Phone numbers, identity documents, family lists and location are not required. The current UI/questions are Hindi; preference does not falsely imply translation.
5. World doors provide knowledge/work/seva quizzes; a forward-step control simulates movement and can produce a surprise question.

No attempt is made to detect a lie, force private disclosure, grade religious loyalty or trap a participant on a negative path. Equal membership standing is not conditional on agreement. Independent Studio/Creator/Gyan tools remain accessible.

## Quiz

- 15 authored four-choice factual/practice questions, including five on cooperative/shared work ideas. Each answer explanation ends in a further reflection question.
- Knowledge questions have a 30-second timer; explicit pause and hidden-tab suspension. Reflection/pledge questions are untimed and never marked right/wrong.
- Correct +10, wrong −3, timeout 0 in JK, IQ, Study, Work or Seva. Separate participation +1 per answered reflection/knowledge attempt (including quiz expiry). Accuracy 0–100% is correct/attempted knowledge answers. IQ is a game category, not an intelligence test.
- Duplicate answer clicks and repeat questions cannot farm points. At 15 answered questions the pool ends; another practice round requires an explicit new journey.
- Ask AI provides an explicitly authored offline hint, not a model response. 50:50 removes two wrong options. Audience Poll uses clearly labeled simulated percentages, not real viewers. Each is once per question; help pauses the timer.
- Quiz runs on world entry, a door, a random step (35% chance), and each completed 60 visible active minutes. Hourly events wait until no dialog/travel is active. An unanswered quiz resumes rather than being replaced. The hourly-preview button doesn't manipulate elapsed time or promise earnings.

## Local time and money proposal

The header shows DEMO, ₹125/hour and visible active elapsed time. A monotonic clock ticks while the page is visible; hidden time and meter-paused time don't accrue. Long scheduling gaps are capped. No closed-tab or background payments. The example is rounded down to paise and never represents a wallet, debt or withdrawal entitlement.

The user's partnership agreement plus three-month training idea is shown as a proposed future payment model, contingent on actual written terms and available work. No registered cooperative, signed partnership, employer, funded payment program or guaranteed income is asserted.

## Profiles, companions and self-reflection

- In-memory by default. Explicit consent saves to new key kdn-immersive-world-v1; no other app keys are written. Saved progress resumes at its prior phase without requiring all pledges again.
- The Store checks corrupt/quota/stale state before writing or clearing. JSON export is an explicit user action. No import UI yet; do not claim full backup restoration exists.
- Twelve optional companion aliases maximum, each with a consent/fictional checkbox. They become deterministic chess-symbol portraits, not AI-generated faces or inferred personalities. Entries can be removed.
- Thirty distinct optional self-rating labels (no claim that science discovered exactly 30). Percentages are entered by the participant; not a diagnostic/personality test or a rating of relatives. Private third-party traits, phone numbers or precise ages are not collected.
- Three action intentions can be selected and self-reported as done. This is not externally verified work and does not pay money or issue civic votes.

## Verification and remaining work

38 Node tests and 17 Python checks cover existing functionality plus gate progression, positive/negative scoring, no-repeat exhaustion, hour/paise math, minimal-data validation, consent, corrupt/quota/stale storage and complete offline assets. A separate jsdom simulation covers the complete onboarding, all four-option dialogs, timer/pause/expiry/hidden events, all lifelines, correct/wrong rewards, random and hourly events, consented avatars, self-ratings, work items, explicit save/resume, old drafts, intro light animation and camera transition state.

No actual browser rendering or Android device screenshot was available; DOM and CSS checks do not prove phone layout, audio, GPU smoothness or installed-PWA refresh. Test the user's Android screen and both orientations next. Cinematic city/map, true AI avatars/scoring, question localization, auth/backend/admin/live/social publishing, signed agreements and real cooperative/payments remain pending.

## Sources

- Cooperative principles: https://www.ica.coop/en/cooperatives/cooperative-identity
- Native modal behavior: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal
- User-initiated audio: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices

The five gate prompts and full pledge originate in the user's supplied text; the reflection questions were edited to preserve voluntary participation and privacy. Do not treat earlier Grok material as verification of actual institutions/resources or a validated psychological scale.

## Latest brand wording (user steering during this build)
Preserve these lines in the opening and first introduction: “किरत करो , वंड छक्को”; “सब कुछ सबका, सबकुछ सबको free”; “The new khalsa world 🌍 order”. Present them as the project’s direction/vision; they do not establish that all goods, services or money are currently provided free.
