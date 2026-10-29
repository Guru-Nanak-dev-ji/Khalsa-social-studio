'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {settleFailure,expireExhausted}=require('../kido-one/autonomy/pg-worker-lifecycle.cjs');
function pool({paused=false,rows=[{status:'QUEUED',attempts:1,max_attempts:3}]}={}){
 const queries=[];
 return {queries,async connect(){return {async query(sql,args){queries.push({sql,args});if(sql.startsWith('SELECT paused'))return {rows:[{paused}]};if(sql.includes('RETURNING status'))return {rows};if(sql.includes('RETURNING task_id'))return {rows:[{task_id:'T-9'}]};return {rows:[]};},release(){}};}};
}
const lease={projectId:'P',taskId:'T',workerId:'W',leaseToken:2};
test('retry uses matching lease fencing and bounded backoff',async()=>{const p=pool();const r=await settleFailure(p,lease,{backoffSeconds:60});assert.equal(r.status,'QUEUED');const q=p.queries.find(x=>x.sql.includes('RETURNING status'));assert.ok(q.sql.includes('lease_token=$4'));assert.ok(q.sql.includes('lease_until>clock_timestamp()'));assert.ok(q.sql.includes('attempts>=max_attempts'));assert.equal(q.args[4],60);});
test('paused worker fails closed and transaction rolls back',async()=>{const p=pool({paused:true});await assert.rejects(settleFailure(p,lease),/WORKERS_PAUSED/);assert.ok(p.queries.some(x=>x.sql==='ROLLBACK'));});
test('stale lease cannot retry',async()=>{const p=pool({rows:[]});await assert.rejects(settleFailure(p,lease),/STALE_LEASE/);});
test('invalid backoff or token denied',async()=>{await assert.rejects(settleFailure(pool(),lease,{backoffSeconds:0}),/INVALID_BACKOFF/);await assert.rejects(settleFailure(pool(),{...lease,leaseToken:0}),/INVALID_LEASE_TOKEN/);});
test('expired exhausted tasks are marked FAILED',async()=>{const p=pool();const r=await expireExhausted(p,{projectId:'P'});assert.deepEqual(r.failedTaskIds,['T-9']);assert.ok(p.queries.some(x=>x.sql.includes("attempts>=max_attempts")));});
