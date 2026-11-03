'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {planNaradResearch}=require('../kido-one/autonomy/narad-queue-adapter.cjs');
test('creates deterministic non-dispatched dry run plan',()=>{
 const a=planNaradResearch({dryRun:true,topic:'Punjab farming',sources:['https://example.org']});
 const b=planNaradResearch({dryRun:true,topic:'Punjab farming',sources:['https://example.org']});
 assert.equal(a.status,'DRY_RUN_PLAN');assert.equal(a.fingerprint,b.fingerprint);
 assert.equal(a.dispatched,false);assert.equal(a.queued,false);assert.equal(a.externalEffects,false);
 assert.equal(a.request.requiresExternalPublication,false);
});
test('blocks paused worker and missing dry run',()=>{
 assert.equal(planNaradResearch({dryRun:true,workerPaused:true,topic:'x'}).status,'BLOCKED');
 assert.equal(planNaradResearch({topic:'x'}).status,'BLOCKED');
});
test('rejects malformed topics and sources',()=>{
 assert.equal(planNaradResearch({dryRun:true,topic:' '}).reason,'INVALID_TOPIC');
 assert.equal(planNaradResearch({dryRun:true,topic:'x',sources:[42]}).reason,'INVALID_SOURCES');
});
