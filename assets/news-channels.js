(()=>{'use strict';const C=window.KNNChannels,$=id=>document.getElementById(id);
const form=$('form'),st=$('f-status');let auth=null,logo='';
try{auth=JSON.parse(sessionStorage.getItem('knn_tg_auth')||'null');}catch{}
function setAuth(a){auth=a;if(a)sessionStorage.setItem('knn_tg_auth',JSON.stringify(a));
 $('login-box').hidden=!!a;$('who').hidden=!a;if(a)$('who').textContent='✅ Login: '+(a.first_name||'')+' — अब नीचे चैनल बनाइए ②';form.dataset.locked=a?'0':'1';}
window.KNNonAuth=u=>setAuth(u);
const s=document.createElement('script');s.async=true;s.src='https://telegram.org/js/telegram-widget.js?22';
s.dataset.telegramLogin='Khalsaworld_bot';s.dataset.size='large';s.dataset.radius='12';s.dataset.onauth='KNNonAuth(user)';s.dataset.lang='hi';$('tg-login').append(s);
setAuth(auth);
function card(c){const a=document.createElement('a');a.className='chan';a.href='./newsroom.html?channel='+encodeURIComponent(c.handle);
 let pic;if(c.logo){pic=document.createElement('img');pic.src=c.logo;pic.alt='';}else{pic=document.createElement('span');pic.className='ph';pic.textContent=C.shortName(c.name).slice(0,3);}
 const t=document.createElement('div');const b=document.createElement('b');b.textContent=c.name;const sm=document.createElement('small');sm.textContent='📍 '+c.city+' · '+(C.LANGS[c.lang]||'')+' · @'+c.handle;
 const tk=document.createElement('span');tk.className='tick';tk.style.background=C.colorOk(c.tickerColor)?c.tickerColor:'#f2c66a';t.append(b,sm,tk);a.append(pic,t);return a;}
async function load(){try{const r=await fetch(C.API+'/news/channels');if(!r.ok)throw 0;const {channels}=await r.json();localStorage.setItem('knn_channels',JSON.stringify(channels));
 $('channels').replaceChildren(...channels.map(card));$('list-status').textContent=channels.length?channels.length+' चैनल':'अभी कोई चैनल नहीं — पहला चैनल आप बनाइए!';}
 catch{let saved=[];try{saved=JSON.parse(localStorage.getItem('knn_channels')||'[]');}catch(e){saved=[];}
  if(saved.length){$('channels').replaceChildren(...saved.map(card));$('list-status').textContent=saved.length+' चैनल';}
  else{$('list-status').textContent='अभी कोई चैनल नहीं — पहला चैनल आप बनाइए!';}}}
load();
const F={name:$('f-name'),handle:$('f-handle'),city:$('f-city'),lang:$('f-lang'),tickerColor:$('f-color')};let handleEdited=false;
F.handle.addEventListener('input',()=>{handleEdited=true;});
function data(){return{name:C.clean(F.name.value),handle:F.handle.value.trim().toLowerCase(),city:C.clean(F.city.value),lang:F.lang.value,tickerColor:F.tickerColor.value,logo};}
function show(errs){document.querySelectorAll('.err').forEach(p=>{p.textContent=errs[p.dataset.for]||'';});}
function preview(){const d=data();$('pv-name').textContent=d.name||'मालवा News';$('pv-tick').style.color=d.tickerColor;
 const L=$('pv-logo');L.replaceChildren();if(logo){const i=new Image();i.src=logo;i.alt='';L.append(i);}else L.textContent=C.shortName(d.name||'KNN').slice(0,3);}
F.name.addEventListener('input',()=>{if(!handleEdited){const g=C.slug(F.name.value.replace(/न्यूज़?|ਨਿਊਜ਼?/g,'news'));F.handle.value=/^(news|news-tv|tv)?$/.test(g)?'':g;}const e=C.nameError(F.name.value);show({...{},name:F.name.value?e:''});preview();});
Object.values(F).forEach(i=>i.addEventListener('change',preview));
$('f-logo').addEventListener('change',async e=>{const f=e.target.files[0];logo='';if(!f){preview();return;}
 try{const bmp=await createImageBitmap(f);const k=Math.min(1,160/Math.max(bmp.width,bmp.height));const cv=document.createElement('canvas');cv.width=Math.round(bmp.width*k);cv.height=Math.round(bmp.height*k);
  cv.getContext('2d').drawImage(bmp,0,0,cv.width,cv.height);let d=cv.toDataURL('image/webp',.8);if(!d.startsWith('data:image/webp'))d=cv.toDataURL('image/jpeg',.8);logo=d.length<=60000?d:'';if(!logo)show({logo:'Logo बहुत बड़ा है, दूसरी फ़ोटो चुनिए।'});}
 catch{show({logo:'यह फ़ोटो नहीं खुली।'});}preview();});
const MSG={'handle taken':'यह handle पहले से किसी का है, दूसरा चुनिए।','name taken':'इस नाम का चैनल पहले से है।','telegram login invalid':'Telegram login पुराना हो गया, दोबारा login कीजिए।','limit: 3 channels per account':'एक account से 3 चैनल तक बन सकते हैं।','slow down':'थोड़ा रुककर दोबारा कोशिश कीजिए।'};
form.addEventListener('submit',async e=>{e.preventDefault();const d=data();const errs=C.validate(d);show(errs);
 if(Object.keys(errs).length){st.textContent='❗ ऊपर लाल लिखी बातें ठीक कीजिए।';return;}
 if(!auth){st.textContent='❗ पहले Telegram से login कीजिए।';$('login-box').scrollIntoView({behavior:'smooth'});return;}
 st.textContent='⏳ चैनल बन रहा है…';$('f-submit').disabled=true;
 try{const r=await fetch(C.API+'/news/channel',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({auth,channel:d})});const j=await r.json().catch(()=>({}));
  if(r.ok){st.textContent='🎉 "'+j.channel.name+'" बन गया! News Studio में चुनकर live जाइए।';form.reset();logo='';handleEdited=false;preview();load();}
  else{if(r.status===401){sessionStorage.removeItem('knn_tg_auth');setAuth(null);}st.textContent='❗ '+(MSG[j.error]||'चैनल नहीं बना ('+r.status+')। नाम के आख़िर में News देखिए।');}}
 catch{st.textContent='❗ Server से जुड़ नहीं पाए। Internet जाँचिए।';}finally{$('f-submit').disabled=false;}});
preview();window.__knnLoad=load;})();
