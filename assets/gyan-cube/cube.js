// Swipe/buttons turn the cube; tap the front letter in पैंती order. +5 game koins once.
(()=>{'use strict';const G=window.KDNGurCube,K=window.KDNKoins,$=id=>document.getElementById(id);const cube=$('gc-cube');if(!G||!cube)return;
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;};
G.FACES.forEach((f,i)=>{const b=el('button','gc-face');b.type='button';b.style.transform=f.t;b.dataset.i=i;b.append(el('b',null,f.l),el('small',null,f.n));b.lang='pa';cube.append(b);});
let rx=0,ry=0,st=G.fresh();const msg=$('gc-msg'),trail=$('gc-trail');
function set(){cube.style.transform='rotateX('+rx+'deg) rotateY('+ry+'deg)';}
function turn(dx,dy){ry+=dx*90;rx+=dy*90;set();}
function show(){trail.textContent=G.ORDER.map((o,i)=>i<st.step?G.FACES[o].l:'·').join(' ');}
function tapFront(){const f=G.front(rx,ry),r=G.tap(st,f);st=r.state;show();
 if(r.solved){msg.textContent='🎉 शाबाश! ੳ ਅ ੲ ਸ ਹ ਕ — पूरे! 🏅 '+G.BADGE;try{localStorage.setItem(G.KEY,JSON.stringify({v:1,badge:true}));}catch{}if(K){let k;try{k=K.validate(JSON.parse(localStorage.getItem(K.KEY)||'null'));}catch{k=K.fresh();}const g=K.claimSpot(k,G.SPOT);try{localStorage.setItem(K.KEY,JSON.stringify(g.state));}catch{}if(g.added)msg.textContent+=' +'+g.added+' 💰 koins';}}
 else msg.textContent=r.ok?'✅ '+G.FACES[f].l+' सही! अगला ढूँढो':'❌ '+G.FACES[f].l+' नहीं — फिर से ੳ से शुरू';}
cube.addEventListener('click',e=>{if(moved)return;if(e.target.closest('.gc-face'))tapFront();});
const stage=$('gc-stage');let p=null,moved=false;
stage.addEventListener('pointerdown',e=>{p={x:e.clientX,y:e.clientY};moved=false;});
stage.addEventListener('pointerup',e=>{if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p=null;if(Math.max(Math.abs(dx),Math.abs(dy))<30)return;moved=true;setTimeout(()=>moved=false,50);
 if(Math.abs(dx)>Math.abs(dy))turn(dx>0?1:-1,0);else turn(0,dy>0?-1:1);});
$('gc-l').onclick=()=>turn(-1,0);$('gc-r').onclick=()=>turn(1,0);$('gc-u').onclick=()=>turn(0,1);$('gc-d').onclick=()=>turn(0,-1);$('gc-tap').onclick=tapFront;
set();show();})();
