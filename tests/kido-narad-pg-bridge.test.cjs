'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {prepareNaradQueueRequest,enqueuePreparedNarad}=require('../kido-one/autonomy/narad-pg-bridge.cjs');
test('maps research draft to supported durable queue kind',()=>{
 const p=prepareNaradQueueRequest({projectId:'kido',topic:'Farming',sources:['https://example.org']});
 assert.equal(p.status,'PREPARED');assert.equal(p.kind,'RESEARCH_DRAFT');assert.equal(p.payload.publication,'DISABLED');assert.equal(p.payload.dryRun,true);
 assert.equal(prepareNaradQueueRequest({projectId:'kido',topic:'Farming',sources:['https://example.org']}).taskId,p.taskId);
});
test('no DB write without explicit opt-in',async()=>{
 const p=prepareNaradQueueRequest({projectId:'kido',topic:'Farming'});
 let touched=false;const pool={connect:async()=>{touched=true;throw Error('unexpected')}};
 await assert.rejects(enqueuePreparedNarad(pool,p),/DB_WRITE_NOT_AUTHORIZED/);assert.equal(touched,false);
});
test('invalid input blocks preparation',()=>assert.equal(prepareNaradQueueRequest({topic:'Farming'}).status,'BLOCKED'));
