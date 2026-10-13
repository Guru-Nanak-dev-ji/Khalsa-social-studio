// KDN Telegram bot — Cloudflare Worker (webhook). Port of the box prototype bot.py.
// Secrets (never in code): TELEGRAM_BOT_TOKEN, WEBHOOK_SECRET, APP_KEY (for Creator /draft). Vars: OWNER_ID, GROUP_ID, optional TEST_GROUP_ID (wrangler.toml).
export function extractPost(text){const t=text||'';const a=t.indexOf('"'),b=t.lastIndexOf('"');return a>=0&&b>a?t.slice(a+1,b):t;}
export const KEYBOARD={inline_keyboard:[[{text:'✅ हाँ, post करो',callback_data:'post_yes'},{text:'✏️ बदलो',callback_data:'post_edit'},{text:'❌ नहीं',callback_data:'post_no'}]]};
// Extra 🧪 button only when TEST_GROUP_ID is set; otherwise the keyboard is unchanged.
export function waUrl(text,max=1800){const base='https://wa.me/?text=',e=encodeURIComponent;const c=Array.from(String(text||''));if((base+e(c.join(''))).length<=max)return base+e(c.join(''));let lo=0,hi=c.length;while(lo<hi){const m=Math.ceil((lo+hi)/2);if((base+e(c.slice(0,m).join('')+'…')).length<=max)lo=m;else hi=m-1;}return base+e(c.slice(0,lo).join('')+'…');}
export function keyboardFor(env,post){const rows=[...KEYBOARD.inline_keyboard];if(env&&env.TEST_GROUP_ID)rows.push([{text:'🧪 Test group में डालो',callback_data:'post_test'}]);if(post)rows.push([{text:'🟢 WhatsApp पर भेजो',url:waUrl(post)}]);return rows.length===KEYBOARD.inline_keyboard.length?KEYBOARD:{inline_keyboard:rows};}
async function call(env,method,body){
  const r=await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
  return r.json();
}
export async function handleUpdate(u,env,send=call){
  const OWNER=Number(env.OWNER_ID),GROUP=Number(env.GROUP_ID);
  // Owner can create an approval popup by messaging the bot: /post <text>
  // Bot added to a group by the owner -> DM owner the group title + id.
  const cm=u.my_chat_member;
  if(cm){
    const st=cm.new_chat_member?.status,ty=cm.chat?.type;
    if(cm.from?.id===OWNER&&(st==='member'||st==='administrator')&&(ty==='group'||ty==='supergroup')){await send(env,'sendMessage',{chat_id:OWNER,text:`Bot इस group में जुड़ा:\n${cm.chat.title||''}\nID: ${cm.chat.id}`});return 'added';}
    return 'ignored';
  }
  const m=u.message;
  if(m){
    // Owner types /id in a group -> DM owner the chat title + id; nothing in the group.
    if(m.from?.id===OWNER&&(m.chat?.type==='group'||m.chat?.type==='supergroup')&&/^\/id(?:@\w+)?$/.test((m.text||'').trim())){await send(env,'sendMessage',{chat_id:OWNER,text:`Group: ${m.chat.title||''}\nID: ${m.chat.id}`});return 'id';}
    if(m.from?.id!==OWNER||m.chat?.type!=='private')return 'ignored';
    let txt=(m.text||'').trim().replace(/^["'“”]+|["'“”]+$/g,'').trim();
    if(/^\/yt(?:@\w+)?$/.test(txt)){if(!env.APP_KEY||!env.YT_CLIENT_ID){await send(env,'sendMessage',{chat_id:OWNER,text:'YouTube setup अभी अधूरा है।'});return 'yt';}await send(env,'sendMessage',{chat_id:OWNER,text:`YouTube जोड़ने के लिए यह link खोलें (15 मिनट तक चलेगा):\nhttps://kdn-telegram-bot.khatrinewsnetwork.workers.dev/yt/start?t=${await ytToken(env)}`});return 'yt';}
    if(/^\/channels(?:@\w+)?$/.test(txt)){await send(env,'sendMessage',channelsMessage(env,await ytChannels(env)));return 'channels';}
    if(txt==='/start'||txt==='/help'||txt==='/post'){await send(env,'sendMessage',{chat_id:OWNER,text:'जो भी post डालनी हो, बस वही text यहाँ लिख दें। मैं पूछूँगा, फिर ✅ दबाने पर Khalsa konnect में डाल दूँगा।'});return 'help';}
    const pm=txt.match(/^\/post(?:@\w+)?\s+([\s\S]+)$/);const post=(pm?pm[1]:(txt.startsWith('/')?'':txt)).trim();
    if(post){await send(env,'sendMessage',{chat_id:OWNER,text:`Khalsa konnect में यह post डालूँ?\n\n"${post}"`,reply_markup:keyboardFor(env,post)});return 'asked';}
    await send(env,'sendMessage',{chat_id:OWNER,text:'Post के लिए लिखें: /post आपका text'});return 'help';
  }
  const q=u.callback_query;
  if(!q||q.from?.id!==OWNER)return 'ignored';
  const msg=q.message,d=q.data;
  const ym=/^yt(def|del):(.+)$/.exec(d||'');
  if(ym){const ok=ym[1]==='def'?await ytSetDefault(env,ym[2]):await ytRemove(env,ym[2]);
    await send(env,'answerCallbackQuery',{callback_query_id:q.id,text:ok?(ym[1]==='def'?'⭐ Default channel बदल गया':'🗑 Channel हटा दिया'):'Channel नहीं मिला'});
    const v=channelsMessage(env,await ytChannels(env));
    if(msg)await send(env,'editMessageText',{chat_id:msg.chat.id,message_id:msg.message_id,text:v.text,reply_markup:v.reply_markup||{inline_keyboard:[]}});
    return 'yt'+ym[1];}
  const post=extractPost(msg?.text);let note;
  if(d==='post_yes'){await send(env,'sendMessage',{chat_id:GROUP,text:post});note='✅ Khalsa konnect में post हो गया।';}
  else if(d==='post_test'&&env.TEST_GROUP_ID){await send(env,'sendMessage',{chat_id:Number(env.TEST_GROUP_ID),text:post});note='🧪 Test group में post हो गया।';}
  else if(d==='post_edit')note='✏️ नया text भेजें: /post नया text';
  else note='❌ ठीक है, post नहीं डाली।';
  await send(env,'answerCallbackQuery',{callback_query_id:q.id,text:note});
  await send(env,'editMessageReplyMarkup',{chat_id:msg.chat.id,message_id:msg.message_id,reply_markup:{inline_keyboard:[]}});
  await send(env,'sendMessage',{chat_id:OWNER,text:note});
  return d;
}
export const ALLOWED_ORIGIN='https://guru-nanak-dev-ji.github.io';
export const MAX_DRAFT=3500;
const enc=new TextEncoder();
// Constant-time comparison: hash both values to equal length, then XOR every byte.
export async function safeEqual(a,b){
  if(typeof a!=='string'||typeof b!=='string'||!a||!b)return false;
  const [x,y]=await Promise.all([a,b].map(v=>crypto.subtle.digest('SHA-256',enc.encode(v))));
  const p=new Uint8Array(x),q=new Uint8Array(y);let diff=0;for(let i=0;i<p.length;i++)diff|=p[i]^q[i];return diff===0;
}
// Simple per-isolate limiter (best effort; Workers may run several isolates).
const hits=new Map();
export function rateLimited(key,now=Date.now(),limit=5,windowMs=60000){
  const list=(hits.get(key)||[]).filter(t=>now-t<windowMs);
  if(list.length>=limit){hits.set(key,list);return true;}
  list.push(now);hits.set(key,list);if(hits.size>1000)hits.clear();return false;
}
function cors(origin){return origin===ALLOWED_ORIGIN?{'Access-Control-Allow-Origin':ALLOWED_ORIGIN,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'content-type, x-kdn-app-key','Access-Control-Max-Age':'86400',Vary:'Origin'}:{Vary:'Origin'};}
function json(body,status,headers){return new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json',...headers}});}
// Creator -> owner approval popup. Never posts to the group; only the owner's ✅ does.
export async function handleDraft(request,env,send=call){
  const origin=request.headers.get('Origin')||'',h=cors(origin);
  if(request.method==='OPTIONS')return new Response(null,{status:origin===ALLOWED_ORIGIN?204:403,headers:h});
  if(request.method!=='POST')return json({ok:false,error:'method'},405,h);
  if(origin!==ALLOWED_ORIGIN)return json({ok:false,error:'origin'},403,h);
  if(!env.APP_KEY)return json({ok:false,error:'not-configured'},503,h);
  const ip=request.headers.get('CF-Connecting-IP')||'unknown';
  if(rateLimited(ip))return json({ok:false,error:'rate'},429,{...h,'Retry-After':'60'});
  if(!(await safeEqual(request.headers.get('X-KDN-App-Key')||'',env.APP_KEY)))return json({ok:false,error:'key'},401,h);
  let data;try{data=await request.json();}catch{return json({ok:false,error:'json'},400,h);}
  const text=typeof data?.text==='string'?data.text.trim():'';
  if(!text)return json({ok:false,error:'empty'},400,h);
  if(Array.from(text).length>MAX_DRAFT)return json({ok:false,error:'long'},413,h);
  await send(env,'sendMessage',{chat_id:Number(env.OWNER_ID),text:`Creator से नया draft — Khalsa konnect में यह post डालूँ?\n\n"${text}"`,reply_markup:keyboardFor(env,text)});
  return json({ok:true},200,h);
}

// ---- YouTube OAuth (owner-only). Link is signed with APP_KEY (HMAC), valid 15 min. ----
const YT_REDIRECT='https://kdn-telegram-bot.khatrinewsnetwork.workers.dev/yt/callback';
const YT_SCOPES='https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload';
const b64u=buf=>btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
async function hmac(key,msg){const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(key),{name:'HMAC',hash:'SHA-256'},false,['sign']);return b64u(await crypto.subtle.sign('HMAC',k,new TextEncoder().encode(msg)));}
export async function ytToken(env,now=Date.now()){const exp=Math.floor(now/1000)+900;return `${exp}.${await hmac(env.APP_KEY,'yt|'+exp)}`;}
export async function ytVerify(env,t,now=Date.now()){if(!env.APP_KEY||!t)return false;const [exp,sig]=String(t).split('.');if(!exp||!sig||Number(exp)<Math.floor(now/1000))return false;return safeEqual(sig,await hmac(env.APP_KEY,'yt|'+exp));}
const page=(title,body,status=200)=>new Response(`<!doctype html><html lang="hi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><body style="font-family:sans-serif;background:#0b1020;color:#f5e6b8;text-align:center;padding:40px 16px"><h1>${title}</h1><p style="font-size:18px">${body}</p></body></html>`,{status,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// ---- Multi-channel YouTube store (KV) ----
// yt_ch:<channelId> = {id,title,refresh_token,connected}; yt_channels = [ids]; yt_default = id.
// Legacy keys yt_refresh_token / yt_channel always mirror the default channel (backward compatible).
const kvGet=async(env,k)=>{const kv=env.KDN_KV;if(!kv||typeof kv.get!=='function')return null;return kv.get(k);};
const kvJson=async(env,k,d)=>{try{const v=await kvGet(env,k);return v?JSON.parse(v):d;}catch(e){return d;}};
async function ytIndex(env){
  let ids=await kvJson(env,'yt_channels',null);
  if(Array.isArray(ids))return ids;
  // Migrate old single-token data once.
  const rt=await kvGet(env,'yt_refresh_token');if(!rt)return [];
  const title=(await kvGet(env,'yt_channel'))||'YouTube channel (पुराना)';
  const rec={id:'legacy',title,refresh_token:rt,connected:''};
  await env.KDN_KV.put('yt_ch:legacy',JSON.stringify(rec));await env.KDN_KV.put('yt_channels',JSON.stringify(['legacy']));await env.KDN_KV.put('yt_default','legacy');
  return ['legacy'];
}
export async function ytChannels(env){
  if(!env.KDN_KV)return {list:[],def:null};
  const ids=await ytIndex(env);const list=[];
  for(const id of ids){const r=await kvJson(env,'yt_ch:'+id,null);if(r)list.push({id,title:r.title||id,connected:r.connected||''});}
  let def=await kvGet(env,'yt_default');if(!list.some(c=>c.id===def))def=list[0]?.id||null;
  return {list,def};
}
async function ytMirrorLegacy(env,id,known){
  const kv=env.KDN_KV;const r=known||(id?await kvJson(env,'yt_ch:'+id,null):null);
  if(r){await kv.put('yt_default',id);await kv.put('yt_refresh_token',r.refresh_token);await kv.put('yt_channel',r.title);}
  else if(typeof kv.delete==='function'){await kv.delete('yt_default');await kv.delete('yt_refresh_token');await kv.delete('yt_channel');}
}
export async function ytSaveChannel(env,rec){
  const kv=env.KDN_KV;const ids=await ytIndex(env);
  await kv.put('yt_ch:'+rec.id,JSON.stringify(rec));
  if(!ids.includes(rec.id))ids.push(rec.id);
  await kv.put('yt_channels',JSON.stringify(ids));
  const def=await kvGet(env,'yt_default');
  // New channel becomes default only if there is none yet; re-connecting the default refreshes legacy mirror.
  if(!def||!ids.includes(def)||def===rec.id||typeof kv.get!=='function')await ytMirrorLegacy(env,rec.id,rec);
}
export async function ytSetDefault(env,id){if(!env.KDN_KV)return false;const ids=await ytIndex(env);if(!ids.includes(id))return false;await ytMirrorLegacy(env,id);return true;}
export async function ytRemove(env,id){
  const kv=env.KDN_KV;if(!kv)return false;const ids=await ytIndex(env);if(!ids.includes(id))return false;
  const rest=ids.filter(x=>x!==id);await kv.put('yt_channels',JSON.stringify(rest));
  if(typeof kv.delete==='function')await kv.delete('yt_ch:'+id);
  const def=await kvGet(env,'yt_default');if(def===id||!def)await ytMirrorLegacy(env,rest[0]||null);
  return true;
}
export function channelsMessage(env,{list,def}){
  const OWNER=Number(env.OWNER_ID);
  if(!list.length)return {chat_id:OWNER,text:'अभी कोई YouTube channel नहीं जुड़ा। /yt भेजकर जोड़ें।'};
  const lines=list.map((c,i)=>`${i+1}. ${c.id===def?'⭐ ':''}${c.title}`);
  const kb=list.map(c=>[{text:(c.id===def?'⭐ ':'')+'Default: '+c.title.slice(0,24),callback_data:('ytdef:'+c.id).slice(0,64)},{text:'🗑 हटाओ',callback_data:('ytdel:'+c.id).slice(0,64)}]);
  return {chat_id:OWNER,text:`जुड़े हुए YouTube channels (⭐ = default):\n${lines.join('\n')}\n\nनया channel जोड़ने के लिए /yt भेजें।`,reply_markup:{inline_keyboard:kb}};
}
export async function handleYt(request,env,send=call,f=fetch){
  const u=new URL(request.url);
  if(!env.YT_CLIENT_ID||!env.YT_CLIENT_SECRET||!env.APP_KEY)return page('अभी तैयार नहीं','YouTube setup अधूरा है।',503);
  if(u.pathname==='/yt/start'){
    const t=u.searchParams.get('t');if(!(await ytVerify(env,t)))return page('Link पुराना है','Telegram में bot को /yt भेजकर नया link लीजिए।',403);
    const q=new URLSearchParams({client_id:env.YT_CLIENT_ID,redirect_uri:YT_REDIRECT,response_type:'code',scope:YT_SCOPES,access_type:'offline',prompt:'consent',include_granted_scopes:'true',state:t});
    return Response.redirect('https://accounts.google.com/o/oauth2/v2/auth?'+q,302);
  }
  if(u.pathname==='/yt/callback'){
    if(u.searchParams.get('error'))return page('इजाज़त नहीं मिली','आपने Allow नहीं दबाया। Telegram में /yt भेजकर दोबारा कोशिश करें।',400);
    if(!(await ytVerify(env,u.searchParams.get('state'))))return page('Link पुराना है','Telegram में bot को /yt भेजकर नया link लीजिए।',403);
    const code=u.searchParams.get('code');if(!code)return page('गड़बड़','Code नहीं मिला।',400);
    const tr=await f('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({code,client_id:env.YT_CLIENT_ID,client_secret:env.YT_CLIENT_SECRET,redirect_uri:YT_REDIRECT,grant_type:'authorization_code'})});
    const tok=await tr.json().catch(()=>({}));
    if(!tr.ok||!tok.access_token){console.log('yt token err',tok&&tok.error);return page('गड़बड़','Google से token नहीं मिला। /yt से दोबारा कोशिश करें।',502);}
    let channel='',chId='';
    try{const cr=await f('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',{headers:{authorization:'Bearer '+tok.access_token}});const cj=await cr.json();const it=cj.items?.[0];channel=it?.snippet?.title||'';chId=it?.id||'';}catch(e){}
    if(!chId)chId='noid-'+Date.now().toString(36);
    if(!channel)channel=`YouTube channel (${chId})`;
    let stored=false;
    if(tok.refresh_token&&env.KDN_KV){await ytSaveChannel(env,{id:chId,title:channel,refresh_token:tok.refresh_token,connected:new Date().toISOString()});stored=true;}
    await send(env,'sendMessage',{chat_id:Number(env.OWNER_ID),text:`YouTube जुड़ गया: ${channel}`+(stored?'':'\n⚠️ Token save नहीं हुआ (KV नहीं जुड़ा)।')});
    return page('✅ YouTube जुड़ गया',`Channel: <b>${esc(channel)}</b><br>अब आप यह page बंद करके Telegram पर लौट सकते हैं। 🙏`);
  }
  return new Response('not found',{status:404});
}
// ---- KNN News channel accounts (KV: news_ch:<handle>, news_index, news_owner:<tgId>) ----
export const NEWS_SUFFIX=/(?:^|[\s\u00a0·\-])(news(?:\s+tv)?|न्यूज़?(?:\s+(?:टीवी|tv))?|ਨਿਊਜ਼?(?:\s+(?:ਟੀਵੀ|tv))?)$/iu;
const nclean=s=>String(s==null?'':s).normalize('NFC').replace(/[\u0000-\u001f\u007f<>]/g,'').replace(/\s+/g,' ').trim();
export function newsValidate(c){const e={};const n=nclean(c.name);const m=NEWS_SUFFIX.exec(n);
 if(n.length<6||n.length>40||!m||nclean(n.slice(0,m.index)).length<2)e.name='name must end with News / News TV';
 if(!/^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$/.test(String(c.handle||'')))e.handle='bad handle';
 const city=nclean(c.city);if(city.length<2||city.length>40)e.city='bad city';
 if(!['hi','pa','en'].includes(c.lang))e.lang='bad lang';if(!/^#[0-9a-f]{6}$/i.test(String(c.tickerColor||'')))e.tickerColor='bad color';
 const l=c.logo;if(!(l===''||l==null||(typeof l==='string'&&l.length<=60000&&/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(l))))e.logo='bad logo';return e;}
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
// Telegram Login Widget: hash = HMAC_SHA256(data_check_string, SHA256(bot_token)).
export async function verifyTelegramLogin(auth,token,now=Date.now()){
 if(!auth||typeof auth!=='object'||!token||typeof auth.hash!=='string')return null;
 const keys=Object.keys(auth).filter(k=>k!=='hash'&&auth[k]!=null&&auth[k]!=='').sort();
 const dcs=keys.map(k=>k+'='+auth[k]).join('\n');const enc=new TextEncoder();
 const secret=await crypto.subtle.digest('SHA-256',enc.encode(token));
 const key=await crypto.subtle.importKey('raw',secret,{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const sig=hex(await crypto.subtle.sign('HMAC',key,enc.encode(dcs)));
 if(!(await safeEqual(sig,auth.hash.toLowerCase())))return null;
 const age=now/1000-Number(auth.auth_date);if(!(age>=-300&&age<86400))return null;
 return {id:String(auth.id),username:auth.username||'',first_name:auth.first_name||''};}
function ncors(origin){return origin===ALLOWED_ORIGIN?{'Access-Control-Allow-Origin':ALLOWED_ORIGIN,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'content-type','Access-Control-Max-Age':'86400',Vary:'Origin'}:{Vary:'Origin'};}
const pub=c=>({handle:c.handle,name:c.name,city:c.city,lang:c.lang,logo:c.logo||'',tickerColor:c.tickerColor,created:c.created,by:c.by||''});
export async function handleNews(request,env){
 const url=new URL(request.url),origin=request.headers.get('Origin')||'',h=ncors(origin),kv=env.KDN_KV;
 if(request.method==='OPTIONS')return new Response(null,{status:origin===ALLOWED_ORIGIN?204:403,headers:h});
 if(!kv)return json({error:'storage unavailable'},503,h);
 if(request.method==='GET'&&url.pathname==='/news/channels'){const idx=JSON.parse(await kv.get('news_index')||'[]');
  const list=(await Promise.all(idx.slice(-200).map(k=>kv.get('news_ch:'+k)))).filter(Boolean).map(s=>pub(JSON.parse(s)));
  return json({channels:list.reverse()},200,{...h,'Cache-Control':'public, max-age=30'});}
 const m=/^\/news\/channel\/([a-z0-9-]{3,30})$/.exec(url.pathname);
 if(request.method==='GET'&&m){const s=await kv.get('news_ch:'+m[1]);return s?json({channel:pub(JSON.parse(s))},200,h):json({error:'not found'},404,h);}
 if(request.method==='POST'&&url.pathname==='/news/channel'){
  if(origin!==ALLOWED_ORIGIN)return json({error:'forbidden'},403,h);
  if(rateLimited('news:'+(request.headers.get('CF-Connecting-IP')||'?')))return json({error:'slow down'},429,h);
  const raw=await request.text();if(raw.length>80000)return json({error:'too large'},413,h);
  let body;try{body=JSON.parse(raw);}catch{return json({error:'bad json'},400,h);}
  const user=await verifyTelegramLogin(body&&body.auth,env.TELEGRAM_BOT_TOKEN);if(!user)return json({error:'telegram login invalid'},401,h);
  const c=body.channel||{};const errors=newsValidate(c);if(Object.keys(errors).length)return json({error:'invalid',errors},400,h);
  const mine=JSON.parse(await kv.get('news_owner:'+user.id)||'[]');if(mine.length>=3)return json({error:'limit: 3 channels per account'},409,h);
  if(await kv.get('news_ch:'+c.handle))return json({error:'handle taken'},409,h);
  const name=nclean(c.name).toLowerCase();const idx=JSON.parse(await kv.get('news_index')||'[]');
  const rec={handle:c.handle,name:nclean(c.name),city:nclean(c.city),lang:c.lang,logo:c.logo||'',tickerColor:c.tickerColor.toLowerCase(),owner:user.id,by:String(user.first_name).slice(0,40),created:new Date().toISOString()};
  for(const k of idx.slice(-500)){const s=await kv.get('news_ch:'+k);if(s&&JSON.parse(s).name.toLowerCase()===name)return json({error:'name taken'},409,h);}
  await kv.put('news_ch:'+c.handle,JSON.stringify(rec));idx.push(c.handle);await kv.put('news_index',JSON.stringify(idx));
  mine.push(c.handle);await kv.put('news_owner:'+user.id,JSON.stringify(mine));
  return json({ok:true,channel:pub(rec)},201,h);}
 return json({error:'not found'},404,h);}

// ---- 💬 सुझाव: site bubble -> KV + owner Telegram. List/done need APP_KEY (or SUGGEST_KEY) ----
export const MAX_SUGGEST=500;
function scors(origin){return origin===ALLOWED_ORIGIN?{'Access-Control-Allow-Origin':ALLOWED_ORIGIN,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'content-type, x-kdn-app-key','Access-Control-Max-Age':'86400',Vary:'Origin'}:{Vary:'Origin'};}
async function suggestAuth(env,key){if(!key)return false;for(const k of [env.APP_KEY,env.SUGGEST_KEY])if(k&&await safeEqual(String(key),k))return true;return false;}
async function kvRate(kv,ip,now,limit=10){const k='srl:'+ip+':'+Math.floor(now/60000);const n=Number(await kv.get(k)||0);if(n>=limit)return true;await kv.put(k,String(n+1),{expirationTtl:120});return false;}
export async function handleSuggest(request,env,send=call,now=Date.now()){
 const url=new URL(request.url),origin=request.headers.get('Origin')||'',h=scors(origin),kv=env.KDN_KV;
 if(request.method==='OPTIONS')return new Response(null,{status:origin===ALLOWED_ORIGIN?204:403,headers:h});
 if(!kv)return json({ok:false,error:'storage'},503,h);
 if(request.method==='GET'&&url.pathname==='/suggest/list'){
  if(!(await suggestAuth(env,url.searchParams.get('key')||request.headers.get('X-KDN-App-Key'))))return json({ok:false,error:'key'},401,h);
  const all=url.searchParams.get('all')==='1';const out=[];let cursor;
  do{const r=await kv.list({prefix:'suggest:',cursor});for(const k of r.keys){const v=await kv.get(k.name);if(!v)continue;const it=JSON.parse(v);if(all||it.status==='new')out.push({id:k.name,...it});}cursor=r.list_complete?null:r.cursor;}while(cursor);
  return json({ok:true,items:out},200,{...h,'Cache-Control':'no-store'});}
 if(request.method!=='POST')return json({ok:false,error:'method'},405,h);
 let data;try{data=JSON.parse((await request.text()).slice(0,8000));}catch{return json({ok:false,error:'json'},400,h);}
 if(url.pathname==='/suggest/done'){
  if(!(await suggestAuth(env,data?.key||request.headers.get('X-KDN-App-Key'))))return json({ok:false,error:'key'},401,h);
  const id=String(data?.id||'');if(!/^suggest:\d+:[a-z0-9]+$/.test(id))return json({ok:false,error:'id'},400,h);
  const v=await kv.get(id);if(!v)return json({ok:false,error:'not found'},404,h);
  const it=JSON.parse(v);it.status='done';it.note=String(data?.note||'').slice(0,500);it.done=new Date(now).toISOString();
  await kv.put(id,JSON.stringify(it));return json({ok:true,id,item:it},200,h);}
 if(url.pathname!=='/suggest')return json({ok:false,error:'not found'},404,h);
 if(origin!==ALLOWED_ORIGIN)return json({ok:false,error:'origin'},403,h);
 const text=typeof data?.text==='string'?data.text.replace(/\s+/g,' ').trim():'';
 if(!text)return json({ok:false,error:'empty'},400,h);
 if(Array.from(text).length>MAX_SUGGEST)return json({ok:false,error:'long'},413,h);
 const page=String(data?.page||'?').replace(/[^\w.\-\/#]/g,'').slice(0,80)||'?';
 const ip=request.headers.get('CF-Connecting-IP')||'unknown';
 if(await kvRate(kv,ip,now))return json({ok:false,error:'rate'},429,{...h,'Retry-After':'60'});
 const ts=Number.isFinite(Number(data?.ts))&&Number(data.ts)>0?Math.floor(Number(data.ts)):now;
 const id=`suggest:${ts}:${Math.random().toString(36).slice(2,8)||'x'}`;
 await kv.put(id,JSON.stringify({text,page,ts,status:'new',created:new Date(now).toISOString()}),{expirationTtl:60*60*24*180});
 try{await send(env,'sendMessage',{chat_id:Number(env.OWNER_ID),text:`💬 सुझाव (${page}): ${text}`});}catch(e){}
 return json({ok:true,id},200,h);}
export default {
  async fetch(request,env){
    const path=new URL(request.url).pathname;
    if(path==='/draft')return handleDraft(request,env);
    if(path==='/suggest'||path.startsWith('/suggest/'))return handleSuggest(request,env);
    if(path.startsWith('/news/'))return handleNews(request,env);
    if(path==='/yt/start'||path==='/yt/callback')return handleYt(request,env);
    if(request.method!=='POST')return new Response('KDN bot OK');
    // Only Telegram (which knows WEBHOOK_SECRET) may call the webhook.
    if(!env.WEBHOOK_SECRET||request.headers.get('X-Telegram-Bot-Api-Secret-Token')!==env.WEBHOOK_SECRET)return new Response('forbidden',{status:403});
    try{await handleUpdate(await request.json(),env);}catch(e){console.log('err',e&&e.message);}
    return new Response('ok');
  }
};
