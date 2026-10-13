(function(){'use strict';const C=window.KDNStudy,K=window.KDNKoins,$=s=>document.querySelector(s);
const cv=$('#reel'),cx=cv.getContext('2d');cv.width=C.W;cv.height=C.H;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
let ALL=[],cur=null,culture=null,world=C.WORLDS[0],imgs={},t0=0,playing=false,speed=1,raf=0,list=[],li=0,seen=[],rec=null,chunks=[],tFixed=null;
C.WORLDS.forEach(w=>{const i=new Image();i.src=w.src;i.onload=()=>draw(tNow());imgs[w.id]=i;});
function tNow(){if(tFixed!==null)return tFixed;return playing?((performance.now()-t0)/1000)*speed:C.DUR;}
function arch(x,y,w,h){cx.beginPath();cx.moveTo(x,y+h);cx.lineTo(x,y+w*0.55);cx.quadraticCurveTo(x,y,x+w/2,y-w*0.05);cx.quadraticCurveTo(x+w,y,x+w,y+w*0.55);cx.lineTo(x+w,y+h);cx.closePath();}
function lines(text,x,y,size,max,color,font,lh){cx.font=font.replace('S',size+'px');cx.fillStyle=color;const L=C.wrap(text,max);L.forEach((l,i)=>cx.fillText(l,x,y+i*size*(lh||1.35)));return y+L.length*size*(lh||1.35);}
function draw(t){const l=cur;cx.save();cx.fillStyle='#140a03';cx.fillRect(0,0,C.W,C.H);
 const im=imgs[world.id];if(im&&im.complete&&im.naturalWidth){const z=RM?1:1+Math.min(t,C.DUR)/C.DUR*0.08;const s=Math.max(C.W/im.naturalWidth,C.H/im.naturalHeight)*z;const w=im.naturalWidth*s,h=im.naturalHeight*s;cx.globalAlpha=.75;cx.drawImage(im,(C.W-w)/2,(C.H-h)/2,w,h);cx.globalAlpha=1;}
 const g=cx.createLinearGradient(0,0,0,C.H);g.addColorStop(0,'rgba(20,10,3,.35)');g.addColorStop(.5,'rgba(20,10,3,.7)');g.addColorStop(1,'rgba(20,10,3,.9)');cx.fillStyle=g;cx.fillRect(0,0,C.W,C.H);
 // सुनहरा मेहराब
 const gl=cx.createLinearGradient(0,0,C.W,C.H);gl.addColorStop(0,'#ffe48a');gl.addColorStop(.45,'#b8862a');gl.addColorStop(.6,'#ffd76a');gl.addColorStop(1,'#7a5a1a');
 cx.strokeStyle=gl;cx.lineWidth=18;arch(70,230,C.W-140,C.H-330);cx.stroke();cx.lineWidth=5;arch(100,270,C.W-200,C.H-400);cx.stroke();
 cx.shadowColor='#ffd76a';cx.shadowBlur=RM?0:20+10*Math.sin(t*2);cx.fillStyle='#ffd76a';cx.beginPath();cx.arc(C.W/2,190,14,0,7);cx.fill();cx.shadowBlur=0;
 cx.textAlign='center';cx.textBaseline='top';
 cx.font='700 38px Mukta,"Noto Sans Devanagari",sans-serif';cx.fillStyle='#e2b04a';cx.fillText('🎓 KDN स्टडी स्टूडियो',C.W/2,90);
 if(!l){cx.restore();return;}
 const a=k=>RM?(t>=C.STEPS.find(s=>s.k===k).at?1:0):C.reveal(t,k);
 let y=480;cx.globalAlpha=a('title');y=lines(culture?culture.title:l.title,C.W/2,y,70,18,'#ffd76a','S "Rozha One",Mukta,serif',1.25);
 if(culture){cx.font='600 34px Mukta,sans-serif';cx.fillStyle='#ffe9a8';cx.fillText('🗺️ '+culture.region,C.W/2,y+6);y+=56;}
 cx.globalAlpha=1;y+=40;
 const pl=a('line');if(pl>0){y=lines(RM?l.line:C.chars(l.line,pl),C.W/2,y,58,20,'#fff1c8','600 S Mukta,"Noto Sans Devanagari",serif',1.4);}else y+=160;
 y+=50;cx.globalAlpha=a('meaning');if(cx.globalAlpha>0){cx.fillStyle='rgba(255,215,106,.9)';cx.fillRect(C.W/2-60,y,120,4);y=lines('अर्थ: '+l.meaning,C.W/2,y+30,44,28,'#ffe9a8','S Mukta,"Noto Sans Devanagari",sans-serif',1.45);}
 if(culture&&cx.globalAlpha>0){y+=30;lines(culture.story,C.W/2,y,34,40,'#f3d9a0','S Mukta,sans-serif',1.45);}
 cx.globalAlpha=a('source');if(cx.globalAlpha>0){let sy=C.H-330;if(l.speaker)sy=lines('🗣️ '+l.speaker,C.W/2,sy,38,34,'#ffd76a','700 S Mukta,sans-serif');lines('📜 '+l.source,C.W/2,sy+6,34,38,'#e2b04a','S Mukta,sans-serif');}
 cx.globalAlpha=1;if(culture){cx.font='700 30px Mukta,sans-serif';cx.fillStyle='#9fd0ff';cx.fillText('🤖 कहानी: AI द्वारा लिखी · पंक्ति: सत्यापित ग्रंथ',C.W/2,C.H-120);}
 const p=Math.min(1,t/C.DUR);cx.fillStyle='rgba(255,215,106,.3)';cx.fillRect(140,C.H-70,C.W-280,8);cx.fillStyle='#ffd76a';cx.fillRect(140,C.H-70,(C.W-280)*p,8);
 cx.restore();}
function loop(){const t=tNow();draw(t);if(playing&&t>=C.DUR){playing=false;onEnd();return;}if(playing)raf=requestAnimationFrame(loop);}
function say(text){if(!('speechSynthesis' in window)||!$('#tts').checked)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='hi-IN';u.rate=speed>1?1.15:0.9;const v=speechSynthesis.getVoices().find(v=>/hi/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u);}
function play(sp){speed=sp||1;tFixed=null;cancelAnimationFrame(raf);t0=performance.now();playing=true;if(cur){seen.push(cur);say(C.narration(cur)+(culture?'। '+culture.story:''));}loop();}
function stop(){playing=false;cancelAnimationFrame(raf);if('speechSynthesis' in window)speechSynthesis.cancel();if(rec&&rec.state!=='inactive')rec.stop();draw(C.DUR);}
let onEnd=()=>{if(rec&&rec.state!=='inactive')rec.stop();};
function pick(l,c){cur=l;culture=c||null;tFixed=null;draw(C.DUR);$('#now').textContent=(c?'🗺️ '+c.title:(l.title+': '+l.line));}
// टैब
document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.tabs button').forEach(x=>x.setAttribute('aria-selected',x===b));document.querySelectorAll('.pane').forEach(p=>p.hidden=p.id!==b.dataset.p);}));
$('#world').innerHTML=C.WORLDS.map(w=>`<option value="${w.id}">${w.name}</option>`).join('');$('#world').addEventListener('change',e=>{world=C.WORLDS.find(w=>w.id===e.target.value);draw(tNow());});
$('#lesson').addEventListener('change',e=>pick(ALL[+e.target.value]));
$('#ownGo').addEventListener('click',()=>{const l=C.own($('#ownText').value,$('#ownTitle').value);if(!l){$('#msg').textContent='पहले अपना पाठ लिखिए।';return;}pick(l);play(1);});
$('#play').addEventListener('click',()=>{onEnd=()=>{};play(1);});$('#stop').addEventListener('click',stop);
// रिकॉर्ड
$('#record').addEventListener('click',async()=>{if(!window.MediaRecorder||!cv.captureStream){$('#msg').textContent='इस browser में रिकॉर्डिंग नहीं चलती। Chrome आज़माइए।';return;}
 const st=cv.captureStream(30);let mic=null;if($('#mic').checked){try{mic=await navigator.mediaDevices.getUserMedia({audio:true});mic.getAudioTracks().forEach(tr=>st.addTrack(tr));}catch(e){$('#msg').textContent='🎙️ mic की अनुमति नहीं मिली, बिना आवाज़ के रिकॉर्ड हो रहा है।';}}
 const mime=C.recMime(m=>MediaRecorder.isTypeSupported(m));chunks=[];rec=new MediaRecorder(st,mime?{mimeType:mime}:{});rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);
 rec.onstop=()=>{if(mic)mic.getTracks().forEach(t=>t.stop());const blob=new Blob(chunks,{type:'video/webm'});const url=URL.createObjectURL(blob);const a=$('#dl');a.href=url;a.download='kdn-study-reel.webm';a.hidden=false;$('#shareV').hidden=!navigator.canShare;$('#shareV').onclick=()=>{const f=new File([blob],'kdn-study-reel.webm',{type:'video/webm'});if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:'KDN स्टडी reel'});else $('#msg').textContent='इस phone पर सीधा share नहीं चलता, पहले download कीजिए।';};$('#msg').textContent='✅ Reel तैयार है (WebM)। नीचे से download या share कीजिए।';};
 rec.start(500);onEnd=()=>{if(rec.state!=='inactive')rec.stop();};$('#msg').textContent='⏺ रिकॉर्डिंग चल रही है ('+C.DUR+' सेकंड)…';play(1);});
