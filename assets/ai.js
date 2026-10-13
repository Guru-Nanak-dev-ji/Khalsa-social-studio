// KDN AI साथी: runs a small open model fully in the browser via WebLLM (Apache-2.0).
const WEBLLM='https://esm.run/@mlc-ai/web-llm@0.2.86';
const $=id=>document.getElementById(id);
const T={
 home:['← Control Room','← ਕੰਟਰੋਲ ਰੂਮ','← Control Room'],title:['AI साथी','AI ਸਾਥੀ','AI Saathi'],
 sub:['मुफ़्त, open-source AI जो आपके फ़ोन में ही चलता है। कोई login या server नहीं; आपकी बातें फ़ोन से बाहर नहीं जातीं।','ਮੁਫ਼ਤ, open-source AI ਜੋ ਤੁਹਾਡੇ ਫ਼ੋਨ ਵਿੱਚ ਹੀ ਚੱਲਦਾ ਹੈ। ਕੋਈ login ਜਾਂ server ਨਹੀਂ; ਤੁਹਾਡੀਆਂ ਗੱਲਾਂ ਫ਼ੋਨ ਤੋਂ ਬਾਹਰ ਨਹੀਂ ਜਾਂਦੀਆਂ।','Free, open-source AI that runs inside your phone. No login or server; your chat stays on the device.'],
 model:['मॉडल चुनें','ਮਾਡਲ ਚੁਣੋ','Choose model'],start:['डाउनलोड करके शुरू करें','ਡਾਊਨਲੋਡ ਕਰਕੇ ਸ਼ੁਰੂ ਕਰੋ','Download and start'],
 send:['पूछें','ਪੁੱਛੋ','Ask'],toCreator:['Creator में भेजें','Creator ਵਿੱਚ ਭੇਜੋ','Send to Creator'],
 warn:['AI गलती कर सकता है। तथ्य, नाम और तारीखें खुद जाँचें।','AI ਗਲਤੀ ਕਰ ਸਕਦਾ ਹੈ। ਤੱਥ, ਨਾਮ ਅਤੇ ਤਾਰੀਖਾਂ ਆਪ ਜਾਂਚੋ।','AI can make mistakes. Check facts, names and dates yourself.'],
 size:['एक बार लगभग {mb} MB डाउनलोड होगा (Wi-Fi बेहतर)। फिर फ़ोन में सेव रहेगा और offline भी चल सकता है। छोटा मॉडल तेज़ है; बड़ा मॉडल हिंदी/ਪੰਜਾਬੀ में बेहतर है।','ਇੱਕ ਵਾਰ ਲਗਭਗ {mb} MB ਡਾਊਨਲੋਡ ਹੋਵੇਗਾ (Wi-Fi ਬਿਹਤਰ)। ਫਿਰ ਫ਼ੋਨ ਵਿੱਚ ਸੰਭਾਲਿਆ ਰਹੇਗਾ। ਛੋਟਾ ਮਾਡਲ ਤੇਜ਼ ਹੈ; ਵੱਡਾ ਮਾਡਲ ਹਿੰਦੀ/ਪੰਜਾਬੀ ਵਿੱਚ ਬਿਹਤਰ ਹੈ।','One-time download of about {mb} MB (Wi-Fi recommended), then stored on the phone. The small model is faster; the larger one is better in Hindi/Punjabi.'],
 noGpu:['इस browser में WebGPU नहीं है, इसलिए AI साथी यहाँ नहीं चल सकता। Android पर नया Chrome (121+) इस्तेमाल करें। बाकी KDN Studio पहले जैसा चलता है।','ਇਸ browser ਵਿੱਚ WebGPU ਨਹੀਂ ਹੈ, ਇਸ ਲਈ AI ਸਾਥੀ ਇੱਥੇ ਨਹੀਂ ਚੱਲ ਸਕਦਾ। Android ਉੱਤੇ ਨਵਾਂ Chrome (121+) ਵਰਤੋ। ਬਾਕੀ KDN Studio ਪਹਿਲਾਂ ਵਾਂਗ ਚੱਲਦਾ ਹੈ।','WebGPU is not available in this browser, so AI Saathi cannot run here. Use a recent Chrome (121+) on Android. The rest of KDN Studio works as before.'],
 loading:['डाउनलोड हो रहा है…','ਡਾਊਨਲੋਡ ਹੋ ਰਿਹਾ ਹੈ…','Downloading…'],ready:['तैयार! अपना सवाल लिखें।','ਤਿਆਰ! ਆਪਣਾ ਸਵਾਲ ਲਿਖੋ।','Ready! Type your question.'],
 fail:['मॉडल लोड नहीं हुआ: ','ਮਾਡਲ ਲੋਡ ਨਹੀਂ ਹੋਇਆ: ','Model failed to load: '],placeholder:['जैसे: लंगर सेवा के लिए एक छोटी पोस्ट लिखो','ਜਿਵੇਂ: ਲੰਗਰ ਸੇਵਾ ਲਈ ਇੱਕ ਛੋਟੀ ਪੋਸਟ ਲਿਖੋ','e.g. Write a short post about langar seva'],
 saved:['Creator में ड्राफ्ट सेव हुआ। ','Creator ਵਿੱਚ ਡਰਾਫਟ ਸੰਭਾਲਿਆ। ','Saved as a Creator draft. '],open:['Creator खोलें →','Creator ਖੋਲ੍ਹੋ →','Open Creator →'],saveFail:['ड्राफ्ट सेव नहीं हुआ।','ਡਰਾਫਟ ਸੰਭਾਲਿਆ ਨਹੀਂ ਗਿਆ।','Could not save the draft.']
};
const LANGNAME={hi:'Hindi (Devanagari script)',pa:'Punjabi (Gurmukhi script)',en:'English'};
let lang='hi',engine=null,history=[],last='';
const t=k=>T[k][{hi:0,pa:1,en:2}[lang]];
export function systemPrompt(l){return `You are "KDN Saathi", a kind, helpful assistant for KDN (Khalsa Digital World / Khatri Digital Network): seva, langar, community, knowledge and news. Always answer in ${LANGNAME[l]}. Keep answers short and clear for mobile. Help users write social media posts and news drafts; never invent facts, names, dates or quotes; mark anything uncertain. Be respectful to all faiths and people.`;}
function paint(){document.documentElement.lang=lang;document.querySelectorAll('[data-i18n]').forEach(n=>n.textContent=t(n.dataset.i18n));
 $('size-note').textContent=t('size').replace('{mb}',$('model').selectedOptions[0].dataset.mb);$('q').placeholder=t('placeholder');if(!hasGpu())showNoGpu();}
