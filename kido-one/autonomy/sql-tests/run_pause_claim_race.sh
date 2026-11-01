#!/usr/bin/env bash
# Step 27: pause/claim transaction race test on disposable PostgreSQL.
set -euo pipefail
psql -v ON_ERROR_STOP=1 <<'SQL'
INSERT INTO kido_worker_control(project_id,paused) VALUES('PAUSE_CI',false)
 ON CONFLICT(project_id) DO UPDATE SET paused=false;
INSERT INTO kido_tasks(project_id,task_id,kind) VALUES('PAUSE_CI','T1','AUDIT_SUMMARY')
 ON CONFLICT DO NOTHING;
SQL
first="$(mktemp)"
second="$(mktemp)"
# Claim transaction holds FOR SHARE on control row until commit.
psql -v ON_ERROR_STOP=1 -At <<'SQL' > "$first" &
BEGIN;
SELECT paused FROM kido_worker_control WHERE project_id='PAUSE_CI' FOR SHARE;
SELECT pg_sleep(3);
SELECT task_id FROM kido_tasks WHERE project_id='PAUSE_CI' AND status='QUEUED'
 FOR UPDATE SKIP LOCKED LIMIT 1;
COMMIT;
SQL
pid=$!
sleep 1
# Pause update must wait for claim's control-row share lock, then commit.
psql -v ON_ERROR_STOP=1 -At <<'SQL' > "$second"
UPDATE kido_worker_control SET paused=true WHERE project_id='PAUSE_CI' RETURNING paused;
SQL
wait "$pid"
grep -qx T1 "$first"
grep -qx t "$second"
test "$(psql -At -c "SELECT paused FROM kido_worker_control WHERE project_id='PAUSE_CI'")" = t
# Once pause committed, subsequent claim gate must observe paused=true.
test "$(psql -At -c "SELECT paused FROM kido_worker_control WHERE project_id='PAUSE_CI'")" = t
echo "PASS: pause serialized after in-flight claim transaction; later claims must stop"
