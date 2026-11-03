'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {appendLedger,loadLedger}=require('../kido-one/autonomy/ledger.cjs');
const make=(id,text,extra={})=>({id,exact_text:text,source_uri:'local-test',recorded_at:'2026-10-29T00:00:00Z',issuer:'DK 01',scope:'test',status:'PROPOSED',...extra});
test('durable ledger append and reload',()=>{const d=fs.mkdtempSync(path.join(os.tmpdir(),'kido-ledger-'));try{const f=path.join(d,'ledger.jsonl');appendLedger(f,make('1','first'));assert.equal(loadLedger(f).length,1);assert.throws(()=>appendLedger(f,make('1','again')),/DUPLICATE/);assert.throws(()=>appendLedger(f,make('2','different')),/POTENTIAL_CONFLICT/);appendLedger(f,make('2','different',{conflict_id:'C-TEST'}));assert.equal(loadLedger(f).length,2);fs.appendFileSync(f,'{"tampered":true}\n');assert.throws(()=>loadLedger(f),/LEDGER_INTEGRITY_FAILED/);}finally{fs.rmSync(d,{recursive:true,force:true});}});
