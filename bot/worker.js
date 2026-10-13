// KDN Telegram bot — Cloudflare Worker (webhook). Port of the box prototype bot.py.
// Secrets (never in code): TELEGRAM_BOT_TOKEN, WEBHOOK_SECRET, APP_KEY (for Creator /draft). Vars: OWNER_ID, GROUP_ID, optional TEST_GROUP_ID (wrangler.toml).
export function extractPost(text){const t=text||'';const a=t.indexOf('"'),b=t.lastIndexOf('"');return a>=0&&b>a?t.slice(a+1,b):t;}
export const KEYBOARD={inline_keyboard:[[{text:'✅ हाँ, post करो',callback_data:'post_yes'},{text:'✏️ बदलो',callback_data:'post_edit'},{text:'❌ नहीं',callback_data:'post_no'}]]};
// Extra 🧪 button only when TEST_GROUP_ID is set; otherwise the keyboard is unchanged.
export function keyboardFor(env){if(!env||!env.TEST_GROUP_ID)return KEYBOARD;return {inline_keyboard:[...KEYBOARD.inline_keyboard,[{text:'🧪 Test group में डालो',callback_data:'post_test'}]]};}
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
    if(txt==='/start'||txt==='/help'||txt==='/post'){await send(env,'sendMessage',{chat_id:OWNER,text:'जो भी post डालनी हो, बस वही text यहाँ लिख दें। मैं पूछूँगा, फिर ✅ दबाने पर Khalsa konnect में डाल दूँगा।'});return 'help';}
    const pm=txt.match(/^\/post(?:@\w+)?\s+([\s\S]+)$/);const post=(pm?pm[1]:(txt.startsWith('/')?'':txt)).trim();
    if(post){await send(env,'sendMessage',{chat_id:OWNER,text:`Khalsa konnect में यह post डालूँ?\n\n"${post}"`,reply_markup:keyboardFor(env)});return 'asked';}
    await send(env,'sendMessage',{chat_id:OWNER,text:'Post के लिए लिखें: /post आपका text'});return 'help';
  }
  const q=u.callback_query;
  if(!q||q.from?.id!==OWNER)return 'ignored';
  const msg=q.message,d=q.data,post=extractPost(msg?.text);let note;
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
  await send(env,'sendMessage',{chat_id:Number(env.OWNER_ID),text:`Creator से नया draft — Khalsa konnect में यह post डालूँ?\n\n"${text}"`,reply_markup:keyboardFor(env)});
  return json({ok:true},200,h);
}
export default {
  async fetch(request,env){
    if(new URL(request.url).pathname==='/draft')return handleDraft(request,env);
    if(request.method!=='POST')return new Response('KDN bot OK');
    // Only Telegram (which knows WEBHOOK_SECRET) may call the webhook.
    if(!env.WEBHOOK_SECRET||request.headers.get('X-Telegram-Bot-Api-Secret-Token')!==env.WEBHOOK_SECRET)return new Response('forbidden',{status:403});
    try{await handleUpdate(await request.json(),env);}catch(e){console.log('err',e&&e.message);}
    return new Response('ok');
  }
};
