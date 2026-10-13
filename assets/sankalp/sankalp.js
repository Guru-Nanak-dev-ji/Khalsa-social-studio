(()=>{'use strict';const S=window.KDNSankalp,K=window.KDNKoins,$=id=>document.getElementById(id);
const load=(k,v,f)=>{try{return v(JSON.parse(localStorage.getItem(k)||'null'));}catch{return f();}};
const save=(k,s)=>{try{localStorage.setItem(k,JSON.stringify(s));}catch{}};
let kst=load(K.KEY,K.validate,K.fresh);{const w=K.grantWelcome(kst);if(w.added){kst=w.state;save(K.KEY,kst);}}
let st=load(S.KEY,S.validate,S.fresh),items=[],pick='';const today=S.dayKey();
const DN=['रवि','सोम','मंगल','बुध','गुरु','शुक्र','शनि'];
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),1600);}
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;};
function paint(){$('h-koins').textContent=K.fmt(K.total(kst));const d=st.days[today];
 $('diya').className='diya'+(d?' lit':'')+(d&&d.done?' done':'');
 $('choose').hidden=!!d;$('mine').hidden=!d;
 if(d){$('mine-text').textContent=d.text;$('done').hidden=d.done;$('change').hidden=d.done;$('done-msg').hidden=!d.done;$('dstate').textContent=d.done?'🪔 दीप पूरा जल गया — शाबाश!':'🪔 दीप जल गया — शाम को ✅ दबाइए';}
 else $('dstate').textContent='दीप अभी बुझा है — संकल्प चुनिए';
 const sk=S.streak(st,today);$('streak').textContent=`🔥 लगातार ${sk} दिन · संकल्प दीप के लिए ${S.NEED} दिन`;
 const W=$('week');W.textContent='';S.week(st,today).forEach(w=>{const c=el('div','wd '+w.status+(w.today?' today':''));const dt=new Date(w.day+'T12:00');
  c.append(el('span','wn',DN[dt.getDay()]),el('span','wi',w.status==='done'?'✅':w.status==='pledged'?'🪔':'·'),el('span','wdn',String(dt.getDate())));c.title=w.day;W.append(c);});
 $('badge').hidden=!st.badge;}
function list(){const L=$('list');L.textContent='';items.forEach(it=>{const b=el('button','pl',it.icon+' '+it.text);b.type='button';b.setAttribute('aria-pressed',pick===it.text?'true':'false');
 b.onclick=()=>{pick=it.text;$('own').value='';list();};L.append(b);});}
$('own').addEventListener('input',()=>{pick='';list();$('cnt').textContent=$('own').value.length+'/'+S.MAX;});
$('go').onclick=()=>{const t=S.clean($('own').value)||pick;if(!t)return toast('पहले एक संकल्प चुनिए');const r=S.pledge(st,today,t);if(!r.ok)return;st=r.state;save(S.KEY,st);toast('🪔 संकल्प लिया!');paint();};
$('change').onclick=()=>{const d=st.days[today];if(!d||d.done)return;const days={...st.days};delete days[today];st={...st,days};save(S.KEY,st);paint();};
$('done').onclick=()=>{const r=S.complete(st,today);if(!r.firstToday)return;st=r.state;save(S.KEY,st);
 const g=K.claimSpot(kst,'sankalp:'+today);kst=g.state;save(K.KEY,kst);toast(g.added?'✅ संकल्प पूरा · +'+g.added+' 💰':'✅ संकल्प पूरा');
 if(r.badgeNew)setTimeout(()=>toast('🏅 '+S.BADGE),1800);paint();};
$('say').onclick=()=>{const d=st.days[today];if(!('speechSynthesis'in window))return toast('इस phone में आवाज़ नहीं है');speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(d?'आज का मेरा संकल्प: '+d.text:'आज एक छोटा अच्छा काम चुनिए');u.lang='hi-IN';u.rate=.9;speechSynthesis.speak(u);};
fetch('./assets/sankalp/sankalp.json').then(r=>r.json()).then(d=>{items=(d.items||[]).filter(i=>i&&i.text);list();}).catch(()=>toast('सूची लोड नहीं हुई'));
paint();window.__sankalp={state:()=>st,koins:()=>K.total(kst)};})();
