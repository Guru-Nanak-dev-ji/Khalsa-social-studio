'use strict';
// Trusted-approval gate: the caller cannot authorize itself by supplying a string.
// Resolver must be a trusted server-side implementation reading verified decisions.
function createApprovalGate(trustedResolver){
 if(typeof trustedResolver!=='function')throw Error('TRUSTED_RESOLVER_REQUIRED');
 return async function verifyApproval({projectId,command,approvalRef}){
  if(!projectId||!command?.id||!approvalRef)return {allowed:false,reason:'APPROVAL_REFERENCE_MISSING'};
  const record=await trustedResolver({projectId,approvalRef});
  if(!record||record.status!=='APPROVED'||record.revoked===true)return {allowed:false,reason:'NOT_APPROVED'};
  if(record.project_id!==projectId||record.command_id!==command.id||record.scope!==command.scope)return {allowed:false,reason:'APPROVAL_SCOPE_MISMATCH'};
  if(!record.verified_issuer||record.issuer_kind!=='HUMAN')return {allowed:false,reason:'UNVERIFIED_HUMAN_ISSUER'};
  if(!record.expires_at||Number.isNaN(Date.parse(record.expires_at))||Date.parse(record.expires_at)<=Date.now())return {allowed:false,reason:'APPROVAL_EXPIRED_OR_UNBOUNDED'};
  if(record.single_use!==true||record.consumed===true)return {allowed:false,reason:'APPROVAL_NOT_SINGLE_USE'};
  return {allowed:true,reason:'TRUSTED_APPROVAL_MATCH'};
 };
}
module.exports={createApprovalGate};
