(()=>{'use strict';const L=window.KDNLangar,K=window.KDNKoins,$=id=>document.getElementById(id);
const load=(k,v,f)=>{try{return v(JSON.parse(localStorage.getItem(k)||'null'));}catch{return f();}};
const save=(k,s)=>{try{localStorage.setItem(k,JSON.stringify(s));}catch{}};
let kst=load(K.KEY,K.validate,K.fresh);{const w=K.grantWelcome(kst);if(w.added){kst=w.state;save(K.KEY,kst);}}
let st=load(L.KEY,L.validate,L.fresh);
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),1100);}
const list=$('steps');L.STEPS.forEach(s=>{const li=document.createElement('li');li.dataset.id=s.id;li.innerHTML=`<span>${s.icon}</span><b>${s.name}</b>`;list.append(li);});
function paint(){const s=L.STEPS[st.step];$('h-koins').textContent=K.fmt(K.total(kst));
 $('icon').textContent=s.icon;$('name').textContent=s.name;$('tap').textContent=`👆 ${s.verb} (${st.taps}/${s.taps})`;
 $('bar').style.width=(st.taps/s.taps*100)+'%';$('rounds').textContent=`🍛 पूरे लंगर: ${st.rounds} · सीखी सेवाएँ: ${st.done.length}/6`;
 list.querySelectorAll('li').forEach((li,i)=>{li.classList.toggle('done',st.done.includes(li.dataset.id));li.classList.toggle('now',i===st.step);});
 $('badge').hidden=!st.badge;$('kitchen').dataset.step=s.id;}
$('tap').onclick=()=>{const r=L.tap(st);st=r.state;save(L.KEY,st);const k=$('icon');k.classList.remove('bump');void k.offsetWidth;k.classList.add('bump');
 if(r.stepDone){let g;if(r.firstTime){g=K.claimSpot(kst,'langar:'+r.stepDone.id);}else g={state:kst,added:0};kst=g.state;
  toast(`✅ ${r.stepDone.done}${g.added?' · +'+g.added+' 💰':''}`);
  if(r.roundDone){const g2=K.ring(kst);kst=g2.state;setTimeout(()=>toast(`🙏 पूरा लंगर! +${g2.added} 💰`),1000);}
  if(r.badgeNew)setTimeout(()=>toast('🏅 '+L.BADGE),2000);save(K.KEY,kst);}
 paint();};
paint();window.__langar={state:()=>st,koins:()=>K.total(kst)};})();
