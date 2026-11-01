# Step 42 - NARAD review and outbound approval requirements

Evidence: partial user-provided autonomy.cjs source, lines 145-200 and 235-265. This is not a complete audit.

Observed: timer-based scheduling, in-process running flag, persisted next-run timestamp, provider-dependent research submission, and an external Notion PATCH path. The visible publishing method does not independently demonstrate verification of a human approval grant. Caller-level controls are unknown.

Required before integration:
1. Keep draft creation distinct from outbound publication.
2. Require authenticated founder grant bound to action, destination, content hash, expiration and one-time nonce.
3. Recheck grant at the network side-effect boundary and record the decision.
4. Reject missing, stale, mismatched, replayed or revoked grants.
5. Preserve in-flight unknown-write state without automatic replay.
6. Use durable worker lease and fencing rather than only an in-process flag.
7. Dry-run tests only; no Notion API requests, deployment or legacy process start.

Status: review findings recorded, no legacy code changes, no approval granted.
