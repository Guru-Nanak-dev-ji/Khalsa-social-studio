'use strict';
// KIDO ONE Step 45: pure decision helper, never performs network or filesystem effects.
const OUTBOUND = new Set(['NOTION_PUBLISH','PUBLISH_CONTENT','SEND_EMAIL','POST_SOCIAL_MEDIA','SEND_MONEY','CHANGE_DNS','DEPLOY_WEBSITE','PAID_API_CALL']);
const LOCAL = new Set(['RESEARCH_DRAFT','LOCAL_JOURNAL','SOURCE_SUMMARY']);
function assessNaradAction(action, context={}) {
  const name=typeof action==='string'?action.toUpperCase():'';
  if (!name || (!OUTBOUND.has(name) && !LOCAL.has(name))) return Object.freeze({decision:'DENY',executionAuthorized:false,reason:'UNKNOWN_ACTION'});
  if (OUTBOUND.has(name)) return Object.freeze({decision:'REQUIRES_VERIFIED_FOUNDER_GRANT',executionAuthorized:false,reason:'OUTBOUND_EFFECT_BLOCKED'});
  if (context.workerPaused===true) return Object.freeze({decision:'DENY',executionAuthorized:false,reason:'WORKER_PAUSED'});
  if (context.dryRun!==true) return Object.freeze({decision:'DENY',executionAuthorized:false,reason:'DRY_RUN_REQUIRED'});
  return Object.freeze({decision:'DRAFT_ALLOWED',executionAuthorized:false,reason:'NO_EXTERNAL_EXECUTION'});
}
module.exports={assessNaradAction,OUTBOUND,LOCAL};
