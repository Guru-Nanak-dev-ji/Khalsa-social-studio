-- KIDO ONE Step 22: role isolation design. NOT APPLIED to production.
-- This migration intentionally does NOT create login users or grant passwords.
-- Deployment operator must create NOLOGIN roles and separate authenticated LOGIN
-- roles with least privilege, network controls and managed secret rotation.
BEGIN;
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='kido_event_reader') THEN CREATE ROLE kido_event_reader NOLOGIN; END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='kido_event_writer') THEN CREATE ROLE kido_event_writer NOLOGIN; END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='kido_worker_role') THEN CREATE ROLE kido_worker_role NOLOGIN; END IF;
END $$;
REVOKE ALL ON kido_events,kido_event_streams,kido_tasks,kido_worker_control,kido_approval_grants FROM PUBLIC;
GRANT SELECT ON kido_events,kido_event_streams TO kido_event_reader;
GRANT SELECT,INSERT ON kido_events TO kido_event_writer;
GRANT SELECT,INSERT,UPDATE ON kido_event_streams TO kido_event_writer;
GRANT SELECT,INSERT,UPDATE ON kido_tasks TO kido_worker_role;
GRANT SELECT ON kido_worker_control TO kido_worker_role;
-- Pause/resume and approval issuance remain reserved to trusted admin service.
-- Row-level tenant isolation is NOT provided by this migration.
COMMIT;
