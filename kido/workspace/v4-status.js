'use strict';
/* Additive, read-only V4 status renderer; no network calls or worker dispatch. */
(function(root){
 function validate(s){
  if(!s||s.schema!=='kido.workspace.v4.offline'||s.workers!==26||s.domains!==11||s.connected_handoff!=='NOT_VERIFIED'||s.receiver_ack!=='PENDING'||s.strict_loops!==0||s.publication!=='HOLD')throw Error('unverified workspace snapshot');
  const c=s.task_counts;
  if(!c||!['QUEUED','CLAIMED','COMPLETED'].every(k=>Number.isSafeInteger(c[k])&&c[k]>=0))throw Error('invalid task counts');
  return {workers:26,domains:11,queued:c.QUEUED,claimed:c.CLAIMED,completed:c.COMPLETED};
 }
 function render(doc,s){
  const data=validate(s),host=doc.getElementById('v4-verified-status');
  if(!host)throw Error('missing v4-verified-status');
  const lines=['Offline status — no connected AI receiver',`Workers: ${data.workers}; Domains: ${data.domains} (unverified)`,`Tasks: queued ${data.queued}, claimed ${data.claimed}, completed ${data.completed}`,'Handoff: NOT VERIFIED; ACK: PENDING; Publication: HOLD'];
  while(host.firstChild)host.removeChild(host.firstChild);
  for(const line of lines){const p=doc.createElement('p');p.textContent=line;host.appendChild(p)}
  return lines.length;
 }
 root.KidoV4Status=Object.freeze({validate,render});
})(typeof window!=='undefined'?window:globalThis);
