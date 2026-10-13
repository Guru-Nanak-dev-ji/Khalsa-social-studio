(()=>{'use strict';const C=window.KNNCore,$=id=>document.getElementById(id);
const cv=$('stage'),ctx=cv.getContext('2d');let mode='portrait',local=null,guest=null,facing='user',rec=null,chunks=[],peer=null,room=null,blob=null;
const vA=document.createElement('video'),vG=document.createElement('video');[vA,vG].forEach(v=>{v.muted=true;v.playsInline=true;v.autoplay=true;});
const params=new URLSearchParams(location.search),guestRoom=params.get('room');const isGuest=C.validRoom(guestRoom);
const say=t=>$('status').textContent=t,psay=t=>$('peerstatus').textContent=t;
function setSize(){const s=C.size(mode);cv.width=s.w;cv.height=s.h;}
async function startCam(){try{if(local)local.getTracks().forEach(t=>t.stop());local=await navigator.mediaDevices.getUserMedia({video:{facingMode:facing,width:{ideal:1280},height:{ideal:720}},audio:{echoCancellation:true,noiseSuppression:true}});vA.srcObject=local;await vA.play().catch(()=>{});say('📷 Camera चालू ✅');return true}catch(e){say('Camera नहीं खुला: अनुमति दें · Allow camera ('+e.name+')');return false}}
function arch(x,y,w,h){ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x,y+w/2);ctx.arc(x+w/2,y+w/2,w/2,Math.PI,0);ctx.lineTo(x+w,y+h);}
function tile(v,t,label){ctx.fillStyle='#120607';ctx.fillRect(t.x,t.y,t.w,t.h);const c=v.videoWidth?C.cover(v.videoWidth,v.videoHeight,t):null;
 if(c)ctx.drawImage(v,c.sx,c.sy,c.sw,c.sh,t.x,t.y,t.w,t.h);else{ctx.fillStyle='#f2c66a';ctx.font='bold 54px system-ui';ctx.textAlign='center';ctx.fillText(t.who==='guest'?'👤 Guest आ रहे हैं…':'📷 Camera चालू करें',t.x+t.w/2,t.y+t.h/2);ctx.textAlign='left';}
 ctx.strokeStyle='#f2c66a';ctx.lineWidth=6;ctx.strokeRect(t.x+3,t.y+3,t.w-6,t.h-6);
 // lower third
 const lh=mode==='portrait'?130:110,ly=t.y+t.h-lh-24,lw=Math.min(t.w-48,900);ctx.fillStyle='rgba(90,15,20,.92)';ctx.fillRect(t.x+24,ly,lw,lh);ctx.fillStyle='#f2c66a';ctx.fillRect(t.x+24,ly,14,lh);
 ctx.fillStyle='#fff';ctx.font='bold 50px system-ui';ctx.fillText(label[0],t.x+56,ly+56,lw-50);ctx.fillStyle='#f2c66a';ctx.font='bold 36px system-ui';ctx.fillText(label[1],t.x+56,ly+lh-22,lw-50);}
let tx=0;function draw(ts){const W=cv.width,H=cv.height,P=mode==='portrait';
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#3a0a0e');g.addColorStop(1,'#050202');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 // studio lights
 for(let i=0;i<5;i++){const x=W*(i+.5)/5,a=.10+.06*Math.sin(ts/700+i);const r=ctx.createRadialGradient(x,0,10,x,0,P?520:420);r.addColorStop(0,`rgba(255,220,150,${a+.2})`);r.addColorStop(1,'rgba(255,220,150,0)');ctx.fillStyle=r;ctx.fillRect(0,0,W,H);}
 // mehrab top
 ctx.strokeStyle='#f2c66a';ctx.lineWidth=8;arch(W*.1,P?40:20,W*.8,P?600:300);ctx.stroke();
 const tiles=C.layout(mode,!!guest);tiles.forEach(t=>tile(t.who==='guest'?vG:vA,t,t.who==='guest'?[$('guestName').value,'LIVE · KNN']:[$('anchor').value,$('anchorRole').value]));
 // top bar: logo bug, LIVE, clock
 const tb=P?150:90,ty=P?70:18;ctx.fillStyle='#f2c66a';ctx.fillRect(30,ty,P?230:200,tb-20);ctx.fillStyle='#3a0a0e';ctx.font=`900 ${P?84:64}px system-ui`;ctx.fillText('KNN',50,ty+(P?100:62));
 const on=Math.floor(ts/600)%2;ctx.fillStyle=on?'#e0101a':'#9c0b12';ctx.fillRect(P?290:250,ty,200,tb-20);ctx.fillStyle='#fff';ctx.font=`900 ${P?62:52}px system-ui`;ctx.fillText('● LIVE',(P?300:262),ty+(P?90:58));
 ctx.textAlign='right';ctx.font=`bold ${P?60:50}px system-ui`;ctx.fillStyle='#fff';ctx.fillText(C.clock(new Date()),W-30,ty+(P?90:58));ctx.textAlign='left';
 // anchor desk + breaking + ticker
 const by=H-(P?400:240);ctx.fillStyle='#5a0f14';ctx.fillRect(0,by,W,P?40:30);ctx.fillStyle='#f2c66a';ctx.fillRect(0,by+(P?40:30),W,6);
 const bh=P?170:110,bry=by+(P?60:46);ctx.fillStyle='#c4121c';ctx.fillRect(0,bry,P?300:330,bh);ctx.fillStyle='#fff';ctx.font=`900 ${P?54:46}px system-ui`;ctx.fillText(P?'BREAKING':'BREAKING',16,bry+bh/2+18,P?280:310);
 ctx.fillStyle='#fff8e8';ctx.fillRect(P?300:330,bry,W,bh);ctx.fillStyle='#3a0a0e';ctx.font=`900 ${P?58:52}px system-ui`;ctx.fillText($('headline').value,(P?320:350),bry+bh/2+20,W-(P?340:370));
 const tky=bry+bh+10,th=P?110:70;ctx.fillStyle='#120607';ctx.fillRect(0,tky,W,th);const text=C.tickerText($('ticker').value.split('\n'));ctx.font=`bold ${P?52:40}px system-ui`;ctx.fillStyle='#f2c66a';const tw=ctx.measureText(text+'   ◆   ').width||1;tx=(tx+4)%tw;for(let x=-tx;x<W;x+=tw)ctx.fillText(text+'   ◆   ',x,tky+th/2+16);
 requestAnimationFrame(draw);}
// audio mix
let ac=null,dest=null;function mix(){ac=ac||new AudioContext();dest=ac.createMediaStreamDestination();[local,guest].forEach(s=>{if(s&&s.getAudioTracks().length)ac.createMediaStreamSource(s).connect(dest)});return dest.stream.getAudioTracks();}
$('rec').onclick=async()=>{if(!local&&!await startCam())return;const s=cv.captureStream(30);mix().forEach(t=>s.addTrack(t));const mime=C.pickMime(m=>window.MediaRecorder&&MediaRecorder.isTypeSupported(m));
 try{rec=new MediaRecorder(s,mime?{mimeType:mime,videoBitsPerSecond:6e6}:{})}catch(e){say('इस browser में recording नहीं चलती');return}chunks=[];rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);
 rec.onstop=()=>{blob=new Blob(chunks,{type:rec.mimeType||'video/webm'});const ext=blob.type.includes('mp4')?'mp4':'webm';const u=URL.createObjectURL(blob);$('playback').src=u;$('dl').href=u;$('dl').download='knn-news-'+Date.now()+'.'+ext;$('out').hidden=false;say('✅ Video तैयार · Download या Share करें')};
 rec.start(1000);$('rec').disabled=true;$('stop').disabled=false;say('⏺ Recording चल रही है…');};
