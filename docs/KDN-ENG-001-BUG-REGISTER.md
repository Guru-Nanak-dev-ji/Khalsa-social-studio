# KDN-ENG-001 — Mission modules code review and bug register

Date: 2026-10-31
Owner: GPT-03 TAKSHASHILA (ChatGPT / GPT-6)
Status: REVIEW — static review complete; runtime and cross-device validation pending.
Branch reviewed: `feature/kdn-federation-nav-v1`
Observed branch head before this report: `76930807a43cdfea79e23189e63105e982b5ce94`

## Scope and method

Read-only source inspection through the connected GitHub repository access. Examined `mission-charter.html`, `mission-roadmap.html`, `assets/mission/{roadmap.js,registry.json,catalog-mapping.json,mission.css}`, `assets/federation/{kdn-federation.js,kdn-federation.css}`, `assets/home/kdn-home.css`, `assets/pages.json`, `tests/kdn-home.test.cjs`, `scripts/{build-pages.py,check-links.py}`, `.github/workflows/{kdn-checks.yml,gateway-smoke.yml}`, `sw.js`, selected root pages, and project documentation.

Git tree inventory at the observed head showed 136 root HTML files and 133 entries in `assets/pages.json`. `scripts/build-pages.py` deliberately excludes `join.html` and `404.html`; `404.html` was not present in the observed root tree. Cross-checked all 133 catalog mappings: unique IDs and hrefs; all mapping hrefs corresponded to catalog entries; mapping pillars matched the 12 registry IDs; all three JSON files parsed successfully. No runtime source code was changed as part of this report.

## Findings

### ENG-01 — HIGH — Manifest is stale relative to root HTML

Evidence: `mission-charter.html` and `mission-roadmap.html` exist in the branch root, but neither appears in `assets/pages.json`. The generator's `--check` mode fails when generated JSON differs from committed JSON (`scripts/build-pages.py`).

Expected: both new pages are included in the site catalog (or explicitly exempted by approved design), and `python3 scripts/build-pages.py --check` succeeds.

Actual (static analysis): 136 root HTML files, 133 catalog entries, 1 deliberately excluded `join.html`, 2 missing mission pages. Under the current generator rules, `--check` would detect a stale manifest. **The Python command was not executed**.

Recommended fix: run the generator and preserve established page metadata. Reconcile `assets/mission/catalog-mapping.json` intentionally: it currently describes the earlier 133-page baseline, not the two new pages. Do not silently represent catalog pages as the planned 1,430 representation units.

### ENG-02 — HIGH — Mission home-link markup contradicts the current regression test

Evidence: both mission pages use `<a class="kdn-home" href="./index.html">` with no `aria-label`. `tests/kdn-home.test.cjs` asserts that every root HTML page has `<a class="kdn-home" href="./index.html" aria-label="..."` and exactly one such link. Other inspected pages (`index.html`, `sab.html`, `directory.html`, `neta-rajya.html`, `creator.html`) contain the required label.

Expected: all pages pass the existing accessible home-link contract.

Actual (static analysis): two mission pages do not match the test regex. **Node test command not executed**.

Recommended fix: add the same meaningful accessible `aria-label` and optional title as established in `index.html`; rerun `node --test tests/kdn-home.test.cjs`.

### ENG-03 — MEDIUM — Mission navigation and resources lack offline pre-cache

Evidence: `sw.js` enumerates a static `ASSETS` array and only intercepts fetches for URLs in that set. The entries for `mission-charter.html`, `mission-roadmap.html`, `assets/mission/*`, and `assets/federation/*` are absent. `sw.js` instructs shell changes to be bundled with a cache version increment (`README.md`).

Expected: if these pages are in the offline PWA experience, their HTML, CSS, JS, and public read-only JSON should be included in a versioned offline strategy.

Actual: mission pages are not offline-cached by this service worker. Whether offline-first is required for the new pages needs architecture approval.

Recommended fix: GPT-02 decide offline scope; if included, add required assets and bump the cache version in the same reviewed change. Check that sensitive/private responses are not cached.

### ENG-04 — MEDIUM — Mission-specific automated test coverage absent from inspected suite and CI

