'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {createApprovalGate}=require('../kido-one/autonomy/approval-gate.cjs');
const command={id:'C-NEW',scope:'publishing'};
const base={status:'APPROVED',revoked:false,project_id:'KDN',command_id:'C-NEW',scope:'publishing',verified_issuer:true,issuer_kind:'HUMAN',expires_at:'2099-01-01T00:00:00Z',single_use:true,consumed:false};
const check=async r=>createApprovalGate(async()=>r)({projectId:'KDN',command,approvalRef:'A-1'});
test('trusted gate permits exact scoped human approval',async()=>assert.equal((await check(base)).allowed,true));
test('trusted gate rejects forged string and missing approval',async()=>{assert.equal((await check(null)).allowed,false);assert.equal((await check({...base,verified_issuer:false})).allowed,false);});
test('trusted gate rejects scope mismatch, revocation, expiry, replay',async()=>{for(const patch of [{scope:'finance'},{revoked:true},{expires_at:'2020-01-01T00:00:00Z'},{consumed:true},{single_use:false},{issuer_kind:'AI'}])assert.equal((await check({...base,...patch})).allowed,false);});