$('stop').onclick=()=>{if(rec&&rec.state!=='inactive')rec.stop();$('rec').disabled=false;$('stop').disabled=true;};
$('share').onclick=async()=>{if(!blob)return;const f=new File([blob],$('dl').download,{type:blob.type});if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],title:'KNN News'}).catch(()=>{});else say('Share नहीं हुआ — Download दबाएँ');};
$('cam').onclick=startCam;$('flip').onclick=()=>{facing=facing==='user'?'environment':'user';startCam()};
$('orient').onclick=()=>{mode=mode==='portrait'?'landscape':'portrait';setSize();say(mode==='portrait'?'9:16 Reel (1080×1920)':'16:9 TV (1920×1080)')};
function gotGuest(s){guest=s;vG.srcObject=s;vG.play().catch(()=>{});psay('✅ Guest जुड़ गए · Guest connected');}
$('host').onclick=async()=>{if(!window.Peer){psay('Guest सेवा load नहीं हुई — internet जाँचें');return}if(!local&&!await startCam())return;room=C.roomId();peer=new Peer(room);
 peer.on('open',()=>{const l=C.guestLink(location.href,room);$('link').textContent=l;$('copy').disabled=$('wa').disabled=false;psay('🔗 Link guest को भेजें, वो खोलें और Allow दबाएँ')});
 peer.on('call',call=>{call.answer(local);call.on('stream',gotGuest);call.on('close',()=>{guest=null;psay('Guest चले गए')})});peer.on('error',e=>psay('जुड़ नहीं सका: '+e.type));};
$('copy').onclick=()=>navigator.clipboard.writeText($('link').textContent).then(()=>psay('📋 Copy हो गया'));
$('wa').onclick=()=>open('https://wa.me/?text='+encodeURIComponent('KNN News Studio में guest बनें: '+$('link').textContent),'_blank');
async function joinAsGuest(){document.querySelector('.arch h1').textContent='👤 KNN Guest';psay('Guest mode: Camera चालू करें…');if(!await startCam())return;
 const wait=()=>new Promise(r=>{const t=setInterval(()=>{if(window.Peer){clearInterval(t);r()}},200)});await wait();peer=new Peer();peer.on('open',()=>{const call=peer.call(guestRoom,local);psay('Anchor से जुड़ रहे हैं…');call.on('stream',s=>{guest=s;vG.srcObject=s;vG.play().catch(()=>{});psay('✅ Studio से जुड़ गए · You are live with the anchor')});});peer.on('error',e=>psay('जुड़ नहीं सका: '+e.type));}
setSize();requestAnimationFrame(draw);if(isGuest)joinAsGuest();
})();