function hasGpu(){return 'gpu' in navigator&&!!navigator.gpu;}
function showNoGpu(){$('gpu').hidden=false;$('gpu').textContent=t('noGpu');$('start').disabled=true;}
function bubble(text,cls){const d=document.createElement('div');d.className='msg '+cls;d.textContent=text;$('log').append(d);$('log').scrollTop=1e9;return d;}
async function start(){
 $('start').disabled=true;$('bar').hidden=false;$('progress-text').textContent=t('loading');
 try{
  if(hasGpu()){const a=await navigator.gpu.requestAdapter();if(!a)throw new Error('no-adapter');}
  const webllm=await import(WEBLLM);
  engine=await webllm.CreateMLCEngine($('model').value,{initProgressCallback:p=>{$('bar').value=p.progress||0;$('progress-text').textContent=Math.round((p.progress||0)*100)+'% · '+(p.text||'');}});
  $('bar').value=1;$('progress-text').textContent=t('ready');$('q').disabled=false;$('send').disabled=false;$('model').disabled=true;$('q').focus();
 }catch(e){if(e.message==='no-adapter'){showNoGpu();}else{$('progress-text').textContent=t('fail')+(e.message||e);$('start').disabled=false;}}
}
async function ask(ev){
 ev.preventDefault();const q=$('q').value.trim();if(!q||!engine)return;$('q').value='';bubble(q,'me');
 history.push({role:'user',content:q});history=history.slice(-8);$('send').disabled=true;const out=bubble('…','bot');
 try{const chunks=await engine.chat.completions.create({messages:[{role:'system',content:systemPrompt(lang)},...history],stream:true,temperature:0.6,max_tokens:512});
  let text='';for await(const c of chunks){text+=c.choices[0]?.delta?.content||'';out.textContent=text;}
  last=text.trim();history.push({role:'assistant',content:last});$('to-creator').disabled=!last;
 }catch(e){out.textContent=t('fail')+(e.message||e);}finally{$('send').disabled=false;}
}
function toCreator(){
 const C=window.KDNCreator;if(!C||!last)return;
 try{const store=new C.Store(localStorage),now=new Date().toISOString();
  store.save({id:C.uid(),created:now,updated:now,language:lang,kind:'social',platform:'general',heading:'',body:last.slice(0,30000),source:'',tags:'#KDN'});
  const p=document.createElement('p');p.className='fine';p.textContent=t('saved');const a=document.createElement('a');a.href='./creator.html';a.textContent=t('open');p.append(a);$('log').append(p);
 }catch{bubble(t('saveFail'),'bot');}
}
$('lang').addEventListener('change',()=>{lang=$('lang').value;paint();});
$('model').addEventListener('change',paint);$('start').addEventListener('click',start);$('chat').addEventListener('submit',ask);$('to-creator').addEventListener('click',toCreator);
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
paint();
