# KIDO ONE — Always-On Autonomous Operations Plan (Step 14)

Status: **DESIGN / NO LIVE EXECUTION**. Owner DK 01. Related: #158, draft PR #159, DEC-003. This plan does not amend historic AI Samvidhan Article 9 or enable external posting.

## Objective
Continue approved KDN work when ChatGPT is closed, using an independent hosted worker, persistent scheduler, queue, monitoring and audit. ChatGPT rooms and other AIs are optional clients; they are not the runtime.

## Architecture
1. **Hosted API**: authenticated ingress for DK 01 commands, human/AI handovers and read-only status; role-scoped tokens, no public write access.
2. **PostgreSQL**: append-only events, tasks, approvals, policy versions and outbox; transactional writes, independent backups, access control and integrity checkpoints.
3. **Scheduler**: durable recurring jobs (research refresh, website checks, draft generation, approval reminders). Leader election or DB leases; idempotency per occurrence; timezone and retry caps.
4. **Worker**: poll queue, claim a task lease, run bounded tools, write evidence, release or retry. No self-granted permissions. Resource/cost/time limits.
5. **Approval service**: trusted human identity and one-time scoped grants; consume approval atomically in the same DB transaction as the authorized action reservation. Conflict IDs alone never authorize anything.
6. **Publishing outbox**: only after approved scoped policy is formally ratified; per-account credentials isolated in secrets manager, rate limits, AI disclosure, source verification, receipts, pause switch. Until then **DRY RUN ONLY**.
7. **Monitoring**: health endpoint, scheduler lag, queue age, job failures, budget, credential expiry, backup restore tests and alerts. Never claim 'running' based only on a configuration file.
8. **Audit dashboard**: humans see what AI proposed, executed, blocked and why; distinguish planned, tested, staged and live states.

## Safe recurring job candidates
- Read-only availability check of KDN's 11 domains; record HTTP evidence without DNS changes.
- Inventory GitHub PRs/issues and CI results; report changes.
- Research and draft project updates; human review until specific publish scope is ratified.
- Identify unresolved conflicts, missing archives and task deadlines.
- Daily backup verification and audit summary (once storage exists).

## Deployment gates
- G0 (current): offline code and tests; no external worker.
- G1: isolated staging PostgreSQL, migrations, real integration tests, role security and atomic approval consumption.
- G2: staging scheduler/worker with fake providers, deterministic clock, simulated failures and pause switch.
- G3: read-only live monitoring with DK 01 permission, credentials and bounded budget.
- G4: scoped publishing only after documented founder ratification of accounts, topics, frequency, templates, emergency stop, Article 9 reconciliation and audit.
- G5: human delegation, role review, security testing, succession policy and incident response.

## Non-negotiable operational controls
Default deny; immutable source history; append-only conflicts; idempotency; least privilege; per-task cost caps; no secret values in GitHub; no unsolicited bulk email; no financial/legal/DNS/production action without explicit specific approval; AI identity disclosure; backup/restore; emergency global pause.

## Unresolved decisions
- Hosting provider, region, budget and billing authority.
- DB/queue provider and retention/backups.
- Domains and connected social accounts permitted for read-only monitoring vs publication.
- Founder-ratified approval policy and historical Article 9 reconciliation.
- Human team roles and permissions.

## Immediate work queue
- [ ] Atomic approval-grant schema + DB adapter with concurrent consumption tests.
- [ ] Real PostgreSQL integration tests in ephemeral CI service.
- [ ] Durable scheduler task schema and worker dry-run loop with lease and idempotency tests.
- [ ] Monitoring and kill-switch tests.
- [ ] Draft deployment runbook, threat model and budget controls.
- [ ] Seek explicit G3/G4 approval only when prerequisites and evidence are complete.

No background process was launched by writing this plan.
