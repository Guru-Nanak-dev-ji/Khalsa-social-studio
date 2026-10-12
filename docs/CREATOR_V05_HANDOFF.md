# KDN News & Social Creator v0.5

Date: 2026-10-12
Branch: `feature/news-social-creator-20261012`
Baseline: `b0cfa8bcc6d731891caa44cb8cc89ee87a8002c9`
Status: implemented and tested as a PR candidate; not a claim of production release.

## What works in this change

- `creator.html` has Hindi, Punjabi and English controls, news/social writing outlines, editable headline/message/source/hashtags and a live text preview.
- Language changes affect labels and outline language, never silently translate the user's text.
- Save updates the selected draft; New starts another. There is no automatic save. Unsaved edits prompt before leaving or replacing the draft where browser support permits.
- Draft search, local deletion, copy, UTF-8 TXT download, full saved-draft JSON backup and additive JSON restore.
- Imports deduplicate matching content and preserve two different drafts with the same imported ID. Import validation is all-or-nothing. Maximum: 500 drafts, 30,000 message characters per draft, 20 MB backup upload.
- Copy-only migration reads `kdn-newsdesk-v03`, `kdn-sangat-post-studio-v1`, and `kdn-sangat-draft-library-v1`. It never writes those keys. Repeating migration does not duplicate identical content. Invalid records are counted and skipped.
- Storage write failures and detected stale-tab writes do not replace saved drafts. Users can still export their current text.
- Manual share uses the device's share menu where supported. It does not prove a post was published. Clipboard failure reveals selectable text.
- Existing media preview and calendar remain in Sangat Post Studio. Media and calendar data are not part of the new text backup.
- The existing Royal Gold colors, heritage arch motif, PWA identity, all icons and native Android code are preserved. No Khanda added.

## Navigation and offline behavior

The root Control Room links to the Creator and previous tools. Previous tool pages link to the new Creator. The existing tools' scripts were compared with the baseline and are unchanged.

`sw.js` precaches the root, Creator HTML/CSS/JS, manifest, icons and previous editor pages. Only bundled resources under this app scope are intercepted. Outside services and GitHub API calls stay online-only. Cleanup affects only this app's scoped cache prefix. The legacy unscoped v2 cache is retained rather than risking another app's data on the shared origin.

The cache version must change whenever bundled HTML/JS/CSS changes. Installation atomically precaches the new shell, then activates. An already-open screen is not forcibly reloaded, so writing is not discarded. Reopening after the worker update loads the new shell.

## Validation

- Current production root, manifest, SW and three manifest PNG icons: HTTP 200 before edits.
- 12 Node behavior tests: multilingual persistence and TXT composition; URL safety; quota/corrupt/blocked storage; stale-tab protection; additive/deduplicating backup restore; limits; copy-only legacy migration; complete offline cache and cache isolation.
- 9 Python checks: existing News Desk checks plus Creator links, unique IDs, labels, controller targets, translation keys and safe text rendering.
- JavaScript syntax and `git diff --check` passed.
- Six jsdom 26.1.0 integration scenarios passed: three-language UI save/reopen/edit/search and text export; backup restore/deduplication/rejection; safe preview and clipboard/share fallbacks; corrupt-storage export recovery; copy-only legacy import; and unsaved/deletion guards. Clipboard, share and download APIs were simulated, not actual device calls.
- Actual browser rendering and Android hardware were unavailable in this environment. Cache checks simulate the service-worker events and are not a browser install/offline test.

## Release and Android check

1. Review the PR diff and automated checks, then merge with release authorization. Keep Pages `main / (root)`.
2. Confirm Pages deploys that exact merged commit and `creator.html` returns 200.
3. Open the installed KDN Studio online, close it fully and reopen after the service-worker update. Look for v0.5 and **Creator खोलें**. Do not uninstall or clear site data to update; local drafts could be lost.
4. Write a Hindi draft, save, reopen and edit it. Repeat with Punjabi and English; check the small-screen layout and keyboard navigation.
5. Download TXT and JSON on Android; import the JSON back and check that identical drafts are not duplicated. Check copy/share with a harmless test draft and cancel the share menu if no publication is intended.
6. Copy previous drafts; verify their original tools still have the originals. Photos and calendar entries stay in the old tool.
7. After one successful online load, go offline and reopen the Creator. Confirm that save/edit/TXT export still work. Outside services need internet.

## Next roadmap

- Complete device validation and resolve any observed issues before claiming v0.5 fully released.
- Consider a user-approved image-card export or assisted writing next. Neither image export nor AI writing is implemented here.
- Cloud accounts, auto-posting, AI translation, push and a new native APK remain separate work. No social account is claimed connected by this change.
