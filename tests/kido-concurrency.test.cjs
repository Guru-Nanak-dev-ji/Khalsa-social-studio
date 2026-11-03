'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const {appendLocked,loadLedger,withLedgerLock}=require('../kido-one/autonomy/locked-ledger.cjs');
const {execFileSync}=require('node:child_process');
const base={source_uri:'local-test',recorded_at:'2026-10-29T00:00:00Z',issuer:'AI_TEST',scope:'concurrent-test',status:'PROPOSED',exact_text:'same command'};
test('serializes concurrent writers and keeps hash chain intact',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'kido-multi-')),file=path.join(dir,'events.jsonl');
 try{
  const worker=path.resolve(__dirname,'../kido-one/autonomy/locked-ledger.cjs');
  const script="const m=require(process.argv[1]);const file=process.argv[2];const id=process.argv[3];m.appendLocked(file,{id,source_uri:'local-test',recorded_at:'2026-10-29T00:00:00Z',issuer:'AI_TEST',scope:'concurrent-test',status:'PROPOSED',exact_text:'same command'});";
  const jobs=Array.from({length:8},(_,i)=>new Promise((resolve,reject)=>{const p=spawn(process.execPath,['-e',script,worker,file,'W'+i]);let err='';p.stderr.on('data',d=>err+=d);p.on('error',reject);p.on('close',c=>c===0?resolve():reject(Error(err||'exit '+c)));}));
  await Promise.all(jobs);assert.equal(loadLedger(file).length,8);
  assert.throws(()=>appendLocked(file,{...base,id:'W0'}),/DUPLICATE_COMMAND_ID/);
  fs.writeFileSync(file+'.lock','occupied');assert.throws(()=>withLedgerLock(file,()=>{}, {maxWaitMs:30,retryMs:5}),/LEDGER_LOCK_TIMEOUT/);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
