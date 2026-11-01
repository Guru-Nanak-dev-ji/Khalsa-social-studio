# Dispatch, Delayed Activation and Chain Protocol

Each task: task_id, version, owner, model_slot, created_at, not_before, dependencies, status, evidence_uri, approval_scope, attempts, idempotency_key, next_handoff.

States: PROPOSED -> ASSIGNED -> READY -> RUNNING -> SUBMITTED -> VERIFIED -> RELEASED; BLOCKED / FAILED / CANCELLED separately.

READY requires time >= not_before, all prerequisites VERIFIED, budget policy pass, provider connected and permission approved. Scheduled tick is **not** execution authorization.

Human relay: GPT room chat and consumer AI chats require user copy/paste unless an actual supported integration is connected. Mark DELIVERED only after proof of delivery; never infer it from a queued command.

On failure: retry only bounded idempotent tasks with backoff, terminal record and human escalation. Never retry production changes or paid calls without approval.

Independent observer: audit every dispatch attempt, paid-provider denial, network attempt, state transition and evidence failure. Fail closed when quota or audit persistence fails.

Public GitHub: never put passwords, tokens, private conversations, personal information, or sensitive business files in this repo.
