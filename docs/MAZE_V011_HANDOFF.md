# KDN v0.11 — door maze and Golden TV
Requested 12 October 2026 (America/Toronto). Baseline main 6bbc2c2af2b8a61644e7f088804bc49024e250cb. Verify PR/Pages separately before claiming deployment.

## What changed
The opening no longer displays the gate question on the front scene. Touch one of two doors; leaves open, the CSS camera moves through the chosen doorway, then the question appears inside a gold television bezel. Four options remain. After an answer, the screen shows the signed reward, Positive/Negative 0–100 indicators and the authored reason. TV slides left after eight visible seconds, or on Continue; Hold TV stops that transition. The next two doors remain ahead. Timers stop while hidden. Each successive room changes palette, guide placement and chess scenery. This is CSS perspective with raster art, not an independently navigable WebGL maze.

Five Pran reflections lead to the complete voluntary pledge, then the expanded work profile and three suggested work/training directions. The introduction remains available from the KDN brand/menu. Name/alias, language, current work or study, experience, skills, desired sector, goal, weekly time and paid/voluntary/learning preference are supported. Education and broad city are optional. No private family lists, identity documents or exact addresses are required. Suggestions use declared interests/skills, never quiz scores or inferred personality. Choosing a track records local preference only, not an application or job appointment.

96 crore jobs is the user's future goal, not vacancies available today. The ₹125/hour meter remains DEMO. Real jobs, partnerships, paid work, backend and AI provider are not connected.

## Recovered sources
Library search identified the user's existing Khalsa Digital World · नया संसार Site, project appgprj_6ac68056cf788191bf8e3484d73269b5. Its source was opened read-only at commit 7722076e60c9f6b49ff76d60eeb748ffa3867177.
Found exactly the previously requested natural-looking golden and silver falcons:
public/kingdom/falcons-v30.js, falcons-v30.css and four assets falcon-{golden,silver}-{flight-v29,poses-v30}.png.
They provide eight-frame flying poses, perching, head movement, different landing points and visibility/reduced-motion handling. These assets and behavior are now local to this repository. Relative asset paths support GitHub Pages and docs pages; no legacy Site URL is embedded into the app. Original Site was not changed.
Recovered original kdn-nihang-guides-v22.webp and full-mehraab-ivory-v11.webp provide room guides and door frames.
All uploaded ZIP manifests were searched; the v4 DoorEntryReturn candidate and Grok Three.js world were found. They are references, not silently merged competing apps.
Attached 10 images were inspected. Emotion-avatar posters are inspiration for a later character layer.

## Artwork
The supplied light/dark Yin–Yang JPG includes a stock watermark. A new original medallion was generated with the built-in imagegen tool, using that image only for thematic inspiration. File: assets/world/yin-medallion-v11.webp. Prompt: original circular yin–yang in ivory feathers, pearlescent light, dark amethyst obsidian and molten gold; two contrasting circular eyes, carved gold rim, near-black purple background, cinematic relief; no figures, text or logo. WebP conversions preserve the complete frame and alpha of recovered sprite sheets; no creative raster edits were made in code.
The KDN in-page entrance now has a 2.8-second rotating/pulsing light, moving emblem and sweep. Android's operating-system PWA launch screen cannot be animated by page CSS; native APK code/launcher was not changed.

## Scores and compatibility
Knowledge: +10 correct, -3 wrong, 0 timeout, plus participation. Its answer indicators are positive 100%, negative 30% or zero respectively.
New Pran behavior choices have explicit authored +/- game values and reasons; not AI truth detection or a psychological test. Needing time, paid work or safe boundaries is not penalized. Harmful actions such as intentional misinformation, coercion, false service credit, humiliation or littering receive negative game values. Both doors stay open.
New reflection records carry rubric:2. Existing v0.10 records without that field retain their original participation and are not retroactively scored against rewritten options.
Same key kdn-immersive-world-v1, opt-in local persistence, corrupt/stale/quota guards. Existing minimal profiles still validate. No new network submission. All legacy Creator/community records stay separate.

## QA
42 Node tests and 17 Python checks pass, including new work-profile validation, rank suggestions, negative/positive feedback and old-answer compatibility.
A jsdom flow checks five gates -> pledge -> work form -> suggestions -> world, lifelines, correct/wrong/expiry, hold/auto TV slide, hidden tabs, hourly/random events, save/resume and protected old records.
A separate canvas simulation verifies exactly two original birds load local sheets, draw flight frames and transition between flying/perching; hidden tab stops scheduling.
No browser preview capability is available here. DOM/CSS/canvas simulations do not prove Android appearance, real audio, GPU smoothness or touch layout. Real phone review remains next.
index.html, enter.html, world.html, maze.html must stay byte-identical. Cache v0.11.0. maze.html is the fresh entry path for old cached installs.

## Next
Photo-based memorial avatars for deceased relatives are explicitly deferred. Future work needs permitted photo use, clear memorial/AI labeling, family control and deletion; do not present an avatar as the actual deceased person speaking.
Expand rooms and the finite 15-question knowledge bank, localize, then implement verified backend/auth, real AI and real work listings in bounded milestones. No endless/new AI question generation or full 3D locomotion is claimed.
Preserve exact motto:
किरत करो , वंड छक्को
सब कुछ सबका, सबकुछ सबको free
The new khalsa world 🌍 order


## Installed-PWA compatibility follow-up
Cache v0.11.1. The four entry aliases load scripts from assets/world/v011/, a path absent from earlier worker cache lists. This prevents an old worker from mixing the fresh maze.html with cached v0.10 controller/content. Top-level world scripts are canonical for tests; synchronize their versioned copies on changes, and use a new version directory for the next release. Existing user state is preserved.
