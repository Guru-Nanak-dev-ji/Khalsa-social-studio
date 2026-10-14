(()=>{'use strict';const P=window.KDNPathey,K=window.KDNKoins,$=id=>document.getElementById(id);
const load=(k,v,f)=>{try{return v(JSON.parse(localStorage.getItem(k)||'null'));}catch{return f();}};
const save=(k,s)=>{try{localStorage.setItem(k,JSON.stringify(s));}catch{}};
let kst=load(K.KEY,K.validate,K.fresh),welcome=0;{const w=K.grantWelcome(kst);if(w.added){kst=w.state;save(K.KEY,kst);welcome=w.added;}}
let st=load(P.KEY,P.validate,P.fresh);const today=P.dayKey();
const DN=['रवि','सोम','मंगल','बुध','गुरु','शुक्र','शनि'];
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),1600);}
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;};
$('b-line').textContent=P.BANI.line;$('b-mean').textContent=P.BANI.meaning;$('b-src').textContent='— '+P.BANI.writer+', अंग '+P.BANI.ang+' · '+P.BANI.src;
function paint(){$('h-koins').textContent=K.fmt(K.total(kst));const t=P.today(st,today),b=P.balance(st);
 for(const x of P.SIDES){const btn=$('b-'+x.id),on=t[x.id];btn.classList.toggle('on',on);btn.setAttribute('aria-pressed',String(on));btn.disabled=on;$('s-'+x.id).textContent=on?'✅ आज हो गया':x.means;$('n-'+x.id).textContent=String(b[x.id]);}
 $('scale').style.setProperty('--tilt',b.tilt+'deg');
 $('bal-msg').textContent=b.kirat+b.seva===0?'⚖️ तराज़ू खाली है — आज से पाथेय भरिए':b.even?'⚖️ संतुलन! किरत और सेवा बराबर — शाबाश':b.heavy==='kirat'?'⚒️ किरत भारी है — थोड़ी सेवा/वंड भी कीजिए':'🤲 सेवा भारी है — ईमानदार किरत भी ज़रूरी है';
 const any=t.kirat||t.seva;$('today-msg').hidden=!any;
 if(any)$('today-msg').textContent='✅ आज का पाथेय: '+[t.kirat?'⚒️ किरत':'',t.seva?'🤲 सेवा':''].filter(Boolean).join(' + ')+(t.kirat&&t.seva?' — पूरा संतुलन!':' — दूसरा पलड़ा भी भरिए?');
 $('pick-msg').hidden=any;
 const n=P.both(st),sk=P.streak(st,today);$('streak').textContent=`🔥 ${sk} दिन लगातार · ⚖️ ${n} दिन दोनों`+(n<P.NEED?` (पाथेय साधक के लिए ${P.NEED-n} बाकी)`:'');
 const W=$('week');W.textContent='';P.week(st,today).forEach(w=>{const c=el('div','wd'+(w.any?' done':'')+(w.both?' both':'')+(w.today?' today':''));const dt=new Date(w.day+'T12:00');
  c.append(el('span','wn',DN[dt.getDay()]),el('span','wi',w.icon),el('span','wdn',String(dt.getDate())));c.title=w.day;W.append(c);});
 $('badge').hidden=!st.badge;}
function tap(side){const r=P.mark(st,today,side);if(!r.added)return;st=r.state;save(P.KEY,st);const x=P.sideOf(side);let msg=x.icon+' आज '+x.title+' पलड़े में';
 if(r.firstToday){const g=K.claimSpot(kst,'pathey:'+today);kst=g.state;save(K.KEY,kst);if(g.added)msg+=' · +'+g.added+' 💰';}
 if(r.bothNew)msg='⚖️ आज किरत + सेवा — पूरा पाथेय!';toast(msg);if(r.badgeNew)setTimeout(()=>toast('🏅 '+P.BADGE),1800);paint();}
for(const x of P.SIDES)$('b-'+x.id).onclick=()=>tap(x.id);
$('say').onclick=()=>{if(!('speechSynthesis'in window))return toast('इस phone में आवाज़ नहीं है');speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance('किरत करो, वंड छक्को. जीवन का पाथेय. पाथेय मतलब किरत और सेवा का संतुलन. '+P.BANI.line+'. अर्थ: '+P.BANI.meaning+' आज आपने ईमानदार किरत की? आज किसी की सेवा की?');u.lang='hi-IN';u.rate=.9;speechSynthesis.speak(u);};
paint();if(welcome)setTimeout(()=>toast('🙏 स्वागत! +'+K.fmt(welcome)+' गुरु कोइन्स'),300);
window.__pathey={state:()=>st,koins:()=>K.total(kst),today:()=>P.today(st,today),balance:()=>P.balance(st)};})();
