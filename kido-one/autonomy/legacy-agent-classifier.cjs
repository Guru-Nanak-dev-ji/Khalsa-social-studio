'use strict';
// KIDO ONE Step 34 — read-only legacy agent manifest classification.
// Accepts only user-supplied relative file names, never reads files or executes code.
const path=require('node:path');
const ROOTS=Object.freeze(['ai-army','command-agents','auto-agents','world-agents','rooms']);
function classifyLegacyFile({root,relativePath}={}){
 if(!ROOTS.includes(root)||typeof relativePath!=='string'||!relativePath.trim())return {status:'REJECTED',reason:'INVALID_ENTRY'};
 const normalized=relativePath.replaceAll('\\','/');
 const parts=normalized.split('/');
 if(path.posix.isAbsolute(normalized)||parts.some(x=>x==='..'||x===''||x==='.')||normalized.includes('\0'))
  return {status:'REJECTED',reason:'UNSAFE_PATH'};
 const base=parts.at(-1).toLowerCase();
 if(/(^\.env|secret|token|credential|password|private|(^|[._-])key([._-]|$))/i.test(normalized))
  return {status:'EXCLUDED',reason:'SENSITIVE_NAME'};
 const kind=/\.(js|cjs|mjs|py|sh|ts)$/.test(base)?'CODE':/\.(json|ya?ml|toml)$/.test(base)?'CONFIG':/\.(md|txt)$/.test(base)?'DOC':'OTHER';
 const hints=[];
 if(/brahma|memory/.test(normalized.toLowerCase()))hints.push('MEMORY');
 if(/agent|army|soul|room/.test(normalized.toLowerCase()))hints.push('AGENT');
 if(/auto|watchdog|monitor|health/.test(normalized.toLowerCase()))hints.push('MONITOR');
 if(/server|gateway|api/.test(normalized.toLowerCase()))hints.push('SERVICE');
 return {status:'INVENTORY_ONLY',root,relativePath:normalized,kind,hints,verifiedCode:false,executed:false};
}
module.exports={ROOTS,classifyLegacyFile};
