# KDN Community v0.7 — implementation and remaining scope

Updated 2026-10-12. Baseline: main bf1c696a8b07b8b6d3f2d5bfeb470b6bcfab5282.
Read the PR and Pages evidence for deployment; this document does not by itself prove live status.

## Implemented

- `community.html`: Royal Gold/mehrab page, chess/card motifs, Hindi/Punjabi/English controls.
- Six short writing excerpts, explicitly labelled author opinion. Editorial card headings are distinct from verbatim excerpt text. Original long articles are not replaced. The threatening narrative, family allegations and claims about intelligence agencies are not published as biography/news.
- Slider defaults to 8 seconds with 6/8/12 choices, previous/next, keyboard arrows, pause and a subtle border glow. Reduced-motion preference starts paused and disables animation. Hidden pages and pointer/focus on the reading region suspend transitions. No full-screen white strobe or automatic scrolling.
- Explicit save-to-Creator copies the current excerpt into the established draft schema, with deduplication. Share opens the device share menu or downloads text. No automatic external publication.
- Personal seva records: multiple activities for one date, separate entries for different dates, edit/remove, JSON backup and additive restore. Restore of demo choices is a separate confirmed operation.
- My Neta local sandbox: ten synthetic identifiers, maximum five unique choices, five points each, 25 total; deselection reclaims five. No real people or public ranking. No delegated points are invented.
- Requested guide names and Fateh text; optional user-initiated device speech when a Punjabi or Hindi voice is installed. This is not recorded character audio or automatic audio on every opening.
- Requested public contact email, short author description, external app links from the user's October handoff, source directory link, manual email suggestion link.
- Expandable ₹125/hour proposal calculator with elapsed time, pause/reset, hidden-tab pause and clear non-cash label. Nothing persists as earnings, and there is no rupee-backed coin or payout.
- Downloadable Hindi agreement/pran review draft. No signup gate or pretend identity verification/signing.

## Product truth and latest decisions

Current Studio is a static GitHub Pages PWA. The older native Android Java launcher is separate. Neither is a multiuser social backend. User reports about X login in another app are not evidence of working OAuth here.

| Request | Current result | Required next work |
| --- | --- | --- |
| Instagram/Facebook-like feed, comments, reactions, follow, search, reports/block | Existing local writers + v0.7 excerpt reader | Backend, identity, media storage, pagination, moderation, visibility policies, abuse controls |
| Email/phone signup, duplicates, show password, forgot password, OTP, X/Facebook/other login | Not active; no password collected | Provider selection and authorized credentials, server checks, rate limits, verification, generic recovery responses that avoid public account enumeration; exact duplicate notice only after verifying contact ownership |
| Pran first page | Review draft | Latest instruction wins: only first signup; store consent version on account; no repeated login banner |
| Digital signing agreement | Review draft only | Identify legal operator/jurisdiction and review terms; choose normal consent vs verified eSign; no assertion of legal enforceability |
| Multi-service/multi-date seva | Working local records | Multiuser sync and optional evidence review, if desired |
| Five leaders, 25 points, continuous selection | Local sandbox works | Unique-account enforcement, transactional support ledger, revoke/change events, server time, audit and appeals |
| Forward incoming support to next delegate | Not implemented | Decide whether support is split among five or forwarded to one. Prevent cycles, double counting and self-support; retain origin IDs; recompute after revoke. Do not multiply incoming points by five |
| Winners by most points, 24/7 selection | Not implemented | Eligibility, tie rules, snapshot time and authority are undecided. Do not call demo characters elected officials |
| Everything in fives, kings/queens, 50% women | Visual chess motifs | Five seats cannot be exactly 50/50. Decide alternating 2/3 seats across councils vs paired councils of ten; do not infer gender from name/photo |
| Gharana/gotra/age Takhts, warrior worth | Directory link only | Self-selected groups, voluntary age bands, membership rules and corrections. App fantasy titles are not historical Sikh Takhts or state authority; no caste/person-worth score |
| One crore famous-person parody accounts | Not created | Use clearly marked fictional demo fixtures. Any real parody profile must clearly identify its parody status and creator; no fabricated participation, follower counts or posts attributed to real people |
| All directory member names as demo accounts | Not imported | Opt-in/claim workflow and an authorized export with consent metadata before real-member migration. Public directory membership is not new-platform consent |
| All Indian gotras | Not claimed complete | Current source covers Arora–Khatri taxonomy; broader sourced catalogue needs scope and correction process. Never infer caste from names |
| ₹125/hour, 125000 INR-equivalent coins, referrals | Sample calculator only | Funding and unit economics, limits, unique-user/activity validation, fraud controls, legally reviewed terms, ledger and verified payouts; do not promise money before those exist |
| PayPal/UPI/transfer/cards/donations | Not connected | Verified recipient/operator and authorized provider configuration. No invented UPI ID or payment URL |
| Live and guest panels | Not active | Streaming provider, room admission/roles, camera/mic on use, recording consent, moderation, quotas and connectivity testing |
| Public-post popups from guides | Not active | Opt-in notification preferences, rate limits, accessible dismissible queue, privacy filters; no forced every-post broadcast to every user |
| Notifications/camera/video/storage permissions | No blanket requests | Ask only at feature use; gracefully support denial. Push requires backend/subscription delivery. Upload should use system file picker |
| Social plugins and automatic crosspost/import | Manual share available | Each provider's supported API, authorization, scopes, account type, delivery receipts/retries and per-destination preview. Login alone does not authorize reading/publishing all posts |
| Team admin panel | Not created as an unsecured HTML admin | Real server RBAC, owner/admin/moderator permissions, session security, immutable audit; public static JS cannot enforce admin access |
| Suggestions notify owner | Opens email composer | User sends the message; backend intake/moderation and delivery receipts needed for automatic notifications |
| 3D guide cutouts | Generated transparent paired cutout included in the greeting | Static 3D-look images are distinct from rigged animated meshes and recorded dialogue |
| About, blogs, profiles and followers | Provided contact and short description | Exact WordPress/social URLs needed; search did not establish an exact Daljit Kafir blog. Do not attach other Daljits' accounts. Counts need source and timestamp |
| Grok apps share links | Seven outbound handoff addresses | Current availability unverified. Reciprocal links require access to those projects; account/content/money sharing not connected |
| All Indian languages | Current controls hi/pa/en; user writing unchanged | Specify supported language set, reviewed translations/fonts, content language tags, regional QA; no automatic translation claim |

