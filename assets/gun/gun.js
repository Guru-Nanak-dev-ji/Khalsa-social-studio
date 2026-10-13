(()=>{'use strict';const G=window.KDNGun,K=window.KDNKoins,$=id=>document.getElementById(id);
const load=(k,v,f)=>{try{return v(JSON.parse(localStorage.getItem(k)||'null'));}catch{return f();}};
const save=(k,s)=>{try{localStorage.setItem(k,JSON.stringify(s));}catch{}};
let kst=load(K.KEY,K.validate,K.fresh);{const w=K.grantWelcome(kst);if(w.added){kst=w.state;save(K.KEY,kst);}}
let st=load(G.KEY,G.validate,G.fresh);const today=G.dayKey(),V=G.virtueFor(today);
const DN=['रवि','सोम','मंगल','बुध','गुरु','शुक्र','शनि'];
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),1600);}
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;};
function paint(){$('h-koins').textContent=K.fmt(K.total(kst));const did=st.done.includes(today);
 $('g-icon').textContent=V.icon;$('g-title').textContent=V.title;$('g-means').textContent=V.means;$('g-tip').textContent=V.tip;
 $('seal').className='seal'+(did?' done':'');$('done').hidden=did;$('done-msg').hidden=!did;
 const n=G.count(st);$('streak').textContent=`🌟 ${n} दिन गुण अपनाया · गुण साधक के लिए ${G.NEED} दिन`+(n<G.NEED?` (${G.NEED-n} बाकी)`:'');
 const W=$('week');W.textContent='';G.week(st,today).forEach(w=>{const c=el('div','wd'+(w.done?' done':'')+(w.today?' today':''));const dt=new Date(w.day+'T12:00');
  c.append(el('span','wn',DN[dt.getDay()]),el('span','wi',w.done?'✅':w.icon),el('span','wdn',String(dt.getDate())));c.title=w.day;W.append(c);});
 $('badge').hidden=!st.badge;}
$('done').onclick=()=>{const r=G.mark(st,today);if(!r.firstToday)return;st=r.state;save(G.KEY,st);
 const g=K.claimSpot(kst,'gun:'+today);kst=g.state;save(K.KEY,kst);toast(g.added?'✅ आज '+V.title+' अपनाया · +'+g.added+' 💰':'✅ आज '+V.title+' अपनाया');
 if(r.badgeNew)setTimeout(()=>toast('🏅 '+G.BADGE),1800);paint();};
$('say').onclick=()=>{if(!('speechSynthesis'in window))return toast('इस phone में आवाज़ नहीं है');speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance('आज का गुण: '+V.title+'. '+V.means+' आज का छोटा काम: '+V.tip);u.lang='hi-IN';u.rate=.9;speechSynthesis.speak(u);};
paint();window.__gun={state:()=>st,koins:()=>K.total(kst),virtue:()=>V};})();
