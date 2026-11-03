'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {decideExecution}=require('../kido-one/autonomy/execution-gate.cjs');
const base={task:{kind:'AUDIT_SUMMARY',leaseOwner:'W',leaseToken:2},control:{paused:false},lease:{workerId:'W',token:2,expiresAt:'2099-01-01T00:00:00Z'}};
test('valid read-only task remains dry-run and outbound denied',()=>{const d=decideExecution(base);assert.equal(d.allow,true);assert.equal(d.outboundAllowed,false);assert.equal(d.externalCallsAllowed,0);});
test('pause and live execution always denied',()=>{assert.equal(decideExecution({...base,control:{paused:true}}).reason,'WORKERS_PAUSED');assert.equal(decideExecution({...base,mode:'LIVE'}).reason,'LIVE_EXECUTION_DISABLED');});
test('stale and expired lease denied',()=>{assert.equal(decideExecution({...base,lease:{...base.lease,token:1}}).reason,'STALE_OR_EXPIRED_LEASE');assert.equal(decideExecution({...base,lease:{...base.lease,expiresAt:'2000-01-01T00:00:00Z'}}).allow,false);});
test('publishing and unapproved human-gated task denied',()=>{assert.equal(decideExecution({...base,task:{...base.task,kind:'PUBLISH_POST'}}).reason,'TASK_NOT_ALLOWLISTED');assert.equal(decideExecution({...base,task:{...base.task,requiresHumanApproval:true}}).reason,'HUMAN_APPROVAL_REQUIRED');});
