'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {enqueueTask,claimTask,finishTask,pauseWorkers}=require('../kido-one/autonomy/pg-worker-queue.cjs');
function fake({paused=true,task=null}={}){
 const calls=[];let released=0;
 return {calls,get released(){return released;},async connect(){return {async query(sql,params){calls.push({sql,params});if(sql.startsWith('UPDATE kido_tasks SET status=$6'))return {rows:task?[{task_id:params[1]}]:[]};if(sql.startsWith('INSERT INTO kido_tasks'))return {rows:[{task_id:params[1]}]};if(sql.startsWith('SELECT paused'))return {rows:[{paused}]};if(sql.startsWith('SELECT * FROM kido_tasks'))return {rows:task?[task]:[]};return {rows:[]};},release(){released++;}};}};
}
test('default pause blocks claims',async()=>{const p=fake();assert.equal(await claimTask(p,{projectId:'KDN',workerId:'w1'}),null);assert.equal(p.calls.some(x=>x.sql.includes('FOR UPDATE SKIP LOCKED')),false);});
test('claim uses transactional SKIP LOCKED and bounded lease',async()=>{const p=fake({paused:false,task:{task_id:'T1',kind:'AUDIT_SUMMARY',payload:{},lease_token:0}});const t=await claimTask(p,{projectId:'KDN',workerId:'w1'});assert.equal(t.taskId,'T1');assert.equal(t.leaseToken,1);assert.ok(p.calls.some(x=>x.sql.includes('FOR UPDATE SKIP LOCKED')));assert.ok(p.calls.some(x=>x.sql==='COMMIT'));});
test('enqueues only allowlisted kinds and pause is explicit',async()=>{const p=fake();assert.equal((await enqueueTask(p,{projectId:'KDN',taskId:'T1',kind:'RESEARCH_DRAFT'})).status,'QUEUED');await assert.rejects(enqueueTask(p,{projectId:'KDN',taskId:'T2',kind:'SEND_EMAIL'}),/INVALID_TASK/);assert.equal((await pauseWorkers(p,{projectId:'KDN',actorId:'DK01'})).paused,true);});

test('fenced completion uses lease owner, token, active lease and pause gate',async()=>{const p=fake({paused:false,task:{task_id:'T1',lease_token:3}});const result=await finishTask(p,{projectId:'KDN',taskId:'T1',workerId:'w1',leaseToken:4,resultHash:'abc'});assert.equal(result.status,'DONE');const sql=p.calls.find(x=>x.sql.includes('STALE')||x.sql.includes("status=$6"));assert.ok(sql.sql.includes('lease_token=$4'));assert.ok(sql.sql.includes('paused=false'));});
test('fenced completion denies stale lease and missing evidence',async()=>{const p=fake();await assert.rejects(finishTask(p,{projectId:'KDN',taskId:'T1',workerId:'w1',leaseToken:1,resultHash:'abc'}),/STALE_LEASE_OR_PAUSED/);await assert.rejects(finishTask(p,{projectId:'KDN',taskId:'T1',workerId:'w1',leaseToken:1}),/RESULT_HASH_REQUIRED/);});
