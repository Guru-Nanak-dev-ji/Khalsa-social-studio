# KDN–KIDO Federation Architecture Baseline V1
Date: 2026-10-31
Author/room: GPT-02 VISHWAKARMA (architecture assignment)
Task: KDN-ARCH-001
Status: DRAFT FOR REVIEW — NOT PRODUCTION VERIFIED

## 1. Scope and evidence
Read-only inspection of `Guru-Nanak-dev-ji/Khalsa-social-studio` on `feature/kdn-federation-nav-v1` and `Guru-Nanak-dev-ji/KiDO-g.net` default branch.
Reference: `docs/KDN-TEN-ROOM-AUTONOMY-PLAN-V2-1.md`, `docs/KDN-MASTER-BLUEPRINT-V1.md`, `assets/mission/registry.json`, `assets/mission/catalog-mapping.json`, `assets/federation/kdn-federation.js`, `assets/federation/kdn-federation.css`, `mission-charter.html`, `mission-roadmap.html`, `KiDO-g.net/api/chat.js`.
GitHub comparison at inspection: feature branch 20 commits ahead and 0 behind main; not deployed merely by existing on feature branch.
External reachability: web fetch failed and local DNS resolver returned temporary failures for all 11 domains. These tool/environment failures do NOT prove domain DNS is broken. Hosting, certificates, apex/www redirects and page availability remain UNVERIFIED.
No DNS, hosting, deployment or production updates were performed.

## 2. Architecture decision: reuse, do not clone
- Use the existing buildless HTML/CSS/JS/PWA Khalsa-social-studio for central navigation, mission catalog and public progress.
- Preserve domain ownership, unique look/content and separate canonical URLs for each domain.
- Use federation header/footer + machine-readable member manifest + explicit external link-out. Do NOT introduce a new shared authentication or full multi-domain backend until necessity, data model, security review and ownership are agreed.
- Existing registry has 12 program pillars, all marked `phase: design`, `verified_live: false`.
- Existing catalog maps 133 entries heuristically. These are NOT 133 verified websites/representation units. The proposed 1,430-unit mapping requires approved definitions before generation.

## 3. Eleven domain responsibilities and initial dependencies
All hosting, DNS zone owners, TLS, redirect policy and active repository mappings must be individually inventoried before release.
| Domain | Proposed public role (from blueprint) | Implementation dependency | Infra status |
| --- | --- | --- | --- |
| not4you.world | Federation entrance | Canonical portal, member manifest, navigation | UNVERIFIED |
| khalsa.homes | Housing/community | Service catalog, privacy notices | UNVERIFIED |
| sikh.website | Heritage/learning | Editorial citations, translations | UNVERIFIED |
| khalsa.website | Identity/brand | Domain ownership and DNS verification | UNVERIFIED (blueprint labels DNS pending) |
| khalsa.buzz | Discussions/community | Moderation, consent, safety | UNVERIFIED |
| khalsa.church | Identity/purpose undecided | Owner-confirmed scope, DNS and content policy | UNVERIFIED (blueprint labels DNS pending) |
| khalsa-legal.world | Legal information | Jurisdiction, disclaimers, counsel review | UNVERIFIED |
| khalsa-news.world | News/editorial | Citation standards, editorial independence | UNVERIFIED |
| khalsa-konnect.shop | Commerce/cooperative | Business validation, payment/legal controls | UNVERIFIED |
| khalsa.lol | Games/entertainment | Age-appropriate design and accessibility | UNVERIFIED |
| kido-g.net | KIDO-G and BRAHMA | Chat API, availability, safety, provider config | UNVERIFIED |

`UNVERIFIED` means lack of independent live evidence, not confirmed downtime.

## 4. Proposed minimal component topology
Browser → domain-local UI → common federation identity links/manifest.
Browser → KIDO-G (own origin) → existing KIDO chat API → configured AI provider.
No cross-domain user sessions, federated login, shared cookies, central payment, or auto-publishing is assumed to exist.
The public member manifest should contain only domain, label, role, canonical URL, live_verification_status, checked_at, and responsible repository. It should not expose personal data or secrets.
Until a manifest is validated, avoid implying that all 11 sites are live; the current navigation lists 9 links and 2 DNS-check labels.

