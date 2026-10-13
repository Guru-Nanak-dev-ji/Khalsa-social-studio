'use strict';
(function(){
const C=window.ReelsCore,$=id=>document.getElementById(id);
const cv=$('rs-canvas'),ctx=cv.getContext('2d');cv.width=C.W;cv.height=C.H;
const FONT='"Noto Sans Devanagari","Noto Sans Gurmukhi",system-ui,sans-serif';
const GOLD='#e8c169',MAROON='#4a0f17',CREAM='#f8ecd2';
let tpl='mehrab',per=3.2,music=null,raf=0,playing=false,t0=0,lines=[];
let storage;try{storage=localStorage;}catch{storage={getItem:()=>null,setItem:()=>{}};}
const say=(m)=>{$('status').textContent=m;};
function getLines(){lines=C.splitLines($('rs-text').value);if(!lines.length)lines=['ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ · सत श्री अकाल','किरत करो · ਕਿਰਤ ਕਰੋ','वंड छको · Share with all','KDN · Khalsa Digital World'];return lines;}
function goldGrad(y0,y1){const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,'#fff3c4');g.addColorStop(.5,GOLD);g.addColorStop(1,'#a8792b');return g;}
function bg(){const g=ctx.createRadialGradient(540,700,100,540,960,1300);g.addColorStop(0,'#6b1824');g.addColorStop(.55,'#2a080d');g.addColorStop(1,'#080304');ctx.fillStyle=g;ctx.fillRect(0,0,C.W,C.H);}
function checker(alpha,y,rows,size){ctx.save();ctx.globalAlpha=alpha;for(let r=0;r<rows;r++)for(let c=0;c<Math.ceil(C.W/size);c++){ctx.fillStyle=(r+c)%2?'#140608':GOLD;ctx.fillRect(c*size,y+r*size,size,size);}ctx.restore();}
function archPath(x,y,w,h){const r=w/2;ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x,y+r*1.1);
  ctx.bezierCurveTo(x,y+r*.35,x+w*.32,y+r*.2,x+w/2,y);ctx.bezierCurveTo(x+w*.68,y+r*.2,x+w,y+r*.35,x+w,y+r*1.1);ctx.lineTo(x+w,y+h);ctx.closePath();}
function mehrab(p){archPath(110,250,860,1450);ctx.fillStyle='rgba(20,6,8,.55)';ctx.fill();ctx.lineWidth=14;ctx.strokeStyle=goldGrad(250,1700);ctx.stroke();
  archPath(150,300,780,1380);ctx.lineWidth=3;ctx.setLineDash([18,12]);ctx.stroke();ctx.setLineDash([]);
  // jali dots along the arch, revealed with progress
  ctx.fillStyle=GOLD;for(let i=0;i<24;i++){const a=Math.PI*(i/23);if(i/23>p*1.4)break;ctx.beginPath();ctx.arc(540-Math.cos(a)*400,690-Math.sin(a)*330,7,0,7);ctx.fill();}
  ctx.font='70px '+FONT;ctx.textAlign='center';ctx.fillText('🪔',220,1660);ctx.fillText('🪔',860,1660);}
function piece(ch,x,y,size,color){ctx.font=size+'px "DejaVu Sans","Segoe UI Symbol",serif';ctx.textAlign='center';ctx.fillStyle=color;ctx.shadowColor='#000';ctx.shadowBlur=20;ctx.fillText(ch,x,y);ctx.shadowBlur=0;}
function shatranj(p,i){checker(.85,1500,3,135);checker(.85,0,2,135);
  const set=['♜','♞','♝','♛','♚','♝','♞','♜'];const e=C.ease(p*1.6);
  set.forEach((s,k)=>{const from=k<4?-200:1280,x=from+(140+k*115-from)*e;piece(s,x,1470,110,k%2?CREAM:GOLD);});
  const pawnX=-150+(540+150)*C.ease(p*2-(i%2)*.2);piece('♟',pawnX,430,150,GOLD);ctx.font='44px '+FONT;ctx.fillStyle=CREAM;ctx.fillText(['प्यादा','ਘੋੜਾ','हाथी','वज़ीर','बादशाह'][i%5],540,520);}
