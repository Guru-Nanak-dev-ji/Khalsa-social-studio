(()=>{'use strict';const C=window.KDNChakra,K=window.KDNKoins,$=id=>document.getElementById(id);
const load=(k,v,f)=>{try{return v(JSON.parse(localStorage.getItem(k)||'null'));}catch{return f();}};
const save=(k,s)=>{try{localStorage.setItem(k,JSON.stringify(s));}catch{}};
let kst=load(K.KEY,K.validate,K.fresh);{const w=K.grantWelcome(kst);if(w.added){kst=w.state;save(K.KEY,kst);}}
let st=load(C.KEY,C.validate,C.fresh),score=0;
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),1100);}
const vy=$('vyuh');for(let i=0;i<7;i++){const r=document.createElement('div');r.className='ring';r.style.setProperty('--i',i);vy.append(r);}
const hero=document.createElement('div');hero.id='hero';hero.textContent='🏹';vy.append(hero);
function paint(){$('h-koins').textContent=K.fmt(K.total(kst));$('score').textContent=`अंक: ${score>0?'+':''}${score}`;
 vy.querySelectorAll('.ring').forEach((r,i)=>r.classList.toggle('broken',i<st.ring));hero.style.setProperty('--d',st.ring);
 $('pos').textContent=st.done?'🏹 सातों घेरे पार!':`घेरा ${st.ring+1} / 7`;$('badge').hidden=!st.badge;
 const q=$('quiz');q.innerHTML='';
 if(st.done){$('story').textContent=C.LESSON;const b=document.createElement('button');b.className='btn ghost';b.textContent='🔁 फिर से खेलें';b.onclick=()=>{st=C.restart(st);save(C.KEY,st);paint();};q.append(b);return;}
 const R=C.RINGS[st.ring];$('story').textContent=R.story;const h=document.createElement('p');h.className='q';h.textContent=R.q;q.append(h);
 R.opts.forEach((o,i)=>{const b=document.createElement('button');b.type='button';b.className='btn';b.textContent=o;b.onclick=()=>pick(i,b);q.append(b);});}
function pick(i,b){const r=C.answer(st,i),g=K.quiz(kst,r.right);kst=g.state;score+=g.added;save(K.KEY,kst);st=r.state;save(C.KEY,st);
 if(!r.right){b.classList.add('no');b.disabled=true;toast('❌ −3 अंक, फिर सोचिए');$('score').textContent=`अंक: ${score}`;return;}
 toast('✅ +10 अंक · घेरा टूटा!');if(r.badgeNew)setTimeout(()=>toast('🏅 '+C.BADGE),1100);paint();}
paint();window.__chakra={state:()=>st,pick:i=>{const b=document.querySelectorAll('#quiz .btn')[i];b&&b.click();},answer:()=>C.RINGS[st.ring]&&C.RINGS[st.ring].a};})();