// Playlist + quiz
$('#plGo').addEventListener('click',()=>{list=C.shuffle(ALL).slice(0,5);li=0;seen=[];$('#quiz').innerHTML='';next();});
function next(){if(li>=list.length){showQuiz();return;}pick(list[li++]);$('#plInfo').textContent='▶ पाठ '+li+' / '+list.length;onEnd=()=>setTimeout(next,600);play(3);}
function showQuiz(){const qs=C.quiz(seen,ALL);let score=0,done=0;$('#plInfo').textContent='🧠 अब 3 सवाल: यह किसने कहा?';
 $('#quiz').innerHTML=qs.map((q,i)=>`<div class="qq"><p><b>${i+1}.</b> “${q.line}”</p>${q.options.map(o=>`<button class="btn ghost" type="button" data-i="${i}">${o}</button>`).join('')}<p class="res" id="r${i}"></p></div>`).join('');
 $('#quiz').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{const i=+b.dataset.i,q=qs[i];if(b.parentNode.dataset.done)return;b.parentNode.dataset.done=1;const ok=b.textContent===q.answer;
  if(K){let s;try{s=JSON.parse(localStorage.getItem(K.KEY)||'null');}catch(e){}const r=K.quiz(s,ok);localStorage.setItem(K.KEY,JSON.stringify(r.state));score+=r.added;}
  $('#r'+i).textContent=ok?'✅ सही! +10 अंक':'❌ सही जवाब: '+q.answer+' (−3)';done++;if(done===qs.length)$('#plInfo').textContent='🏁 Quiz पूरा: '+(score>=0?'+':'')+score+' अंक (game koins, असली पैसा नहीं)';}));}
