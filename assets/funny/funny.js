(()=>{'use strict';const F=window.KDNFunny,K=window.KDNKoins,$=id=>document.getElementById(id);
const load=(k,v,f)=>{try{return v(JSON.parse(localStorage.getItem(k)||'null'));}catch{return f();}};
const save=(k,s)=>{try{localStorage.setItem(k,JSON.stringify(s));}catch{}};
let kst=load(K.KEY,K.validate,K.fresh);{const w=K.grantWelcome(kst);if(w.added){kst=w.state;save(K.KEY,kst);}}
let st=load(F.KEY,F.validate,F.fresh);const today=F.dayKey(),J=F.jokeFor(today);let open=st.done.includes(today);
const DN=['रवि','सोम','मंगल','बुध','गुरु','शुक्र','शनि'];
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),1600);}
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;};
function paint(){$('h-koins').textContent=K.fmt(K.total(kst));const did=st.done.includes(today);
 $('j-icon').textContent=J.icon;$('j-setup').textContent=J.setup;$('j-punch').textContent=J.punch;
 const card=$('joke-card');card.className='joke-card'+(open?' open':'')+(did?' smiled':'');
 $('reveal').hidden=open;$('punch-wrap').hidden=!open;$('smile').hidden=!open||did;$('smile').disabled=did;
 $('done-msg').hidden=!did;if(did)$('done-msg').textContent='😊 आज मुस्कुराए — शाबाश! + koins मिल चुके।';
 const n=F.count(st);$('streak').textContent=`🌟 ${n} दिन मुस्कुराए · फनी साधक के लिए ${F.NEED} दिन`+(n<F.NEED?` (${F.NEED-n} बाकी)`:'');
 const W=$('week');W.textContent='';F.week(st,today).forEach(w=>{const c=el('div','wd'+(w.done?' done':'')+(w.today?' today':''));const dt=new Date(w.day+'T12:00');
  c.append(el('span','wn',DN[dt.getDay()]),el('span','wi',w.done?'😁':w.icon),el('span','wdn',String(dt.getDate())));c.title=w.day;W.append(c);});
 $('badge').hidden=!st.badge;}
$('reveal').onclick=()=>{open=true;paint();};
$('joke-card').onclick=e=>{if(e.target.closest('button'))return;if(!open){open=true;paint();}};
$('smile').onclick=()=>{if(!open)return toast('👆 पहले punchline खोलिए');const r=F.mark(st,today);if(!r.firstToday)return;st=r.state;save(F.KEY,st);
 const g=K.claimSpot(kst,'funny:'+today);kst=g.state;save(K.KEY,kst);toast(g.added?'😊 आज मुस्कुराए · +'+g.added+' 💰':'😊 आज मुस्कुराए');
 if(r.badgeNew)setTimeout(()=>toast('🏅 '+F.BADGE),1800);paint();};
$('say').onclick=()=>{if(!('speechSynthesis'in window))return toast('इस phone में आवाज़ नहीं है');speechSynthesis.cancel();
 const txt=open?('आज का चुटकुला: '+J.setup+' '+J.punch):('आज का चुटकुला: '+J.setup+' punchline खोलने के लिए कार्ड दबाएँ।');
 const u=new SpeechSynthesisUtterance(txt+' हँसी से सच, किसी को चोट नहीं।');u.lang='hi-IN';u.rate=.9;speechSynthesis.speak(u);};
paint();window.__funny={state:()=>st,koins:()=>K.total(kst),joke:()=>J,open:()=>open};})();
