# Khalsa Social Studio 🌍

A free and open-source social media management platform.

Part of Khalsa Digital World (KDN).

## Our Mission
Knowledge • Seva • Collaboration • Technology

## Available in the v0.5 Creator change
- News and social text editor with Hindi, Punjabi and English interfaces.
- Editable on-device drafts, search, copy, TXT export and JSON backup/import.
- Copy previous News Desk and Sangat Post Studio text drafts without changing their data.
- Manual device share menu, when supported. Publication remains the user's action.
- Royal Gold interface and a versioned offline PWA shell.
- Existing News Desk, media preview and personal post calendar remain available.

The public Control Room is at https://guru-nanak-dev-ji.github.io/Khalsa-social-studio/.
The Creator is at `creator.html` after this change is merged and Pages deploys it.
See [Creator handoff and validation](docs/CREATOR_V05_HANDOFF.md) for release status.

## Not connected yet
AI generation/translation, cloud sync, OAuth publishing, automatic scheduling and push notifications are not active. The personal post calendar is a plan, not an automatic publisher.

## Development
This is a buildless HTML/CSS/JavaScript PWA. Pages serves `main` from `/` (root).
Run `python -m unittest discover -s tests -v` and `node --test tests/creator.test.cjs`.
Before each deployed app-shell change, bump the cache version in `sw.js` and include any new local assets in its list.

## Vision
सब कुछ सबका है — साथ, सेवा, सहयोग से।
