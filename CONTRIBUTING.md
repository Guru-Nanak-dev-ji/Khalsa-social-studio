
## Versioning (automatic — read before bumping anything)
- Every push to `main` runs `.github/workflows/version-stamp.yml`, which calls `scripts/stamp-version.sh`.
- The stamp **never goes backward**: it takes the max of `VERSION` (as X.Y.0), the `sw.js` CACHE version, `assets/version.js` and the last `chore: stamp vX.Y.Z` commit, then bumps the patch (X.Y.Z+1). It writes the result to `assets/version.js`, the `sw.js` CACHE name and the `World · vX.Y.Z` labels.
- **PRs should not hand-bump `const CACHE` in `sw.js` or the labels.** To start a new series (e.g. 0.88), edit the `VERSION` file only; the next stamp becomes 0.88.0.

## Adding a page (सारे द्वार index)
- Drop a new `name.html` in the repo root with a good `<title>` and `<meta name="description">`.
- Run `python3 scripts/build-pages.py` to add it to `assets/pages.json` (topic like गुरु/इतिहास/स्वाद is assigned from the filename; edit icon/name/sub/cat by hand if you like). CI (`kdn-checks`) fails if the manifest is stale or any internal link is broken (`scripts/check-links.py`).
- If you forget, the push-to-main `version-stamp` workflow also runs the sync and commits the updated manifest, so the page shows up on `sab.html` automatically.
