'use strict';
(function(){
const C=window.PromoCore,cv=document.getElementById('screen'),x=cv.getContext('2d');
const W=1080,H=1920,GOLD='#f2c14e',MAROON='#5a0f1c';
let t0=performance.now(),paused=false,pauseAt=0,rec=null;
const btn=document.getElementById('play'),recBtn=document.getElementById('rec'),dots=document.getElementById('dots');
C.SCENES.forEach((s,i)=>{const b=document.createElement('button');b.textContent=i+1;b.setAttribute('aria-label',s.title);b.onclick=()=>{t0=performance.now()-i*C.SCENE_MS;if(paused)pauseAt=performance.now();};dots.appendChild(b);});
function now(){return (paused?pauseAt:performance.now())-t0;}
function mehrab(a){x.save();x.globalAlpha=a;x.strokeStyle=GOLD;x.lineWidth=14;x.shadowColor=GOLD;x.shadowBlur=30;
 x.beginPath();x.moveTo(120,1800);x.lineTo(120,700);x.bezierCurveTo(120,330,420,260,540,130);x.bezierCurveTo(660,260,960,330,960,700);x.lineTo(960,1800);x.stroke();
 x.lineWidth=4;x.beginPath();x.moveTo(170,1800);x.lineTo(170,720);x.bezierCurveTo(170,380,450,310,540,200);x.bezierCurveTo(630,310,910,380,910,720);x.lineTo(910,1800);x.stroke();x.restore();}
function wrap(txt,y,size,font,color){x.font=size+'px '+font;x.fillStyle=color;x.textAlign='center';
 const words=txt.split(' ');let line='',lines=[];for(const w of words){const tt=line?line+' '+w:w;if(x.measureText(tt).width>720&&line){lines.push(line);line=w;}else line=tt;}lines.push(line);
 lines.forEach((l,i)=>x.fillText(l,540,y+i*size*1.25));return y+lines.length*size*1.25;}
function draw(){const ms=now(),{index,progress}=C.sceneAt(ms),s=C.SCENES[index];
 const g=x.createRadialGradient(540,800,100,540,960,1300);g.addColorStop(0,'#8a1a2e');g.addColorStop(1,'#1e0308');x.fillStyle=g;x.fillRect(0,0,W,H);
 // floating sparks
 for(let i=0;i<40;i++){const px=(i*197+ms*0.02*(1+i%3))%W,py=H-((i*331+ms*0.05*(1+i%4))%H);x.fillStyle='rgba(242,193,78,'+(0.2+0.3*Math.sin(ms/400+i)**2)+')';x.beginPath();x.arc(px,py,3+i%4,0,7);x.fill();}
 mehrab(0.9);
 const fade=Math.min(1,progress*6,(1-progress)*8),rise=(1-Math.min(1,progress*4))*80;
 x.save();x.globalAlpha=Math.max(0,fade);x.translate(0,rise);
 x.font='220px "Noto Color Emoji",sans-serif';x.textAlign='center';const bob=Math.sin(ms/300)*12;x.fillText(s.icon,540,640+bob);
 let y=wrap(s.title,860,96,'"Tiro Devanagari Hindi",serif',GOLD);
 if(s.sub)y=wrap(s.sub,y,54,'Mukta,sans-serif','#ffe9b0');
 y+=40;s.lines.forEach((l,i)=>{const a=Math.min(1,Math.max(0,(progress-0.1-i*0.08)*6));x.globalAlpha=Math.max(0,fade)*a;y=wrap(l,y,l.length>26?50:62,'Mukta,sans-serif','#fff')+18;});
 x.restore();
 x.fillStyle=MAROON;x.fillRect(0,H-90,W,90);x.fillStyle=GOLD;x.fillRect(0,H-90,W*((ms%C.TOTAL_MS)/C.TOTAL_MS),8);
 x.font='40px Mukta,sans-serif';x.fillStyle='#ffe9b0';x.textAlign='center';x.fillText('KDN · Khalsa Digital World  '+(index+1)+'/'+C.SCENES.length,540,H-30);
 [...dots.children].forEach((b,i)=>b.classList.toggle('on',i===index));
 requestAnimationFrame(draw);}
btn.onclick=()=>{if(paused){t0+=performance.now()-pauseAt;paused=false;btn.textContent='⏸ रोकें';}else{pauseAt=performance.now();paused=true;btn.textContent='▶ चलाएँ';}};
recBtn.onclick=()=>{
 if(rec){rec.stop();return;}
 if(!cv.captureStream||!window.MediaRecorder){alert('इस browser में recording नहीं चलती');return;}
 const type=['video/mp4','video/webm;codecs=vp9','video/webm'].find(t=>MediaRecorder.isTypeSupported(t))||'';
 const chunks=[];rec=new MediaRecorder(cv.captureStream(30),type?{mimeType:type}:{});
 rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);
 rec.onstop=()=>{const blob=new Blob(chunks,{type:rec.mimeType||'video/webm'});rec=null;recBtn.textContent='⏺ Reel video बनाएँ';
  const ext=blob.type.includes('mp4')?'mp4':'webm',file=new File([blob],'kdn-promo.'+ext,{type:blob.type});
  if(navigator.canShare&&navigator.canShare({files:[file]}))navigator.share({files:[file],title:'KDN'}).catch(()=>{});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=file.name;a.click();};
 if(paused)btn.click();t0=performance.now();rec.start();recBtn.textContent='⏹ रोकें ('+C.TOTAL_MS/1000+'s)';
 setTimeout(()=>rec&&rec.stop(),C.TOTAL_MS);};
draw();
})();
