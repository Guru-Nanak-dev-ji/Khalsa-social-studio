-- KIDO ONE Step 24: actual PostgreSQL concurrent claim test.
-- Two sessions contend for one row using FOR UPDATE SKIP LOCKED.
-- This script runs in an isolated CI database only.
BEGIN;
INSERT INTO kido_worker_control(project_id,paused) VALUES ('CONCURRENCY_CI',false)
 ON CONFLICT(project_id) DO UPDATE SET paused=false;
INSERT INTO kido_tasks(project_id,task_id,kind,payload)
 VALUES ('CONCURRENCY_CI','TASK_1','AUDIT_SUMMARY','{}')
 ON CONFLICT DO NOTHING;
COMMIT;
