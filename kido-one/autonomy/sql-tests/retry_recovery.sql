-- KIDO ONE Step 26: real PostgreSQL retry/recovery assertions in disposable CI DB.
BEGIN;
INSERT INTO kido_worker_control(project_id,paused) VALUES ('LIFECYCLE_CI',false)
 ON CONFLICT(project_id) DO UPDATE SET paused=false;
INSERT INTO kido_tasks(project_id,task_id,kind,status,attempts,max_attempts,lease_owner,lease_until,lease_token)
VALUES
 ('LIFECYCLE_CI','RETRY','AUDIT_SUMMARY','LEASED',1,3,'W1',clock_timestamp()+interval '2 minutes',4),
 ('LIFECYCLE_CI','EXHAUST','AUDIT_SUMMARY','LEASED',3,3,'W2',clock_timestamp()-interval '2 minutes',2),
 ('LIFECYCLE_CI','STALE','AUDIT_SUMMARY','LEASED',1,3,'W3',clock_timestamp()+interval '2 minutes',7);
COMMIT;
-- Correct lease may retry.
UPDATE kido_tasks SET status='QUEUED',run_at=clock_timestamp()+interval '30 seconds',lease_owner=NULL,lease_until=NULL
WHERE project_id='LIFECYCLE_CI' AND task_id='RETRY' AND lease_owner='W1' AND lease_token=4
 AND status='LEASED' AND lease_until>clock_timestamp();
-- Old fencing token cannot overwrite current worker.
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM kido_tasks WHERE project_id='LIFECYCLE_CI' AND task_id='STALE' AND lease_token=6) THEN
  RAISE EXCEPTION 'STALE_TOKEN_SEED_INVALID';
 END IF;
END $$;
UPDATE kido_tasks SET status='DONE' WHERE project_id='LIFECYCLE_CI' AND task_id='STALE'
 AND lease_owner='W3' AND lease_token=6 AND status='LEASED' AND lease_until>clock_timestamp();
-- Expired, exhausted task becomes failed.
UPDATE kido_tasks SET status='FAILED',lease_owner=NULL,lease_until=NULL
WHERE project_id='LIFECYCLE_CI' AND task_id='EXHAUST'
 AND status='LEASED' AND lease_until<=clock_timestamp() AND attempts>=max_attempts;
DO $$ BEGIN
 IF (SELECT status FROM kido_tasks WHERE project_id='LIFECYCLE_CI' AND task_id='RETRY') <> 'QUEUED' THEN
  RAISE EXCEPTION 'RETRY_NOT_QUEUED';
 END IF;
 IF (SELECT status FROM kido_tasks WHERE project_id='LIFECYCLE_CI' AND task_id='EXHAUST') <> 'FAILED' THEN
  RAISE EXCEPTION 'EXHAUST_NOT_FAILED';
 END IF;
 IF (SELECT status FROM kido_tasks WHERE project_id='LIFECYCLE_CI' AND task_id='STALE') <> 'LEASED' THEN
  RAISE EXCEPTION 'STALE_TOKEN_ACCEPTED';
 END IF;
END $$;
