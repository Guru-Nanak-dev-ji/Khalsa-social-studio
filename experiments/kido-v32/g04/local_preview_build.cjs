'use strict';
/** V32/G04 C16: offline deterministic HTML preview AFTER C14 authorization seam.
 * No provider, no network, no live domain, no original main.cjs import.
 * A local fixture host is NOT authenticated authority. Never treat its receipts
 * as platform ACK, qualified sandbox or permission to deploy.
 */
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');
const {createApprovalStopMiddleware,stableSha}=require('./approval_stop_middleware_c14.cjs');
const {createMockLifecycleSeam,LEGACY_REPO,LEGACY_COMMIT,LEGACY_FILE,LEGACY_BLOB_SHA,mapLegacyTask}=require('./legacy_main_mock_adapter.cjs');
const {operation,PAGE}=require('./mock_build_adapter.cjs');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const PAGE_SHA=hash(PAGE);
function fixedInputs(){
 const legacy={id:'t-v32-c16-001',status:'QUEUED',requestCount:0,prompt:'FIXED_LOCAL_FIXTURE'};
 const host={sourceRepo:LEGACY_REPO,sourceCommit:LEGACY_COMMIT,sourcePath:LEGACY_FILE,sourceBlobSha:LEGACY_BLOB_SHA,activeTaskId:legacy.id,tenantId:'TENANT-LOCAL',workerId:'S1-GPT04',attemptId:'ATTEMPT-C16-001',leaseId:'LEASE-C16-001',approvalId:'APPROVAL-C16-001',sourceSha256:'a'.repeat(64),inputSha256:'b'.repeat(64),fence:1,stopRevision:0};
 return {legacy,host};
}
function mockAuthorityPorts(task){
 const auth=()=>({stop:{active:false,revision:task.stopRevision},issuers:{'ISSUER-LOCAL':{keyId:'KEY-LOCAL',enabled:true}},tenantId:task.tenantId,scope:task.scope,workerId:task.workerId});
 const grant=()=>({verified:true,issuerId:'ISSUER-LOCAL',issuerKeyId:'KEY-LOCAL',tenantId:task.tenantId,workerId:task.workerId,taskId:task.taskId,approvalId:task.approvalId,scope:task.scope,provider:task.provider,operation:task.operation,sourceSha256:task.sourceSha256,inputSha256:task.inputSha256,stopRevision:task.stopRevision,expiresAtMs:5000});
 const lease=()=>({valid:true,taskId:task.taskId,workerId:task.workerId,tenantId:task.tenantId,leaseId:task.leaseId,attemptId:task.attemptId,fence:task.fence,stopRevision:task.stopRevision,expiresAtMs:5000});
 return Object.freeze({readAuthority:async()=>auth(),verifyApproval:async()=>grant(),assertLease:async()=>lease(),subscribeStop:()=>()=>{},nowMs:()=>1000,commitTerminal:async r=>({committed:true,receiptId:'RECEIPT-LOCAL-C16',resultSha256:r.resultSha256,stopRevision:r.stopRevision,fence:r.fence})});
}
function directory(root){
 if(typeof root!=='string'||!path.isAbsolute(root)||root.includes('\0'))throw Error('ABSOLUTE_TRUSTED_PREVIEW_ROOT_REQUIRED');
 const st=fs.lstatSync(root);
 if(st.isSymbolicLink()||!st.isDirectory())throw Error('ROOT_SYMLINK_OR_NOT_DIR');
 return fs.realpathSync(root);
}
function exactFile(p){
 const stat=fs.lstatSync(p);
 if(!stat.isFile()||stat.isSymbolicLink()||stat.size>100000)throw Error('PREVIEW_FILE_UNSAFE');
 return fs.readFileSync(p);
}
function verifyExisting(dir,receipt){
 const stat=fs.lstatSync(dir);if(stat.isSymbolicLink()||!stat.isDirectory())throw Error('EXISTING_OUTPUT_NOT_DIR');
 const body=exactFile(path.join(dir,'index.html'));
 const m=JSON.parse(exactFile(path.join(dir,'manifest.json')).toString('utf8'));
 if(body.toString('utf8')!==PAGE||hash(body)!==PAGE_SHA||m.schema!=='KDN-V32-LOCAL-PREVIEW-C16'||m.htmlSha256!==PAGE_SHA||m.receiptId!==receipt.receiptId||m.publicationAllowed!==false||m.autonomousLoopsCertified!==0)throw Error('EXISTING_PREVIEW_HASH_OR_RECEIPT_CONFLICT');
 return {status:'EXISTS_VERIFIED_NO_OVERWRITE',path:dir,htmlSha256:PAGE_SHA,publicDomainLive:false,autonomousLoopsCertified:0};
}
async function buildPreview(root,{legacy,host,ports}={}){
 const targetRoot=directory(root);
 if(!legacy||!host)throw Error('LEGACY_AND_HOST_INPUT_REQUIRED');
 const mapped=mapLegacyTask(legacy,host);
 const callbacks=ports||mockAuthorityPorts(mapped.task);
 const middleware=createApprovalStopMiddleware(callbacks,{preflightTimeoutMs:1000,operationTimeoutMs:1000,terminalTimeoutMs:1000});
 const receipt=(await createMockLifecycleSeam(middleware,{operation}).runSelected(legacy,host)).receipt;
 if(receipt.autonomousLoopsCertified!==0||receipt.realWorkerAckVerified!==false)throw Error('MOCK_RECEIPT_SCOPE_VIOLATION');
 const local=operation({task:mapped.task,signal:{aborted:false}});
 if(local.html!==PAGE||local.htmlSha256!==PAGE_SHA||receipt.resultSha256!==stableSha(local))throw Error('RECEIPT_RESULT_MISMATCH');
 // Recheck current mock STOP/lease immediately before a local write, without
 // representing this as a production atomic cross-process transaction.
 const a=await callbacks.readAuthority(mapped.task);const l=await callbacks.assertLease(mapped.task,a);
 if(a?.stop?.active!==false||a.stop.revision!==mapped.task.stopRevision||l?.valid!==true||l.fence!==mapped.task.fence||l.expiresAtMs<=callbacks.nowMs())throw Error('STOP_OR_LEASE_BEFORE_PREVIEW_WRITE');
 const dest=path.join(targetRoot,'kido-v32-c16-'+PAGE_SHA.slice(0,16));
 if(fs.existsSync(dest))return verifyExisting(dest,receipt);
 // Exclusive new directory; every file created with wx and mode 0600.
 // Partial output lacks manifest and cannot be accepted by verifyExisting.
 fs.mkdirSync(dest,{mode:0o700});
 const manifest={schema:'KDN-V32-LOCAL-PREVIEW-C16',htmlSha256:PAGE_SHA,receiptId:receipt.receiptId,legacyId:legacy.id,sourceBlobSha:LEGACY_BLOB_SHA,publicationAllowed:false,publicDomainLive:false,autonomousLoopsCertified:0,hostAuthority:'SYNTHETIC_ONLY'};
 fs.writeFileSync(path.join(dest,'index.html'),PAGE,{flag:'wx',mode:0o600});
 fs.writeFileSync(path.join(dest,'manifest.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx',mode:0o600});
 return {status:'BUILT_LOCAL_PREVIEW',path:dest,htmlSha256:PAGE_SHA,publicDomainLive:false,autonomousLoopsCertified:0};
}
module.exports={buildPreview,fixedInputs,mockAuthorityPorts,PAGE_SHA,verifyExisting};
if(require.main===module){
 const root=path.join(__dirname,'local-preview-output');
 if(!fs.existsSync(root))fs.mkdirSync(root,{mode:0o700});
 buildPreview(root,{...fixedInputs()}).then(r=>{process.stdout.write(JSON.stringify(r)+'\n')},e=>{console.error(e.code||e.message);process.exitCode=2});
}
