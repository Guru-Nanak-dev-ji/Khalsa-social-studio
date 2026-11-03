'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {assessNaradAction}=require('../kido-one/autonomy/narad-action-boundary.cjs');
test('Notion and other outbound actions are never authorized',()=>{
 for(const action of ['NOTION_PUBLISH','SEND_EMAIL','POST_SOCIAL_MEDIA','SEND_MONEY','CHANGE_DNS','DEPLOY_WEBSITE','PAID_API_CALL']){
  const r=assessNaradAction(action,{dryRun:true});
  assert.equal(r.decision,'REQUIRES_VERIFIED_FOUNDER_GRANT');
  assert.equal(r.executionAuthorized,false);
 }
});
test('local drafts require dry-run and non-paused worker',()=>{
 assert.equal(assessNaradAction('RESEARCH_DRAFT',{dryRun:true}).decision,'DRAFT_ALLOWED');
 assert.equal(assessNaradAction('RESEARCH_DRAFT',{dryRun:false}).decision,'DENY');
 assert.equal(assessNaradAction('RESEARCH_DRAFT',{dryRun:true,workerPaused:true}).decision,'DENY');
});
test('unknown action is denied',()=>assert.equal(assessNaradAction('CREATE_TOKEN',{dryRun:true}).decision,'DENY'));
