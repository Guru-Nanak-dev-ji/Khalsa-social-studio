# KDN Social Studio v0.6 — Poster Creator and Mehrab design

Date: 2026-10-12. Baseline: `3c2a69265ba25cfa90e65adba7386c75fe806c0e`.
Branch: `feature/poster-creator-v06`. Check the PR and Pages run for deployment status; this document alone is not proof of a release.

## User direction

The user reports the installed app opens, but its launcher icon has not refreshed. They explicitly deprioritized icon work and asked to continue development. During implementation they requested mehrab styling throughout the app, varied designs, chess pieces and playing cards. Do not restart icon troubleshooting or reinstall/clear the app.

## Implemented

- `poster.html`: Hindi, Punjabi and English controls; square 1080 × 1080 and portrait 1080 × 1350 canvas PNG export; Royal arch, Chess court and Card gallery styles.
- Local JPEG, PNG or WebP photo input (12 MB, 40 megapixels, 12,000 pixels per side limits), cover crop with horizontal/vertical focus, remove/reset controls. Photos stay in memory on the device and are never uploaded.
- Headline, short message and credit/source fields. The complete preview is the PNG source. Text is fitted without splitting words or Indic combining sequences; overlong content blocks export with a visible correction message. Limits: 140/420/100 UTF-16 units respectively, and available visual space.
- A saved text draft can be copied into the poster. Full field content is retained in the inputs even if too long for a poster, so the user chooses how to shorten it. No Creator or legacy storage writes are made by the poster page.
- PNG is prepared before a download/share tap. File sharing uses feature detection and preserves user activation; cancellation is not reported as publication. Download has an additional open-image fallback. A download request is not proof of the Android file save.
- Poster editing is temporary and explicitly described as such. Unsaved changes prompt before leaving where supported. Download/export does not create an editable poster backup; text-draft JSON still contains text only.
- Full Noto Sans Devanagari and Gurmukhi fonts are bundled under OFL, cached offline, and loaded before export. See `assets/fonts/README.md` for provenance and licenses.
- `assets/heritage.css` and four decorative native SVG assets apply the user's mehrab/chess/card direction to all ten HTML pages. Existing FAQ content and inline tool scripts are unchanged. Decorative motifs are hidden from assistive technology and ignore pointer events.
- Cache is `v0.6.0`; poster, fonts and shared styling are precached with the existing core app. Gateway and FAQ HTML are still not newly precached; their online styling uses the shared assets. Reopening the app after the worker update loads the new shell, without forcing reload during writing.

## Validation performed

- 17 Node behavior tests: previous draft/storage safety and offline cache isolation, crop geometry at all focus extremes, multilingual word wrapping, output sizes, empty/oversized/unfittable text export blocking.
- 12 Python checks: existing News Desk/Creator markup plus poster labels/controller/translation references, all ten styled screens, and absence of poster uploads or draft writes.
- Read-only icon integrity checker, JavaScript syntax and whitespace checks.
- Six existing jsdom Creator integration scenarios pass after navigation/theme changes.
- Four new jsdom + native canvas integration scenarios: multilingual draft copying, all three styles, PNG/share payload and overflow; real crop-pixel changes and bad/oversized/stale photo handling; corrupt draft storage preservation; font failure/retry and unsaved reset guard. Native share, download, font loading and image events are simulated.
- Canvas images were rendered with the shipped renderer and bundled fonts, then visually inspected for Hindi, Punjabi, English, photo and no-photo designs. This is not an actual browser screenshot or Android verification.
- All inline script/data blocks in eight older HTML pages were compared with baseline and match, including both complete FAQ datasets. PWA identity/icons and native Android sources are unchanged in this release.

## Phone check after deployment

1. Open the installed app online, then close and reopen after it receives the update. Look for v0.6 and **फोटो पोस्टर बनाएँ**. Do not uninstall or clear browser storage.
2. Add a short Hindi/Punjabi/English headline and optional photo. Try the three mehrab styles and both output sizes; move the photo sliders.
3. Download PNG, open it in the phone gallery, and confirm its lettering, crop and size. Check file Share by opening then cancelling the share menu.
4. Copy a saved text draft, shorten only the poster copy, then confirm the original in the Creator. Check that overlong text blocks PNG rather than losing words.
5. After a successful online load, reopen the Creator/Poster offline and repeat text editing and PNG export.
6. Check small-screen padding, decoration, touch targets and text on Control Room, Creator, News Desk, Post Studio, Connections, Gateway and FAQ reader. Resolve observed device issues before claiming full Android validation.

## Still separate work

Editable poster persistence, multi-photo/video composition, AI writing/translation, cloud accounts, OAuth publishing, shared editorial roles, automatic scheduling and native APK updates are not implemented by this change. No automatic publishing or gambling functionality is attached to the chess/card decorations.
