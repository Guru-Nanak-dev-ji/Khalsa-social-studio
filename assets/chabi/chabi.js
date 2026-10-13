(()=>{'use strict';const C=window.KDNChabi,K=window.KDNKoins,$=id=>document.getElementById(id);
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const kl=()=>{try{return K.validate(JSON.parse(localStorage.getItem(K.KEY)||'null'));}catch{return K.fresh();}};
const ks=s=>{try{localStorage.setItem(K.KEY,JSON.stringify(s));}catch{}};
const cl=()=>{try{return C.validate(JSON.parse(localStorage.getItem(C.KEY)||'null'));}catch{return C.fresh();}};
const cs=s=>{try{localStorage.setItem(C.KEY,JSON.stringify(s));}catch{}};
let kst=kl();{const w=K.grantWelcome(kst);if(w.added){kst=w.state;ks(kst);}}
let st=cl(),data=null;
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),900);}
function paint(){$('h-koins').textContent=K.fmt(K.total(kst));$('h-score').textContent=K.fmt(kst.score);
 $('keys').innerHTML=C.ROOMS.map((_,i)=>`<b class="${i<st.keys?'on':''}">🗝️</b>`).join('');}
function room(){const i=st.room,R=C.ROOMS[i];$('bg').style.backgroundImage=`url(./assets/lworld/${R.world}-m.webp)`;
 $('r-num').textContent=`कमरा ${i+1} / ${C.ROOMS.length}`;$('r-name').textContent=(st.done?'🏅 ':'🚪 ')+R.name;
 const s=$('stage');s.innerHTML='';
 R.spots.forEach(([x,y,e],k)=>{const b=document.createElement('button');b.type='button';b.className='spot';b.style.left=x+'%';b.style.top=y+'%';b.textContent=e;b.setAttribute('aria-label','छिपी चीज़ '+(k+1));
  if(st.found.includes(R.id+':'+k))b.classList.add('found');
  b.onclick=()=>{const r=C.find(st,i,k);if(!r.isNew)return;st=r.state;cs(st);const g=K.claimSpot(kl(),'chabi:'+r.id);kst=g.state;ks(kst);b.classList.add('found');toast(g.added?'+5 💰':'✨');paint();gate();};s.append(b);});
 const d=document.createElement('div');d.className='door'+(st.keys>i||st.done?' open':'');d.innerHTML='<i></i><i></i>';s.append(d);gate();paint();}
function gate(){const n=C.foundIn(st,st.room),b=$('riddle');
 if(st.done){b.disabled=false;b.textContent='🏅 '+C.BADGE+' — card देखें';return;}
 b.disabled=n<3;b.textContent=n<3?`🔒 पहेली (${n}/3 चीज़ें मिलीं)`:'🗝️ पहेली सुलझाएँ';$('r-help').textContent=n<3?'छिपी हुई 3 चीज़ें छूकर खोजिए (+5 koins हर एक)।':'तीनों मिल गईं! अब पहेली सुलझाकर सुनहरी चाबी पाइए।';}
function ask(){if(st.done)return win();const i=st.room,q=C.build(i,data);$('q-text').textContent='🔑 '+q.text;$('q-line').textContent='“'+q.line+'”'+(q.text.includes('अर्थ')?' — '+q.source:'');$('q-note').textContent='';
 const box=$('q-opts');box.innerHTML='';q.opts.forEach((o,j)=>{const b=document.createElement('button');b.type='button';b.textContent=o;
  b.onclick=()=>{const ok=j===q.c,r=K.quiz(kl(),ok);kst=r.state;ks(kst);paint();
   if(!ok){b.disabled=true;$('q-note').textContent='❌ −3 अंक। '+q.hint;return;}
   $('q-note').textContent='✅ सही! +10 अंक · '+q.source+' — '+q.meaning;box.querySelectorAll('button').forEach(x=>x.disabled=true);
   setTimeout(()=>{$('quiz').hidden=true;const a=C.answer(st,i,true);st=a.state;cs(st);flyKey(()=>{const d=$('stage').querySelector('.door');d&&d.classList.add('open');setTimeout(()=>a.finished?(room(),win()):room(),rm?50:1500);});},rm?600:1800);};box.append(b);});
 $('quiz').hidden=false;}
