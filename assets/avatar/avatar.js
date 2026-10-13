// UI for मेरा अवतार. Photo stays on device; MediaPipe runs in-browser.
const MP='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
const MODEL='https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
const A=window.KDNAvatar,$=id=>document.getElementById(id);
let opt=A.load(localStorage),landmarker=null;
const canvas=$('av-canvas'),ctx=canvas.getContext('2d'),status=t=>{$('av-status').textContent=t;};
function render(){A.draw(ctx,canvas.width,opt,'neutral',{});document.getElementById('av-dastaar-group').hidden=!(opt.head==='dastaar'||opt.head==='patka');sync();renderStickers();}
function swatches(id,list,key){const el=$(id);el.innerHTML='';for(const c of list){const b=document.createElement('button');b.type='button';b.className='sw';b.style.background=c.c||c;b.dataset.v=c.c||c;b.setAttribute('aria-label',c.n||c);b.onclick=()=>{opt[key]=b.dataset.v;render();};el.append(b);}}
function chips(id,list,key){const el=$(id);el.innerHTML='';for(const c of list){const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=c.n;b.dataset.v=c.id;b.onclick=()=>{opt[key]=c.id;render();};el.append(b);}}
function sync(){for(const[id,key]of[['av-skin','skin'],['av-hair','hair'],['av-dastaar','dastaar'],['av-head','head'],['av-beard','beard'],['av-eyes','eyes']])for(const b of $(id).children)b.setAttribute('aria-pressed',String(b.dataset.v===opt[key]));$('av-smile').value=opt.smile;if(document.activeElement!==$('av-name'))$('av-name').value=opt.name;}
swatches('av-skin',A.SKINS,'skin');swatches('av-hair',A.HAIR,'hair');swatches('av-dastaar',A.DASTAAR,'dastaar');chips('av-head',A.HEADS,'head');chips('av-beard',A.BEARDS,'beard');chips('av-eyes',A.EYES,'eyes');
$('av-smile').oninput=e=>{opt.smile=+e.target.value;render();};$('av-name').oninput=e=>{opt.name=e.target.value;};
$('av-save').onclick=()=>{opt=A.save(localStorage,opt);status('✅ अवतार इस फ़ोन में सहेज लिया गया।');};
$('av-reset').onclick=()=>{opt=A.sanitize(null);render();status('नए सिरे से शुरू।');};
const fname=s=>'kdn-avatar-'+s+(opt.name?'-'+opt.name.replace(/\s+/g,'_'):'');
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000);}
async function share(blob,name){const file=new File([blob],name,{type:blob.type});if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:'मेरा अवतार'});return;}catch(e){if(e.name==='AbortError')return;}}download(blob,name);}
const toBlob=c=>new Promise(r=>c.toBlob(r,'image/png'));
$('av-dl').onclick=async()=>download(await toBlob(canvas),fname('main')+'.png');
let stickerTimer=0;
function renderStickers(){clearTimeout(stickerTimer);stickerTimer=setTimeout(()=>{const el=$('av-stickers');el.innerHTML='';for(const s of A.STICKERS){const c=document.createElement('canvas');c.width=c.height=320;A.draw(c.getContext('2d'),320,opt,s.id,{t:0.2});
 const t=document.createElement('div');t.className='tile';const img=new Image();img.alt=s.n;img.src=c.toDataURL('image/png');const b=document.createElement('b');b.textContent=s.emoji+' '+s.n;
 const r=document.createElement('div');r.className='row';const d=document.createElement('button');d.type='button';d.textContent='⬇️';d.setAttribute('aria-label',s.n+' डाउनलोड');d.onclick=async()=>download(await toBlob(c),fname(s.id)+'.png');
 const sh=document.createElement('button');sh.type='button';sh.textContent='📤 भेजो';sh.onclick=async()=>share(await toBlob(c),fname(s.id)+'.png');r.append(d,sh);t.append(img,b,r);el.append(t);}},60);}
