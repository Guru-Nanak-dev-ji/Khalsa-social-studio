# KDN AI HANDOFF — CONTINUE WORK

Updated: 2026-10-11
Repository: https://github.com/Guru-Nanak-dev-ji/Khalsa-social-studio

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
