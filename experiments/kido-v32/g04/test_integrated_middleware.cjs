'use strict';
const {test}=require('node:test');const assert=require('node:assert/strict');
const {createApprovalStopMiddleware,GateDenied,stableSha}=require('./approval_stop_middleware.cjs');
const {createRunner,operation,PAGE}=require('./mock_build_adapter.cjs');
const {createMockHost,baseTask}=require('./mock_host_ports.cjs');
const run=(host)=>createRunner(createApprovalStopMiddleware(host.ports)).runTask(host.task);
const fails=async(fn,code)=>assert.rejects(fn,e=>e instanceof GateDenied&&e.code===code);

test('C13-01 combined C11+C12 host port returns receipt with deterministic digest',async()=>{
 const h=createMockHost();let result=await run(h);
 assert.match(result.receiptId,/RECEIPT-LOCAL/);assert.equal(result.autonomousLoopsCertified,0);
 assert.equal(result.realWorkerAckVerified,false);assert.equal(h.state.receiptWrites,1);
 assert.equal(h.state.listenerCount,0);
});
test('C13-02 same mock task retry returns same receipt not second terminal write',async()=>{const h=createMockHost();const a=await run(h),b=await run(h);assert.equal(a.receiptId,b.receiptId);assert.equal(h.state.receiptWrites,1)});
test('C13-03 rejects revoked STOP before run',async()=>{let h=createMockHost();h.stop();await fails(()=>run(h),'STOP_ACTIVE_OR_STALE')});
test('C13-04 rejects STOP stale snapshot after resume',async()=>{let h=createMockHost();h.stop();h.resume();await fails(()=>run(h),'STOP_ACTIVE_OR_STALE')});
test('C13-05 grant expiry rejects',async()=>{let h=createMockHost();h.moveTime(5000);await fails(()=>run(h),'GRANT_EXPIRED_OR_TOO_LONG')});
test('C13-06 expired lease rejects',async()=>{let h=createMockHost();h.setLeaseOverride(()=>({valid:true,taskId:h.task.taskId,workerId:h.task.workerId,tenantId:h.task.tenantId,leaseId:h.task.leaseId,attemptId:h.task.attemptId,fence:h.task.fence,stopRevision:h.task.stopRevision,expiresAtMs:999}));await fails(()=>run(h),'LEASE_EXPIRED')});
test('C13-07 revoked lease rejects',async()=>{let h=createMockHost();h.revokeLease();await fails(()=>run(h),'LEASE_NOT_ATOMICALLY_CURRENT')});
test('C13-08 disabled issuer rejects',async()=>{let h=createMockHost();h.disableIssuer();await fails(()=>run(h),'ISSUER_TO_KEY_BINDING_FAILED')});
test('C13-09 issuer rotation with spoofed old grant rejects',async()=>{let h=createMockHost();h.setGrantOverride(()=>({...baseGrant(h),issuerKeyId:'KEY-TEST'}));h.rotateIssuer();await fails(()=>run(h),'ISSUER_TO_KEY_BINDING_FAILED')});
test('C13-10 paid provider before host operation is denied',async()=>{let h=createMockHost(baseTask({provider:'OPENAI_PAID'}));await fails(()=>run(h),'FORBIDDEN_SCOPE_PROVIDER_OR_OPERATION')});
test('C13-11 arbitrary shell operation denied',async()=>{let h=createMockHost(baseTask({operation:'SHELL_EXEC'}));await fails(()=>run(h),'FORBIDDEN_SCOPE_PROVIDER_OR_OPERATION')});
test('C13-12 public release scope denied',async()=>{let h=createMockHost(baseTask({scope:'PRODUCTION'}));await fails(()=>run(h),'FORBIDDEN_SCOPE_PROVIDER_OR_OPERATION')});
test('C13-13 all listener subscriptions cleaned after error',async()=>{let h=createMockHost();const middleware=createApprovalStopMiddleware(h.ports);await fails(()=>middleware.run(h.task,async()=>{throw new GateDenied('MOCK_OPERATION_FAIL')}),'MOCK_OPERATION_FAIL');assert.equal(h.state.listenerCount,0)});
test('C13-14 no real connected Room ACK from in-memory host',async()=>{let h=createMockHost();assert.equal((await run(h)).realWorkerAckVerified,false)});
test('C13-15 actual deterministic HTML valid independent of result receipt',()=>{const r=operation({task:baseTask(),signal:{aborted:false}});assert.match(r.html,/viewport/);assert.equal(r.html,PAGE);assert.match(r.htmlSha256,/^[a-f0-9]{64}$/)});
test('C13-16 reject STOP during asynchronous build before terminal',async()=>{
 const h=createMockHost();let started;const ready=new Promise(resolve=>started=resolve);
 const mw=createApprovalStopMiddleware(h.ports);
 const p=mw.run(h.task,async()=>{started();await Promise.resolve();h.stop();return operation({task:h.task,signal:{aborted:false}})});
 await ready;await fails(()=>p,'STOP_DURING_WORK');assert.equal(h.state.receiptWrites,0);
});
test('C13-17 STOP between build and commit denies',async()=>{
 let h=createMockHost();const original=h.ports.commitTerminal;h.ports.commitTerminal=async receipt=>{h.stop();return original(receipt)};
 await fails(()=>run(h),'TERMINAL_ATOMIC_COMMIT_REJECTED');assert.equal(h.state.receiptWrites,0);
});
test('C13-18 terminal unknown outcome never accepted',async()=>{
 let h=createMockHost();h.ports.commitTerminal=async()=>{throw new Error('network lost AFTER commit maybe')};
 await fails(()=>run(h),'TERMINAL_COMMIT_OUTCOME_UNKNOWN_RECONCILE')
});
test('C13-19 callback grant verification missing never calls operation',async()=>{
 let h=createMockHost();h.setVerifyResult(false);await fails(()=>run(h),'GRANT_NOT_VERIFIED_BY_HOST');assert.equal(h.state.receiptWrites,0)
});
test('C13-20 result builder consistency SHA is deterministic',()=>{
 let result=operation({task:baseTask(),signal:{aborted:false}});assert.equal(stableSha(result),stableSha(result));
});
function baseGrant(h){return {verified:true,issuerId:'ISSUER-TEST',issuerKeyId:'KEY-TEST',tenantId:h.task.tenantId,workerId:h.task.workerId,taskId:h.task.taskId,approvalId:h.task.approvalId,scope:h.task.scope,provider:h.task.provider,operation:h.task.operation,sourceSha256:h.task.sourceSha256,inputSha256:h.task.inputSha256,stopRevision:h.task.stopRevision,expiresAtMs:6000}}
