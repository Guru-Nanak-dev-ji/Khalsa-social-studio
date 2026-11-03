'use strict';
// KIDO ONE Step 29: one-shot offline worker orchestration; no scheduler/network.
const {decideExecution}=require('./execution-gate.cjs');
const {planRoute}=require('./ai-router.cjs');
async function processDryRunTask({task,control,lease,approval,availableProviders=['local']}={}){
 const gate=decideExecution({task,control,lease,approval,mode:'DRY_RUN'});
 if(!gate.allow)return {status:'BLOCKED',reason:gate.reason,executed:false,externalCalls:0};
 const role=task.kind==='RESEARCH_DRAFT'?'DRAFT':task.kind==='AUDIT_SUMMARY'?'SUMMARIZE':'CLASSIFY';
 const route=planRoute({role,available:availableProviders,maxCostTier:'FREE_SOFTWARE',containsSecrets:task.containsSecrets===true});
 if(route.status!=='DRY_RUN_PLAN')return {status:'UNASSIGNED',reason:route.reason||route.status,executed:false,externalCalls:0};
 return {status:'DRY_RUN_READY',taskId:task.taskId,provider:route.provider,role,executed:false,externalCalls:0,requiresDispatch:true};
}
module.exports={processDryRunTask};
