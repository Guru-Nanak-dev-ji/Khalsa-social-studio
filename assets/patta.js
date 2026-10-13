(()=>{'use strict';const P=window.KDNPatta,K=window.KDNKoins,$=id=>document.getElementById(id);
const cv=$('sky'),cx=cv.getContext('2d');let W=0,H=0,dpr=1;
const rm=matchMedia('(prefers-reduced-motion: reduce)');
let simple=localStorage.getItem('kdn-patta-simple')==='1'||rm.matches;
const load=()=>{try{return K.validate(JSON.parse(localStorage.getItem(K.KEY)||'null'));}catch{return K.fresh();}};
const save=s=>{try{localStorage.setItem(K.KEY,JSON.stringify(s));}catch{}};
let st=load();{const w=K.grantWelcome(st);if(w.added){st=w.state;save(st);}}
let run=0,ringsRun=0,cam=0,speed=2.2,lx=0,ly=0,tx=0,ty=0,gates=[],n=0,playing=false,paused=false,asked=[],last=0,t=0;
const rand=Math.random;
function paint(){$('h-koins').textContent=K.fmt(K.total(st));$('h-earn').textContent=K.fmt(st.earned);$('h-score').textContent=K.fmt(st.score);$('h-run').textContent=ringsRun;$('simple').textContent=simple?'✨ सुंदर graphics':'🪶 सरल graphics';}
function size(){dpr=Math.min(simple?1:1.5,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dpr|0;cv.height=H*dpr|0;cx.setTransform(dpr,0,0,dpr,0,0);}
function reset(){cam=0;n=0;gates=[];ringsRun=0;lx=ly=tx=ty=0;for(let i=0;i<8;i++)gates.push(P.gate(n++,rand));}
function proj(x,y,z){const d=Math.max(.05,z-cam),f=1/d;return{x:W/2+x*f*W*.45,y:H/2+y*f*W*.45,s:f};}
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),900);}
function arch(z,glow){const a=proj(-1.3,-1.1,z),b=proj(1.3,1.2,z),w=b.x-a.x,h=b.y-a.y;if(w<4)return;const al=Math.min(1,(z-cam)<1?(z-cam):1)*Math.min(1,6/(z-cam));
 cx.globalAlpha=Math.max(0,al);cx.lineWidth=Math.max(1,w*.03);cx.strokeStyle=glow?'#ffd77a':'#b8862e';cx.beginPath();const r=w/2;
 cx.moveTo(a.x,b.y);cx.lineTo(a.x,a.y+r);cx.quadraticCurveTo(a.x,a.y,a.x+r,a.y-r*.25);cx.quadraticCurveTo(b.x,a.y,b.x,a.y+r);cx.lineTo(b.x,b.y);cx.stroke();
 if(!simple){cx.lineWidth=Math.max(1,w*.008);cx.strokeStyle='#e8b84a66';for(let i=1;i<4;i++){const xx=a.x+w*i/4;cx.beginPath();cx.moveTo(xx,b.y);cx.lineTo(xx,b.y-h*.12);cx.stroke();}}
 cx.globalAlpha=1;}
function ring(g){const p=proj(g.x,g.y,g.z),r=P.R*p.s*W*.45;if(r<2||g.done)return;const al=Math.min(1,6/(g.z-cam));cx.globalAlpha=al;
 cx.lineWidth=Math.max(2,r*.18);cx.strokeStyle=g.quiz?'#7fd0ff':'#ffd23f';if(!simple){cx.shadowColor=cx.strokeStyle;cx.shadowBlur=r*.4;}
 cx.beginPath();cx.arc(p.x,p.y,r,0,7);cx.stroke();cx.shadowBlur=0;cx.fillStyle=cx.strokeStyle;cx.font=`${Math.max(10,r*.6)}px Mukta`;cx.textAlign='center';cx.textBaseline='middle';cx.fillText(g.quiz?'?':'+5',p.x,p.y);cx.globalAlpha=1;}
