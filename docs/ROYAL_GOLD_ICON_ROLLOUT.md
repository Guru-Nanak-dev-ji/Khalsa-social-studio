# KDN Studio Royal Gold Icon — staging checklist

Status: preparation only. Do not merge until image assets are uploaded and builds pass.

## Approved design
Gold arch, globe, KDN STUDIO lettering, heritage landmarks and film reel, black background; no Khanda.

## Source files
User-approved original image: 1000361012.png.
Prepared downloadable icon pack contains:
- icon-192.png
- icon-512.png
- icon-maskable-512.png
- manifest.webmanifest
- android/ launcher assets

## PWA steps
1. Upload the three PNG icons to repository root, matching names.
2. Update manifest.webmanifest to reference icon-192.png and icon-512.png as purpose any, and icon-maskable-512.png as purpose maskable.
3. Verify index.html links to manifest and service worker caching allows fresh icon resources.
4. Test browser installation on Android Chrome. Do not delete an existing app until local drafts are exported.

## Android steps
1. Inspect android/app/src/main/AndroidManifest.xml for launcher icon reference.
2. Replace relevant mipmap launcher icons using supplied assets and verify adaptive icon XML if present.
3. Run GitHub Actions Android APK build and download the artifact.
4. Test installation on physical Android before release.

## Safety
Backup branch: backup-before-royal-icon-2026-10-12.
No DNS/email changes. No direct main-branch changes. No claim of successful APK until build and device tests.
