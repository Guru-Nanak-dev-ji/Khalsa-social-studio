-- Step 14: one-time approvals. Migration draft only.
BEGIN;
CREATE TABLE IF NOT EXISTS kido_approval_grants (
 project_id text NOT NULL,
 approval_ref text NOT NULL,
 command_id text NOT NULL,
 scope text NOT NULL,
 approved_by text NOT NULL,
 verified_human boolean NOT NULL DEFAULT false,
 expires_at timestamptz NOT NULL,
 revoked_at timestamptz,
 consumed_at timestamptz,
 consumed_event_id text,
 PRIMARY KEY(project_id,approval_ref),
 CHECK (length(approved_by)>0),
 CHECK (length(command_id)>0)
);
CREATE INDEX IF NOT EXISTS kido_approval_pending_idx ON kido_approval_grants(project_id,command_id,scope) WHERE consumed_at IS NULL AND revoked_at IS NULL;
COMMIT;
-- In production, only trusted approval service may INSERT grants.
-- Normal AI/worker DB role must NOT UPDATE/DELETE this table.
