'use strict';
// KIDO ONE Step 06: pure, offline, default-deny policy engine.
// This module performs NO network calls, file writes, or publication.
const crypto = require('node:crypto');
const hash = value => crypto.createHash('sha256').update(String(value)).digest('hex');
const REQUIRED = ['id','exact_text','source_uri','recorded_at','issuer','scope','status'];
function validateCommand(c) {
  const missing = REQUIRED.filter(k => typeof c?.[k] !== 'string' || !c[k].trim());
  return { ok: missing.length === 0, missing };
}
function appendCommand(ledger, command) {
  if (!Array.isArray(ledger)) throw new TypeError('ledger must be an array');
  const valid = validateCommand(command);
  if (!valid.ok) return {ok:false, reason:'MISSING_FIELDS', missing:valid.missing, ledger};
  if (ledger.some(c=>c.id===command.id)) return {ok:false, reason:'DUPLICATE_ID', ledger};
  const entry = Object.freeze({...command, text_sha256:hash(command.exact_text)});
  return {ok:true, ledger:Object.freeze([...ledger,entry]), entry};
}
function detectConflicts(ledger, candidate) {
  return ledger.filter(c=>c.scope===candidate.scope &&
    c.id!==candidate.id && c.status!=='REVOKED' &&
    (c.exact_text!==candidate.exact_text || (candidate.supersedes_id && candidate.supersedes_id===c.id)))
    .map(c=>({type:'POTENTIAL_POLICY_CONFLICT',existing_id:c.id,candidate_id:candidate.id,
      resolution:'HUMAN_REVIEW_REQUIRED'}));
}
function evaluatePublication(draft, policy) {
  const deny = reason => ({decision:'NEEDS_HUMAN_APPROVAL',reason});
  if (!policy || policy.enabled!==true) return deny('POLICY_DISABLED');
  if (!policy.founder_approval_ref || !policy.approved_at) return deny('NO_SCOPED_APPROVAL');
  if (!draft || !draft.ai_disclosure || !draft.source_urls?.length) return deny('DISCLOSURE_OR_SOURCES_MISSING');
  if (!policy.channels?.includes(draft.channel)) return deny('CHANNEL_NOT_APPROVED');
  if (!policy.topics?.includes(draft.topic)) return deny('TOPIC_NOT_APPROVED');
  if (!policy.templates?.includes(draft.template_id)) return deny('TEMPLATE_NOT_APPROVED');
  if (!Number.isInteger(policy.max_posts_per_day) || policy.max_posts_per_day<1) return deny('NO_RATE_LIMIT');
  if (!Number.isInteger(draft.posts_today) || draft.posts_today>=policy.max_posts_per_day) return deny('RATE_LIMIT');
  if (draft.sensitive || draft.unverified || draft.personal_data || draft.unsolicited ||
      draft.financial || draft.legal || draft.production_change) return deny('RESTRICTED_CONTENT');
  return {decision:'DRY_RUN_ELIGIBLE',reason:'SCOPED_CHECKS_PASSED',
    draft_sha256:hash(JSON.stringify(draft)),published:false};
}
module.exports={hash,validateCommand,appendCommand,detectConflicts,evaluatePublication};
