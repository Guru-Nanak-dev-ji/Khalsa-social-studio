'use strict';
// KIDO ONE Step 11: PostgreSQL transaction adapter, NOT connected to a live DB.
// Caller provides a trusted pg-compatible pool; no credentials or network configured here.
const crypto=require('node:crypto');
const {validateCommand}=require('./policy-engine.cjs');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const stable=x=>Array.isArray(x)?'['+x.map(stable).join(',')+']':x&&typeof x==='object'?'{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+stable(x[k])).join(',')+'}':JSON.stringify(x);
async function appendCommandEvent(pool,{projectId,eventId,idempotencyKey,command,actorKind='AI',policyVersion='draft-v0.1'}){
 if(!pool||typeof pool.connect!=='function')throw Error('POOL_REQUIRED');
 if(!projectId||!eventId||!idempotencyKey||!policyVersion)throw Error('EVENT_IDENTIFIERS_REQUIRED');
 const v=validateCommand(command);if(!v.ok)throw Error('INVALID_COMMAND '+v.missing.join(','));
 if(!['AI','HUMAN','SERVICE'].includes(actorKind))throw Error('INVALID_ACTOR_KIND');
 const c=await pool.connect();let begun=false;
 try{
  await c.query('BEGIN');begun=true;
  await c.query('INSERT INTO kido_event_streams(project_id) VALUES ($1) ON CONFLICT DO NOTHING',[projectId]);
  const stream=(await c.query('SELECT last_seq,last_hash FROM kido_event_streams WHERE project_id=$1 FOR UPDATE',[projectId])).rows[0];
  const old=(await c.query('SELECT event_id,seq,event_hash FROM kido_events WHERE project_id=$1 AND idempotency_key=$2',[projectId,idempotencyKey])).rows[0];
  if(old){await c.query('COMMIT');begun=false;return {status:'ALREADY_RECORDED',...old};}
  const existing=(await c.query("SELECT payload->'command' AS command FROM kido_events WHERE project_id=$1 AND event_type='COMMAND_RECEIVED'",[projectId])).rows;
  if(existing.some(r=>r.command?.id===command.id))throw Error('DUPLICATE_COMMAND_ID');
  if(existing.some(r=>r.command?.scope===command.scope&&r.command?.exact_text!==command.exact_text)&&!(command.conflict_id && command.approval_evidence))throw Error('POTENTIAL_CONFLICT_REQUIRES_ID');
  const seq=Number(stream.last_seq)+1,previousHash=stream.last_hash;
  if(!Number.isSafeInteger(seq))throw Error('SEQUENCE_OVERFLOW');
  const payload={command};const eventHash=sha(stable({projectId,seq,eventId,idempotencyKey,previousHash,payload,policyVersion}));
  await c.query('INSERT INTO kido_events(project_id,seq,event_id,idempotency_key,event_type,actor_id,actor_kind,source_uri,policy_version,approval_ref,conflict_id,payload,previous_hash,event_hash) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13,$14)',[projectId,seq,eventId,idempotencyKey,'COMMAND_RECEIVED',command.issuer,actorKind,command.source_uri,policyVersion,command.approval_evidence||null,command.conflict_id||null,JSON.stringify(payload),previousHash,eventHash]);
  await c.query('UPDATE kido_event_streams SET last_seq=$2,last_hash=$3 WHERE project_id=$1',[projectId,seq,eventHash]);
  await c.query('COMMIT');begun=false;
  return {status:'RECORDED',projectId,eventId,seq,eventHash};
 }catch(e){if(begun)await c.query('ROLLBACK');throw e;}finally{c.release();}
}
module.exports={appendCommandEvent};