function leaf(){const x=W/2+lx*W*.45*.55,y=H/2+ly*W*.45*.55,s=Math.min(W,H)*.09,tilt=(tx-lx)*1.5;cx.save();cx.translate(x,y);cx.rotate(tilt);
 const g=cx.createLinearGradient(-s,0,s,0);g.addColorStop(0,'#fff1b8');g.addColorStop(1,'#d9a032');cx.fillStyle=g;cx.beginPath();cx.moveTo(0,-s*.25);cx.lineTo(s,s*.35);cx.lineTo(0,s*.15);cx.lineTo(-s,s*.35);cx.closePath();cx.fill();
 cx.strokeStyle='#7a4a10';cx.lineWidth=1.5;cx.beginPath();cx.moveTo(0,-s*.25);cx.lineTo(0,s*.15);cx.stroke();cx.restore();}
function draw(){const bg=cx.createRadialGradient(W/2,H/2,10,W/2,H/2,Math.max(W,H)*.7);bg.addColorStop(0,'#5a1a14');bg.addColorStop(1,'#12030a');cx.fillStyle=bg;cx.fillRect(0,0,W,H);
 if(!simple){cx.fillStyle='#ffd77a';for(let i=0;i<30;i++){const a=(i*137.5+t*20)%360*Math.PI/180,r=((i*53+t*60)%400)/400*Math.max(W,H)*.6;cx.globalAlpha=.25;cx.fillRect(W/2+Math.cos(a)*r,H/2+Math.sin(a)*r,2,2);}cx.globalAlpha=1;}
 const base=Math.ceil(cam/1.2)*1.2;for(let z=base+12;z>cam+.1;z-=1.2)arch(z,false);
 [...gates].sort((a,b)=>b.z-a.z).forEach(ring);leaf();}
function step(dt){cam+=speed*dt;speed=Math.min(4,speed+dt*.02);const k=Math.min(1,dt*6);lx+=(tx-lx)*k;ly+=(ty-ly)*k;
 for(const g of gates){if(!g.done&&g.z-cam<0.15){g.done=true;const ok=P.hit(g,lx*.55,ly*.55);
  if(g.quiz){ask();}else if(ok){const r=K.ring(load());st=r.state;save(st);ringsRun++;paint();toast('+5 💰');}}}
 gates=gates.filter(g=>g.z>cam-1);while(gates.length<8)gates.push(P.gate(n++,rand));}
function loop(ts){const dt=Math.min(.05,(ts-last)/1000||0);last=ts;t+=dt;if(playing&&!paused&&!rm.matches)step(dt);else if(playing&&!paused&&rm.matches)step(dt*.6);draw();requestAnimationFrame(loop);}
function ask(){paused=true;const q=P.pick(asked,rand);asked.push(q.id);if(asked.length>=P.Q.length)asked=[];$('q-text').textContent=q.q;const box=$('q-opts');box.innerHTML='';$('q-note').textContent='';
 q.o.forEach((o,i)=>{const b=document.createElement('button');b.type='button';b.textContent=o;b.onclick=()=>{const right=i===q.c;const r=K.quiz(load(),right);st=r.state;save(st);paint();
  box.querySelectorAll('button').forEach((x,j)=>{x.disabled=true;if(j===q.c)x.className='ok';else if(j===i)x.className='no';});
  $('q-note').textContent=right?'✅ सही! +10 अंक':'❌ सही उत्तर: '+q.o[q.c]+' (−3 अंक)';setTimeout(()=>{$('quiz').hidden=true;paused=false;last=performance.now();},1400);};box.append(b);});
 $('quiz').hidden=false;}
function pt(e){tx=P.clamp((e.clientX-W/2)/(W*.45*.55),-1.2,1.2);ty=P.clamp((e.clientY-H/2)/(W*.45*.55),-1,1);}
cv.addEventListener('pointerdown',e=>{pt(e);cv.setPointerCapture(e.pointerId);});cv.addEventListener('pointermove',e=>{if(e.buttons||e.pointerType==='touch')pt(e);});
$('start').onclick=()=>{reset();$('intro').hidden=true;playing=true;paused=false;last=performance.now();};
$('pause').onclick=()=>{if(!playing)return;paused=!paused;$('pause').textContent=paused?'▶ चलाओ':'⏸ रोको';};
$('simple').onclick=()=>{simple=!simple;localStorage.setItem('kdn-patta-simple',simple?'1':'0');size();paint();};
addEventListener('resize',size);size();reset();paint();requestAnimationFrame(loop);
window.KDNPattaDebug={ask};
})();