function cardRect(x,y,w,h,rot,suit,red){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.fillStyle=CREAM;ctx.strokeStyle=GOLD;ctx.lineWidth=8;
  ctx.beginPath();ctx.roundRect(-w/2,-h/2,w,h,28);ctx.fill();ctx.stroke();ctx.fillStyle=red?'#b3192d':'#1a0a0c';ctx.font='bold 70px serif';ctx.textAlign='center';
  ctx.fillText(suit,-w/2+50,-h/2+90);ctx.font='180px serif';ctx.fillText(suit,0,60);ctx.restore();}
function taash(p,i){const s=[['♠',0],['♥',1],['♦',1],['♣',0]],e=C.ease(p*1.8);
  s.forEach(([su,red],k)=>cardRect(540+(k-1.5)*190*e,1560,220,310,(k-1.5)*.18*e,su,red));
  cardRect(540,360,240,330,Math.sin(p*6)*.08,s[i%4][0],s[i%4][1]);}
function text(line,p){const e=C.ease(p*2.2),fade=p>.85?1-(p-.85)/.15:1;ctx.save();ctx.globalAlpha=Math.min(e,fade);
  let size=line.length>60?66:line.length>30?80:96;ctx.font='bold '+size+'px '+FONT;ctx.textAlign='center';
  const rows=C.wrap(line,780,s=>ctx.measureText(s).width);const y0=1000-rows.length*size*.65+(1-e)*80;
  rows.forEach((r,k)=>{ctx.fillStyle='#000a';ctx.fillText(r,544,y0+k*size*1.3+4);ctx.fillStyle=goldGrad(y0-size,y0+rows.length*size*1.3);ctx.fillText(r,540,y0+k*size*1.3);});ctx.restore();}
function frame(t){bg();const sc=C.sceneAt(t,lines.length,per);const i=Math.max(0,sc.index);
  if(tpl==='mehrab')mehrab(sc.p);else if(tpl==='shatranj')shatranj(sc.p,i);else taash(sc.p,i);
  if(lines[i])text(lines[i],sc.done?.5:sc.p);
  ctx.font='36px '+FONT;ctx.textAlign='center';ctx.fillStyle=GOLD;ctx.fillText('KDN · Khalsa Digital World',540,1860);
  ctx.font='30px '+FONT;ctx.fillStyle=CREAM;ctx.fillText((i+1)+' / '+lines.length,540,90);return sc;}
