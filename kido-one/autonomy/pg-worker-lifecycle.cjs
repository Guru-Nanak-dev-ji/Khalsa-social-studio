'use strict';
// Step 25: durable task lifecycle operations, no live DB connection or outbound actions.
function required(v,name){if(typeof v!=='string'||!v.trim())throw Error('MISSING_'+name);}
function validateLease({projectId,taskId,workerId,leaseToken}){
 required(projectId,'PROJECT');required(taskId,'TASK');required(workerId,'WORKER');
 if(!Number.isSafeInteger(leaseToken)||leaseToken<1)throw Error('INVALID_LEASE_TOKEN');
}
async function settleFailure(pool,lease,{reason='TASK_FAILED',backoffSeconds=30}={}){
 validateLease(lease);
 if(!Number.isInteger(backoffSeconds)||backoffSeconds<1||backoffSeconds>3600)throw Error('INVALID_BACKOFF');
 const c=await pool.connect();let tx=false;
 try{
  await c.query('BEGIN');tx=true;
  const ctl=await c.query('SELECT paused FROM kido_worker_control WHERE project_id=$1 FOR SHARE',[lease.projectId]);
  if(!ctl.rows.length||ctl.rows[0].paused)throw Error('WORKERS_PAUSED');
  const r=await c.query("UPDATE kido_tasks SET status=CASE WHEN attempts>=max_attempts THEN 'FAILED' ELSE 'QUEUED' END,run_at=CASE WHEN attempts>=max_attempts THEN run_at ELSE clock_timestamp()+($5::int * interval '1 second') END,lease_owner=NULL,lease_until=NULL,updated_at=clock_timestamp() WHERE project_id=$1 AND task_id=$2 AND lease_owner=$3 AND lease_token=$4 AND status='LEASED' AND lease_until>clock_timestamp() RETURNING status,attempts,max_attempts",[lease.projectId,lease.taskId,lease.workerId,lease.leaseToken,backoffSeconds]);
  if(!r.rows.length)throw Error('STALE_LEASE');
  await c.query('COMMIT');tx=false;
  return {taskId:lease.taskId,status:r.rows[0].status,reason};
 }catch(e){if(tx)await c.query('ROLLBACK');throw e;}finally{c.release();}
}
async function expireExhausted(pool,{projectId}){
 required(projectId,'PROJECT');
 const c=await pool.connect();
 try{
  const r=await c.query("UPDATE kido_tasks SET status='FAILED',lease_owner=NULL,lease_until=NULL,updated_at=clock_timestamp() WHERE project_id=$1 AND status='LEASED' AND lease_until<=clock_timestamp() AND attempts>=max_attempts RETURNING task_id",[projectId]);
  return {failedTaskIds:r.rows.map(x=>x.task_id)};
 }finally{c.release();}
}
module.exports={settleFailure,expireExhausted};
