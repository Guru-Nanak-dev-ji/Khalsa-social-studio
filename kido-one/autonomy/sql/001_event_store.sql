-- KIDO ONE Step 11: PostgreSQL event-store draft; do not deploy without review.
BEGIN;
CREATE TABLE IF NOT EXISTS kido_event_streams (
 project_id text PRIMARY KEY,
 last_seq bigint NOT NULL DEFAULT 0 CHECK (last_seq >= 0),
 last_hash text NOT NULL DEFAULT 'GENESIS'
);
CREATE TABLE IF NOT EXISTS kido_events (
 project_id text NOT NULL REFERENCES kido_event_streams(project_id),
 seq bigint NOT NULL CHECK (seq > 0),
 event_id text NOT NULL,
 idempotency_key text NOT NULL,
 event_type text NOT NULL,
 actor_id text NOT NULL,
 actor_kind text NOT NULL CHECK (actor_kind IN ('HUMAN','AI','SERVICE')),
 source_uri text NOT NULL,
 policy_version text NOT NULL,
 approval_ref text,
 conflict_id text,
 payload jsonb NOT NULL,
 previous_hash text NOT NULL,
 event_hash text NOT NULL,
 occurred_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY (project_id,seq),
 UNIQUE (project_id,event_id),
 UNIQUE (project_id,idempotency_key)
);
CREATE INDEX IF NOT EXISTS kido_events_type_idx ON kido_events(project_id,event_type,occurred_at);
-- Append-only defense in depth: deny UPDATE/DELETE even to normal writers.
CREATE OR REPLACE FUNCTION kido_reject_event_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'KIDO_EVENT_APPEND_ONLY'; END $$;
DROP TRIGGER IF EXISTS kido_events_immutable ON kido_events;
CREATE TRIGGER kido_events_immutable BEFORE UPDATE OR DELETE ON kido_events
FOR EACH ROW EXECUTE FUNCTION kido_reject_event_mutation();
COMMIT;
-- IMPORTANT: production role separation, RLS, backups and privileges are NOT configured here.
