'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {processDryRunTask}=require('../kido-one/autonomy/offline-worker.cjs');
const task={taskId:'T1',kind:'RESEARCH_DRAFT',leaseOwner:'W',leaseToken:1};
const args={task,control:{paused:false},lease:{workerId:'W',token:1,expiresAt:'2099-01-01T00:00:00Z'}};
test('worker routes approved dry-run to local model without execution',async()=>{const r=await processDryRunTask(args);assert.equal(r.status,'DRY_RUN_READY');assert.equal(r.provider,'local');assert.equal(r.executed,false);assert.equal(r.externalCalls,0);});
test('paused worker never routes task',async()=>{const r=await processDryRunTask({...args,control:{paused:true}});assert.equal(r.status,'BLOCKED');assert.equal(r.reason,'WORKERS_PAUSED');});
test('publishing remains blocked',async()=>{const r=await processDryRunTask({...args,task:{...task,kind:'PUBLISH_POST'}});assert.equal(r.status,'BLOCKED');});
test('no free model or sensitive input never dispatched',async()=>{const a=await processDryRunTask({...args,availableProviders:['openai']});assert.equal(a.status,'UNASSIGNED');const b=await processDryRunTask({...args,task:{...task,containsSecrets:true}});assert.equal(b.status,'UNASSIGNED');});
