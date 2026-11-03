-- KIDO ONE Step 16: durable task queue and global emergency pause (DRAFT).
BEGIN;
CREATE TABLE IF NOT EXISTS kido_worker_control (
 project_id text PRIMARY KEY,
 paused boolean NOT NULL DEFAULT true,
 changed_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 changed_by text NOT NULL DEFAULT 'SYSTEM'
);
CREATE TABLE IF NOT EXISTS kido_tasks (
 project_id text NOT NULL,
 task_id text NOT NULL,
 kind text NOT NULL CHECK(kind IN ('RESEARCH_DRAFT','WEBSITE_CHECK_DRY_RUN','GITHUB_STATUS_DRY_RUN','AUDIT_SUMMARY')),
 payload jsonb NOT NULL DEFAULT '{}'::jsonb,
 status text NOT NULL DEFAULT 'QUEUED' CHECK(status IN ('QUEUED','LEASED','DONE','FAILED')),
 run_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 attempts integer NOT NULL DEFAULT 0 CHECK(attempts >= 0),
 max_attempts integer NOT NULL DEFAULT 3 CHECK(max_attempts BETWEEN 1 AND 5),
 lease_owner text,
 lease_until timestamptz,
 result_hash text,
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(project_id,task_id)
);
CREATE INDEX IF NOT EXISTS kido_tasks_ready_idx ON kido_tasks(project_id,run_at) WHERE status IN ('QUEUED','LEASED');
COMMIT;
-- Only trusted server-side roles may mutate worker_control or task rows.
-- RLS, role grants, backup and event-store outbox integration pending.
