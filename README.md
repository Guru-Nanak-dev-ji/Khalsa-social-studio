# Khalsa Social Studio 🌍

A free and open-source social media management platform.

Part of Khalsa Digital World (KDN).

## Our Mission
Knowledge • Seva • Collaboration • Technology

## Available features — v0.6
- Photo Poster Creator: square 1080 × 1080 or portrait 1080 × 1350 PNG, with three Royal Gold mehrab styles, chess pieces and playing-card ornaments.
- Local JPG/PNG/WebP photos, crop focus controls, editable headline/message/credit, saved text-draft copying and manual image sharing where supported.
- Bundled Hindi/Punjabi fonts and an overflow guard that prevents exporting cut-off text. Poster work is temporary; download the PNG before leaving.
- Shared, varied mehrab styling across all ten HTML screens, including Gateway and both FAQ readers.
- News and social text editor with Hindi, Punjabi and English interfaces.
- Editable on-device drafts, search, copy, TXT export and JSON backup/import.
- Copy previous News Desk and Sangat Post Studio text drafts without changing their data.
- Manual device share menu, when supported. Publication remains the user's action.
- Royal Gold interface and a versioned offline PWA shell.
- Existing News Desk, media preview and personal post calendar remain available.

The public Control Room is at https://guru-nanak-dev-ji.github.io/Khalsa-social-studio/.
The text Creator is at `creator.html`; the Poster Creator is at `poster.html` after this change is merged and Pages deploys it.
See [v0.6 handoff and validation](docs/POSTER_V06_HANDOFF.md) and the PR/Pages status for release verification.

## Not connected yet
AI generation/translation, cloud sync, OAuth publishing, automatic scheduling and push notifications are not active. The personal post calendar is a plan, not an automatic publisher.

## Development
This is a buildless HTML/CSS/JavaScript PWA. Pages serves `main` from `/` (root).
Run `python -m unittest discover -s tests -v` and `node --test tests/*.test.cjs`.
Before each deployed app-shell change, bump the cache version in `sw.js` and include any new local assets in its list.

## Vision
सब कुछ सबका है — साथ, सेवा, सहयोग से।
