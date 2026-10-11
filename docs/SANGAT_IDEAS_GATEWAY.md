# Sangat Ideas Gateway — Implementation Plan (2026-10-11)

Status: PLANNED. No public submission backend is currently connected.

## Public experience
- Hindi/Punjabi/English mobile-friendly royal-gold interface, accessible without GitHub sign-in.
- Two clear actions: "नया विचार भेजें" and "नया द्वार प्रस्तावित करें".
- Fields: idea title, category, description, expected community benefit, optional non-public reply method with consent.
- Show a submission reference ID, review state and public-safe updates. Never display contact details publicly.
- Explicit notice: suggestions are reviewed, not automatically approved, published or implemented.

## Status flow
Draft -> Submitted -> Moderation -> Community Review -> Approved / Declined -> In Development -> Tested -> Released.
Only authorized human moderators may approve, reject, or publish proposals. Protected royal-gold, mehrab, heritage, Pran Dwar and original narrative require documented community stewardship review.

## Backend requirements before accepting submissions
- Hosted HTTPS API and persistent storage; public GitHub Pages alone cannot safely store submitted ideas.
- Server-side validation, rate limiting, spam protection, abuse reporting and moderation queue.
- Minimal personal-data collection, privacy notice, retention/deletion policy, role-based access, audit log.
- Authenticated administration; all secrets in server-side secret storage, never in public repo or browser.
- Prevent HTML/script injection; do not allow unreviewed uploads or auto-publishing.
- Accessible anonymous submission with spam controls; optional account only for users who want tracking.
- API cost/hosting/security review before deployment.

## Milestones
1. Approve public submission/privacy requirements and hosting choice.
2. Build backend + storage and moderation workflow.
3. Add public UI and tracking, with tests.
4. Connect Android app, using same backend with proper permissions.
5. Add opt-in notifications after separate secure push implementation and actual device tests.

## AI and cross-account continuity
Read docs/AI_HANDOFF.md and GitHub Issues #1-#3. Any AI service is a contributor under explicit permission, not a governance authority. Do not merge account histories or credentials. Document verified changes and next actions in the repository.

## Acceptance criteria
- Person without GitHub account can submit a proposal, receive reference ID, and track its public-safe status.
- Moderator can review safely; protected changes cannot be auto-approved.
- Privacy and abuse controls are tested, and no personal data leaks to GitHub public Issues.
- Works on mobile, including Android, with royal-gold design intact.
