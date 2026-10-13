(()=>{'use strict';const V=window.KDNVand,K=window.KDNKoins,$=id=>document.getElementById(id);
const load=(k,v,f)=>{try{return v(JSON.parse(localStorage.getItem(k)||'null'));}catch{return f();}};
const save=(k,s)=>{try{localStorage.setItem(k,JSON.stringify(s));}catch{}};
let kst=load(K.KEY,K.validate,K.fresh);{const w=K.grantWelcome(kst);if(w.added){kst=w.state;save(K.KEY,kst);}}
let st=load(V.KEY,V.validate,V.fresh),pick=null;const today=V.dayKey();
const DN=['रवि','सोम','मंगल','बुध','गुरु','शुक्र','शनि'];
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),1600);}
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;};
const KB=$('kinds');V.KINDS.forEach(k=>{const b=el('button','kind');b.type='button';b.dataset.id=k.id;b.setAttribute('aria-pressed','false');
 b.append(el('span','ki',k.icon),el('span','kt',k.title));b.onclick=()=>{pick=k.id;paint();};KB.append(b);});
$('b-line').textContent=V.BANI.line;$('b-mean').textContent=V.BANI.meaning;$('b-src').textContent='— '+V.BANI.writer+', अंग '+V.BANI.ang+' · '+V.BANI.src;
function paint(){$('h-koins').textContent=K.fmt(K.total(kst));const did=st.done.includes(today),dk=did?V.kindOf(st.kinds[today]):null,pk=V.kindOf(pick);
 $('thali').className='thali'+(did?' full':pk?' ready':'');$('t-food').textContent=did&&dk?dk.icon:pk?pk.icon:'';
 [...KB.children].forEach(b=>{const on=b.dataset.id===(did&&dk?dk.id:pick);b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on));b.disabled=did;});
 $('pick-msg').textContent=did?'':pk?pk.icon+' '+pk.title+': '+pk.means:'👆 पहले चुनिए — आज आपने क्या बाँटा?';
 $('done').hidden=did;$('done').disabled=!pk;$('done-msg').hidden=!did;if(did)$('done-msg').textContent='✅ आज '+(dk?dk.icon+' '+dk.title:'')+' बाँटा — थाली भर गई, शाबाश!';
 const n=V.count(st);$('streak').textContent=`🌟 ${n} दिन बाँटा · वंड साधक के लिए ${V.NEED} दिन`+(n<V.NEED?` (${V.NEED-n} बाकी)`:'');
 const W=$('week');W.textContent='';V.week(st,today).forEach(w=>{const c=el('div','wd'+(w.done?' done':'')+(w.today?' today':''));const dt=new Date(w.day+'T12:00');
  c.append(el('span','wn',DN[dt.getDay()]),el('span','wi',w.done?w.icon:'○'),el('span','wdn',String(dt.getDate())));c.title=w.day;W.append(c);});
 $('badge').hidden=!st.badge;}
$('done').onclick=()=>{if(!pick)return toast('👆 पहले चुनिए क्या बाँटा');const r=V.mark(st,today,pick);if(!r.firstToday)return;st=r.state;save(V.KEY,st);
 const k=V.kindOf(pick),g=K.claimSpot(kst,'vand:'+today);kst=g.state;save(K.KEY,kst);toast(g.added?'🍲 आज '+k.title+' बाँटा · +'+g.added+' 💰':'🍲 आज '+k.title+' बाँटा');
 if(r.badgeNew)setTimeout(()=>toast('🏅 '+V.BADGE),1800);paint();};
$('say').onclick=()=>{if(!('speechSynthesis'in window))return toast('इस phone में आवाज़ नहीं है');speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance('किरत करो, वंड छक्को. '+V.BANI.line+'. अर्थ: '+V.BANI.meaning+' आज आपने क्या बाँटा? खाना, समय, ज्ञान, मुस्कान या कोई चीज़.');u.lang='hi-IN';u.rate=.9;speechSynthesis.speak(u);};
paint();window.__vand={state:()=>st,koins:()=>K.total(kst),kind:()=>pick||st.kinds[today]||null};})();
