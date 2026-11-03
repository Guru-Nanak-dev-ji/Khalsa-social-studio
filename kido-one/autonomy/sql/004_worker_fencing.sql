-- KIDO ONE Step 22: restore missing worker fencing migration.
BEGIN;
ALTER TABLE kido_tasks ADD COLUMN IF NOT EXISTS lease_token bigint NOT NULL DEFAULT 0 CHECK(lease_token >= 0);
CREATE INDEX IF NOT EXISTS kido_tasks_expired_lease_idx ON kido_tasks(project_id,lease_until) WHERE status='LEASED';
COMMIT;
