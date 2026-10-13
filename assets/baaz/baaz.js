(()=>{'use strict';const B=window.KDNBaaz,K=window.KDNKoins,$=id=>document.getElementById(id);
const load=(k,v,f)=>{try{return v(JSON.parse(localStorage.getItem(k)||'null'));}catch{return f();}};
const save=(k,s)=>{try{localStorage.setItem(k,JSON.stringify(s));}catch{}};
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
let st=load(B.KEY,B.validate,B.fresh),kst=load(K.KEY,K.validate,K.fresh);{const w=K.grantWelcome(kst);if(w.added){kst=w.state;save(K.KEY,kst);}}
const cv=$('sky'),cx=cv.getContext('2d');let W=0,H=0,DPR=1,g=null,flap=false,last=0,raf=0,phase='ready',bgx=0;
function size(){DPR=Math.min(1.5,devicePixelRatio||1);const r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*DPR;cv.height=H*DPR;cx.setTransform(DPR,0,0,DPR,0,0);if(!g)draw();}
function hud(){$('h-koins').textContent=K.fmt(K.total(kst));$('score').textContent=String(g?g.score:0).padStart(3,'0');$('best').textContent=String(st.best).padStart(3,'0');$('badge').hidden=!st.badge;}
function hills(off,col,amp,base){cx.fillStyle=col;cx.beginPath();cx.moveTo(0,H);for(let x=0;x<=W+20;x+=20)cx.lineTo(x,H*base-Math.sin((x+off)/90)*amp-Math.sin((x+off)/37)*amp*.4);cx.lineTo(W,H);cx.fill();}
function draw(){const sky=cx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#1b1035');sky.addColorStop(.55,'#7a3b52');sky.addColorStop(1,'#f2a65a');cx.fillStyle=sky;cx.fillRect(0,0,W,H);
 cx.fillStyle='rgba(255,236,190,.9)';cx.beginPath();cx.arc(W*.78,H*.24,Math.min(W,H)*.09,0,7);cx.fill();
 hills(bgx*.2,'rgba(60,25,60,.55)',22,.78);hills(bgx*.45,'rgba(35,15,40,.75)',30,.88);
 if(g){cx.font='34px serif';cx.textAlign='center';cx.textBaseline='middle';
  for(const c of g.cols){const grd=cx.createLinearGradient(c.x-30,0,c.x+30,0);grd.addColorStop(0,'#6b3f1f');grd.addColorStop(.5,'#d9a441');grd.addColorStop(1,'#6b3f1f');cx.fillStyle=grd;cx.fillRect(c.x-30,0,60,c.top);cx.fillRect(c.x-30,c.top+c.gap,60,H-c.top-c.gap);cx.fillStyle='#f6d58b';cx.fillRect(c.x-36,c.top-10,72,10);cx.fillRect(c.x-36,c.top+c.gap,72,10);}
  cx.font='26px serif';for(const k of g.coins)cx.fillText('💰',k.x,k.y);
  cx.save();cx.translate(W*.3,g.y);cx.rotate(Math.max(-.5,Math.min(.8,g.vy/700)));cx.scale(-1,1);cx.font='38px serif';cx.fillText('🦅',0,0);cx.restore();}
 const fog=cx.createLinearGradient(0,H*.7,0,H);fog.addColorStop(0,'rgba(255,220,180,0)');fog.addColorStop(1,'rgba(255,220,180,.35)');cx.fillStyle=fog;cx.fillRect(0,H*.7,W,H*.3);}
function loop(t){const dt=last?(t-last)/1000:0;last=t;if(!RM)bgx+=dt*60;B.step(g,dt,flap,W);flap=false;draw();hud();if(g.over)return end();raf=requestAnimationFrame(loop);}
function start(){g=B.newGame((Date.now()%100000)+1,H);phase='flying';$('shell').dataset.phase=phase;last=0;flap=true;cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);}
function toast(m){const e=$('toast');e.textContent=m;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,2600);}
function end(){phase='over';$('shell').dataset.phase=phase;const r=B.finish(st,g.score);st=r.state;save(B.KEY,st);let msg=`🦅 उड़ान खत्म · ${g.score} अंक`;
 if(g.score>=10){const k=K.ring(kst);kst=k.state;save(K.KEY,kst);msg+=` · +${k.added} 💰`;}
 if(r.firstBadge)msg='🏅 badge मिला: '+B.BADGE+'! '+msg;else if(r.newBest)msg+=' · 🎉 नया best!';$('over-msg').textContent=msg;toast(msg);hud();}
function tap(e){if(e)e.preventDefault();if(phase==='flying')flap=true;else start();}
cv.addEventListener('pointerdown',tap);$('go').addEventListener('click',()=>start());$('again').addEventListener('click',()=>start());
addEventListener('keydown',e=>{if(e.code==='Space'||e.key==='ArrowUp'){if(document.activeElement&&document.activeElement.tagName==='BUTTON')return;tap(e);}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&phase==='flying'){cancelAnimationFrame(raf);last=0;}else if(!document.hidden&&phase==='flying')raf=requestAnimationFrame(loop);});
addEventListener('resize',size);size();hud();window.__baaz={state:()=>st,koins:()=>K.total(kst),phase:()=>phase};})();
