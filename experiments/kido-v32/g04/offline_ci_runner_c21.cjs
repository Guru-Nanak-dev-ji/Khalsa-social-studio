'use strict';
/** V32 S1-GPT04 C18: bounded offline CI smoke for existing C14/C15/C16/C17.
 * Proves local build and custody on pinned test files, NOT public release or ACK.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {buildPreview,fixedInputs}=require('./local_preview_build_c21.cjs');
const {verify}=require('./preview_custody_verify_c21.cjs');
const PINNED=Object.freeze({
 'approval_stop_middleware_c20.cjs':'5e156f116d8bd1d1f4b9c70fc1242d8e6d56613db768f04258d9dd728e053e47',
 'legacy_main_mock_adapter_c21.cjs':'e8bc766bf5738ec519f5dff7623fd3837d6ce55cef3acd8e8ef4f8f28b85eca7',
 'mock_build_adapter.cjs':'3146a5150c8d07be3dddd977cbe9e3e0b151559114b6934afe5a3541dad8087f',
 'local_preview_build_c21.cjs':'5ec77889ffe96853ba4c9bb49831773a5544e58510710e53264459cef235d805',
 'preview_custody_verify_c21.cjs':'52bef8ea1b9a583664e7e31ea9e83cbb790d9998d226cf3a2a31f973d086961a'
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
 const root=path.join(__dirname,'local-preview-output-c21');
 if(!fs.existsSync(root))fs.mkdirSync(root,{mode:0o700});
 runOfflineCi(root).then(result=>{process.stdout.write(JSON.stringify(result,null,2)+'\n')},e=>{console.error(e.code||e.message);process.exitCode=2});
}
