'use strict';
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const os=require('node:os');const {buildPreview,fixedInputs,PAGE_SHA}=require('./local_preview_build.cjs');const {verify,OUTPUT_NAME}=require('./preview_custody_verify.cjs');
const mk=()=>fs.mkdtempSync(path.join(os.tmpdir(),'v32-c17-readonly-'));
async function run(fn){const root=mk();try{const r=await buildPreview(root,fixedInputs());return await fn(root,r)}finally{fs.rmSync(root,{recursive:true,force:true})}}
async function fail(fn,code){await run(async(root,r)=>{fn(root,r);const out=verify(root);assert.equal(out.integrityVerified,false);assert.equal(out.reason,code);assert.equal(out.releaseAllowed,false)})}
test('01 real C16 local preview byte verification succeeds',()=>run(async(root)=>assert.equal(verify(root).integrityVerified,true)));
test('02 success never authorizes deployment',()=>run(async(root)=>assert.equal(verify(root).releaseAllowed,false)));
test('03 success never certifies worker ACK',()=>run(async(root)=>assert.equal(verify(root).realWorkerAckVerified,false)));
test('04 result has same expected HTML SHA',()=>run(async(root)=>assert.equal(verify(root).htmlSha256,PAGE_SHA)));
test('05 no output directory is blocked',()=>{const root=mk();try{assert.equal(verify(root).reason,'INCOMPLETE_OR_MISSING_PREVIEW')}finally{fs.rmSync(root,{recursive:true,force:true})}});
test('06 missing html blocked',()=>fail((root,r)=>fs.unlinkSync(path.join(r.path,'index.html')),'INCOMPLETE_OR_MISSING_PREVIEW'));
test('07 missing manifest blocked',()=>fail((root,r)=>fs.unlinkSync(path.join(r.path,'manifest.json')),'INCOMPLETE_OR_MISSING_PREVIEW'));
test('08 modified html blocked',()=>fail((root,r)=>fs.writeFileSync(path.join(r.path,'index.html'),'tamper'),'HTML_SHA_MISMATCH'));
test('09 malformed manifest blocked',()=>fail((root,r)=>fs.writeFileSync(path.join(r.path,'manifest.json'),'{oops'),'MALFORMED_MANIFEST'));
test('10 fake receipt rejected',()=>fail((root,r)=>{const p=path.join(r.path,'manifest.json');const m=JSON.parse(fs.readFileSync(p));m.receiptId='RECEIPT-OTHER';fs.writeFileSync(p,JSON.stringify(m))},'MANIFEST_SOURCE_OR_RECEIPT_MISMATCH'));
test('11 changed original blob denied',()=>fail((root,r)=>{const p=path.join(r.path,'manifest.json');const m=JSON.parse(fs.readFileSync(p));m.sourceBlobSha='f'.repeat(40);fs.writeFileSync(p,JSON.stringify(m))},'MANIFEST_SOURCE_OR_RECEIPT_MISMATCH'));
test('12 public allowed field true rejected',()=>fail((root,r)=>{const p=path.join(r.path,'manifest.json');const m=JSON.parse(fs.readFileSync(p));m.publicationAllowed=true;fs.writeFileSync(p,JSON.stringify(m))},'MANIFEST_TRUST_BOUNDARY_VIOLATION'));
test('13 credential/signer status fake rejected',()=>fail((root,r)=>{const p=path.join(r.path,'manifest.json');const m=JSON.parse(fs.readFileSync(p));m.hostAuthority='SIGNED_PLATFORM';fs.writeFileSync(p,JSON.stringify(m))},'MANIFEST_TRUST_BOUNDARY_VIOLATION'));
test('14 forged loops rejected',()=>fail((root,r)=>{const p=path.join(r.path,'manifest.json');const m=JSON.parse(fs.readFileSync(p));m.autonomousLoopsCertified=1;fs.writeFileSync(p,JSON.stringify(m))},'MANIFEST_TRUST_BOUNDARY_VIOLATION'));
test('15 extra manifest field rejected',()=>fail((root,r)=>{const p=path.join(r.path,'manifest.json');const m=JSON.parse(fs.readFileSync(p));m.admin=true;fs.writeFileSync(p,JSON.stringify(m))},'INVALID_MANIFEST_SCHEMA'));
test('16 symlink HTML rejected',()=>run(async(root,r)=>{const p=path.join(r.path,'index.html');fs.unlinkSync(p);fs.symlinkSync(path.join(r.path,'manifest.json'),p);assert.equal(verify(root).reason,'UNSAFE_FILE_OR_SYMLINK')}));
test('17 symlink manifest rejected',()=>run(async(root,r)=>{const p=path.join(r.path,'manifest.json');fs.unlinkSync(p);fs.symlinkSync(path.join(r.path,'index.html'),p);assert.equal(verify(root).reason,'UNSAFE_FILE_OR_SYMLINK')}));
test('18 root symlink refused',()=>run(async(root)=>{const link=root+'-symlink';fs.symlinkSync(root,link);try{assert.equal(verify(link).reason,'ROOT_SYMLINK_OR_NOT_DIRECTORY')}finally{fs.unlinkSync(link)}}));
test('19 output symlink refused',()=>{const root=mk();const target=mk();try{fs.symlinkSync(target,path.join(root,OUTPUT_NAME));assert.equal(verify(root).reason,'OUTPUT_NOT_SAFE_DIRECTORY')}finally{fs.rmSync(root,{recursive:true,force:true});fs.rmSync(target,{recursive:true,force:true})}});
test('20 relative root refused',()=>assert.equal(verify('./relative').reason,'INVALID_ROOT'));
test('21 repeated verification does not modify files',()=>run(async(root,r)=>{const p=path.join(r.path,'index.html'),q=path.join(r.path,'manifest.json');const a=fs.statSync(p).mtimeMs,b=fs.statSync(q).mtimeMs;verify(root);verify(root);assert.equal(fs.statSync(p).mtimeMs,a);assert.equal(fs.statSync(q).mtimeMs,b)}));
test('22 read-only source excludes explicit write/delete operations',()=>{const text=fs.readFileSync(require.resolve('./preview_custody_verify.cjs'),'utf8');assert.equal(/fs\.(?:writeFileSync|unlinkSync|rmSync|mkdirSync|renameSync)/.test(text),false)});
test('23 CLI reads existing build and never rebuilds',()=>run(async(root)=>{const proc=require('node:child_process').spawnSync(process.execPath,['-e',`const x=require(${JSON.stringify(require.resolve('./preview_custody_verify.cjs'))}); process.stdout.write(JSON.stringify(x.verify(${JSON.stringify(root)})))`],{encoding:'utf8',timeout:3000});assert.equal(proc.status,0);assert.equal(JSON.parse(proc.stdout).integrityVerified,true)}));
