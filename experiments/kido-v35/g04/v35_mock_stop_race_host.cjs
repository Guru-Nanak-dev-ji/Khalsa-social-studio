'use strict';
/** V35 S1-GPT04 C22B: ephemeral deterministic STOP/lease/CAS fault-injection host.
 * No queue, no signatures, no disk writes, no network, no real receiver.
 * Pure single-process fixture for C20 middleware regression, NOT an atomic DB.
 */
const {createApprovalStopMiddleware}=require('../../kido-v32/g04/approval_stop_middleware_c20.cjs');
const {operation:staticOperation}=require('../../kido-v32/g04/mock_build_adapter.cjs');
function deferred(){let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no});return {promise,resolve,reject};}
function createHarness(){
 const task={taskId:'TASK-V35-G04',tenantId:'TENANT-MOCK',workerId:'S1-GPT04',sourceSha256:'a'.repeat(64),inputSha256:'b'.repeat(64),operation:'MOCK_STATIC_BUILD_TEST',scope:'GREEN_MOCK_ONLY',provider:'MOCK_LOCAL',attemptId:'ATTEMPT-G04',leaseId:'LEASE-G04',fence:1,stopRevision:0,approvalId:'APPROVAL-G04'};
 const state={time:1000,stop:false,stopRevision:0,leaseFence:1,leaseExpiry:5000,approval:true,issuerKey:'KEY-G04',receipt:null,attempts:0,subscribers:new Set(),afterCommit:null,commitBarrier:null,unknownCommit:false};
 function authority(){return {stop:{active:state.stop,revision:state.stopRevision},issuers:{'ISSUER-G04':{keyId:state.issuerKey,enabled:true}},tenantId:task.tenantId,scope:task.scope,workerId:task.workerId};}
 function grant(){return {verified:state.approval,issuerId:'ISSUER-G04',issuerKeyId:'KEY-G04',tenantId:task.tenantId,workerId:task.workerId,taskId:task.taskId,approvalId:task.approvalId,scope:task.scope,provider:task.provider,operation:task.operation,sourceSha256:task.sourceSha256,inputSha256:task.inputSha256,stopRevision:task.stopRevision,expiresAtMs:5000};}
 function lease(){return {valid:true,taskId:task.taskId,workerId:task.workerId,tenantId:task.tenantId,leaseId:task.leaseId,attemptId:task.attemptId,fence:state.leaseFence,stopRevision:state.stopRevision,expiresAtMs:state.leaseExpiry};}
 const ports={readAuthority:async()=>authority(),verifyApproval:async()=>grant(),assertLease:async()=>lease(),nowMs:()=>state.time,subscribeStop:(_t,cb)=>{state.subscribers.add(cb);return ()=>state.subscribers.delete(cb);},commitTerminal:async request=>{
  state.attempts++;
  if(state.commitBarrier)await state.commitBarrier();
  if(state.stop||state.stopRevision!==request.stopRevision||state.leaseFence!==request.fence||state.leaseExpiry<=state.time||state.receipt)throw Error('MOCK_CAS_DENIED');
  state.receipt={taskId:request.taskId,attemptId:request.attemptId,fence:request.fence,stopRevision:request.stopRevision,resultSha256:request.resultSha256};
  if(state.afterCommit)state.afterCommit();
  if(state.unknownCommit)throw Error('SIMULATED_RESPONSE_LOST_AFTER_COMMIT');
  return {committed:true,receiptId:'RECEIPT-G04',resultSha256:request.resultSha256,stopRevision:request.stopRevision,fence:request.fence};
 }};
 return Object.freeze({
  task,ports,
  run:(op=staticOperation,options)=>createApprovalStopMiddleware(ports,options).run({...task},op),
  stop:()=>{state.stop=true;state.stopRevision++;for(const cb of [...state.subscribers])cb({active:true,revision:state.stopRevision});},
  expire:()=>{state.time=6000},
  rotateFence:()=>{state.leaseFence++},
  disableApproval:()=>{state.approval=false},
  rotateIssuerKey:()=>{state.issuerKey='KEY-REVOKED'},
  setCommitBarrier:b=>{state.commitBarrier=b},
  afterCommit:fn=>{state.afterCommit=fn},
  loseCommitResponse:()=>{state.unknownCommit=true},
  stats:()=>Object.freeze({attempts:state.attempts,receipt:state.receipt?{...state.receipt}:null,subscriptions:state.subscribers.size,stop:state.stop})
 });
}
module.exports={deferred,createHarness};
