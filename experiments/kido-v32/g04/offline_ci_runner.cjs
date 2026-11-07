'use strict';
/** V32 S1-GPT04 C18: bounded offline CI smoke for existing C14/C15/C16/C17.
 * Proves local build and custody on pinned test files, NOT public release or ACK.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {buildPreview,fixedInputs}=require('./local_preview_build.cjs');
const {verify}=require('./preview_custody_verify.cjs');
const PINNED=Object.freeze({
 'approval_stop_middleware_c14.cjs':'c82f254f527e3c53eb118dde476723516e15530e20c0aa6ee0b126ca330fbec4',
 'legacy_main_mock_adapter.cjs':'daf00c97412eacdfbe2f10ac47c5151d71e9d32904686c448277b4b05836333d',
 'mock_build_adapter.cjs':'3146a5150c8d07be3dddd977cbe9e3e0b151559114b6934afe5a3541dad8087f',
 'local_preview_build.cjs':'082c6c89781623b78a1ff7c8dc38e89e2bc588b284ad3105e1e3e3ec2269c97f',
 'preview_custody_verify.cjs':'49f0f12f891b5265b7770ff504ab48e4656413952473ae3f62b19a8aeaa48306'
});
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
function scanSources(sourceRoot=__dirname){
 if(typeof sourceRoot!=='string'||!path.isAbsolute(sourceRoot))throw Error('SOURCE_ROOT_ABSOLUTE_REQUIRED');
 const st=fs.lstatSync(sourceRoot);if(st.isSymbolicLink()||!st.isDirectory())throw Error('SOURCE_ROOT_UNTRUSTED');
 const files={};
 for(const [file,expected] of Object.entries(PINNED)){
  const loc=path.join(sourceRoot,file),item=fs.lstatSync(loc);
  if(item.isSymbolicLink()||!item.isFile()||item.size>100000)throw Error('SOURCE_NOT_REGULAR_'+file);
  const b=fs.readFileSync(loc),actual=sha(b);
  if(actual!==expected)throw Error('SOURCE_PIN_MISMATCH_'+file);
  files[file]=actual;
 }
 const combined=sha(JSON.stringify(files));
 return Object.freeze({files,combinedSha256:combined});
}
async function runOfflineCi(outputRoot,sourceRoot=__dirname){
 const sources=scanSources(sourceRoot); // Fail closed before creating output.
 const build=await buildPreview(outputRoot,fixedInputs());
 const custody=verify(outputRoot);
 if(!custody.integrityVerified||custody.htmlSha256!==build.htmlSha256)throw Error('LOCAL_CUSTODY_SMOKE_FAILED');
 return Object.freeze({schema:'KDN-V32-G04-C18-LOCAL-CI-1',status:'LOCAL_MOCK_BUILD_SMOKE_PASS',sourceTreeSha256:sources.combinedSha256,
  sourceFiles:sources.files,htmlSha256:build.htmlSha256,buildStatus:build.status,custodyStatus:custody.status,
  actualPublicDomainsVerified:0,realWorkerAckVerified:false,independentlyCertifiedAutonomousLoops:0,
  goForDeployment:false,remoteProvidersCalled:false});
}
module.exports={runOfflineCi,scanSources,PINNED};
if(require.main===module){
 const root=path.join(__dirname,'local-preview-output');
 runOfflineCi(root).then(result=>{process.stdout.write(JSON.stringify(result,null,2)+'\n')},e=>{console.error(e.code||e.message);process.exitCode=2});
}
