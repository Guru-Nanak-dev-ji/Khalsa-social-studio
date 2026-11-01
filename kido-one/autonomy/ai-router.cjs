'use strict';
// KIDO ONE Step 19: multi-AI routing contract, dry-run only.
// No network calls, credentials, provider APIs, or external messages.
const PROVIDERS=Object.freeze({
 local:{costTier:'FREE_SOFTWARE',needsKey:false,roles:['DRAFT','CLASSIFY','SUMMARIZE']},
 gemini:{costTier:'VARIABLE',needsKey:true,roles:['DRAFT','RESEARCH']},
 openai:{costTier:'VARIABLE',needsKey:true,roles:['REASON','CODE','REVIEW']},
 grok:{costTier:'VARIABLE',needsKey:true,roles:['RESEARCH','REVIEW']},
 deepseek:{costTier:'VARIABLE',needsKey:true,roles:['CODE','REVIEW']}
});
const allowed=new Set(['DRAFT','CLASSIFY','SUMMARIZE','RESEARCH','REASON','CODE','REVIEW']);
function planRoute({role,available=[],maxCostTier='FREE_SOFTWARE',containsSecrets=false}={}){
 if(!allowed.has(role))return {status:'REJECTED',reason:'UNKNOWN_ROLE'};
 if(containsSecrets)return {status:'HUMAN_REVIEW',reason:'SENSITIVE_INPUT'};
 const choices=available.filter(x=>Object.hasOwn(PROVIDERS,x)&&PROVIDERS[x].roles.includes(role)&&
  (maxCostTier==='VARIABLE'||PROVIDERS[x].costTier==='FREE_SOFTWARE'));
 if(!choices.length)return {status:'UNASSIGNED',reason:'NO_ELIGIBLE_PROVIDER'};
 const provider=choices[0];
 return {status:'DRY_RUN_PLAN',provider,role,needsKey:PROVIDERS[provider].needsKey,
  estimatedCost:null,executed:false,externalCalls:0};
}
module.exports={PROVIDERS,planRoute};
