(()=>{'use strict';const T=window.KDNTakht,K=window.KDNKoins,$=id=>document.getElementById(id);
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const kl=()=>{try{return K.validate(JSON.parse(localStorage.getItem(K.KEY)||'null'));}catch{return K.fresh();}};
const ks=s=>{try{localStorage.setItem(K.KEY,JSON.stringify(s));}catch{}};
const tl=()=>{try{return T.validate(JSON.parse(localStorage.getItem(T.KEY)||'null'));}catch{return T.fresh();}};
const ts=s=>{try{localStorage.setItem(T.KEY,JSON.stringify(s));}catch{}};
let kst=kl();{const w=K.grantWelcome(kst);if(w.added){kst=w.state;ks(kst);}}
let st=tl(),rx=-14,ry=-24,idle=true,lastTouch=0,cur=-1;
const cube=$('cube'),grid=$('grid');
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),1000);}
function paint(){$('h-koins').textContent=K.fmt(K.total(kst));$('seen').textContent=`${st.seen.length} / 6 द्वार देखे`;
 document.querySelectorAll('[data-id]').forEach(e=>e.classList.toggle('seen',st.seen.includes(e.dataset.id)));$('badge').hidden=!st.badge;}
function visit(i){const r=T.visit(st,i);if(!r.isNew)return;st=r.state;ts(st);const g=K.claimSpot(kst,'takht:'+T.FACES[i].id);kst=g.state;ks(kst);if(g.added)toast('+5 💰 '+T.FACES[i].name);if(r.badgeNew)setTimeout(()=>toast('🏅 '+T.BADGE),900);paint();}
function enter(i,el){const f=T.FACES[i];visit(i);if(rm){location.href=f.href;return;}document.body.classList.add('zoom');(el||cube).classList.add('go');setTimeout(()=>location.href=f.href,650);}
T.FACES.forEach((f,i)=>{const mk=cls=>{const b=document.createElement('button');b.type='button';b.className=cls;b.dataset.id=f.id;b.innerHTML=`<span class="jaali" aria-hidden="true"></span><span class="ic">${f.icon}</span><b>${f.name}</b><small>${f.sub}</small><em>छूकर अंदर जाएँ</em>`;b.setAttribute('aria-label',f.name+' द्वार में जाएँ');return b;};
 const a=mk('face');a.style.transform=`rotateX(${f.fx}deg) rotateY(${f.fy}deg) translateZ(var(--h))`;a.onclick=e=>{if(moved)return;const fr=T.front(rx,ry);if(fr!==i){go(i);return;}enter(i,a);};cube.append(a);
 const g=mk('tile');g.onclick=()=>enter(i,g);grid.append(g);});
function show(){cube.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`;}
function settle(){const i=T.front(rx,ry);if(i!==cur){cur=i;document.querySelectorAll('.face').forEach((e,k)=>e.classList.toggle('front',k===i));$('now').textContent=`${T.FACES[i].icon} ${T.FACES[i].name} — छूकर अंदर जाएँ`;visit(i);}}
function go(i){const t=T.target(i);idle=false;lastTouch=Date.now();rx=t.rx;ry=t.rx?Math.round(ry/360)*360:t.ry+360*Math.round((ry-t.ry)/360);cube.classList.add('snap');show();setTimeout(settle,520);}
let down=null,moved=false;
const sc=$('scene');
sc.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,rx,ry};moved=false;idle=false;cube.classList.remove('snap');});
addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.abs(dx)+Math.abs(dy)>8)moved=true;ry=down.ry+dx*.5;rx=Math.max(-90,Math.min(90,down.rx-dy*.5));show();});
addEventListener('pointerup',()=>{if(!down)return;down=null;lastTouch=Date.now();if(!moved)return;rx=T.snap(rx);ry=T.snap(ry);cube.classList.add('snap');show();setTimeout(()=>{settle();moved=false;},520);});
document.querySelectorAll('[data-turn]').forEach(b=>b.onclick=()=>{const [ax,d]=b.dataset.turn.split(',');idle=false;lastTouch=Date.now();cube.classList.add('snap');if(ax==='x')rx=Math.max(-90,Math.min(90,T.snap(rx)+ +d));else ry=T.snap(ry)+ +d;show();setTimeout(settle,520);});
addEventListener('keydown',e=>{const m={ArrowLeft:'y,-90',ArrowRight:'y,90',ArrowUp:'x,90',ArrowDown:'x,-90'}[e.key];if(m)document.querySelector(`[data-turn="${m}"]`).click();if(e.key==='Enter'&&cur>=0)enter(cur);});
let t0=performance.now();
function tick(t){const dt=t-t0;t0=t;if(!idle&&!down&&Date.now()-lastTouch>6000){idle=true;cube.classList.remove('snap');rx=T.snap(rx)||-14;}
 if(idle&&!down){ry+=dt*.012;show();}requestAnimationFrame(tick);}
if(rm){document.body.classList.add('rm');}else{show();requestAnimationFrame(tick);}
setInterval(()=>{if(idle){const i=T.front(rx,ry);document.querySelectorAll('.face').forEach((e,k)=>e.classList.toggle('front',k===i));$('now').textContent=`${T.FACES[i].icon} ${T.FACES[i].name} — घुमाइए या छूकर अंदर जाएँ`;}},400);
$('to-grid').onclick=()=>document.body.classList.toggle('rm');
paint();window.__takht={state:()=>st,front:()=>T.front(rx,ry),go,rot:()=>[rx,ry]};})();
