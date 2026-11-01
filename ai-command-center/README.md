# KDN–KIDO AI Command Center V1 (STAGING)

This branch is a **proposal**, not a deployed autonomous agent. No secrets, API keys, provider calls or live cross-room messaging.

## Architecture
- `registry/rooms.json`: 11 immutable GPT room identities and proposed external platform slots.
- `tasks/queue.json`: initial tasks, dependencies and status.
- `protocol.md`: handover, evidence, human approval, retries and delayed activation.
- `.github/workflows/kdn-command-tick.yml`: opt-in scheduled/manual queue validation, dry-run only, no AI dispatch.

## To enable actual autonomy later
1. Review staging branch and merge explicitly after approval.
2. Set up a trusted queue/state store with atomic claims, retries and durable receipts. Do not use Git commits as a concurrent transaction database.
3. Connect each provider via authorized API/connector; ChatGPT/Grok/Claude UI rooms are **not** automatically addressable by GitHub Actions.
4. Add credentials in repository secrets, never committed files; configure budgets and permission scopes.
5. Implement a dispatcher with rate limits, provider-specific models, approval gate, logging and idempotency.
6. Test mock-only with no outbound attempts, then authorize each real provider and release.

GitHub Actions schedules may be delayed and require workflow on the default branch; the staging branch does not activate scheduled runs.

Master Registry: https://docs.google.com/document/d/1tdCSnzLmqj7V-QOu-cOwG1XtAwqPw4h_PKsjU6duir8/edit
