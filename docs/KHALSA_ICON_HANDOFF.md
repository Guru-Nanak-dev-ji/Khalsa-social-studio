# KHALSA app icon — 12 October 2026

User request: use the purple/gold knight and globe as the app icon, with English KHALSA lettering blended into the emblem. The selected treatment integrates geometric gold capitals into the globe's upper purple-and-gold rim. No Khanda added.

## Assets and wiring

- Optimized master: `assets/branding/khalsa-emblem-v1.webp`.
- PNG sizes: 32, 48, 180, 192 and 512 in `icons/`.
- Separate padded maskable 512 PNG: visible artwork measured within radius 192 pixels, below the 204.8-pixel safe radius. Black fills the full square; the complete name and knight fit inside the circular mask.
- Manifest points to new versioned PNG paths. Manifest URL, app ID, start URL, scope, name and short name stay the same, preserving the installed PWA identity.
- Root and Creator use the emblem; primary existing tool pages have matching favicons and touch icons. Legacy PNG paths are exact copies for compatibility.
- SW cache advances to v0.5.1 and includes all active icons. Creator behavior and draft storage are unchanged.
- The old pixel-letter generator is retired; its compatibility entry point now only validates artwork. The icon workflow is read-only, so a manifest change cannot silently restore the old icons.
- This release targets the installed web app/PWA. It does not build or install a new native Android APK. Native Android source remains unchanged.
- Older PR #5 contains a previous icon proposal and is separate; do not merge it over this selected artwork.

## Verification

PNG dimensions, source hashes, manifest identity, compatibility aliases and safe padding are checked. Circular and 192-pixel previews were visually inspected. Existing Creator checks are rerun because the service-worker asset list changes.

Actual launcher refresh on the user's phone cannot be confirmed remotely. Chrome Android schedules manifest checks and WebAPK updates; an existing icon can take time to refresh. Open the installed app online, then close it. Wi-Fi and charging help meet Chrome's documented update conditions. Do not clear app/browser data or uninstall merely to refresh the icon, because drafts are local.

References:
- https://www.w3.org/TR/appmanifest/#icon-masks
- https://web.dev/articles/manifest-updates
