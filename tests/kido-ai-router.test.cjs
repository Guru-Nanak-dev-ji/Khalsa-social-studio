'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {planRoute}=require('../kido-one/autonomy/ai-router.cjs');
test('free software route remains offline and cost-unverified',()=>{const r=planRoute({role:'DRAFT',available:['local','openai']});assert.equal(r.provider,'local');assert.equal(r.externalCalls,0);assert.equal(r.executed,false);assert.equal(r.estimatedCost,null);});
test('paid API cannot be chosen under free-only policy',()=>assert.equal(planRoute({role:'REASON',available:['openai']}).status,'UNASSIGNED'));
test('sensitive input and unsupported roles fail closed',()=>{assert.equal(planRoute({role:'CODE',available:['deepseek'],containsSecrets:true,maxCostTier:'VARIABLE'}).status,'HUMAN_REVIEW');assert.equal(planRoute({role:'SEND_EMAIL',available:['openai']}).status,'REJECTED');});
test('variable-cost route is a plan, not a real provider call',()=>{const r=planRoute({role:'REVIEW',available:['grok'],maxCostTier:'VARIABLE'});assert.equal(r.status,'DRY_RUN_PLAN');assert.equal(r.needsKey,true);assert.equal(r.externalCalls,0);});
