'use strict';
/** Pure in-memory authority/STOP/lease adapter for local fixture testing ONLY.
 * No real signing, no cross-process transaction, no provider/worker dispatch.
 * Avoid exporting this module to production runtime as a source of authority.
 */
const assert=require('node:assert/strict');
const TASK_KEYS=['taskId','tenantId','workerId','sourceSha256','inputSha256','operation','scope','provider','attemptId','leaseId','fence','stopRevision','approvalId'];
function baseTask(overrides={}){
 const task={taskId:'TASK-C13-001',tenantId:'TENANT-TEST',workerId:'S1-GPT04',sourceSha256:'a'.repeat(64),inputSha256:'b'.repeat(64),operation:'MOCK_STATIC_BUILD_TEST',scope:'GREEN_MOCK_ONLY',provider:'MOCK_LOCAL',attemptId:'ATTEMPT-001',leaseId:'LEASE-001',fence:1,stopRevision:0,approvalId:'APPROVAL-001',...overrides};
 assert.deepEqual(Object.keys(task).sort(),TASK_KEYS.slice().sort());
 return task;
}
function createMockHost(initialTask=baseTask()){
 let now=1000;let stopActive=false;let stopRevision=initialTask.stopRevision;
 let grantExpiresAt=now+5000;let leaseExpiresAt=now+5000;let leaseValid=true;
 let issuer='ISSUER-TEST',keyId='KEY-TEST',issuerEnabled=true;
 let verifyResult=true;let overrideGrant=null;let overrideLease=null;
 let receipt=null;let receiptWrites=0;let subscribed=0;
 const listeners=new Set();
 const task={...initialTask};
 const authority=()=>({stop:{active:stopActive,revision:stopRevision},issuers:{[issuer]:{keyId,enabled:issuerEnabled}},tenantId:task.tenantId,scope:task.scope,workerId:task.workerId});
 const grant=()=>({verified:verifyResult,issuerId:issuer,issuerKeyId:keyId,tenantId:task.tenantId,workerId:task.workerId,taskId:task.taskId,approvalId:task.approvalId,scope:task.scope,provider:task.provider,operation:task.operation,sourceSha256:task.sourceSha256,inputSha256:task.inputSha256,stopRevision:task.stopRevision,expiresAtMs:grantExpiresAt});
 const lease=()=>({valid:leaseValid,taskId:task.taskId,workerId:task.workerId,tenantId:task.tenantId,leaseId:task.leaseId,attemptId:task.attemptId,fence:task.fence,stopRevision:task.stopRevision,expiresAtMs:leaseExpiresAt});
 const ports={
  async readAuthority(){return authority();},
  async verifyApproval(){return overrideGrant?overrideGrant():grant();},
  async assertLease(){return overrideLease?overrideLease():lease();},
  subscribeStop(t,onStop){subscribed++;listeners.add(onStop);return ()=>{listeners.delete(onStop)};},
  nowMs(){return now;},
  async commitTerminal(r){
   // NO await here: one JS turn for a deterministic LOCAL mock CAS.
   if(stopActive||stopRevision!==task.stopRevision||!leaseValid||now>=leaseExpiresAt||now>=grantExpiresAt)return {committed:false,receiptId:'RECEIPT-DENIED',resultSha256:r.resultSha256,stopRevision,fence:task.fence};
   for(const k of ['taskId','workerId','tenantId','attemptId','leaseId','fence','stopRevision'])if(r[k]!==task[k])return {committed:false,receiptId:'RECEIPT-DENIED',resultSha256:r.resultSha256,stopRevision,fence:task.fence};
   if(!receipt){receipt={committed:true,receiptId:'RECEIPT-LOCAL-001',resultSha256:r.resultSha256,stopRevision,fence:task.fence};receiptWrites++;}
   if(r.resultSha256!==receipt.resultSha256)return {committed:false,receiptId:'RECEIPT-CONFLICT',resultSha256:r.resultSha256,stopRevision,fence:task.fence};
   return {...receipt};
  }
 };
 return {
  task,ports,
  stop(){stopActive=true;stopRevision++;for(const cb of [...listeners])cb({active:true,revision:stopRevision});},
  resume(){stopActive=false;stopRevision++;for(const cb of [...listeners])cb({active:false,revision:stopRevision});},
  moveTime(amount){if(!Number.isSafeInteger(amount)||amount<0)throw Error('INVALID_TIME_STEP');now+=amount;},
  revokeLease(){leaseValid=false;},
  rotateIssuer(){keyId='KEY-ROTATED';},
  disableIssuer(){issuerEnabled=false;},
  setVerifyResult(x){verifyResult=x;},
  setGrantOverride(fn){overrideGrant=fn;},
  setLeaseOverride(fn){overrideLease=fn;},
  get state(){return {now,stopActive,stopRevision,receiptWrites,subscribed,listenerCount:listeners.size,receipt:receipt&&{...receipt}};}
 };
}
module.exports={baseTask,createMockHost};
