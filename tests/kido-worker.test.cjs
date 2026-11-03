'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {newQueue,enqueue,setPaused,claim,complete,fail,dryRun}=require('../kido-one/autonomy/dry-run-worker.cjs');
test('paused by default, dedupe, bounded dry run',()=>{
 const q=newQueue();assert.equal(q.paused,true);
 assert.equal(enqueue(q,{id:'T1',kind:'RESEARCH_DRAFT'}).status,'QUEUED');
 assert.equal(enqueue(q,{id:'T1',kind:'RESEARCH_DRAFT'}).status,'ALREADY_QUEUED');
 assert.equal(claim(q,{workerId:'w1',now:0}),null);
 setPaused(q,false);const t=claim(q,{workerId:'w1',now:0});assert.equal(t.attempts,1);
 const result=dryRun(t);assert.equal(result.published,false);assert.equal(result.emailed,false);
 assert.equal(complete(q,{id:'T1',workerId:'w1',now:1,result}).status,'DONE');
 assert.equal(claim(q,{workerId:'w1',now:2}),null);
});
test('expired lease, retries and eventual failure',()=>{
 const q=newQueue();enqueue(q,{id:'T2',kind:'AUDIT_SUMMARY',maxAttempts:2});setPaused(q,false);
 claim(q,{workerId:'a',now:0,leaseMs:10});
 assert.throws(()=>complete(q,{id:'T2',workerId:'b',now:1,result:{}}),/INVALID/);
 assert.equal(claim(q,{workerId:'b',now:10,leaseMs:10}).attempts,2);
 assert.equal(fail(q,{id:'T2',workerId:'b',now:11,reason:'fixture'}),'FAILED');
});
test('retry backoff and global stop',()=>{
 const q=newQueue();enqueue(q,{id:'T3',kind:'GITHUB_STATUS_DRY_RUN'});setPaused(q,false);
 claim(q,{workerId:'a',now:0});
 assert.equal(fail(q,{id:'T3',workerId:'a',now:1,reason:'fixture'}),'QUEUED');
 assert.equal(claim(q,{workerId:'b',now:999}),null);
 setPaused(q,true);assert.equal(claim(q,{workerId:'b',now:5000}),null);
 setPaused(q,false);assert.equal(claim(q,{workerId:'b',now:5000}).attempts,2);
 assert.throws(()=>enqueue(q,{id:'bad',kind:'SEND_EMAIL'}),/INVALID_TASK/);
});
