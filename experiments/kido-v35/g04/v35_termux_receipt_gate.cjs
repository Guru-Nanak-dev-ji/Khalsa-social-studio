'use strict';
/** Read-only, exact-byte V35 Android receipt admission. It proves source custody
 * against a human-reported hash, NEVER phone origin, remote ACK, or worker loops.
 * No network, task queue, credential access or command execution.
 */
const fs = require('node:fs');
const crypto = require('node:crypto');
const EXPECTED = 'acbfa98d51c225cea3ea84c32302b615f095bab5b863efb2f7c971c1de11582b';
const BYTE_LIMIT = 4096;
class ReceiptError extends Error {constructor(code){super(code);this.code=code;}}
function fail(code){throw new ReceiptError(code);}
function admitBytes(raw, expectedSha=EXPECTED){
  if(!Buffer.isBuffer(raw)||raw.length===0||raw.length>BYTE_LIMIT)fail('RECEIPT_BYTES_INVALID');
  if(typeof expectedSha!=='string'||!/^[a-f0-9]{64}$/.test(expectedSha))fail('SHA_PIN_INVALID');
  const digest=crypto.createHash('sha256').update(raw).digest('hex');
  if(digest!==expectedSha)fail('SHA_PIN_MISMATCH');
  let obj;
  try{obj=JSON.parse(raw.toString('utf8'));}catch{fail('RECEIPT_JSON_INVALID');}
  const keys=['run','test','status','results','winner','cross_platform','strict_loops'];
  if(obj===null||Array.isArray(obj)||typeof obj!=='object'||Object.keys(obj).sort().join('|')!==keys.sort().join('|'))fail('RECEIPT_SCHEMA_MISMATCH');
  if(obj.run!=='b98304749cbd'||obj.test!=='V35_TWO_PROCESS_ATOMIC_CLAIM'||obj.status!=='PASS'||obj.winner!=='WORKER-B'||obj.cross_platform!=='NOT_VERIFIED'||obj.strict_loops!==0)fail('RECEIPT_SCOPE_MISMATCH');
  if(!Array.isArray(obj.results)||obj.results.length!==2||JSON.stringify(obj.results)!==JSON.stringify([['WORKER-B','CLAIMED'],['WORKER-A','REJECTED']]))fail('CLAIM_EVIDENCE_MISMATCH');
  return Object.freeze({kind:'V35_HUMAN_UPLOADED_ATOMIC_CLAIM_RECEIPT',bytes:raw.length,sha256:digest,uniqueClaimWinner:'WORKER-B',rejected:'WORKER-A',verifiedRawCustody:true,verifiedPhoneExecution:false,verifiedConnectedHandoff:false,realReceiverAck:false,independentlyCertifiedStrictLoops:0,decision:'LOCAL_RECEIPT_ONLY_REMOTE_AUTH_HOLD'});
}
function readPinnedFile(file){
  if(typeof file!=='string'||!file||file.includes('\0'))fail('PATH_INVALID');
  const flags=fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW||0) | (fs.constants.O_NONBLOCK||0);
  let fd;
  try {
    fd=fs.openSync(file,flags);
    const st=fs.fstatSync(fd);
    if(!st.isFile()||st.size===0||st.size>BYTE_LIMIT)fail('NOT_A_BOUNDED_REGULAR_FILE');
    return admitBytes(fs.readFileSync(fd));
  } catch(e){if(e instanceof ReceiptError)throw e;fail('RECEIPT_NOT_READABLE');}
  finally {if(fd!==undefined)fs.closeSync(fd);}
}
if(require.main===module){try{
  const path=process.argv[2];if(!path||process.argv.length!==3)fail('USAGE_PATH_REQUIRED');
  process.stdout.write(JSON.stringify(readPinnedFile(path),null,2)+'\n');
}catch(e){process.stderr.write(String(e.code||'UNKNOWN')+'\n');process.exitCode=2;}}
module.exports={admitBytes,readPinnedFile,ReceiptError,EXPECTED};