$('av-gif-make').onclick=async()=>{const btn=$('av-gif-make');btn.disabled=true;status('GIF बन रहे हैं…');
 try{const {GIFEncoder,quantize,applyPalette}=await import('./vendor/gifenc.esm.js');const el=$('av-gifs');el.innerHTML='';const S=200;
  for(const g of A.GIFS){const c=document.createElement('canvas');c.width=c.height=S;const cx=c.getContext('2d',{willReadFrequently:true});const enc=GIFEncoder();
   for(let i=0;i<g.frames;i++){const p=i/g.frames;const f=g.id==='blink'?{blink:Math.max(0,1-Math.abs(p-0.5)*6)}:g.id==='smile'?{smile:Math.sin(p*Math.PI)}:{wave:p};
    const o=g.id==='smile'?Object.assign({},opt,{smile:0}):opt;cx.fillStyle='#24070b';cx.fillRect(0,0,S,S);A.draw(cx,S,o,'neutral',f);
    const {data}=cx.getImageData(0,0,S,S);const pal=quantize(data,128);enc.writeFrame(applyPalette(data,pal),S,S,{palette:pal,delay:g.id==='blink'?120:100});}
   enc.finish();const blob=new Blob([enc.bytes()],{type:'image/gif'});const t=document.createElement('div');t.className='tile';const img=new Image();img.alt=g.n;img.src=URL.createObjectURL(blob);const b=document.createElement('b');b.textContent=g.n;
   const r=document.createElement('div');r.className='row';const d=document.createElement('button');d.type='button';d.textContent='⬇️';d.onclick=()=>download(blob,fname(g.id)+'.gif');const sh=document.createElement('button');sh.type='button';sh.textContent='📤 भेजो';sh.onclick=()=>share(blob,fname(g.id)+'.gif');r.append(d,sh);t.append(img,b,r);el.append(t);}
  status('✅ तीनों GIF तैयार हैं।');}catch(e){status('GIF नहीं बन पाया: '+e.message);}finally{btn.disabled=false;}};
async function getLandmarker(){if(landmarker)return landmarker;const v=await import(MP+'/vision_bundle.mjs');const files=await v.FilesetResolver.forVisionTasks(MP+'/wasm');
 landmarker=await v.FaceLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:MODEL},runningMode:'IMAGE',numFaces:1});return landmarker;}
function patch(pctx,cx,cy,r){const W=pctx.canvas.width,H=pctx.canvas.height;const x=Math.max(0,Math.round(cx-r)),y=Math.max(0,Math.round(cy-r)),w=Math.min(W-x,Math.round(r*2)),h=Math.min(H-y,Math.round(r*2));return w>0&&h>0?pctx.getImageData(x,y,w,h).data:null;}
async function onPhoto(file){if(!file)return;status('फ़ोटो पढ़ रहे हैं…');const bmp=await createImageBitmap(file);const pc=$('av-photo'),pctx=pc.getContext('2d',{willReadFrequently:true});
 const s=Math.min(bmp.width,bmp.height),W=pc.width;pctx.drawImage(bmp,(bmp.width-s)/2,(bmp.height-s)/2,s,s,0,0,W,W);
 status('चेहरा पहचान रहे हैं… (पहली बार थोड़ा समय लगेगा)');
 try{const lm=await getLandmarker();const res=lm.detect(pc);const l=res.faceLandmarks&&res.faceLandmarks[0];if(!l){status('चेहरा साफ़ नहीं दिखा। सामने से रोशनी में दोबारा फ़ोटो लें, या नीचे से खुद सजाएँ।');return;}
  const P=i=>[l[i].x*W,l[i].y*W],faceW=Math.hypot(P(454)[0]-P(234)[0],P(454)[1]-P(234)[1]),r=Math.max(3,faceW*0.05);
  const cheekA=patch(pctx,...P(50),r),cheekB=patch(pctx,...P(280),r);const cheek=cheekA&&cheekB?new Uint8ClampedArray([...cheekA,...cheekB]):cheekA||cheekB;
  const fh=P(10),ch=P(152);const hair=patch(pctx,fh[0],fh[1]-faceW*0.22,r*1.6),chin=patch(pctx,ch[0],ch[1]-faceW*0.03,r);
  const name=opt.name;opt=A.inferFromSamples({cheek,hair,chin,smile:A.smileFromLandmarks(l)});opt.name=name;render();status('✅ अवतार बन गया! नीचे से रंग और रूप बदल सकते हैं।');}
 catch(e){status('चेहरा पहचानने का साधन नहीं खुला (इंटरनेट जाँचें)। आप नीचे से खुद अवतार सजा सकते हैं।');}}
$('av-file').onchange=e=>onPhoto(e.target.files[0]);$('av-camera').onchange=e=>onPhoto(e.target.files[0]);
render();
