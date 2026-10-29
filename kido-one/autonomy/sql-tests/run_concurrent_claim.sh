#!/usr/bin/env bash
# Isolated PostgreSQL CI only. Verify SKIP LOCKED under two live connections.
set -euo pipefail
psql -v ON_ERROR_STOP=1 -f kido-one/autonomy/sql-tests/concurrent_claim_seed.sql
first_log="$(mktemp)"
second_log="$(mktemp)"
psql -v ON_ERROR_STOP=1 -At <<'SQL' > "$first_log" &
BEGIN;
SELECT task_id FROM kido_tasks
 WHERE project_id='CONCURRENCY_CI' AND status='QUEUED'
 ORDER BY task_id FOR UPDATE SKIP LOCKED LIMIT 1;
SELECT pg_sleep(3);
COMMIT;
SQL
first_pid=$!
sleep 1
psql -v ON_ERROR_STOP=1 -At <<'SQL' > "$second_log"
BEGIN;
SELECT coalesce((SELECT task_id FROM kido_tasks
 WHERE project_id='CONCURRENCY_CI' AND status='QUEUED'
 ORDER BY task_id FOR UPDATE SKIP LOCKED LIMIT 1),'NO_TASK');
COMMIT;
SQL
wait "$first_pid"
grep -qx TASK_1 "$first_log"
grep -qx NO_TASK "$second_log"
echo "PASS: competing connection skipped locked task"