## Architecture for the next real social release

No provider was purchased or activated. Keep the core free; do not introduce cards, subscriptions or paid trials without a concrete user decision.

Use one authenticated backend with separate records for users, profiles, consent versions, external account authorizations, posts/media, reactions, follows, seva entries/activities, support allocations/delegations, reports, moderator actions, notifications and payout/donation events. Enforce ownership/roles on the server, not in downloadable JavaScript. Keep OAuth tokens in protected server storage; never collect platform passwords. Keep civic support points separate from money, coins, time estimates and service records.

Public-feed launch gate: verified signup/recovery, moderation/report/block, privacy/delete/export, storage quotas, access-control tests and a small real-device pilot. Live/payments/crossposting each need their own provider and tests. The previously discussed 18 October Studio beta target does not promise this expanded social-network scope. No new full-network launch date is committed.

## Sources inspected

- User's local October 7 control-room handoff supplied Grok addresses. Web open attempts did not verify their availability.
- https://arorakhatri.com/our-members.php (public member directory; no individual records copied into the app).
- https://arorakhatri.com/arora-khatri-gotra-directory.php (alphabetical taxonomy source, not proof of membership consent).
- https://cca.gov.in/eSign.html (verified electronic signing requires a real authentication/signature integration; a typed name alone is not CCA eSign).

## Storage and review

- New storage key `kdn-community-local-v1`. Existing Creator/draft/calendar keys are preserved.
- Imports validate the whole payload before writes, cap at 500 records and preserve existing local choices unless their separate restore action is confirmed. ID collisions on different records get new IDs.
- Storage errors, invalid backups and stale tabs fail without replacement; rendering uses text nodes. Browser storage is personal convenience storage, not authenticated or tamper-proof evidence.
- Test core constraints, merge behavior, quota/corruption/conflict and timer math; integration-test save/edit/restore/selection/share fallback/reduced motion. Check actual Android layout, voice, share/download and SW update on device before calling those verified.

## Asset and verification evidence

Built-in imagegen produced a paired transparent PNG for Bhai Nihang Singh and Bibi Nihang Kaur. `assets/branding/nihang-greeters-v1.webp` is a 768×512 optimized app copy with alpha; original generation was 1536×1024. Prompt/production notes are in `assets/branding/nihang-greeters-v1.txt`. Neither image is a rigged 3D model or real-person photograph.

Local checks passed: 22 Node tests; 13 Python markup/integration checks; icon identity/hash validation; jsdom UI simulation of three-language controls, slider, safe text, multi-date/activity save/edit, five-choice limit and point reclaim, Creator dedupe, TXT share fallback, backup/import/reopen, separate choice restore, timer/hidden pause, reduced motion, blocked/corrupt storage and unsaved edits. Actual browser rendering and Android permissions/share/voice are not covered by jsdom.
