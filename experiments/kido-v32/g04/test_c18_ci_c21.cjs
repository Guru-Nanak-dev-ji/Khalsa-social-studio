'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {runOfflineCi,scanSources,PINNED}=require('./offline_ci_runner_c21.cjs');
const SOURCE=__dirname, NAMES=Object.keys(PINNED);
async function sandbox(fn){const output=fs.mkdtempSync(path.join(os.tmpdir(),'v32-g04-c18-out-'));try{return await fn(output)}finally{fs.rmSync(output,{recursive:true,force:true})}}
function copySource(){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'v32-g04-c18-source-'));for(const n of NAMES)fs.copyFileSync(path.join(SOURCE,n),path.join(dir,n));return dir}
test('01 exact source pin check for five modules passes',()=>assert.equal(Object.keys(scanSources().files).length,5));
test('02 combined source digest stable',()=>assert.equal(scanSources().combinedSha256,scanSources().combinedSha256));
test('03 actual local build + read-only recovery passes',()=>sandbox(async root=>assert.equal((await runOfflineCi(root)).status,'LOCAL_MOCK_BUILD_SMOKE_PASS')));
test('04 output confirms 0 public domains',()=>sandbox(async root=>assert.equal((await runOfflineCi(root)).actualPublicDomainsVerified,0)));
test('05 output confirms no real receiver ACK',()=>sandbox(async root=>assert.equal((await runOfflineCi(root)).realWorkerAckVerified,false)));
test('06 output confirms 0 certified loops',()=>sandbox(async root=>assert.equal((await runOfflineCi(root)).independentlyCertifiedAutonomousLoops,0)));
test('07 output confirms no production GO',()=>sandbox(async root=>assert.equal((await runOfflineCi(root)).goForDeployment,false)));
test('08 output confirms no remote provider calls',()=>sandbox(async root=>assert.equal((await runOfflineCi(root)).remoteProvidersCalled,false)));
test('09 repeat CI verifies existing rather than overwrite',()=>sandbox(async root=>{const a=await runOfflineCi(root),b=await runOfflineCi(root);assert.equal(a.htmlSha256,b.htmlSha256);assert.equal(b.buildStatus,'EXISTS_VERIFIED_NO_OVERWRITE')}));
test('10 source SHA mutation is denied',()=>{const dir=copySource();try{fs.appendFileSync(path.join(dir,NAMES[0]),'\n// mutation');assert.throws(()=>scanSources(dir),/SOURCE_PIN_MISMATCH/)}finally{fs.rmSync(dir,{recursive:true,force:true})}});
test('11 source symlink is denied',()=>{const dir=copySource();try{fs.unlinkSync(path.join(dir,NAMES[1]));fs.symlinkSync(path.join(SOURCE,NAMES[1]),path.join(dir,NAMES[1]));assert.throws(()=>scanSources(dir),/SOURCE_NOT_REGULAR/)}finally{fs.rmSync(dir,{recursive:true,force:true})}});
test('12 missing source file denies',()=>{const dir=copySource();try{fs.unlinkSync(path.join(dir,NAMES[2]));assert.throws(()=>scanSources(dir),e=>e.code==='ENOENT')}finally{fs.rmSync(dir,{recursive:true,force:true})}});
test('13 relative source dir denies',()=>assert.throws(()=>scanSources('relative'),/SOURCE_ROOT_ABSOLUTE_REQUIRED/));
test('14 symlink source root denies',()=>{const dir=copySource(),link=dir+'-link';try{fs.symlinkSync(dir,link);assert.throws(()=>scanSources(link),/SOURCE_ROOT_UNTRUSTED/)}finally{fs.unlinkSync(link);fs.rmSync(dir,{recursive:true,force:true})}});
test('15 tampered HTML subsequent CI fails',()=>sandbox(async root=>{const first=await runOfflineCi(root);const target=path.join(root,'kido-v32-c16-'+first.htmlSha256.slice(0,16),'index.html');fs.writeFileSync(target,'tampered');await assert.rejects(()=>runOfflineCi(root),/EXISTING_PREVIEW_HASH_OR_RECEIPT_CONFLICT/)}));
test('16 missing manifest next CI fails without recreate',()=>sandbox(async root=>{const f=await runOfflineCi(root);fs.unlinkSync(path.join(root,'kido-v32-c16-'+f.htmlSha256.slice(0,16),'manifest.json'));await assert.rejects(()=>runOfflineCi(root),/ENOENT/)}));
test('17 source pin rejection leaves no output artifacts',()=>sandbox(async root=>{const dir=copySource();try{fs.appendFileSync(path.join(dir,NAMES[3]),'\n');await assert.rejects(()=>runOfflineCi(root,dir),/SOURCE_PIN_MISMATCH/);assert.equal(fs.readdirSync(root).length,0)}finally{fs.rmSync(dir,{recursive:true,force:true})}}));
test('18 no Git push, cloud provider or terminal shell in module',()=>{const s=fs.readFileSync(require.resolve('./offline_ci_runner_c21.cjs'),'utf8');for(const pat of ["require('node:http')","require('node:https')","require('node:child_process')","fetch(","exec("])assert.equal(s.includes(pat),false)});
test('19 source tree digest is real 64 hex',()=>assert.match(scanSources().combinedSha256,/^[a-f0-9]{64}$/));
test('20 CI rejects untrusted source path before preview',()=>sandbox(async root=>assert.rejects(()=>runOfflineCi(root,'/path/not/exists'),/ENOENT/)));
