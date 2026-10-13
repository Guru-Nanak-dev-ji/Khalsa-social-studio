# KDN — Free Royal World v0.14.0

User-approved scope: replace the opening presentation and refresh the shared royal design using only free/open-source tooling, retain existing working app functions, and publish into the same GitHub Pages app.

## First screen

- Header: **किरत करो वंड छक्को**
- **सबकुछ सबका, सब को सबकुछ free**
- **क्योंकि वाहेगुरु जी ने हमें सब मुफ्त में ही दिया है और देता ही जा रहा है।**
- Corrected Gurbani: **ਦੇਦਾ ਦੇ ਲੈਦੇ ਥਕਿ ਪਾਹਿ ॥** — Japji Sahib, Pauri 3.
- **New khalsa world order**
- Explicit free-entry explanation is available through “हमारा संकल्प”. Shared goods, jobs, ownership and real cash are not represented as already available entitlements.

## Experience

- A locally bundled Three.js 0.180.0 scene: procedural gold domes, minarets, arches, inlaid circular map, reflecting-pool geometry, chess pawns and orbiting mechanical rings. No paid API, video credits, runtime CDN, remote 3D model service or image-generation service.
- First visit stays on the mission until the user enters. A 6.8-second skippable city tour precedes the pledge gates. Direct entry is always available. Returning users with progress resume after a short mission screen; the first appearance of this release does not erase old progress.
- Each pledge door gets a distinct 2.8-second intro before its leaves open (650 ms), followed by the camera push (750 ms) and the existing four-option golden TV.
- Both paths remain available. Cancel intro returns to the same door without scoring; skip completes only the intro. Hidden tabs pause intro progress. Reduced motion uses a static 600 ms transition; motion and lightweight-view controls remain available.
- Existing Control Room/next-room door buttons receive a room-specific intro after the existing ledger step. The prior profile requirement remains.
- Original SVG architecture is a lightweight fallback if WebGL2/module loading fails or the user selects it. Context loss also exposes the fallback. Device pixel ratio is capped at 1.5 and continuous 3D rendering at approximately 30 fps. Repeated geometry is instanced.
- Two existing local falcon sprites now fly/perch on the welcome and cinematic screens, as well as the previous pledge, guide, profile and control views. They are not new rigged 3D models.
- Shared ink-blue/gold materials, doors and typography now cover all 21 HTML entries/tools. Same existing project; no reference site is embedded or added as an app destination.

## Source and update contract

- `khalsa.html` is a new cache-safe entry into the SAME app, not a new site. It equals index, enter, world, maze, kingdom and palace byte for byte. The existing installed app's manifest ID/start URL/scope/icons remain unchanged.
- Active code: `assets/world/v014`, `assets/kingdom/v014`, `assets/palace/v014`, `assets/realm/v014`. Canonical world scripts match active v014. v011/v012/v013 remain frozen.
- Service worker v0.14.0 includes the new modules, vector fallback, fonts and license files. Existing draft/journey/collection keys are retained. `kdn-realm-intro-v014` stores only a local seen flag.
- New original presentation code and SVGs: MIT. Three.js license is preserved separately. This does not relicense the inherited user artwork/voices; see `assets/realm/v014/OPEN_SOURCE.md`.
- Scripture source checked: https://www.sikhmissionarysociety.org/sms/smssikhism/prayers/japjisahib/

## Verified / limitations

- Node behavior and Python static suites, all-entry DOM preservation, complete five-gate → Pran → guides → profile → ledger/control flow, hidden timers, skip/cancel, resume, unique gifts and profile bonus, unsafe profile-link rejection, old drafts and corrupt save preservation.
- Local Three.js ES module dependency graph imports; every cache/CSS/HTML asset is checked locally. Falcon motion/perch checks use a 390px canvas/DOM simulation.
- Real browser rendering is unavailable in this managed environment because its required browser QA capability is absent. Simulation is not a real Android visual, GPU-performance, touch, sound or PWA-upgrade test. Do not describe it as one.
- These are real-time animated intros, not MP4 videos. Accurate guide lip-sync, public accounts, real social connections/auto-posting, backend payments/jobs and a completed 500-room world are not added by this release.

## Next work

Use the actual phone result to refine camera framing and text clearance before expanding new rooms. Preserve this first-screen copy and the existing functioning tools. Use free/open-source dependencies only; no Runway purchase, paid credits or subscriptions.
