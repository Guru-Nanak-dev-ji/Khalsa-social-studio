# KIDO ONE — Real PostgreSQL Integration Test Plan (Step 19)
Status: PROPOSED; no live database provisioned.

## Isolated CI prerequisites
- Ephemeral PostgreSQL service with disposable test credentials and database; never use production secrets.
- Apply sql/001_event_store.sql, 002_approval_grants.sql, 003_worker_queue.sql, 004_worker_fencing.sql in order.
- Run transactions in separate clients to verify per-project sequence, duplicate idempotency, one-time approval consumption, simultaneous claims, stale-worker fencing and paused worker behavior.
- Test rollback on failed event insert, crash/retry after lease expiry, restore from backup, role restrictions and immutability trigger.
- Capture DB version, test output, CI run URL, exact commit and failures in evidence log.

## High-priority review issues before integration
1. SQL role privileges/RLS are missing; not production safe.
2. Strict pause vs in-flight task effects requires stronger fencing and worker-level checks.
3. Approval issuer identity and grant issuance are not yet authenticated.
4. Database adapter mocked tests do not prove real PostgreSQL behavior.
5. No hosted scheduler, worker, storage, or connected AI provider exists.
6. Local-model software may be free but compute, hosting, API access and quotas are not guaranteed free.

## Exit criteria
Real PostgreSQL CI PASS, reviewed access controls, zero live outbound actions, clear rollback plan and DK 01 approval for any deployment.
