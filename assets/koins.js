(()=>{'use strict';const K=window.KDNKoins,D=window.KDNDoors,pal=document.getElementById('palace');if(!K||!pal)return;
const load=()=>{try{return K.validate(JSON.parse(localStorage.getItem(K.KEY)||'null'));}catch{return K.fresh();}};
const save=s=>{try{localStorage.setItem(K.KEY,JSON.stringify(s));}catch{}};
const bar=document.createElement('div');bar.id='koin-bar';bar.setAttribute('role','status');bar.setAttribute('aria-live','polite');
bar.innerHTML='<span class="kb-score">⭐ अंक <b id="kb-score">0</b></span><span class="kb-bag">💰 <b id="kb-koins">0</b> <small>game koins, असली पैसा नहीं</small></span>';
document.body.prepend(bar);
function paint(s){document.getElementById('kb-score').textContent=K.fmt(s.score);document.getElementById('kb-koins').textContent=K.fmt(K.total(s));}
let st=load();const w=K.grantWelcome(st);if(w.added){st=w.state;save(st);setTimeout(()=>toast('🎉 स्वागत है! 1,25,000 welcome game koins आपके थैले में। (असली पैसा नहीं)'),600);}paint(st);
function toast(t){const e=document.createElement('div');e.className='kb-toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),3200);}
function sparkle(x,y){const box=document.createElement('div');box.className='kb-spark';box.style.left=x+'px';box.style.top=y+'px';box.setAttribute('aria-hidden','true');
 box.innerHTML='<i></i><i></i><i></i><i></i><i></i><i></i><b>+'+K.SPOT+' 💰</b>';document.body.append(box);setTimeout(()=>box.remove(),1300);}
const SPOTS=[{l:'8%',t:'38%'},{l:'86%',t:'72%'}];
function placeSpots(){pal.querySelectorAll('.kb-spot').forEach(e=>e.remove());const path=D.parseHash(location.hash);if(!path.length)return;st=load();
 K.spotsFor(path).forEach((id,i)=>{if(st.spots.includes(id))return;const b=document.createElement('button');b.type='button';b.className='kb-spot';b.textContent='✦';
  b.setAttribute('aria-label','छुपा ख़ज़ाना — +'+K.SPOT+' koins');b.style.left=SPOTS[i].l;b.style.top=SPOTS[i].t;
  b.addEventListener('click',e=>{const r=K.claimSpot(load(),id);if(r.added){st=r.state;save(st);paint(st);sparkle(e.clientX,e.clientY);}b.remove();});pal.append(b);});}
addEventListener('hashchange',placeSpots);placeSpots();
window.KDNKoinsUI={award:right=>{const r=K.quiz(load(),right);st=r.state;save(st);paint(st);return r.added;}};
})();
