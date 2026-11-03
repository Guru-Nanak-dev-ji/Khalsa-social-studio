# KIDO ONE — Step 29 Hosted Worker Architecture
Status: DESIGN ONLY. No hosted worker, API keys, or scheduler running.

## Deployment units
1. Private API: authenticated command intake, policy checks and trusted human approvals.
2. PostgreSQL: event stream, grants, queue, worker-control, lease fencing, role isolation, encrypted backups.
3. Scheduler: periodic read-only research/status tasks, capped rate and cost.
4. Worker: claim -> reload pause/lease -> execution gate -> dry-run route -> audit -> complete, never bypassing approvals.
5. Operator console: pause/resume, status, queue inspection, audit, spending limits.
6. Health monitor: heartbeat, stale lease detection, alerting and disaster recovery.

## Non-negotiable gates
- Zero default outbound messaging, social posting, financial transactions or DNS edits.
- Explicit DK 01 authorization before production deploy, recurring spend, credentials, live posting.
- Secret vault; per-provider scopes and quotas; no secrets in prompts or logs.
- Independent identity checks for approval grants; row-level tenant isolation.
- Pause must stop new claims and recheck before external side effects; in-flight cancellation requires separate design.
- Restore test, CI with real database, observed logs and rollback before launch.
- Current offline-worker.cjs only computes a plan; it does NOT execute tasks or call AI APIs.

## Suggested staged rollout
G0 prototype (current) -> G1 hosted DB in isolated environment -> G2 dry-run worker with no network egress -> G3 human-reviewed read-only integrations -> G4 explicitly authorized narrow publishing.