## 5. Observed integration gaps
A. `assets/federation/kdn-federation.js` and CSS exist on the development branch and are referenced by `directory.html`; `index.html` does NOT load them. Navigation therefore is not consistent across inspected pages. Review other entrypoints and service-worker caching before adding common assets.
B. The navigation JS adds site links to 9 sites and plain status labels for `khalsa.website` and `khalsa.church`. Those labels are based on development assumptions, NOT current independent DNS measurement.
C. `KiDO-g.net/api/chat.js` explicitly allows CORS origins `https://www.kido-g.net`, `https://kido-g.net`, `https://kido-g-ai-api.vercel.app`. It does not yet allow other federation origins. This is not a blocker to simple hyperlinks or full-page navigation; cross-origin JS fetches require a separately reviewed API architecture. Do not blanket-allow `*` origins or expose the provider key to browsers.
D. The KIDO API supports `GET` status and `POST` messages; actual production deployment, authentication, usage controls, abuse protection and uptime are unverified. Avoid treating this status route as evidence of a healthy upstream model.
E. Readme describes GitHub Pages at `guru-nanak-dev-ji.github.io/Khalsa-social-studio/`, but the actual Pages deployment state has not been independently confirmed.

## 6. Proposed API contracts (design only, not deployed)
- `GET /federation/v1/members.json` (static public manifest): `{version, generated_at, members:[{domain, label, role, canonical_url, status, verified_at, repo}]}`. Permit `status: unknown|verified_live|verified_unavailable`. Data must be evidence backed.
- `GET /federation/v1/programs.json`: curated public projection of the existing registry, no duplicate source-of-truth or private fields. Versioning and editorial review required.
- KIDO chat: keep `POST /api/chat` on the trusted KIDO host. If cross-domain embedding is required later, define consent, request limits, token protection, explicit origin allowlist, abuse controls and test cases before modifying CORS.
- For links-only federation, no cross-site API access is required; start with URLs and public manifests.

## 7. GPT-03 implementation specification
1. Inventory every HTML entrypoint and existing federation stylesheet/script inclusion. Produce counts + file list + DOM screenshot/test evidence.
2. Add progressive-enhancement federation navigation consistently to approved entrypoints, without destroying existing `kdn-home` or mobile paths.
3. Accessibility: keyboard, 44px touch targets, focus visibility, semantic navigation, Hindi/Punjabi/English labels as appropriate; no inaccessible overlays.
4. Preserve PWA offline behavior; review `sw.js` cache version and asset list before changes.
5. Add tests for current-page deduplication, external URL safety, no false live claims, and fallback without JS.
6. No unreviewed CORS widening or new shared login; hand KIDO API proposal to GPT-05 + GPT-04.
Acceptance: deterministic test report, mobile screenshot/keyboard QA, no new dead links, no regression in existing tests, and code commits on a review branch only.

## 8. GPT-10 operations/release specification
1. Inventory per-domain: registrar/control account, authoritative NS, apex/www A/AAAA/CNAME, certificate issuer/expiry, hosting provider, repo, deploy pipeline, redirect chain and reachable public response.
2. Capture evidence with timestamp, tested network and effective URL; distinguish DNS failure from TLS failure, authentication gate, wrong deployment, redirect loop and app failure.
3. Stage/preview all changes; enforce gates G0 inventory → G1 integrity → G2 mobile/a11y → G3 privacy/security → G4 content/legal → G5 staging signoff → G6 approved production → G7 monitoring/rollback.
4. Require owner approval for production DNS/deploy/security changes; log rollback plan and before/after evidence.
5. Do not promote the 11 sites as verified-live until all independently pass their checks.
Acceptance: domain-by-domain evidence matrix, clear blocked reasons, preview URLs, human release approval and rollback runbook.

## 9. Task handovers and dependencies
- GPT-03: navigation coverage and integration tests (P1).
- GPT-04: a11y and API security review (P0 where API changes are involved).
- GPT-05: KIDO/BRAHMA API trust boundary and limits (P1).
- GPT-06: hosting/DNS/repository ownership inventory (P0).
- GPT-08: multilingual/editorial/registry validation (P1).
- GPT-09: federation shared identity UX check (P1).
- GPT-10: release readiness and rollback checklist (P0).
- GPT-01: central ledger registration and conflict resolution.

## 10. Decisions required before implementation
- Actual registrar/hosting assignments per domain; unresolved DNS records and Cloudflare account ownership.
- Whether not4you.world or another site is the canonical federation entry point (blueprint proposes not4you.world).
- Owner approval of brand badge/design and multilingual taxonomy.
- Cross-domain authentication / API requirement: default NO unless justified.
- Scope and public use of `khalsa.church`.
- No 1,430 placeholder pages until unit definitions and data governance are approved.

## Checkpoint
TASK_ID: KDN-ARCH-001
COMPLETED: Read source architecture and code; drafted federation dependency baseline, domain matrix and engineering/operations specifications.
EVIDENCE: This file + referenced code paths and GitHub branch comparison.
PENDING: Independent domain availability verification, repository mapping and visual tests.
BLOCKERS: No authoritative domain/hosting inventory; public URL testing inconclusive due to tool failures.
NEXT: GPT-06 inventory + GPT-03 navigation coverage tests + GPT-04 security review.
APPROVAL: No production action requested.
