'use strict';
/** V32/G04 C17 — READ-ONLY restart-time custody verifier for local mock preview.
 * It never creates, deletes, repairs, dispatches or deploys any file.
 * A PASS verifies local bytes only, not cryptographic worker/host authenticity.
 */
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');
const {PAGE_SHA}=require('./local_preview_build.cjs');
const LEGACY_BLOB='32cdb35d06c104f1556bd3eaba8b256165aee4d5';
const SHA=x=>crypto.createHash('sha256').update(x).digest('hex');
const OUTPUT_NAME='kido-v32-c16-'+PAGE_SHA.slice(0,16);
function deny(reason){return {schema:'KDN-V32-G04-C17-CUSTODY-VERIFY-1',integrityVerified:false,reason,releaseAllowed:false,autonomousLoopsCertified:0,realWorkerAckVerified:false};}
function regularFile(p){
 const st=fs.lstatSync(p);
 if(st.isSymbolicLink()||!st.isFile()||st.size>65536||st.size<1)throw Error('NONREGULAR_OR_OVERSIZE');
 return fs.readFileSync(p);
}
function verify(root){
 if(typeof root!=='string'||!path.isAbsolute(root)||root.includes('\0'))return deny('INVALID_ROOT');
 try{
  const rootStat=fs.lstatSync(root);if(rootStat.isSymbolicLink()||!rootStat.isDirectory())return deny('ROOT_SYMLINK_OR_NOT_DIRECTORY');
  const normalized=fs.realpathSync(root);
  const target=path.join(normalized,OUTPUT_NAME);
  const dirStat=fs.lstatSync(target);if(dirStat.isSymbolicLink()||!dirStat.isDirectory())return deny('OUTPUT_NOT_SAFE_DIRECTORY');
  const html=regularFile(path.join(target,'index.html'));
  if(SHA(html)!==PAGE_SHA)return deny('HTML_SHA_MISMATCH');
  const m=JSON.parse(regularFile(path.join(target,'manifest.json')).toString('utf8'));
  const keys=['schema','htmlSha256','receiptId','legacyId','sourceBlobSha','publicationAllowed','publicDomainLive','autonomousLoopsCertified','hostAuthority'];
  if(m===null||typeof m!=='object'||Array.isArray(m)||Object.keys(m).sort().join('|')!==keys.sort().join('|'))return deny('INVALID_MANIFEST_SCHEMA');
  if(m.schema!=='KDN-V32-LOCAL-PREVIEW-C16'||m.htmlSha256!==PAGE_SHA||m.receiptId!=='RECEIPT-LOCAL-C16'||m.legacyId!=='t-v32-c16-001'||m.sourceBlobSha!==LEGACY_BLOB)return deny('MANIFEST_SOURCE_OR_RECEIPT_MISMATCH');
  if(m.publicationAllowed!==false||m.publicDomainLive!==false||m.autonomousLoopsCertified!==0||m.hostAuthority!=='SYNTHETIC_ONLY')return deny('MANIFEST_TRUST_BOUNDARY_VIOLATION');
  return {schema:'KDN-V32-G04-C17-CUSTODY-VERIFY-1',integrityVerified:true,status:'LOCAL_ARTIFACT_BYTES_VERIFIED_ONLY',htmlSha256:PAGE_SHA,releaseAllowed:false,autonomousLoopsCertified:0,realWorkerAckVerified:false};
 }catch(e){
  if(e.code==='ENOENT')return deny('INCOMPLETE_OR_MISSING_PREVIEW');
  if(e.message==='NONREGULAR_OR_OVERSIZE')return deny('UNSAFE_FILE_OR_SYMLINK');
  if(e instanceof SyntaxError)return deny('MALFORMED_MANIFEST');
  return deny('LOCAL_CUSTODY_READ_FAILED');
 }
}
module.exports={verify,OUTPUT_NAME};
if(require.main===module){const root=path.join(__dirname,'local-preview-output');const r=verify(root);process.stdout.write(JSON.stringify(r)+'\n');if(!r.integrityVerified)process.exitCode=2}
