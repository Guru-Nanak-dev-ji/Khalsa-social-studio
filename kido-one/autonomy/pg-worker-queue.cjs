'use strict';
// Step 16: PostgreSQL queue adapter, no live DB connection or background execution.
const ALLOWED=new Set(['RESEARCH_DRAFT','WEBSITE_CHECK_DRY_RUN','GITHUB_STATUS_DRY_RUN','AUDIT_SUMMARY']);
function required(v,name){if(typeof v!=='string'||!v.trim())throw Error('MISSING_'+name);}
async function enqueueTask(pool,{projectId,taskId,kind,payload={},runAt='2026-10-29T00:00:00Z',maxAttempts=3}){
 required(projectId,'PROJECT');required(taskId,'TASK');
 if(!ALLOWED.has(kind)||!Number.isInteger(maxAttempts)||maxAttempts<1||maxAttempts>5||!Number.isFinite(Date.parse(runAt)))throw Error('INVALID_TASK');
 const c=await pool.connect();try{
  const r=await c.query("INSERT INTO kido_tasks(project_id,task_id,kind,payload,run_at,max_attempts) VALUES($1,$2,$3,$4::jsonb,$5,$6) ON CONFLICT(project_id,task_id) DO NOTHING RETURNING task_id",[projectId,taskId,kind,JSON.stringify(payload),runAt,maxAttempts]);
  return {status:r.rows.length?'QUEUED':'ALREADY_QUEUED',taskId};
 }finally{c.release();}
}
async function claimTask(pool,{projectId,workerId,leaseSeconds=30}){
 required(projectId,'PROJECT');required(workerId,'WORKER');
 if(!Number.isInteger(leaseSeconds)||leaseSeconds<1||leaseSeconds>300)throw Error('INVALID_LEASE');
 const c=await pool.connect();let tx=false;
 try{
  await c.query('BEGIN');tx=true;
  const control=await c.query('SELECT paused FROM kido_worker_control WHERE project_id=$1 FOR SHARE',[projectId]);
  if(!control.rows.length||control.rows[0].paused){await c.query('COMMIT');tx=false;return null;}
  const r=await c.query("SELECT * FROM kido_tasks WHERE project_id=$1 AND run_at<=clock_timestamp() AND (status='QUEUED' OR (status='LEASED' AND lease_until<=clock_timestamp())) AND attempts<max_attempts ORDER BY run_at,task_id FOR UPDATE SKIP LOCKED LIMIT 1",[projectId]);
  if(!r.rows.length){await c.query('COMMIT');tx=false;return null;}
  const task=r.rows[0];
  await c.query("UPDATE kido_tasks SET status='LEASED',attempts=attempts+1,lease_owner=$3,lease_until=clock_timestamp()+($4::int * interval '1 second'),updated_at=clock_timestamp() WHERE project_id=$1 AND task_id=$2",[projectId,task.task_id,workerId,leaseSeconds]);
  await c.query('COMMIT');tx=false;return {taskId:task.task_id,kind:task.kind,payload:task.payload,leaseOwner:workerId};
 }catch(e){if(tx)await c.query('ROLLBACK');throw e;}finally{c.release();}
}
async function pauseWorkers(pool,{projectId,actorId}){
 required(projectId,'PROJECT');required(actorId,'ACTOR');
 const c=await pool.connect();try{
  await c.query("INSERT INTO kido_worker_control(project_id,paused,changed_by) VALUES($1,true,$2) ON CONFLICT(project_id) DO UPDATE SET paused=true,changed_at=clock_timestamp(),changed_by=$2",[projectId,actorId]);
  return {paused:true,projectId};
 }finally{c.release();}
}
module.exports={enqueueTask,claimTask,pauseWorkers};
