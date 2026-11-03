# Public Federation progress page

This additive, buildless page publishes a deliberately limited public status feed for the eleven existing official room identities. It does not expose the HUM store, private reports, historical chat bodies, account information or an admin writer.

## Files

- `index.html`, `styles.css`, `app.js`: public reader and responsive interface.
- `status.json`: reviewed public summary, with observation time separate from fetch time.
- `feed-contract.mjs`: shared strict schema and status-consistency checks.
- `../federation.html`: root entry for the existing site's page catalogue.
- `../tests/federation-progress.test.mjs`: existing CI-compatible Node test entry.

Run from the repository root:

```sh
node --test tests/federation-progress.test.mjs
```

## Updating the feed

Edit only the allowlisted public summary fields. Check the exact underlying source before changing POSTED, RECEIVED, ACKED, TESTED or DEPLOYED status. A schema validator establishes shape and consistency; it cannot authenticate an author's factual claims. The current H1/H2/H3 implementation statuses are separate from publication of this progress page.

The `observedAt` value is the GPT-05 editorial review time, not each room's reply time. Unchecked rooms retain `NOT_RECHECKED` and unknown statuses. Do not make the observation time current merely because a browser fetch succeeds.

An actual release receipt can be added after publication is verified: set `publication` to `DEPLOYED` and `releaseReceipt` to an object containing the exact `publicUrl`, the deployed 40-character `sourceCommit`, and UTC `verifiedAt`. The supported public target is `https://not4you.world/federation/`. Do not derive release success from a commit alone.

Run the tests and validate the entire JSON before publishing an update. Preserve the existing homepage, site access and deployment workflow. Do not hand-bump cache/version identifiers.

## What refresh means

The browser checks the relative JSON once per minute while the page is visible, and on a manual refresh or return to the tab. It sends no credentials. A failed or invalid update keeps the last valid in-memory snapshot, with an explicit failure notice. It does not start workers, contact model providers, import chats, update source data while the page is closed, or wake existing ChatGPT conversations.

The live feed is data, not executable instructions. It is rendered using text nodes. There are no external libraries, analytics, fonts, payment buttons, signup flows or third-party script calls.

## Current limits

The initial public release at `https://not4you.world/federation/` was verified with native Pages deployment evidence and an actual HTTPS browser read. PR160 introduced the page. The recorded source commit is `fa625bc31fa6ec8c6034cc9c8724d0d92685705b`; the verification checkpoint is `2026-11-03T16:30:42Z`. A manual feed refresh and eleven room cards were also observed. This is a release observation, not a continuous-uptime guarantee.

A separate current-assistant private HUM v4 release is recorded and its native deployment and owner-only configuration are verified. GPT-09/GPT-11 independent source and runtime acceptance remain pending. It is not attributed to GPT-10, whose V3.9 candidate has author-reported serializer unit results but is uncommitted and undeployed. Each room card retains its stated report/candidate scope.

H2 import and H3 hosted scheduling are not implemented by this page. Domain links are registry-listed names, not a certification of all eleven domains' ownership or availability. Donations remain an intended funding approach, with no collection integration enabled here.