function cultures(){$('#cult').innerHTML=C.CULTURES.map((c,i)=>{const x=C.culture(c,ALL);return x?`<button class="cc" type="button" data-i="${i}"><b>${c.region}</b><span>${c.title}</span><small>🤖 AI कहानी · 📜 ${x.lesson.source}</small></button>`:'';}).join('');
 $('#cult').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{const x=C.culture(C.CULTURES[+b.dataset.i],ALL);pick(x.lesson,x);world=C.WORLDS[1];$('#world').value='gate';onEnd=()=>{};play(1);scrollTo({top:0,behavior:RM?'auto':'smooth'});}));}
Promise.all(['./assets/gyan/granth.json','./assets/saathi/bani.json'].map(u=>fetch(u).then(r=>r.json()).catch(()=>null))).then(([g,b])=>{ALL=C.lessons(g,b);$('#lesson').innerHTML=ALL.map((l,i)=>`<option value="${i}">${l.title} · ${l.line.slice(0,34)}</option>`).join('');if(ALL[0])pick(ALL[0]);cultures();});
window.__study={at:t=>{tFixed=t;draw(t);},pick:i=>pick(ALL[i]),culture:i=>{const x=C.culture(C.CULTURES[i],ALL);pick(x.lesson,x);},world:id=>{world=C.WORLDS.find(w=>w.id===id);}};
draw(C.DUR);})();
