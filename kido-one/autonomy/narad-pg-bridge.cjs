'use strict';
// Step 47: explicit opt-in bridge into the existing durable queue, no connection created here.
const {planNaradResearch}=require('./narad-queue-adapter.cjs');
const {enqueueTask}=require('./pg-worker-queue.cjs');
function prepareNaradQueueRequest(input={}){
 const plan=planNaradResearch({...input,dryRun:true});
 if(plan.status!=='DRY_RUN_PLAN')return {status:'BLOCKED',reason:plan.reason};
 if(typeof input.projectId!=='string'||!input.projectId.trim())return {status:'BLOCKED',reason:'PROJECT_REQUIRED'};
 return {status:'PREPARED',projectId:input.projectId,taskId:'narad-'+plan.fingerprint.slice(0,32),kind:'RESEARCH_DRAFT',payload:{topic:plan.request.topic,sources:plan.request.sources,publication:'DISABLED',dryRun:true},fingerprint:plan.fingerprint};
}
async function enqueuePreparedNarad(pool,prepared,{allowDatabaseWrite=false}={}){
 if(!allowDatabaseWrite)throw Error('DB_WRITE_NOT_AUTHORIZED');
 if(!prepared||prepared.status!=='PREPARED'||prepared.kind!=='RESEARCH_DRAFT'||prepared.payload?.dryRun!==true||prepared.payload?.publication!=='DISABLED')throw Error('INVALID_PREPARED_TASK');
 return enqueueTask(pool,{projectId:prepared.projectId,taskId:prepared.taskId,kind:prepared.kind,payload:prepared.payload});
}
module.exports={prepareNaradQueueRequest,enqueuePreparedNarad};
