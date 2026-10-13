(()=>{'use strict';const T=window.KDNTitli,K=window.KDNKoins,$=id=>document.getElementById(id);
const load=(k,v,f)=>{try{return v(JSON.parse(localStorage.getItem(k)||'null'));}catch{return f();}};
const save=(k,s)=>{try{localStorage.setItem(k,JSON.stringify(s));}catch{}};
let kst=load(K.KEY,K.validate,K.fresh);{const w=K.grantWelcome(kst);if(w.added){kst=w.state;save(K.KEY,kst);}}
let st=load(T.KEY,T.validate,T.fresh),last='';
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),1100);}
function sky(){const w=$('sky');w.className='sky '+(st.karma>0?'up':st.karma<0?'down':'');w.style.setProperty('--k',st.karma);}
function paint(){$('h-koins').textContent=K.fmt(K.total(kst));sky();$('trail').textContent=[...st.path].map(c=>c==='a'?'🌸':'🥀').join(' ')||'—';
 $('effect').textContent=last;$('effect').hidden=!last;$('badge').hidden=!st.badge;$('ends').textContent=`देखे गए अंत: ${st.seen.length} / 3`;
 const box=$('choices');box.innerHTML='';
 if(st.step>=T.SCENES.length){const r=T.RESULTS[T.resultOf(st.karma)];$('scene').innerHTML='';const h=document.createElement('h2');h.textContent=r.icon+' '+r.name;const p=document.createElement('p');p.textContent=r.text;$('scene').append(h,p);
  const b=document.createElement('button');b.className='btn';b.textContent='🦋 One click — दिन फिर से जियो';b.onclick=()=>{st=T.again(st);last='';save(T.KEY,st);paint();};box.append(b);return;}
 const S=T.SCENES[st.step];$('scene').textContent=`(${st.step+1}/5) ${S.t}`;
 S.c.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.className='btn'+(i?' ghost':'');b.textContent=c.x;b.onclick=()=>pick(i);box.append(b);});}
function pick(i){const r=T.choose(st,i);st=r.state;last=r.effect||'';save(T.KEY,st);const f=$('fly');f.classList.remove('flap');void f.offsetWidth;f.classList.add('flap');
 if(r.result){if(r.isNewResult){const g=K.claimSpot(kst,'titli:'+r.result);kst=g.state;save(K.KEY,kst);if(g.added)toast(`🦋 नया अंत! +${g.added} 💰`);}
  if(r.badgeNew)setTimeout(()=>toast('🏅 '+T.BADGE),1100);}
 paint();}
paint();window.__titli={state:()=>st,pick};})();
