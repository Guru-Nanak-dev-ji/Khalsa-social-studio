// KDN Telegram bot — Cloudflare Worker (webhook). Port of the box prototype bot.py.
// Secrets (never in code): TELEGRAM_BOT_TOKEN, WEBHOOK_SECRET. Vars: OWNER_ID, GROUP_ID (wrangler.toml).
export function extractPost(text){const t=text||'';const a=t.indexOf('"'),b=t.indexOf('"',a+1);return a>=0&&b>a?t.slice(a+1,b):t;}
export const KEYBOARD={inline_keyboard:[[{text:'✅ हाँ, post करो',callback_data:'post_yes'},{text:'✏️ बदलो',callback_data:'post_edit'},{text:'❌ नहीं',callback_data:'post_no'}]]};
async function call(env,method,body){
  const r=await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
  return r.json();
}
export async function handleUpdate(u,env,send=call){
  const OWNER=Number(env.OWNER_ID),GROUP=Number(env.GROUP_ID);
  // Owner can create an approval popup by messaging the bot: /post <text>
  const m=u.message;
  if(m){
    if(m.from?.id!==OWNER||m.chat?.type!=='private')return 'ignored';
    const txt=m.text||'';
    if(txt.startsWith('/post ')){const post=txt.slice(6).trim();if(!post)return 'empty';
      await send(env,'sendMessage',{chat_id:OWNER,text:`Khalsa konnect में यह post डालूँ?\n\n"${post}"`,reply_markup:KEYBOARD});return 'asked';}
    await send(env,'sendMessage',{chat_id:OWNER,text:'Post के लिए लिखें: /post आपका text'});return 'help';
  }
  const q=u.callback_query;
  if(!q||q.from?.id!==OWNER)return 'ignored';
  const msg=q.message,d=q.data,post=extractPost(msg?.text);let note;
  if(d==='post_yes'){await send(env,'sendMessage',{chat_id:GROUP,text:post});note='✅ Khalsa konnect में post हो गया।';}
  else if(d==='post_edit')note='✏️ नया text भेजें: /post नया text';
  else note='❌ ठीक है, post नहीं डाली।';
  await send(env,'answerCallbackQuery',{callback_query_id:q.id,text:note});
  await send(env,'editMessageReplyMarkup',{chat_id:msg.chat.id,message_id:msg.message_id,reply_markup:{inline_keyboard:[]}});
  await send(env,'sendMessage',{chat_id:OWNER,text:note});
  return d;
}
export default {
  async fetch(request,env){
    if(request.method!=='POST')return new Response('KDN bot OK');
    // Only Telegram (which knows WEBHOOK_SECRET) may call the webhook.
    if(!env.WEBHOOK_SECRET||request.headers.get('X-Telegram-Bot-Api-Secret-Token')!==env.WEBHOOK_SECRET)return new Response('forbidden',{status:403});
    try{await handleUpdate(await request.json(),env);}catch(e){console.log('err',e&&e.message);}
    return new Response('ok');
  }
};
