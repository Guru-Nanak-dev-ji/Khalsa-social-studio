'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {enqueueTask,claimTask,pauseWorkers}=require('../kido-one/autonomy/pg-worker-queue.cjs');
function fake({paused=true,task=null}={}){
 const calls=[];let released=0;
 return {calls,get released(){return released;},async connect(){return {async query(sql,params){calls.push({sql,params});if(sql.startsWith('INSERT INTO kido_tasks'))return {rows:[{task_id:params[1]}]};if(sql.startsWith('SELECT paused'))return {rows:[{paused}]};if(sql.startsWith('SELECT * FROM kido_tasks'))return {rows:task?[task]:[]};return {rows:[]};},release(){released++;}};}};
}
test('default pause blocks claims',async()=>{const p=fake();assert.equal(await claimTask(p,{projectId:'KDN',workerId:'w1'}),null);assert.equal(p.calls.some(x=>x.sql.includes('FOR UPDATE SKIP LOCKED')),false);});
test('claim uses transactional SKIP LOCKED and bounded lease',async()=>{const p=fake({paused:false,task:{task_id:'T1',kind:'AUDIT_SUMMARY',payload:{}}});const t=await claimTask(p,{projectId:'KDN',workerId:'w1'});assert.equal(t.taskId,'T1');assert.ok(p.calls.some(x=>x.sql.includes('FOR UPDATE SKIP LOCKED')));assert.ok(p.calls.some(x=>x.sql==='COMMIT'));});
test('enqueues only allowlisted kinds and pause is explicit',async()=>{const p=fake();assert.equal((await enqueueTask(p,{projectId:'KDN',taskId:'T1',kind:'RESEARCH_DRAFT'})).status,'QUEUED');await assert.rejects(enqueueTask(p,{projectId:'KDN',taskId:'T2',kind:'SEND_EMAIL'}),/INVALID_TASK/);assert.equal((await pauseWorkers(p,{projectId:'KDN',actorId:'DK01'})).paused,true);});
