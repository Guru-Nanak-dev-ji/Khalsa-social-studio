'use strict';
// KIDO ONE durable append-only JSONL ledger. Offline only; no network or publishing.
// For local trusted server use. Never put private commands in a public repository.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {validateCommand,hash}=require('./policy-engine.cjs');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
function stable(value){if(Array.isArray(value))return '['+value.map(stable).join(',')+']';if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+stable(value[k])).join(',')+'}';return JSON.stringify(value);}
function loadLedger(file){
 if(!fs.existsSync(file))return [];
 const lines=fs.readFileSync(file,'utf8').split('\n').filter(Boolean);
 let prev='GENESIS';
 return lines.map((line,i)=>{
   const e=JSON.parse(line);
   if(e.seq!==i+1||e.previous_hash!==prev||e.event_hash!==sha(stable({seq:e.seq,previous_hash:e.previous_hash,command:e.command})))throw Error('LEDGER_INTEGRITY_FAILED at '+(i+1));
   prev=e.event_hash;return e;
 });
}
function appendLedger(file,command){
 const valid=validateCommand(command);
 if(!valid.ok)throw Error('INVALID_COMMAND '+valid.missing.join(','));
 const events=loadLedger(file);
 if(events.some(e=>e.command.id===command.id))throw Error('DUPLICATE_COMMAND_ID');
 if(events.some(e=>e.command.scope===command.scope&&e.command.exact_text!==command.exact_text)&&!command.conflict_id)throw Error('POTENTIAL_CONFLICT_REQUIRES_ID');
 const dir=path.dirname(file);
 fs.mkdirSync(dir,{recursive:true,mode:0o700});
 const prev=events.length?events.at(-1).event_hash:'GENESIS';
 const e={seq:events.length+1,previous_hash:prev,command:{...command,text_sha256:hash(command.exact_text)}};
 e.event_hash=sha(stable({seq:e.seq,previous_hash:e.previous_hash,command:e.command}));
 const fd=fs.openSync(file,fs.constants.O_WRONLY|fs.constants.O_APPEND|fs.constants.O_CREAT,0o600);
 try{fs.writeSync(fd,JSON.stringify(e)+'\n');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
 return e;
}
module.exports={loadLedger,appendLedger};
