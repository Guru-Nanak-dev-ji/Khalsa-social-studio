'use strict';
// Step 46: build a dry-run research queue proposal. Never dispatches, stores or calls providers.
const {assessNaradAction}=require('./narad-action-boundary.cjs');
const crypto=require('node:crypto');
function planNaradResearch(input={}){
 const decision=assessNaradAction('RESEARCH_DRAFT',{dryRun:input.dryRun,workerPaused:input.workerPaused});
 if(decision.decision!=='DRAFT_ALLOWED')return {status:'BLOCKED',reason:decision.reason,dispatched:false};
 const topic=typeof input.topic==='string'?input.topic.trim():'';
 if(!topic||topic.length>180)return {status:'BLOCKED',reason:'INVALID_TOPIC',dispatched:false};
 const sources=Array.isArray(input.sources)?input.sources:[];
 if(sources.length>12||sources.some(s=>typeof s!=='string'||s.length>500))return {status:'BLOCKED',reason:'INVALID_SOURCES',dispatched:false};
 const request={kind:'NARAD_RESEARCH_DRAFT',topic,sources:[...sources],requiresExternalPublication:false,approvalStatus:'NOT_REQUESTED'};
 const fingerprint=crypto.createHash('sha256').update(JSON.stringify(request)).digest('hex');
 return {status:'DRY_RUN_PLAN',request,fingerprint,dispatched:false,queued:false,externalEffects:false};
}
module.exports={planNaradResearch};
