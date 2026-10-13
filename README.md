# Khalsa Social Studio 🌍

A free and open-source social media management platform.

Part of Khalsa Digital World (KDN).

## Our Mission
Knowledge • Seva • Collaboration • Technology

## Available features — v0.6
- Photo Poster Creator: square 1080 × 1080 or portrait 1080 × 1350 PNG, with three Royal Gold mehrab styles, chess pieces and playing-card ornaments.
- Local JPG/PNG/WebP photos, crop focus controls, editable headline/message/credit, saved text-draft copying and manual image sharing where supported.
- Bundled Hindi/Punjabi fonts and an overflow guard that prevents exporting cut-off text. Poster work is temporary; download the PNG before leaving.
- Shared, varied mehrab styling across all ten HTML screens, including Gateway and both FAQ readers.
- News and social text editor with Hindi, Punjabi and English interfaces.
- Editable on-device drafts, search, copy, TXT export and JSON backup/import.
- Copy previous News Desk and Sangat Post Studio text drafts without changing their data.
- Manual device share menu, when supported. Publication remains the user's action.
- Royal Gold interface and a versioned offline PWA shell.
- Existing News Desk, media preview and personal post calendar remain available.

The public opening is at https://guru-nanak-dev-ji.github.io/Khalsa-social-studio/; the Control Room is at `studio.html`.
The text Creator is at `creator.html`; the Poster Creator is at `poster.html` after this change is merged and Pages deploys it.
See [v0.6 handoff and validation](docs/POSTER_V06_HANDOFF.md) and the PR/Pages status for release verification.

## Not connected yet
AI generation/translation, cloud sync, OAuth publishing, automatic scheduling and push notifications are not active. The personal post calendar is a plan, not an automatic publisher.

## Development
This is a buildless HTML/CSS/JavaScript PWA. Pages serves `main` from `/` (root).
Run `python -m unittest discover -s tests -v` and `node --test tests/*.test.cjs`.
Before each deployed app-shell change, bump the cache version in `sw.js` and include any new local assets in its list.

## Vision
सब कुछ सबका है — साथ, सेवा, सहयोग से।

## Community tools — v0.7

Open [Sangat Darbar](community.html) for Daljit’s selected writing excerpts, an adjustable/pauseable slider, personal seva records with multiple activities/dates, backup/restore, and a fictional five-choice/25-point My Neta demo. Hindi, Punjabi and English controls are included. The Nihang greeters are generated static cutouts; optional Fateh speech uses an available device voice.

These additions do not activate public accounts, authentication, a multiuser feed, automatic posting, live streaming, team admin access, delegation, payments or withdrawable coins. The ₹125/hour calculator is explicitly a non-cash proposal demo. [Full handoff and request status](docs/COMMUNITY_V07_HANDOFF.md) · [Agreement review draft](docs/COMMUNITY_AGREEMENT_DRAFT.txt).

## Gyan Mandal — v0.8

[Open Gyan Mandal](gyan.html): three thematic Dwars, nine spiritual reflections, a personal journey, a parenting/service discussion proposal and family dedication. Twelve reader routes provide Punjabi text, Hindi summaries, source references, adjustable type, reflection questions, TXT and explicit Creator copies. This is the edited reading edition; original text is preserved separately. [Editorial and development handoff](docs/GYAN_V08_HANDOFF.md).

## Duality opening — v0.9

The root now opens a slow rotating yin–yang and two internal, symbolic mehrab doors: **4you.world** and **not4you.world**. Twenty-five Hindi reflection questions branch by answer, with transparent practice points, six-answer breaks, undo, restart, reduced motion and direct access to Studio. Both paths encourage constructive reflection and equal participation. Responses stay in page memory only. These are authored questions and local game rules, not live AI evaluation, an honesty test, money or My Neta votes. [Behavior and release handoff](docs/DUALITY_V09_HANDOFF.md).

## Immersive opening — v0.10

[Enter the five-gate world](world.html). One viewport contains a large animated yin–yang, two perspective doors, camera-like entry, flying baaz and an illuminated KDN start. Four-choice reflection gates lead through the full voluntary pledge, a five-part introduction and a minimal profile into a local Game of Takhats demo.

Fifteen knowledge/practice questions include a pauseable 30-second timer, opt-in sounds, 50:50, clearly labeled prepared hints and demo audience votes. Positive/negative quiz points and accuracy percentages are separate from equal participation. Step events and visible active-hour events introduce more questions. A ₹125/hour demo calculation is not earnings. Optional consented aliases, self-ratings, work intentions and opt-in local progress are included. [Scope, validation and pending work](docs/WORLD_V010_HANDOFF.md).

## v0.11 — Golden TV maze
Touch a door before the question appears. Perspective entry leads to four TV options, explicit positive/negative answer feedback, then a sliding TV and the next doors. The original golden/silver falcons now fly and perch across app screens. A work profile offers local skill/interest suggestions; 96 crore jobs remains a proposal. Open maze.html for the fresh entry path. Details and QA limits: docs/MAZE_V011_HANDOFF.md.