Evidence: `.github/workflows/kdn-checks.yml` invokes Python checks and Node tests, but the workflow's explicit `node --check` list does not include `assets/mission/roadmap.js` or `assets/federation/kdn-federation.js`. Tree inventory includes `tests/kdn-home.test.cjs` but no mission registry/mapping or dashboard-specific test file.

Expected: tests cover registry schema (exactly 12 unique IDs), status claims, catalog metadata integrity, fallback behavior, navigation injection and keyboard/accessibility characteristics.

Actual: the inspected branch lacks those targeted tests. This is an **assessed coverage gap**, not a claim that every existing test fails.

Recommended fix: add `tests/mission.test.cjs`, exercise valid/invalid registry and mapping data, and extend CI syntax checks.

### ENG-05 — REVIEW — Inconsistent shared federation navigation coverage

Evidence: the inspected `index.html` does not load `assets/federation/kdn-federation.js`; `sab.html`, `directory.html`, `creator.html`, `neta-rajya.html`, and the two mission pages do. The script itself requires a direct child `body > a.kdn-home` to insert navigation.

Impact: federation link visibility and navigation flow may differ between entry and interior pages. This may be intentional if home has a custom navigation design.

Recommended action: GPT-02 decide shared versus page-specific navigation. Verify desktop/mobile routes and associated domain link states; do not blindly inject duplicate navigation.

### ENG-06 — LOW — Dashboard parsing has shallow integrity checks

Evidence: `assets/mission/roadmap.js` validates only `Array.isArray(data.pillars)` and count 12, not pillar ID uniqueness or allowed status fields. For catalog mapping, the script calls `data.mappings.map(...)` without explicit shape checks; malformed data leads to fallback rather than a precise integrity error.

Recommended fix: validate registry schema and mappings before rendering, preserve text-only DOM output, and test failure states. Keep `verified_live` as evidence-gated rather than deriving live status from content existence.

## CI evidence and test honesty

At observed branch head `76930807a43cdfea79e23189e63105e982b5ce94`, GitHub Actions run `41145782373` (`KDN Gateway Smoke Tests`) reported SUCCESS, but that workflow only checks `docs/index.html` and `docs/gateway.html`. It **does not establish** that mission pages, all Node tests, or Python manifest checks passed.

No complete checkout or runtime tests were performed in this review environment (direct `git ls-remote` from the isolated sandbox failed due to DNS/network access). Accordingly:
- JSON structure and cross-reference checks: PASS (source inspection / JavaScript in-memory check).
- Source file existence for inspected references: PASS for inspected mission resources.
- `python3 scripts/build-pages.py --check`: NOT RUN; logically expected failure on current tree.
- `node --test tests/kdn-home.test.cjs`: NOT RUN; definite markup/assertion mismatch.
- Browser/mobile/offline tests: NOT RUN.
- Production deploy / DNS / publication: NOT DONE.

## Proposed follow-up

**KDN-ENG-002 — Mission pages consistency and regression tests** (GPT-03 implementation; GPT-04 independent QA; GPT-02 navigation/offline decisions):
1. Add accessible home labels to the two mission pages.
2. Rebuild `assets/pages.json` with existing generator and record expected entries.
3. Decide whether the 133-entry mapping is retained as a historical baseline or extended with newly cataloged pages.
4. Add tests for mission registry, catalog integrity, navigation initialization, and fallback behavior.
5. Make explicit SW/nav design decisions with GPT-02, then test all offline/mobile cases before release.
6. Rerun Python manifest/link checks, Node tests, and local preview; record commands, environment and results.

## Handover

PROJECT: KDN-KIDO
TASK_ID: KDN-ENG-001
FROM: GPT-03 TAKSHASHILA
TO: GPT-01 KIDO COMMANDER; GPT-02 Architecture; GPT-04 QA/Security
PRIORITY: P1
COMPLETED: Scoped mission HTML/CSS/JS/catalog/CI review, integrity comparisons and bug register.
EVIDENCE: This report, paths above; head at time of audit `76930807a43cdfea79e23189e63105e982b5ce94`.
COMMIT: Recorded by the GitHub create-file response; no source-code modifications.
PENDING: Runtime test execution, fixes, cross-browser checks and review.
BLOCKERS: Sandbox cannot clone repo via network; production/preview testing access not verified.
NEXT: KDN-ENG-002; GPT-02 architecture decisions and GPT-04 independent test review.
STATUS: REVIEW (audit documented, fix and test validation pending).
