'use strict';
// Local-filesystem ONLY; not a distributed lock. Never use on NFS/cloud sync.
// Separate lock file created atomically with O_EXCL; fail closed on stale lock.
const fs=require('node:fs');
const {appendLedger,loadLedger}=require('./ledger.cjs');
const sleep=ms=>{const b=new SharedArrayBuffer(4);Atomics.wait(new Int32Array(b),0,0,ms);};
function withLedgerLock(file,fn,{maxWaitMs=3000,retryMs=20}={}){
 const lock=file+'.lock';const started=Date.now();let fd;
 while(true){
  try{fd=fs.openSync(lock,fs.constants.O_WRONLY|fs.constants.O_CREAT|fs.constants.O_EXCL,0o600);break;}
  catch(e){if(e.code!=='EEXIST')throw e;if(Date.now()-started>=maxWaitMs)throw Error('LEDGER_LOCK_TIMEOUT');sleep(retryMs);}
 }
 try{fs.writeSync(fd,JSON.stringify({pid:process.pid,started_at:new Date().toISOString()}));fs.fsyncSync(fd);return fn();}
 finally{try{fs.closeSync(fd);}finally{fs.unlinkSync(lock);}}
}
function appendLocked(file,command,opts){return withLedgerLock(file,()=>appendLedger(file,command),opts);}
module.exports={withLedgerLock,appendLocked,loadLedger};
