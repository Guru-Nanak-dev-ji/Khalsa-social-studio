'use strict';
// KIDO ONE Step 28: default-deny execution gate. Pure decisions only; no I/O.
const READ_ONLY=new Set(['RESEARCH_DRAFT','WEBSITE_CHECK_DRY_RUN','GITHUB_STATUS_DRY_RUN','AUDIT_SUMMARY']);
function decideExecution({task,control,lease,approval,mode='DRY_RUN'}={}){
 if(!task||!READ_ONLY.has(task.kind))return {allow:false,reason:'TASK_NOT_ALLOWLISTED'};
 if(mode!=='DRY_RUN')return {allow:false,reason:'LIVE_EXECUTION_DISABLED'};
 if(!control||control.paused!==false)return {allow:false,reason:'WORKERS_PAUSED'};
 if(!lease||!Number.isSafeInteger(lease.token)||lease.token<1||
    lease.workerId!==task.leaseOwner||lease.token!==task.leaseToken||
    !Number.isFinite(Date.parse(lease.expiresAt))||Date.parse(lease.expiresAt)<=Date.now())
  return {allow:false,reason:'STALE_OR_EXPIRED_LEASE'};
 if(task.requiresHumanApproval && approval?.verified!==true)return {allow:false,reason:'HUMAN_APPROVAL_REQUIRED'};
 return {allow:true,mode:'DRY_RUN',outboundAllowed:false,externalCallsAllowed:0};
}
module.exports={decideExecution};
