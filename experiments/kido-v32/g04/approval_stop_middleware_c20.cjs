'use strict';
/**
 * KDN V32 / S1-GPT04 C20 — data-only GREEN mock authorization / STOP middleware.
 * Integrates AROUND existing main.cjs.runTask, not another queue, scheduler or signer.
 * The host MUST provide authenticated snapshot, grant verification, lease checks,
 * STOP subscription and atomic commit. This module cannot attest the host,
 * sandbox arbitrary actions, certify paid/prod, or provide live worker ACK.
 */
const crypto = require('node:crypto');
const { AbortController } = global;
const HEX = /^[a-f0-9]{64}$/;
const ID = /^[A-Za-z][A-Za-z0-9._:-]{2,95}$/;
const SAFE_OP = new Set(['MOCK_COUNT_LITERAL_ITEMS', 'MOCK_STATIC_BUILD_TEST']);
const REQUIRED = ['readAuthority','verifyApproval','assertLease','subscribeStop','commitTerminal','nowMs'];


class GateDenied extends Error {
  constructor(code) { super(code); this.name='GateDenied'; this.code=code; }
}
const has = (v,k)=>Object.prototype.hasOwnProperty.call(v,k);
const plain = x=>x!==null && typeof x==='object' && (Object.getPrototypeOf(x)===Object.prototype || Object.getPrototypeOf(x)===null);
function deny(code) { throw new GateDenied(code); }
function exact(v,keys) {
 if(!plain(v))return false;
 // Object.getOwnPropertyDescriptors reads descriptor metadata without executing
 // ordinary JavaScript property getters. Host must still reject Proxy input.
 const descriptors=Object.getOwnPropertyDescriptors(v);
 return Object.keys(descriptors).length===keys.length && keys.every(k=>
   has(descriptors,k) && has(descriptors[k],'value'));
}
function assertId(v,k) { if(typeof v!=='string'||!ID.test(v)) deny('INVALID_'+k); }
function assertHash(v,k) { if(typeof v!=='string'||!HEX.test(v)) deny('INVALID_'+k); }
function assertSafeTask(t) {
 const keys=['taskId','tenantId','workerId','sourceSha256','inputSha256','operation','scope','provider','attemptId','leaseId','fence','stopRevision','approvalId'];
 if(!exact(t,keys)) deny('INVALID_TASK_ENVELOPE');
 for(const k of ['taskId','tenantId','workerId','attemptId','leaseId','approvalId'])assertId(t[k],k.toUpperCase());
 assertHash(t.sourceSha256,'SOURCE_HASH'); assertHash(t.inputSha256,'INPUT_HASH');
 if(t.scope!=='GREEN_MOCK_ONLY' || t.provider!=='MOCK_LOCAL' || !SAFE_OP.has(t.operation)) deny('FORBIDDEN_SCOPE_PROVIDER_OR_OPERATION');
 if(!Number.isSafeInteger(t.fence)||t.fence<=0 || !Number.isSafeInteger(t.stopRevision)||t.stopRevision<0) deny('INVALID_FENCE_OR_STOP_REVISION');
 return Object.freeze({...t});
}
function assertClock(nowMs){const n=nowMs();if(!Number.isSafeInteger(n)||n<0)deny('INVALID_CLOCK');return n;}
function checkAuthority(s,t){
 if(!exact(s,['stop','issuers','tenantId','scope','workerId']))deny('UNTRUSTED_AUTHORITY_SCHEMA');
 if(!exact(s.stop,['active','revision']) || s.stop.active!==false || !Number.isSafeInteger(s.stop.revision) || s.stop.revision!==t.stopRevision)deny('STOP_ACTIVE_OR_STALE');
 if(s.tenantId!==t.tenantId || s.scope!==t.scope || s.workerId!==t.workerId)deny('AUTHORITY_TENANT_SCOPE_WORKER_MISMATCH');
 if(!plain(s.issuers))deny('ISSUER_REGISTRY_MISSING');
}
function checkGrant(a,t,s,now){
 if(!exact(a,['verified','issuerId','issuerKeyId','tenantId','workerId','taskId','approvalId','scope','provider','operation','sourceSha256','inputSha256','stopRevision','expiresAtMs']))deny('GRANT_SCHEMA_INVALID');
 if(a.verified!==true)deny('GRANT_NOT_VERIFIED_BY_HOST');
 assertId(a.issuerId,'ISSUER');assertId(a.issuerKeyId,'ISSUER_KEY');
 if(!has(s.issuers,a.issuerId) || !exact(s.issuers[a.issuerId],['keyId','enabled']) || s.issuers[a.issuerId].enabled!==true || s.issuers[a.issuerId].keyId!==a.issuerKeyId)deny('ISSUER_TO_KEY_BINDING_FAILED');
 for(const k of ['tenantId','workerId','taskId','approvalId','scope','provider','operation','sourceSha256','inputSha256','stopRevision']) if(a[k]!==t[k])deny('GRANT_SUBJECT_MISMATCH_'+k.toUpperCase());
 if(!Number.isSafeInteger(a.expiresAtMs)||a.expiresAtMs<=now||a.expiresAtMs>now+15*60*1000)deny('GRANT_EXPIRED_OR_TOO_LONG');
}
function checkLease(l,t){
 if(!exact(l,['valid','taskId','workerId','tenantId','leaseId','attemptId','fence','stopRevision','expiresAtMs']))deny('LEASE_SCHEMA_INVALID');
 if(l.valid!==true || ['taskId','workerId','tenantId','leaseId','attemptId','fence','stopRevision'].some(k=>l[k]!==t[k]))deny('LEASE_NOT_ATOMICALLY_CURRENT');
 if(!Number.isSafeInteger(l.expiresAtMs)||l.expiresAtMs<=0)deny('LEASE_EXPIRY_INVALID');
}
function stableSha(data){
 const seen=new Set();let nodes=0;
 function walk(v,depth){
  if(++nodes>512 || depth>10)deny('RESULT_JSON_BOUNDS');
  if(v===null || typeof v==='boolean')return;
  if(typeof v==='number') {if(!Number.isFinite(v)||!Number.isSafeInteger(v))deny('INVALID_RESULT_NUMBER');return;}
  if(typeof v==='string') {if(v.length>8192)deny('RESULT_JSON_BOUNDS');return;}
  if(typeof v!=='object'||seen.has(v))deny('NON_JSON_OR_CYCLIC_RESULT');
  if(!Array.isArray(v)&&!plain(v))deny('NON_JSON_OR_CYCLIC_RESULT');
  seen.add(v);
  if(Array.isArray(v)) {if(v.length>128)deny('RESULT_JSON_BOUNDS');for(const x of v)walk(x,depth+1);}
  else {
   const keys=Object.keys(v);if(keys.length>80)deny('RESULT_JSON_BOUNDS');
   for(const key of keys){if(['__proto__','constructor','prototype'].includes(key)||key.length>128)deny('RESULT_INVALID_KEY');
     const desc=Object.getOwnPropertyDescriptor(v,key);
     if(!desc||!has(desc,'value'))deny('RESULT_ACCESSOR_FORBIDDEN');
     walk(desc.value,depth+1);
   }
  }
  seen.delete(v);
 }
 walk(data,0);
 const json=JSON.stringify(data);
 if(typeof json!=='string'||Buffer.byteLength(json,'utf8')>32768)deny('RESULT_JSON_BOUNDS');
 return crypto.createHash('sha256').update(json).digest('hex');
}
// Only a cooperative local mock is permitted; timeout cannot kill a hostile
// operation. A terminal timeout is UNKNOWN COMMIT, never automatic retry.
function boundedWait(stage, call, durationMs, controller){
 let timer;
 const outcome=Promise.resolve().then(call);
 const timeout=new Promise((_,reject)=>{
  timer=setTimeout(()=>{
   if(controller)controller.abort();
   reject(new GateDenied(stage==='TERMINAL'?'TERMINAL_COMMIT_OUTCOME_UNKNOWN_RECONCILE':
     stage==='OPERATION'?'MOCK_OPERATION_TIMEOUT':'PREFLIGHT_TIMEOUT'));
  },durationMs);
 });
 return Promise.race([outcome,timeout]).finally(()=>clearTimeout(timer));
}
function validateBudget(options){
 if(!plain(options)||Object.keys(options).some(k=>!['preflightTimeoutMs','operationTimeoutMs','terminalTimeoutMs'].includes(k)))
  deny('BOUNDED_OPTIONS_REQUIRED');
 for(const k of Object.keys(options)){
  if(!has(Object.getOwnPropertyDescriptor(options,k),'value'))deny('BOUNDED_OPTIONS_DATA_ONLY_REQUIRED');
 }
 const config={preflightTimeoutMs:3000,operationTimeoutMs:3000,terminalTimeoutMs:3000,...options};
 for(const k of Object.keys(config))if(!Number.isSafeInteger(config[k])||config[k]<1||config[k]>10000)
  deny('INVALID_TIMEOUT_'+k.toUpperCase());
 return Object.freeze(config);
}
function createApprovalStopMiddleware(deps, options={}){
 if(!plain(deps)||REQUIRED.some(k=>{
  const d=Object.getOwnPropertyDescriptor(deps,k);
  return !d||!has(d,'value')||typeof d.value!=='function';
 }))deny('REQUIRED_TRUSTED_HOST_PORT_MISSING');
 const budget=validateBudget(options);
 async function revalidate(t, controller){
  const snap=await boundedWait('PREFLIGHT',()=>deps.readAuthority(t),budget.preflightTimeoutMs,controller);checkAuthority(snap,t);
  const clock=assertClock(deps.nowMs);
  checkGrant(await boundedWait('PREFLIGHT',()=>deps.verifyApproval(t,snap),budget.preflightTimeoutMs,controller),t,snap,clock);
  const lease=await boundedWait('PREFLIGHT',()=>deps.assertLease(t,snap),budget.preflightTimeoutMs,controller);
  checkLease(lease,t);
  if(lease.expiresAtMs<=clock)deny('LEASE_EXPIRED');
  return {stopRevision:snap.stop.revision,lease};
 }
 return Object.freeze({
  async run(task,operation){
   const t=assertSafeTask(task);if(typeof operation!=='function')deny('MISSING_MOCK_OPERATION');
   await revalidate(t);
   const controller=new AbortController();let unsub;let subscribed=false;
   try {
    // A promise-returning subscription cannot safely cancel after an admission
    // timeout; enforce synchronous installation and synchronous unsubscribe.
    unsub=deps.subscribeStop(t,event=>{
      if(!exact(event,['active','revision'])||event.active!==false||!Number.isSafeInteger(event.revision)||event.revision!==t.stopRevision)controller.abort();
    });
    if(typeof unsub!=='function')deny('STOP_SUBSCRIPTION_MISSING');subscribed=true;
    await revalidate(t,controller);if(controller.signal.aborted)deny('STOP_DURING_PREFLIGHT');
    const result=await boundedWait('OPERATION',()=>operation({task:t,signal:controller.signal}),budget.operationTimeoutMs,controller);
    if(controller.signal.aborted)deny('STOP_DURING_WORK');
    await revalidate(t,controller);if(controller.signal.aborted)deny('STOP_BEFORE_TERMINAL');
    const resultSha256=stableSha(result);
    let committed;
    try { committed=await boundedWait('TERMINAL',()=>deps.commitTerminal({taskId:t.taskId,tenantId:t.tenantId,workerId:t.workerId,
      leaseId:t.leaseId,attemptId:t.attemptId,fence:t.fence,stopRevision:t.stopRevision,
      resultSha256,operation:t.operation,condition:'ATOMIC_STOP_LEASE_COMPARE_AND_SET'}),budget.terminalTimeoutMs,controller); }
    catch (_) { deny('TERMINAL_COMMIT_OUTCOME_UNKNOWN_RECONCILE'); }
    if(!exact(committed,['committed','receiptId','resultSha256','stopRevision','fence'])||committed.committed!==true ||
       !ID.test(committed.receiptId) || committed.resultSha256!==resultSha256 || committed.stopRevision!==t.stopRevision || committed.fence!==t.fence)
       deny('TERMINAL_ATOMIC_COMMIT_REJECTED');
    if(controller.signal.aborted)deny('STOP_AFTER_COMMIT_UNKNOWN_OUTCOME');
    return Object.freeze({status:'HOST_ATOMIC_COMMIT_CLAIMED_NOT_INDEPENDENTLY_ATTESTED',
      receiptId:committed.receiptId,resultSha256,stopRevision:t.stopRevision,fence:t.fence,
      realWorkerAckVerified:false,autonomousLoopsCertified:0});
   } finally {controller.abort();if(subscribed) { try{await unsub();}catch{} }}
  }
 });
}
module.exports={createApprovalStopMiddleware,GateDenied,assertSafeTask,stableSha};
