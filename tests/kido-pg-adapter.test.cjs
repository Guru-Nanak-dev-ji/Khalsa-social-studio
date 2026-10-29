'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {appendCommandEvent}=require('../kido-one/autonomy/pg-adapter.cjs');
function pool(){
 const state={seq:0,hash:'GENESIS',events:[],rollbacks:0};
 return {state,async connect(){return {async query(sql,params=[]){
  if(sql==='BEGIN'||sql==='COMMIT')return {rows:[]};
  if(sql==='ROLLBACK'){state.rollbacks++;return {rows:[]};}
  if(sql.startsWith('INSERT INTO kido_event_streams'))return {rows:[]};
  if(sql.startsWith('SELECT last_seq'))return {rows:[{last_seq:state.seq,last_hash:state.hash}]};
  if(sql.startsWith('SELECT event_id'))return {rows:state.events.filter(e=>e.key===params[1]).map(e=>({event_id:e.id,seq:e.seq,event_hash:e.hash}))};
  if(sql.startsWith("SELECT payload->"))return {rows:state.events.map(e=>({command:e.command}))};
  if(sql.startsWith('INSERT INTO kido_events')){state.events.push({id:params[2],key:params[3],seq:params[1],hash:params[13],command:JSON.parse(params[11]).command});return {rows:[]};}
  if(sql.startsWith('UPDATE kido_event_streams')){state.seq=params[1];state.hash=params[2];return {rows:[]};}
  throw Error('UNEXPECTED_SQL '+sql);
 },release(){}};}};
}
const command=(id,text='same',extra={})=>({id,exact_text:text,source_uri:'fixture',recorded_at:'2026-10-29',issuer:'DK 01',scope:'test',status:'PROPOSED',...extra});
const req=(id,key,cmd)=>({projectId:'KDN',eventId:id,idempotencyKey:key,command:cmd});
test('PG adapter appends with sequence and idempotency',async()=>{const p=pool();const a=await appendCommandEvent(p,req('e1','k1',command('c1')));assert.equal(a.status,'RECORDED');assert.equal(a.seq,1);assert.equal((await appendCommandEvent(p,req('e1','k1',command('c1')))).status,'ALREADY_RECORDED');const b=await appendCommandEvent(p,req('e2','k2',command('c2')));assert.equal(b.seq,2);assert.equal(p.state.events.length,2);});
test('PG adapter rejects conflicting and duplicate commands',async()=>{const p=pool();await appendCommandEvent(p,req('e1','k1',command('c1')));await assert.rejects(appendCommandEvent(p,req('e2','k2',command('c2','different'))),/POTENTIAL_CONFLICT/);await assert.rejects(appendCommandEvent(p,req('e3','k3',command('c1'))),/DUPLICATE/);assert.equal(p.state.events.length,1);});
test('PG adapter fails closed on missing pool or malformed command',async()=>{await assert.rejects(appendCommandEvent(null,req('e1','k1',command('c1'))),/POOL_REQUIRED/);await assert.rejects(appendCommandEvent(pool(),req('e1','k1',{})),/INVALID_COMMAND/);});
