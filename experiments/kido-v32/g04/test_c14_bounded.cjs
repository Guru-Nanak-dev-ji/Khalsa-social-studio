'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createApprovalStopMiddleware,GateDenied}=require('./approval_stop_middleware_c14.cjs');
const {operation,PAGE}=require('./mock_build_adapter.cjs');
const sha='a'.repeat(64);
function fixture(){
 const task={taskId:'TASK-014',tenantId:'TENANT-TEST',workerId:'S1-GPT04',sourceSha256:sha,inputSha256:'b'.repeat(64),operation:'MOCK_STATIC_BUILD_TEST',scope:'GREEN_MOCK_ONLY',provider:'MOCK_LOCAL',attemptId:'ATTEMPT-014',leaseId:'LEASE-014',fence:1,stopRevision:0,approvalId:'APPROVAL-014'};
 const state={now:100,stopped:false,rev:0,ops:0,commits:0,unsubs:0,onStop:null,receipt:null};
 const ports={
  async readAuthority(){return {stop:{active:state.stopped,revision:state.rev},issuers:{'ISSUER-TEST':{keyId:'KEY-TEST',enabled:true}},tenantId:task.tenantId,scope:task.scope,workerId:task.workerId}},
  async verifyApproval(){return {verified:true,issuerId:'ISSUER-TEST',issuerKeyId:'KEY-TEST',tenantId:task.tenantId,workerId:task.workerId,taskId:task.taskId,approvalId:task.approvalId,scope:task.scope,provider:task.provider,operation:task.operation,sourceSha256:task.sourceSha256,inputSha256:task.inputSha256,stopRevision:task.stopRevision,expiresAtMs:7000}},
  async assertLease(){return {valid:true,taskId:task.taskId,workerId:task.workerId,tenantId:task.tenantId,leaseId:task.leaseId,attemptId:task.attemptId,fence:task.fence,stopRevision:task.stopRevision,expiresAtMs:7000}},
  subscribeStop(_task,cb){state.onStop=cb;return ()=>{state.unsubs++;state.onStop=null}},
  nowMs(){return state.now},
  async commitTerminal(r){state.commits++;if(state.stopped)return {committed:false,receiptId:'RECEIPT-FAILED',resultSha256:r.resultSha256,stopRevision:state.rev,fence:r.fence};if(!state.receipt)state.receipt={committed:true,receiptId:'RECEIPT-014',resultSha256:r.resultSha256,stopRevision:r.stopRevision,fence:r.fence};return state.receipt}
 };
 const timeouts={preflightTimeoutMs:40,operationTimeoutMs:40,terminalTimeoutMs:40};
 const run=(work=operation,options=timeouts)=>createApprovalStopMiddleware(ports,options).run(task,async(v)=>{state.ops++;return work(v)});
 const stop=()=>{state.stopped=true;state.rev++;state.onStop?.({active:true,revision:state.rev})};
 return {task,state,ports,run,stop,timeouts};
}
async function code(fn,expected){await assert.rejects(fn,e=>e instanceof GateDenied&&e.code===expected)}
const never=()=>new Promise(()=>{});
test('01 integrated C11->C12 deterministic HTML receipt',async()=>{const f=fixture();const out=await f.run();assert.equal(out.autonomousLoopsCertified,0);assert.equal(f.state.commits,1);assert.equal(f.state.unsubs,1);assert.equal(out.realWorkerAckVerified,false)});
test('02 no duplicate terminal commit from same result',async()=>{const f=fixture();await f.run();await f.run();assert.equal(f.state.commits,2);assert.equal(f.state.receipt.receiptId,'RECEIPT-014')});
test('03 slow first authority read timed out with no operation',async()=>{const f=fixture();f.ports.readAuthority=never;await code(()=>f.run(),'PREFLIGHT_TIMEOUT');assert.equal(f.state.ops,0);assert.equal(f.state.commits,0)});
test('04 slow approval verification timed out with no operation',async()=>{const f=fixture();f.ports.verifyApproval=never;await code(()=>f.run(),'PREFLIGHT_TIMEOUT');assert.equal(f.state.ops,0)});
test('05 slow lease validation timed out with no operation',async()=>{const f=fixture();f.ports.assertLease=never;await code(()=>f.run(),'PREFLIGHT_TIMEOUT');assert.equal(f.state.ops,0)});
test('06 slow operation timed out and never committed',async()=>{const f=fixture();await code(()=>f.run(never),'MOCK_OPERATION_TIMEOUT');assert.equal(f.state.commits,0);assert.equal(f.state.unsubs,1)});
test('07 operation cancellation signal aborts on timeout',async()=>{const f=fixture();let signal;await code(()=>f.run(({signal:s})=>{signal=s;return never()}),'MOCK_OPERATION_TIMEOUT');assert.equal(signal.aborted,true)});
test('08 cooperative operation notified of abort',async()=>{const f=fixture();let aborted=false;await code(()=>f.run(({signal})=>new Promise(resolve=>signal.addEventListener('abort',()=>{aborted=true;resolve({ok:true})},{once:true}))),'MOCK_OPERATION_TIMEOUT');assert.equal(aborted,true);assert.equal(f.state.commits,0)});
test('09 stop installed during registration blocks before operation',async()=>{const f=fixture();f.ports.subscribeStop=(_t,onStop)=>{onStop({active:true,revision:1});return ()=>{f.state.unsubs++}};await code(()=>f.run(),'STOP_DURING_PREFLIGHT');assert.equal(f.state.ops,0)});
test('10 stop during operation denies commit',async()=>{const f=fixture();await code(()=>f.run(async()=>{f.stop();return {ok:true}}),'STOP_DURING_WORK');assert.equal(f.state.commits,0)});
test('11 subscription must install synchronously',async()=>{const f=fixture();f.ports.subscribeStop=async()=>()=>{};await code(()=>f.run(),'STOP_SUBSCRIPTION_MISSING');assert.equal(f.state.commits,0)});
test('12 subscription missing refusal',async()=>{const f=fixture();f.ports.subscribeStop=()=>undefined;await code(()=>f.run(),'STOP_SUBSCRIPTION_MISSING')});
test('13 terminal commit hangs; unknown outcome not success',async()=>{const f=fixture();f.ports.commitTerminal=never;await code(()=>f.run(),'TERMINAL_COMMIT_OUTCOME_UNKNOWN_RECONCILE');assert.equal(f.state.unsubs,1)});
test('14 terminal throws; unknown outcome not success',async()=>{const f=fixture();f.ports.commitTerminal=()=>{throw new Error('lost');};await code(()=>f.run(),'TERMINAL_COMMIT_OUTCOME_UNKNOWN_RECONCILE')});
test('15 terminal says false deny',async()=>{const f=fixture();f.ports.commitTerminal=async r=>({committed:false,receiptId:'RECEIPT-NO',resultSha256:r.resultSha256,stopRevision:r.stopRevision,fence:r.fence});await code(()=>f.run(),'TERMINAL_ATOMIC_COMMIT_REJECTED')});
test('16 options negative timeout deny',()=>{const f=fixture();assert.throws(()=>createApprovalStopMiddleware(f.ports,{operationTimeoutMs:-1}),e=>e.code==='INVALID_TIMEOUT_OPERATIONTIMEOUTMS')});
test('17 options excessively large timeout deny',()=>{const f=fixture();assert.throws(()=>createApprovalStopMiddleware(f.ports,{terminalTimeoutMs:20000}),e=>e.code==='INVALID_TIMEOUT_TERMINALTIMEOUTMS')});
test('18 options extra key deny',()=>{const f=fixture();assert.throws(()=>createApprovalStopMiddleware(f.ports,{allowPaid:true}),e=>e.code==='BOUNDED_OPTIONS_REQUIRED')});
test('19 preexisting stop denies without run',async()=>{const f=fixture();f.stop();await code(()=>f.run(),'STOP_ACTIVE_OR_STALE');assert.equal(f.state.ops,0)});
test('20 stale lease precondition denies',async()=>{const f=fixture();f.ports.assertLease=async()=>({valid:false,taskId:f.task.taskId,workerId:f.task.workerId,tenantId:f.task.tenantId,leaseId:f.task.leaseId,attemptId:f.task.attemptId,fence:f.task.fence,stopRevision:0,expiresAtMs:7000});await code(()=>f.run(),'LEASE_NOT_ATOMICALLY_CURRENT')});
test('21 host preflight wrong issuer key denies',async()=>{const f=fixture();const o=f.ports.verifyApproval;f.ports.verifyApproval=async()=>({...await o(),issuerKeyId:'KEY-OTHER'});await code(()=>f.run(),'ISSUER_TO_KEY_BINDING_FAILED')});
test('22 host preflight task scope rejects paid',async()=>{const f=fixture();f.task.provider='PAID_REMOTE';await code(()=>f.run(),'FORBIDDEN_SCOPE_PROVIDER_OR_OPERATION')});
test('23 result output scope permits only local deterministic mock',async()=>{const f=fixture();assert.equal((await f.run()).realWorkerAckVerified,false);assert.ok(PAGE.includes('viewport'))});
