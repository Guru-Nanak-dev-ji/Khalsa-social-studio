'use strict';
// KIDO ONE Step 15: deterministic, offline task scheduler/worker prototype.
// No timers, network, outbound messages, credentials or automatic background process.
const crypto=require('node:crypto');
const digest=x=>crypto.createHash('sha256').update(String(x)).digest('hex');
const ALLOWED=new Set(['RESEARCH_DRAFT','WEBSITE_CHECK_DRY_RUN','GITHUB_STATUS_DRY_RUN','AUDIT_SUMMARY']);
function newQueue(){return {tasks:[],events:[],paused:true};}
function enqueue(queue,{id,kind,payload={},runAt=0,maxAttempts=3}){
 if(!id||!ALLOWED.has(kind)||!Number.isFinite(runAt)||!Number.isInteger(maxAttempts)||maxAttempts<1||maxAttempts>5)throw Error('INVALID_TASK');
 if(queue.tasks.some(t=>t.id===id))return {status:'ALREADY_QUEUED',id};
 const t={id,kind,payload,runAt,maxAttempts,attempts:0,status:'QUEUED',leaseUntil:null,leaseOwner:null};
 queue.tasks.push(t);queue.events.push({type:'TASK_CREATED',id});return {status:'QUEUED',id};
}
function setPaused(queue,paused){queue.paused=Boolean(paused);queue.events.push({type:queue.paused?'AUTOMATION_PAUSED':'AUTOMATION_RESUMED'});}
function claim(queue,{workerId,now,leaseMs=30000}){
 if(queue.paused)return null;
 if(!workerId||!Number.isFinite(now)||!Number.isInteger(leaseMs)||leaseMs<1)throw Error('INVALID_CLAIM');
 const t=queue.tasks.find(t=>t.runAt<=now&&(t.status==='QUEUED'||(t.status==='LEASED'&&t.leaseUntil<=now)));
 if(!t)return null;
 if(t.attempts>=t.maxAttempts){t.status='FAILED';queue.events.push({type:'TASK_FAILED',id:t.id});return null;}
 t.status='LEASED';t.leaseOwner=workerId;t.leaseUntil=now+leaseMs;t.attempts++;
 queue.events.push({type:'TASK_CLAIMED',id:t.id,workerId,attempt:t.attempts});return {...t};
}
function complete(queue,{id,workerId,now,result}){
 const t=queue.tasks.find(t=>t.id===id);
 if(!t||t.status!=='LEASED'||t.leaseOwner!==workerId||!Number.isFinite(now)||now>=t.leaseUntil)throw Error('INVALID_OR_EXPIRED_LEASE');
 t.status='DONE';t.resultHash=digest(JSON.stringify(result));queue.events.push({type:'TASK_RESULT_RECORDED',id,resultHash:t.resultHash});
 return {status:'DONE',id,resultHash:t.resultHash};
}
function fail(queue,{id,workerId,now,reason}){
 const t=queue.tasks.find(t=>t.id===id);
 if(!t||t.status!=='LEASED'||t.leaseOwner!==workerId||now>=t.leaseUntil)throw Error('INVALID_OR_EXPIRED_LEASE');
 t.status=t.attempts>=t.maxAttempts?'FAILED':'QUEUED';t.runAt=now+Math.min(60000,1000*(2**(t.attempts-1)));t.leaseOwner=null;t.leaseUntil=null;
 queue.events.push({type:t.status==='FAILED'?'TASK_FAILED':'TASK_RETRY_QUEUED',id,reason:String(reason||'UNKNOWN')});return t.status;
}
function dryRun(task){
 if(!ALLOWED.has(task.kind))throw Error('UNSAFE_TASK');
 return {mode:'DRY_RUN',kind:task.kind,published:false,emailed:false,changedProduction:false,taskId:task.id};
}
module.exports={newQueue,enqueue,setPaused,claim,complete,fail,dryRun};