function loop(){const t=(performance.now()-t0)/1000;const sc=frame(t);if(sc.done){playing=false;onEnd&&onEnd();return;}raf=requestAnimationFrame(loop);}
let onEnd=null;
function play(cb){cancelAnimationFrame(raf);getLines();per=+$('rs-per').value;t0=performance.now();playing=true;onEnd=cb||null;loop();}
$('rs-preview').onclick=()=>{play();if(music){music.currentTime=0;music.play().catch(()=>{});}};
document.querySelectorAll('.tpl').forEach(b=>b.onclick=()=>{tpl=b.dataset.t;document.querySelectorAll('.tpl').forEach(x=>x.setAttribute('aria-pressed',x===b));getLines();frame(per*.6);});
$('rs-per').oninput=()=>{$('rs-perv').textContent=$('rs-per').value+'s';};
$('rs-music').onchange=e=>{const f=e.target.files[0];if(!f)return;music=new Audio(URL.createObjectURL(f));music.loop=true;say('🎵 '+f.name);};
// Creator import
const drafts=C.creatorDrafts(storage),sel=$('rs-draft');
drafts.forEach(d=>{const o=document.createElement('option');o.value=d.id;o.textContent=(d.heading||d.text).slice(0,50);sel.append(o);});
$('rs-import').onclick=()=>{const d=drafts.find(x=>x.id===sel.value);if(!d){say('Creator में कोई सेव ड्राफ्ट नहीं मिला।');return;}$('rs-text').value=d.text.split(/(?<=[।॥.!?])\s+|\n/).filter(Boolean).join('\n');getLines();frame(per*.6);say('📥 ड्राफ्ट आ गया');};
// Recording
let blob=null,ext='webm';
$('rs-record').onclick=()=>{if(!cv.captureStream||!window.MediaRecorder){say('यह browser video record नहीं करता — Chrome इस्तेमाल करें।');return;}
  const mime=C.pickMime(m=>MediaRecorder.isTypeSupported(m));ext=C.extFor(mime);const stream=cv.captureStream(30);
  let actx;if(music){try{actx=new AudioContext();const src=actx.createMediaElementSource(music),dst=actx.createMediaStreamDestination();src.connect(dst);src.connect(actx.destination);dst.stream.getAudioTracks().forEach(t=>stream.addTrack(t));music.currentTime=0;music.play();}catch(e){}}
  const rec=new MediaRecorder(stream,mime?{mimeType:mime,videoBitsPerSecond:6e6}:{});const parts=[];rec.ondataavailable=e=>e.data.size&&parts.push(e.data);
  rec.onstop=()=>{blob=new Blob(parts,{type:mime||'video/webm'});const v=$('rs-video');v.src=URL.createObjectURL(blob);v.hidden=false;$('rs-dl').disabled=$('rs-share').disabled=false;music&&music.pause();actx&&actx.close();say('✅ Reel तैयार ('+ext.toUpperCase()+')');};
  rec.start();say('⏺ Recording…');play(()=>setTimeout(()=>rec.stop(),400));};
const fname=()=>'kdn-reel-'+Date.now()+'.'+ext;
$('rs-dl').onclick=()=>{if(!blob)return;const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=fname();a.click();};
$('rs-share').onclick=async()=>{if(!blob)return;const file=new File([blob],fname(),{type:blob.type});const text=$('rs-caption').value;
  try{await navigator.clipboard.writeText(text);}catch{}
  if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],text});say('Share list में Instagram चुनें, caption copy है।');}catch{}}else{say('Share नहीं हुआ — Download करके Instagram में डालें।');}};
// Hashtags
let sets=C.loadSets(storage);const on=new Set(['kdn']);
function renderTags(){const box=$('rs-sets');box.textContent='';sets.forEach(s=>{const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=s.name;b.setAttribute('aria-pressed',on.has(s.id));
  b.onclick=()=>{on.has(s.id)?on.delete(s.id):on.add(s.id);renderTags();};box.append(b);});
  const cur=sets.find(s=>s.id===$('rs-edit-set').value)||sets[0];$('rs-edit-set').innerHTML=sets.map(s=>`<option value="${s.id}">${s.name.replace(/</g,'')}</option>`).join('');$('rs-edit-set').value=cur.id;$('rs-tags').value=cur.tags;updateCaption();}
function updateCaption(){$('rs-caption').value=C.caption(getLines().join('\n'),sets.filter(s=>on.has(s.id)).map(s=>s.tags));}
$('rs-edit-set').onchange=()=>{$('rs-tags').value=(sets.find(s=>s.id===$('rs-edit-set').value)||{}).tags||'';};
$('rs-save-tags').onclick=()=>{const s=sets.find(x=>x.id===$('rs-edit-set').value);if(!s)return;s.tags=C.normTags($('rs-tags').value);try{C.saveSets(storage,sets);say('💾 hashtags सेव');}catch{say('सेव नहीं हुआ');}renderTags();};
$('rs-reset-tags').onclick=()=>{sets=C.DEFAULT_SETS.map(x=>({...x}));try{C.saveSets(storage,sets);}catch{}renderTags();};
$('rs-copy').onclick=async()=>{updateCaption();try{await navigator.clipboard.writeText($('rs-caption').value);say('📋 Caption + hashtags copy');}catch{$('rs-caption').select();say('दबाकर Copy करें');}};
$('rs-text').oninput=updateCaption;
renderTags();getLines();(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>frame(per*.6));
window.__reelFrame=(t,name)=>{if(name)tpl=name;getLines();frame(t);};
})();
