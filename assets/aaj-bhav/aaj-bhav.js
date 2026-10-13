(()=>{'use strict';const A=window.KDNAajBhav,K=window.KDNKoins,$=id=>document.getElementById(id);
const load=(k,v,f)=>{try{return v(JSON.parse(localStorage.getItem(k)||'null'));}catch{return f();}};
const save=(k,s)=>{try{localStorage.setItem(k,JSON.stringify(s));}catch{}};
let kst=load(K.KEY,K.validate,K.fresh);{const w=K.grantWelcome(kst);if(w.added){kst=w.state;save(K.KEY,kst);}}
let st=load(A.KEY,A.validate,A.fresh),list=[];
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),1400);}
const grid=$('moods');A.MOODS.forEach(m=>{const b=document.createElement('button');b.type='button';b.className='mood';b.dataset.id=m.id;b.innerHTML=`<span>${m.icon}</span><b>${m.name}</b>`;b.onclick=()=>choose(m.id);grid.append(b);});
function show(id){const m=A.MOODS.find(x=>x.id===id),day=A.dayKey();if(!m)return;const q=A.quoteFor(list,id,day);
 $('result').hidden=false;$('rname').textContent=m.icon+' आज का भाव: '+m.name;
 const im=$('poster');if(m.img){im.src=m.img;im.hidden=false;}else im.hidden=true;
 $('qline').textContent=q?'“'+q.line+'”':'';$('qmean').textContent=q?q.meaning:'';$('qsrc').textContent=q?'— '+q.source:'';$('advice').textContent='💡 '+m.advice;
 grid.querySelectorAll('.mood').forEach(b=>b.classList.toggle('on',b.dataset.id===id));}
function paint(){$('h-koins').textContent=K.fmt(K.total(kst));const d=A.diary(st,7),ul=$('diary');ul.innerHTML='';
 if(!d.length)ul.innerHTML='<li>अभी कोई दिन नहीं। आज से शुरू कीजिए!</li>';
 d.forEach(r=>{const li=document.createElement('li');li.textContent=`${r.day} · ${r.mood.icon} ${r.mood.name}`;ul.append(li);});
 const n=A.count(st);$('days').textContent=`📅 भाव लिखे गए दिन: ${Math.min(n,7)}/7`;$('badge').hidden=!A.badge(st);}
function choose(id){const day=A.dayKey(),had=A.badge(st),r=A.pick(st,id,day);st=r.state;save(A.KEY,st);
 if(r.firstToday){const g=K.claimSpot(kst,'aajbhav:'+day);kst=g.state;save(K.KEY,kst);if(g.added)toast('🌸 आज का भाव लिखा · +'+g.added+' 💰');}
 if(!had&&A.badge(st))setTimeout(()=>toast('🏅 '+A.BADGE),1500);show(id);paint();}
$('say').onclick=()=>{if(!('speechSynthesis'in window))return toast('इस phone में आवाज़ नहीं है');speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance([$('rname').textContent,$('qline').textContent,$('qmean').textContent,$('advice').textContent].join('। '));u.lang='hi-IN';u.rate=.9;speechSynthesis.speak(u);};
Promise.all(['./assets/saathi/bani.json','./assets/gyan/granth.json'].map(u=>fetch(u).then(r=>r.json()).catch(()=>null))).then(([b,g])=>{list=A.quotes(b,g);const t=st.days[A.dayKey()];if(t)show(t);});
paint();window.__aajbhav={state:()=>st,koins:()=>K.total(kst)};})();
