'use strict';
const STATES=Object.freeze(['DRAFT','OPEN_FOR_COMMENT','REVISION','VOTING','CLOSED','ARCHIVED']);
const ROLES=Object.freeze(['citizen','moderator','auditor']);
function validateProposal(p){
 if(!p||typeof p!=='object'||Array.isArray(p))throw Error('proposal object required');
 if(!/^P-[A-Z0-9]{8,32}$/.test(p.id||''))throw Error('invalid id');
 if(typeof p.title!=='string'||p.title.trim().length<5||p.title.length>160)throw Error('invalid title');
 if(!STATES.includes(p.state))throw Error('invalid state');
 if(p.officialElection!==false)throw Error('civic votes are not official elections');
 if(p.aiVotes!==0)throw Error('AI votes prohibited');
 return true;
}
function voteEligibility({verified,duplicate,consented,proposalState}){
 if(proposalState!=='VOTING')return {allowed:false,reason:'NOT_OPEN'};
 if(verified!==true)return {allowed:false,reason:'IDENTITY_NOT_VERIFIED'};
 if(consented!==true)return {allowed:false,reason:'NO_CONSENT'};
 if(duplicate!==false)return {allowed:false,reason:'DUPLICATE_OR_UNKNOWN'};
 return {allowed:true,reason:'ELIGIBLE_FOR_SERVER_SIDE_ATOMIC_CLAIM'};
}
function publicReceipt(r){
 if(!r||typeof r!=='object')throw Error('receipt required');
 return {proposalId:r.proposalId,status:r.status,ballotCount:Number.isSafeInteger(r.ballotCount)&&r.ballotCount>=0?r.ballotCount:null,aiOpinionSeparated:true,officialElection:false,identityPublished:false,proofStatus:'NOT_VERIFIED'};
}
module.exports={STATES,ROLES,validateProposal,voteEligibility,publicReceipt};