function flyKey(done){const k=document.createElement('div');k.className='flykey';k.textContent='🗝️';k.style.left='45%';k.style.top='40%';document.body.append(k);
 const t=$('keys').children[st.keys-1].getBoundingClientRect();requestAnimationFrame(()=>{k.style.left=t.left+'px';k.style.top=t.top+'px';k.style.fontSize='26px';});
 setTimeout(()=>{k.remove();paint();done();},rm?30:1150);}
function card(){const c=$('share-card'),x=c.getContext('2d');const g=x.createLinearGradient(0,0,0,960);g.addColorStop(0,'#3a1a08');g.addColorStop(1,'#120804');x.fillStyle=g;x.fillRect(0,0,720,960);
 x.strokeStyle='#ffd23f';x.lineWidth=10;x.beginPath();x.moveTo(80,900);x.lineTo(80,360);x.quadraticCurveTo(80,80,360,60);x.quadraticCurveTo(640,80,640,360);x.lineTo(640,900);x.stroke();
 x.fillStyle='#ffd23f';x.textAlign='center';x.font='120px serif';x.fillText('🏅',360,330);x.font='bold 64px Mukta, sans-serif';x.fillText(C.BADGE,360,450);
 x.fillStyle='#fff6dc';x.font='38px Mukta, sans-serif';x.fillText('7 द्वार · 7 सुनहरी चाबियाँ',360,530);x.font='54px serif';for(let i=0;i<7;i++)x.fillText('🗝️',144+i*72,630);
 x.font='34px Mukta, sans-serif';x.fillText('⭐ '+K.fmt(kst.score)+' अंक',360,720);x.fillStyle='#ffd23f';x.fillText('🗝️ चाबी वाला द्वार · KDN',360,840);}
function win(){card();$('win').hidden=false;}
$('riddle').onclick=ask;$('close-win').onclick=()=>$('win').hidden=true;
$('reset').onclick=()=>{if(confirm('शुरू से खेलें? (koins वैसे ही रहेंगे)')){st=C.fresh();cs(st);room();}};
$('share').onclick=()=>$('share-card').toBlob(async b=>{const f=new File([b],'chakravyuh-bhedi.png',{type:'image/png'});
 try{if(navigator.canShare&&navigator.canShare({files:[f]}))return await navigator.share({files:[f],title:C.BADGE,text:'मैंने 🗝️ चाबी वाला द्वार के 7 द्वार खोले!'});}catch{}const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=f.name;a.click();});
// दीये की चिंगारियाँ
if(!rm){const c=$('diya'),x=c.getContext('2d');let w,h;const P=[];const sz=()=>{w=c.width=innerWidth;h=c.height=innerHeight;};sz();addEventListener('resize',sz);
 for(let i=0;i<34;i++)P.push({x:Math.random(),y:Math.random(),r:Math.random()*2+1,v:Math.random()*.0012+.0004,p:Math.random()*6});
 (function f(t){x.clearRect(0,0,w,h);for(const q of P){q.y-=q.v;if(q.y<0){q.y=1;q.x=Math.random();}x.globalAlpha=.4+.4*Math.sin(t/400+q.p);x.fillStyle='#ffb347';x.beginPath();x.arc((q.x+Math.sin(t/2000+q.p)*.01)*w,q.y*h,q.r,0,7);x.fill();}requestAnimationFrame(f);})(0);}
window.__chabi={state:()=>st,set:s=>{st=C.validate(s);cs(st);room();},ask,win};
Promise.all(['./assets/gyan/granth.json','./assets/saathi/bani.json'].map(u=>fetch(u).then(r=>r.json()))).then(([g,b])=>{data={granth:g,bani:b};room();}).catch(()=>{$('r-help').textContent='पहेलियाँ load नहीं हुईं, page refresh कीजिए।';});
paint();})();
