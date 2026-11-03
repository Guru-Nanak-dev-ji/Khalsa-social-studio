'use strict';
// Step 50: additional regression tests for legacy NARAD bridge; no external services.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {prepareNaradQueueRequest,enqueuePreparedNarad}=require('../kido-one/autonomy/narad-pg-bridge.cjs');
const {assessNaradAction}=require('../kido-one/autonomy/narad-action-boundary.cjs');

test('all publication actions remain blocked even if caller asserts approval',()=>{
 for(const action of ['NOTION_PUBLISH','PUBLISH_CONTENT','SEND_EMAIL','POST_SOCIAL_MEDIA']){
  const d=assessNaradAction(action,{dryRun:true,founderApproved:true,grant:'fake'});
  assert.equal(d.executionAuthorized,false);
 }
});
test('untrusted caller cannot bypass dry-run preparation with invalid inputs',()=>{
 const bad=[
  {projectId:'kido',topic:''},
  {projectId:'kido',topic:'x',sources:[null]},
  {projectId:'kido',topic:'x',sources:Array(13).fill('url')},
  {projectId:'',topic:'x'}
 ];
 for(const input of bad)assert.equal(prepareNaradQueueRequest(input).status,'BLOCKED');
});
test('database is untouched when authorization is absent',async()=>{
 let connects=0;
 const pool={connect:async()=>{connects++;throw Error('UNEXPECTED_DATABASE_ACCESS')}};
 const prepared=prepareNaradQueueRequest({projectId:'kido',topic:'Agriculture'});
 await assert.rejects(enqueuePreparedNarad(pool,prepared),/DB_WRITE_NOT_AUTHORIZED/);
 assert.equal(connects,0);
});
test('malformed prepared tasks are rejected before DB connection',async()=>{
 let connects=0;
 const pool={connect:async()=>{connects++;throw Error('UNEXPECTED_DATABASE_ACCESS')}};
 for(const prepared of [null,{}, {status:'PREPARED',kind:'NOTION_PUBLISH',payload:{dryRun:true,publication:'DISABLED'}},{status:'PREPARED',kind:'RESEARCH_DRAFT',payload:{dryRun:true,publication:'ENABLED'}}]){
  await assert.rejects(enqueuePreparedNarad(pool,prepared,{allowDatabaseWrite:true}),/INVALID_PREPARED_TASK/);
 }
 assert.equal(connects,0);
});
