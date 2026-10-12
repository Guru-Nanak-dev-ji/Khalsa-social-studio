# KDN AI HANDOFF — CONTINUE WORK

Updated: 2026-10-12
Repository: https://github.com/Guru-Nanak-dev-ji/Khalsa-social-studio

## Latest milestone — v0.6 Poster Creator and app-wide Mehrab design
- User confirms the app opens and asks to move on from the unchanged phone launcher icon. Do not troubleshoot that icon unless asked again.
- User requests varied mehrab arches, chess pieces and playing cards across the app. Shared decorative styling now covers all ten HTML screens.
- `poster.html` adds local photo + headline/message/credit composition, three styles, square/portrait PNG and supported manual file sharing. Copied text drafts stay intact; poster edits are temporary and must be downloaded before leaving.
- Bundled Hindi/Punjabi fonts and text-overflow guards protect PNG output. No photo upload, cloud account or automatic publication is added.
- Branch `feature/poster-creator-v06`, baseline `3c2a69265ba25cfa90e65adba7386c75fe806c0e`, cache v0.6.0. See `docs/POSTER_V06_HANDOFF.md` for the implemented scope, validation and phone check. Verify PR/Pages state before asserting production deployment.
- Automated tests and canvas rendering are checked locally; Android browser layout/download/share still need device verification. Existing tools' inline scripts, FAQ data, storage keys, PWA identity/icons and native Android sources are preserved.

## Latest milestone — integrated KHALSA app icon
- User authorized applying the English KHALSA knight/globe emblem as the app icon and blending its lettering with the logo.
- Versioned PWA icons, favicons and app header artwork are updated; SW cache is v0.5.1. App identity and draft storage are preserved.
- The old icon-generator workflow is now read-only validation to prevent overwriting the selected artwork.
- See `docs/KHALSA_ICON_HANDOFF.md`. Check the PR/Pages run for deployment status; phone launcher refresh is not remotely verified.
- The Creator PR #6 was merged and deployed as `10b4aba57876ec6d9b25f0325a8f68726e5bffb6`; root, Creator, scripts, stylesheet and SW returned HTTP 200 and matched the merged source.

## Latest milestone — v0.5 Creator feature branch
- Source baseline verified: `b0cfa8bcc6d731891caa44cb8cc89ee87a8002c9` (PR #4 merged).
- User's 12 October handoff reports that the v0.4 PWA is installed and opens on Android. This is distinct from the older native Android Java app described below.
- Existing public root, manifest, service worker and all three manifest PNG icons returned HTTP 200 during this work.
- Added `creator.html`: Hindi/Punjabi/English text editor, local draft save/edit/search, TXT and JSON exports, additive backup restore, manual share and copy-only import of previous text drafts.
- Root and previous tools link to the Creator. Legacy tool scripts, legacy storage keys, manifest, icons and native Android source are unchanged.
- Offline app assets use a scope-specific versioned cache. Old unscoped v2 cache is deliberately not deleted; it can be shared with another app on the origin. Future shell edits require a version bump.
- Development is on `feature/news-social-creator-20261012`, through a PR. Do not infer production deployment from this file. See `docs/CREATOR_V05_HANDOFF.md` and the PR status.
- Automated data/cache/markup checks pass. Actual Android touch layout, native download/share and service-worker update behavior still require device verification.
- A separate icon PR #5 was already open during this work; this change does not merge it or change icons.

The technical notes below dated 11 October remain historical context; use the latest milestone and current repository/Pages state for new work.

## Mission
KDN Social Studio is a free community-oriented project for Sangat participation and Khalsa Panth seva: Saath, Seva, Sahyog, Sarbat da Bhala. It is not a personal ownership claim. Formal legal stewardship and community governance are NOT yet established.

## Current verified technical state
- Public GitHub repository with website in root index.html and native Android app under android/.
- Website index.html updated in commit d802ff57dc337d79cd2c314f1e09552dbbba8d17 to fetch public GitHub Issues using unauthenticated GitHub API, with manual refresh, create/view links, fallback and royal gold theme. Deployment and phone behavior must be tested.
- Native Android MainActivity.java is at android/app/src/main/java/world/khalsa/socialstudio/MainActivity.java. It builds native Android UI with buttons that open GitHub Issues, Actions and public website in a browser. It does NOT embed the website as a WebView. It is still labeled v0.1.
- User screenshots showed an earlier successful Android APK GitHub Actions run; do not infer current release readiness.
- Issue #1: GitHub-backed work queue and live status; website partly implemented, needs testing and Android integration.
- Issue #2: PWA/secure push notifications; not implemented or active.
- Issue #3: Panth-first community control room, Sangat idea submissions, new Dwars, multi-AI handoff, stewardship and protected design; planning only.
- No verified connected social accounts. No verified active push notifications.

## Protected design and governance
- Preserve royal gold, mehrab arches, heritage/3D story world, Pran Dwar and the KDN identity.
- Do not change protected core design without documented approval under a transparent Panthic community stewardship process. Until such a process exists, do not assume any AI or collaborator can unilaterally approve such changes.
- Sangat input and open consultation are central; do not falsely claim that a council, legal trust, or legal ownership arrangement already exists.
- Keep core service free for public users where sustainable; define software/content licensing and governance with community input.

## Continuation across AI accounts
A different ChatGPT account or AI tool can resume by reading this file, README.md, Issues, source code and Actions. Chat histories, paid subscriptions, credentials and memory do not automatically transfer between accounts. Keep public repo free of personal emails, passwords, tokens, private drafts and other sensitive data.

## Next development priorities
1. Test website issue list and errors on Android Chrome.
2. Build public Ideas/New Dwar proposal intake that does not require a GitHub account, with moderation, privacy notice and abuse controls; choose a secure backend before collecting submissions.
3. Add shared dashboard and audit trail; role-based approval workflow.
4. Update Android native UI to show current issue summaries safely, or link to the shared dashboard; test APK and Play Protect warning before distributing.
5. Implement opt-in in-app notifications first, then authenticated web push backend and end-to-end device tests.
6. Establish documented community stewardship, contribution/license rules and protected design approvals.

## Definition of done
Never mark work complete based on an Issue, a green CI check, or code alone. Require actual feature testing, security review where relevant, and deployment verification.

## Instructions to the next AI
Read docs/AI_HANDOFF.md, README.md, Issues #1-#3 and current source. Check the newest commits before editing. Make small reviewed changes; update this handoff with factual status and commit after each milestone. Never claim to be working in the background without an actual scheduled or running process.
