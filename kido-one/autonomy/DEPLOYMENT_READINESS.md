# KIDO ONE — Deployment Readiness Gates (Step 21)
Status: NOT READY FOR PRODUCTION. This is a checklist, not authorization.

## Evidence checklist
- [x] Offline policy, append-only ledger and worker prototypes committed to draft PR #159.
- [x] Existing Node CI passed for Step 20 commit 784cdd8c731733356fb22c7ab04fbbc27fd8c424.
- [x] Automatic ephemeral PostgreSQL schema CI workflow committed (not yet verified running).
- [ ] PostgreSQL workflow run completed successfully with exact commit and logs.
- [ ] Real multi-connection concurrency and atomic approval-consumption integration tests.
- [ ] DB least-privilege roles, RLS, audit trails and trusted approval issuance.
- [ ] Durable queue completion/retries, worker crash recovery and emergency stop race tests.
- [ ] Secrets manager, cost caps, outbound network allowlist and safe provider adapters.
- [ ] Encrypted backups and restore test; immutable checkpoint verification.
- [ ] Authenticated human/AI roles, command conflicts and ratified constitutional hierarchy.
- [ ] Founder DK 01 selects hosting, region, spending limit and deployment authority.
- [ ] Founder DK 01 approves any live publishing scope and Article 9 reconciliation.

## Rollout
G0 offline code -> G1 isolated PostgreSQL -> G2 dry-run hosted worker -> G3 approved read-only monitoring -> G4 explicitly scoped publishing.

## Important distinctions
A workflow file in GitHub is not evidence it has run. A passing Node CI is not proof PostgreSQL migrations passed. A deployed worker is not permission to send emails or posts. ChatGPT sessions are not a 24/7 runtime.
