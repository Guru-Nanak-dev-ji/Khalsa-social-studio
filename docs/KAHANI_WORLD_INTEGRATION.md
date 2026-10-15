# कहानी घर · स्मृति महल integration

Prepared 2026-10-15 against `53291fb109ebd0e43e02b8656740e50943b031b4`
in `Guru-Nanak-dev-ji/Khalsa-social-studio`.

## Purpose and scope

Make the original story house feel alive while keeping the old worlds reachable.
This changes the existing `kahani.html`; it does not replace the main world or
create a second story collection. `not4you.world` remains the main world.

- A stationary sticky toolbar keeps Waheguru, all doors, old worlds and the
  return route visible. The scene controls stay separate from moving artwork.
- Five arches drift through artwork already in this repository. The space
  between the arches is transparent; the existing page background remains.
- Touch dragging and arrow buttons move the scene. Pause remains in effect
  after reading. Reduced-motion preferences disable automatic movement.
- Story links open the original full sections. Reading pauses the new scene;
  returning to the arches continues from the same position within this page.
- The original room registry supplies all 16 main room links. `sab.html` still
  opens the complete 131-page root catalogue. Four linked older worlds and
  the six original network doors are also accessible in their own groups.
- “खालसा राष्ट्र” and “सनातनी राष्ट्र” open cultural reading links already in
  the project. The gift button opens the existing chapter-one reward flow.

## Preservation and boundaries

All original HTML IDs and links are retained. The story body starting at
`चेतना का धागा` is byte-for-byte unchanged from the baseline. Existing story
renderers, story data, koins code, page catalogue and kingdom registry are
unchanged. The new controller performs no storage or network writes and adds
no currency, personal data collection, account system or real-money promise.

No existing asset is deleted. No DNS, domain, hosting or live deployment change
is part of this branch. The following external links are retained destinations,
not a guarantee that every service or feature is currently available.

## Files and offline support

- `kahani.html`: additional navigation, scenery and cultural/old-world links.
- `assets/kahani/kahani-world.css`: scoped styling and original artwork URLs.
- `assets/kahani/kahani-world.js`: animation, touch, lifecycle and registry links.
- `sw.js`: new assets added to the existing shell list and cache bumped to
  `v0.87.10`. Existing service-worker cache lifecycle is unchanged. The normal
  main-branch version-stamp workflow will advance the release again on merge.
- `tests/kahani-world.test.cjs`: five new lifecycle and integration checks.

## Validation

- `python3 scripts/build-pages.py --check`: 131 pages, catalogue unchanged.
- `python3 scripts/check-links.py`: 0 missing local targets.
- `python3 -m unittest discover -s tests -v`: 17 passed.
- `node --test tests/*.test.cjs tests/*.test.mjs`: 359 passed.
- All 26 existing CI syntax checks plus the new controller: passed.
- Baseline comparison: all original HTML IDs/links retained; original story
  body and nine content/storage/catalogue/registry files unchanged.
- `git diff --check`: passed.

The new motion tests use a deterministic DOM/event harness. They cover story
pause/return, explicit pause, reduced motion, visibility, offscreen behavior,
back-forward cache, horizontal drag, vertical scroll release, pointer
cancellation, loop/resize position, repeated detail opening and original links.
They do not replace browser rendering or a physical-phone test. Browser/mobile
visual QA has not been performed in this environment.

## Review and release plan

1. Review the isolated branch and source diff; keep the baseline commit.
2. In a browser, check 360 px phone width and desktop: no horizontal document
   overflow, readable fixed toolbar, swipe versus vertical scroll, pause,
   original chapter choices, one-time gift, return position and all door groups.
3. Check reduced motion and offline use after the new worker installs. Existing
   local game progress must remain present; do not clear browser site data.
4. Merge only after release approval. This repository publishes from `main`;
   a merge is a live-site change, even though no DNS edit is required.
5. Keep the prior source and backups. For a visual regression, revert this
   integration commit in a new commit and let the normal version workflow
   advance the cache version. Do not force-reset the repository or erase saved
   visitor progress. The new motion controller has no storage to migrate back.

## Maintainer handoff

The source repository, baseline, existing audit inventory and this integration
note form the handoff. A designated maintainer should have their own authorized
repository/hosting access and retain the original audit/backups. Reviewers can
run the commands above without account secrets. No credentials belong in this
document or in a public repository. Future automation requires its own available
account, permissions and explicit scope; no unattended job is created here.
