# KDN cinematic palace — v0.13.0

## User correction delivered
- Same GitHub Pages app; old tools retained. New `palace.html` entry is an alias, not a separate app. Manifest id/scope unchanged. Index, enter, world, maze, kingdom and palace HTML remain identical.
- Visible in-page KDN light sweep / glow on launch, including a static reduced-motion entrance. A native Android/PWA system splash remains controlled by the OS and is not an animated native splash.
- Gold engraved double doors: leaf opening 850 ms before camera push 850 ms; TV in an interior on a stand. Four answers, compact result, 2.4 seconds visible time, 360 ms slide out, optional hold/manual continue. Next door pairs vary in arch shape.
- Fifth answer opens full-screen blue/gold Pran directly. The supplied full voluntary pledge stays intact; Shiva, Guru Nanak and Baba Farid art move between three stage positions. Pause/manual controls and reduced-motion support.
- Large Tark Singh / Bhavana Kaur cutouts after Pran, moving body poses and speaking indicator, with existing distinct male/female generated welcome voices. Accurate talking-face lip-sync is NOT present: the connected Runway Free workspace exposed no available video model. No paid plan changes made.
- Introduction leads to Control Room with 16 doors (15 destinations plus My Neta shortcut). Existing 13 catalog rooms plus economic, social and feedback mandals give 16 catalog entries. There are 20 HTML files, not 500 completed worlds.
- Attractive three-step local profile: name/current work; goal/field/time with optional skills; optional public social profile links. Zoho Forms links removed. Door locks require a work profile in this demo; they are not authentication or access security.
- Profile completion awards +25 local game points and +10 Khalsa game coins once. Social demo reactions use chess/card symbols, one point per demo post, no repeated reward on replacement. Neither is money or a public rating.
- Before intentional in-app page navigation, show a full ledger. On OS/tab close, save on visibility/pagehide; browsers cannot show a custom in-app popup after the app has already closed.
- Resume valid last local destination, scroll position, full-screen scene, intro slide, or unanswered quiz/timer. New journeys save game progress in this browser; profile save remains an explicit checked option that can be disabled. Existing saved records and old draft/service keys retained.
- Two raster falcons have reserved mobile perches, fly between positions, and appear in full-screen dialog views. Reduced motion renders static birds; hidden tabs stop animation and active-time accrual.

## Recovered artwork provenance
- User local screenshot `upload/01-1000351367.jpg` showed a blue/gold Shiva Pran stage.
- Read-only source reference: old Site appgprj_6aaf2f2b0e8081919452700c5436a056, commit 4d513089c371415de2b4e2a1974031952258662f; recovered whole Shiva-waterfall image.
- Read-only source reference: old Site appgprj_6ac68056cf788191bf8e3484d73269b5, commit 7722076e60c9f6b49ff76d60eeb748ffa3867177; transparent spiritual atlases and original guide pair/falcon sheets. Original Sites untouched. Historical figures are labeled artistic depictions.
- Gold door ornament is a code-native SVG. New recovered assets stored only in this git repository, under assets/palace/v013.

## Architecture / persistence
- Current canonical world-content.js/world-core.js/world.js must match assets/world/v013 copies. Freeze old v011/v012 copies.
- Shared assets/kingdom/v013 preserves original room order/coin mapping, adds three mandals, voices reused from v012 MP3s.
- assets/palace/v013: palace-core.js, palace.js, palace.css, falcons.js, golden-doors.svg, three WebP images.
- Keys: kdn-immersive-world-v1 (existing journey), kdn-kingdom-collection-v1 (existing gifts), kdn-palace-local-v1 (bonus, validated links, local reactions/consented notes, last route). No external requests for this personal data.
- Last-route checks accept only known app HTML paths, no external schemes/traversal. Profile links require HTTPS and allowlisted platform hosts. Corrupt/quota/stale journey storage is not overwritten. User text uses textContent, not HTML.
- Default game progression persistence implements the requested resume. Shared devices can expose browser-local data. Profile checkbox removes persisted profile/journey; unsaved profiles cannot unlock another page after reload. No cloud sync or accounts.
- ₹125/hour is a demo estimate accruing only while visible, with separate ₹0 actual payment/withdrawal display. Agreement/training/payment remains a proposal, not active employment or guarantee.
- New economic, social and feedback worlds share mandal.html query routes. Feedback notes are voluntary, consented, local and deletable; they do not infer anyone's personality or award a public reputation score.
- Social links open public profiles only. OAuth, auto-post/import, real peer reactions, backend login, jobs, payments, ownership, live AI and memorial-photo avatars remain future work.

## Verification
- 51 Node behavioral tests and 17 Python static checks pass.
- Full DOM simulation: five doors → automatic Pran → large guides → 16 locked doors → three-step form → ledger → unlocked control; invalid links, duplicate bonus/reactions, pending quiz resume, hidden timer, corrupt storage and original drafts.
- Shared layer DOM check on all 20 HTML files: original forms/IDs, gifts, inventory, keys, map/search, male/female audio paths, nested page paths.
- Dense 390px viewport falcon canvas simulation: both visible, resting and crossing >100 px while flying; top-layer parenting; reduced-motion/static birds and hidden-tab pause.
- Service worker cache v0.13.0, includes new paths/assets; previous application data not cleared.
- Real Android visual/touch/audio listening and PWA upgrade check are still needed. Browser rendering was unavailable under this environment's Sites workflow; DOM/canvas simulation is not visual verification.

## Next screenshot review
1. Open palace.html; confirm page glow after the OS splash.
2. Touch a gold door, see both leaves open before camera moves; TV stand and four options should fit the phone.
3. Complete five answers; confirm full Pran stage, then large guides and Control Room.
4. Complete profile, inspect ledger, test existing Creator and My Neta. Leave/reopen and confirm resume.
5. Confirm both falcons fly/perch and don't hide buttons; report any overlapping text at actual screen size.
6. FREE-ONLY constraint (user confirmed during this release): investigate a no-cost browser/local lip-sync solution. Do not buy, upgrade, spend paid credits or require Runway. Do not present body-motion/audio as lip sync.
