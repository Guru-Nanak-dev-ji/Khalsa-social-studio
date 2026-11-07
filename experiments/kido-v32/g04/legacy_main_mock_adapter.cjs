'use strict';
/** KDN V32 S1-GPT04 C15 — pure, source-pinned legacy main.cjs task -> C14 envelope.
 * No imports of legacy main.cjs/providers.cjs; NO queue or provider calls.
 * Referenced historical Git blob is NOT the live phone's attested source.
 */
const {assertSafeTask}=require('./approval_stop_middleware_c14.cjs');
const LEGACY_REPO='Guru-Nanak-dev-ji/Khalsa-social-studio';
const LEGACY_COMMIT='b7a64d0c0afc9c17aeb25e8ee7c078d2c29e9f62';
const LEGACY_FILE='kido-releases/navigation-v1/src/main.cjs';
const LEGACY_BLOB_SHA='32cdb35d06c104f1556bd3eaba8b256165aee4d5';
const ID=/^t-[a-z0-9-]{5,80}$/;
const SHA=/^[a-f0-9]{64}$/;
const IDENT=/^[A-Za-z][A-Za-z0-9._:-]{2,95}$/;
const own=(obj,k)=>Object.prototype.hasOwnProperty.call(obj,k);
function plain(x){return x!==null&&typeof x==='object'&&Object.getPrototypeOf(x)===Object.prototype;}
function shape(x,keys){return plain(x)&&Object.keys(x).length===keys.length&&keys.every(k=>own(x,k)&&own(Object.getOwnPropertyDescriptors(x),k)&&own(Object.getOwnPropertyDescriptor(x,k),'value'));}
class LegacyBoundaryDenied extends Error{constructor(code){super(code);this.name='LegacyBoundaryDenied';this.code=code}}
function fail(s){throw new LegacyBoundaryDenied(s)}
function mapLegacyTask(legacy,host){
 // Compatibility with historic KidoApp.submit and pump; adapter is invoked by
 // explicit trusted caller BEFORE any provider network work, NOT old runTask.
 if(!plain(legacy)||!['id','status','requestCount'].every(k=>own(legacy,k)&&own(Object.getOwnPropertyDescriptor(legacy,k),'value')))fail('LEGACY_TASK_SHAPE');
 if(typeof legacy.id!=='string'||!ID.test(legacy.id)||!['QUEUED','RUNNING'].includes(legacy.status)||legacy.requestCount!==0)fail('LEGACY_NOT_PRISTINE_SELECTED_TASK');
 const keys=['sourceRepo','sourceCommit','sourcePath','sourceBlobSha','activeTaskId','tenantId','workerId','attemptId','leaseId','approvalId','sourceSha256','inputSha256','fence','stopRevision'];
 if(!shape(host,keys))fail('UNTRUSTED_HOST_BINDING_SCHEMA');
 if(host.sourceRepo!==LEGACY_REPO||host.sourceCommit!==LEGACY_COMMIT||host.sourcePath!==LEGACY_FILE||host.sourceBlobSha!==LEGACY_BLOB_SHA)fail('HISTORICAL_SOURCE_NOT_PINNED');
 if(host.activeTaskId!==legacy.id)fail('LEGACY_ACTIVE_SELECTION_MISMATCH');
 for(const k of ['tenantId','workerId','attemptId','leaseId','approvalId'])if(typeof host[k]!=='string'||!IDENT.test(host[k]))fail('INVALID_HOST_'+k.toUpperCase());
 for(const k of ['sourceSha256','inputSha256'])if(typeof host[k]!=='string'||!SHA.test(host[k]))fail('INVALID_HOST_'+k.toUpperCase());
 if(!Number.isSafeInteger(host.fence)||host.fence<=0||!Number.isSafeInteger(host.stopRevision)||host.stopRevision<0)fail('INVALID_HOST_FENCE_STOP');
 const task=assertSafeTask({
  taskId:'LEGACY-'+legacy.id,tenantId:host.tenantId,workerId:host.workerId,
  sourceSha256:host.sourceSha256,inputSha256:host.inputSha256,
  operation:'MOCK_STATIC_BUILD_TEST',scope:'GREEN_MOCK_ONLY',provider:'MOCK_LOCAL',
  attemptId:host.attemptId,leaseId:host.leaseId,fence:host.fence,stopRevision:host.stopRevision,approvalId:host.approvalId
 });
 return Object.freeze({task,legacyId:legacy.id,sourceBlobSha:LEGACY_BLOB_SHA,
  status:'PROPOSED_LOCAL_MOCK_ADAPTER_ONLY',originalLiveSourceAttested:false,
  registeredReceiverAck:false,autonomousLoopsCertified:0});
}
function createMockLifecycleSeam(middleware,legacyBuild){
 if(!middleware||typeof middleware.run!=='function'||!legacyBuild||typeof legacyBuild.operation!=='function')fail('REQUIRED_BOUNDARY_MODULE_MISSING');
 return Object.freeze({runSelected:async(legacy,host)=>{
  const mapped=mapLegacyTask(legacy,host);
  const receipt=await middleware.run(mapped.task,legacyBuild.operation);
  return Object.freeze({legacyId:mapped.legacyId,receipt,originalLiveSourceAttested:false,autonomousLoopsCertified:0});
 }});
}
module.exports={mapLegacyTask,createMockLifecycleSeam,LegacyBoundaryDenied,LEGACY_BLOB_SHA,LEGACY_COMMIT,LEGACY_FILE,LEGACY_REPO};
