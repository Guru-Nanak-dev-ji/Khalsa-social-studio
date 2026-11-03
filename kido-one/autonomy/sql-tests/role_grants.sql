-- KIDO ONE Step 23: role-grant checks in disposable PostgreSQL CI.
-- Execute as CI database owner, never production.
DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='kido_worker_role') THEN
  RAISE EXCEPTION 'KIDO_WORKER_ROLE_MISSING';
 END IF;
 IF has_table_privilege('kido_worker_role','kido_worker_control','UPDATE') THEN
  RAISE EXCEPTION 'KIDO_WORKER_CAN_CHANGE_PAUSE';
 END IF;
 IF has_table_privilege('kido_event_reader','kido_events','INSERT') THEN
  RAISE EXCEPTION 'KIDO_READER_CAN_WRITE_EVENTS';
 END IF;
 IF has_table_privilege('kido_worker_role','kido_approval_grants','INSERT') THEN
  RAISE EXCEPTION 'KIDO_WORKER_CAN_ISSUE_APPROVAL';
 END IF;
 IF NOT has_table_privilege('kido_worker_role','kido_tasks','UPDATE') THEN
  RAISE EXCEPTION 'KIDO_WORKER_CANNOT_UPDATE_TASK';
 END IF;
END $$;
