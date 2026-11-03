# Step 39 — Legacy Commander Architecture Audit Plan
Date: 2026-10-29. Status: PENDING SOURCE STRUCTURE; not an execution review.

## Verified evidence
- Legacy commander.js: 306 lines, SHA256 c126b929be4dc02ded08124faed64b5fea507452a26b8be09777aff532a4b48d.
- Legacy autonomy.cjs: 282 lines, SHA256 a9dcdcc41331207e6f1ae2ff749995b031e85c0a9a935deb8a51b329d77125a6.
- Actual contents of these files have NOT been supplied.

## Mapping hypotheses to verify
- Agent roster / task assignment -> KIDO worker queue and provider registry.
- Periodic loops / recovery -> worker lifecycle and fencing.
- Human approvals -> approval gate and execution gate.
- State logs / memory -> append-only ledger.
No source-level claims until content review.

## Minimal safe evidence
Collect ONLY line numbers and names of declared functions, exports, require/import targets, timers, subprocess and network call sites. Do not expose matching lines, .env, secrets or source bodies. This is architecture reconnaissance, not a security audit.

## Acceptance gates
1. Distinguish scheduler vs commander vs provider routing.
2. Identify how tasks persist across restart and whether duplicate execution is possible.
3. Ensure approval is verified at execution boundary, not inferred from labels.
4. Require idempotency, lease fencing, safe stop, bounded retries and audit trail.
5. No automatic start, no script execution, no legacy overwrites.
