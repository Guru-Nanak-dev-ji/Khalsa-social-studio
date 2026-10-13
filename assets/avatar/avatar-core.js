(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNAvatar=m;})(this,function(){'use strict';
// Pure helpers + canvas drawing for the on-device cartoon avatar. No network.
const KEY='kdn-avatar-v1';
const SKINS=['#f6d7b8','#eac196','#d9a273','#c68a5a','#a96c40','#7d4c2b','#5a3520'];
const HAIR=['#1b1210','#3b2416','#6b4423','#9a9a9a','#e8e4dc'];
const DASTAAR=[{n:'केसरी',c:'#f28c0f'},{n:'नीला',c:'#1c3f95'},{n:'सफ़ेद',c:'#f4f1e8'},{n:'काला',c:'#151515'},{n:'लाल',c:'#b3192d'},{n:'गुलाबी',c:'#e35d9b'},{n:'हरा',c:'#1f7a3f'},{n:'पीला',c:'#f2c230'}];
const HEADS=[{id:'dastaar',n:'दस्तार'},{id:'patka',n:'पटका'},{id:'hair',n:'बाल'},{id:'long',n:'लंबे बाल'},{id:'none',n:'कुछ नहीं'}];
const BEARDS=[{id:'full',n:'पूरी दाढ़ी'},{id:'short',n:'छोटी दाढ़ी'},{id:'none',n:'बिना दाढ़ी'}];
const EYES=[{id:'round',n:'गोल'},{id:'almond',n:'बादाम'},{id:'happy',n:'मुस्कुराती'}];
const STICKERS=[{id:'hansi',n:'हँसी',emoji:'😂'},{id:'namaste',n:'नमस्ते',emoji:'🙏'},{id:'taali',n:'ताली',emoji:'👏'},{id:'hairan',n:'हैरान',emoji:'😲'},{id:'gussa',n:'गुस्सा',emoji:'😠'},{id:'pyaar',n:'प्यार',emoji:'❤️'}];
const GIFS=[{id:'blink',n:'पलक झपकना',frames:10},{id:'smile',n:'मुस्कान',frames:10},{id:'wave',n:'हाथ हिलाना',frames:12}];
const DEFAULTS={skin:'#d9a273',hair:'#1b1210',head:'dastaar',dastaar:'#f28c0f',beard:'full',eyes:'round',smile:0.5,name:''};
const hex=h=>{h=String(h||'').replace('#','');if(!/^[0-9a-f]{6}$/i.test(h))return null;return[0,2,4].map(i=>parseInt(h.slice(i,i+2),16));};
const toHex=rgb=>'#'+rgb.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const shade=(h,k)=>{const c=hex(h)||[128,128,128];return toHex(c.map(v=>k<0?v*(1+k):v+(255-v)*k));};
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
// Average RGB of pixels in [r,g,b,a,...] buffer, ignoring transparent ones.
function average(data){let r=0,g=0,b=0,n=0;for(let i=0;i<data.length;i+=4){if(data[i+3]<128)continue;r+=data[i];g+=data[i+1];b+=data[i+2];n++;}return n?[r/n,g/n,b/n]:null;}
const nearest=(rgb,list)=>list.reduce((best,h)=>dist(rgb,hex(h))<dist(rgb,hex(best))?h:best,list[0]);
// Turn sampled patches into avatar options. Skin keeps the true sampled tone.
function inferFromSamples(s){const o=Object.assign({},DEFAULTS);const skin=s.cheek&&average(s.cheek);if(skin)o.skin=toHex(skin);
 const hairRgb=s.hair&&average(s.hair);if(hairRgb){o.hair=nearest(hairRgb,HAIR);
  // A strongly coloured, non-skin, non-hair crown is likely a dastaar/patka.
  const sat=Math.max(...hairRgb)-Math.min(...hairRgb);if(skin&&dist(hairRgb,skin)>70&&sat>60){o.head='dastaar';o.dastaar=DASTAAR.reduce((b,d)=>dist(hairRgb,hex(d.c))<dist(hairRgb,hex(b.c))?d:b,DASTAAR[0]).c;}else o.head='hair';}
 const chin=s.chin&&average(s.chin);if(chin&&skin)o.beard=dist(chin,skin)>90?'full':dist(chin,skin)>55?'short':'none';
 if(typeof s.smile==='number')o.smile=Math.max(0,Math.min(1,s.smile));return o;}
// Mouth openness from landmarks (13 upper lip, 14 lower lip, 61/291 corners).
function smileFromLandmarks(l){if(!l||!l[61]||!l[291]||!l[13])return 0.5;const w=Math.hypot(l[291].x-l[61].x,l[291].y-l[61].y),face=Math.hypot(l[454].x-l[234].x,l[454].y-l[234].y)||1;const lift=((l[13].y+l[14].y)/2)-((l[61].y+l[291].y)/2);return Math.max(0,Math.min(1,(w/face-0.33)*4+lift*20));}
function sanitize(o){const d=Object.assign({},DEFAULTS),x=o&&typeof o==='object'?o:{};
 for(const k of['skin','hair','dastaar'])if(hex(x[k]))d[k]=toHex(hex(x[k]));
 if(HEADS.some(h=>h.id===x.head))d.head=x.head;if(BEARDS.some(h=>h.id===x.beard))d.beard=x.beard;if(EYES.some(h=>h.id===x.eyes))d.eyes=x.eyes;
 if(typeof x.smile==='number'&&isFinite(x.smile))d.smile=Math.max(0,Math.min(1,x.smile));d.name=String(x.name||'').slice(0,30);return d;}
function load(store){try{return sanitize(JSON.parse(store.getItem(KEY)||'null'));}catch(e){return sanitize(null);}}
function save(store,o){const c=sanitize(o);store.setItem(KEY,JSON.stringify(c));return c;}
// expr: neutral|hansi|namaste|taali|hairan|gussa|pyaar ; f: {blink,smile,wave,t}
function draw(ctx,S,opt,expr,f){const o=sanitize(opt);f=f||{};expr=expr||'neutral';const u=S/100;ctx.save();ctx.clearRect(0,0,S,S);
 const P=(fn)=>{ctx.beginPath();fn();};
 // backdrop medallion
 const g=ctx.createRadialGradient(50*u,45*u,5*u,50*u,50*u,50*u);g.addColorStop(0,'#5a1220');g.addColorStop(1,'#24070b');ctx.fillStyle=g;P(()=>ctx.arc(50*u,50*u,48*u,0,7));ctx.fill();ctx.lineWidth=2.5*u;ctx.strokeStyle='#e7c46a';ctx.stroke();
 const skin=o.skin,skinD=shade(skin,-0.18);
 // long hair behind
 if(o.head==='long'){ctx.fillStyle=o.hair;P(()=>ctx.ellipse(50*u,58*u,30*u,34*u,0,0,7));ctx.fill();}
 // neck + shoulders
 ctx.fillStyle='#e7c46a';P(()=>ctx.ellipse(50*u,104*u,40*u,22*u,0,0,7));ctx.fill();ctx.fillStyle=skinD;ctx.fillRect(42*u,68*u,16*u,16*u);
 // ears + face
 ctx.fillStyle=skin;for(const x of[24,76]){P(()=>ctx.ellipse(x*u,52*u,5*u,7*u,0,0,7));ctx.fill();}
 P(()=>ctx.ellipse(50*u,52*u,25*u,29*u,0,0,7));ctx.fill();
 // beard
 const beardCol=o.hair;if(o.beard!=='none'){ctx.fillStyle=beardCol;P(()=>{if(o.beard==='full'){ctx.moveTo(25*u,50*u);ctx.quadraticCurveTo(26*u,86*u,50*u,92*u);ctx.quadraticCurveTo(74*u,86*u,75*u,50*u);ctx.quadraticCurveTo(70*u,70*u,50*u,72*u);ctx.quadraticCurveTo(30*u,70*u,25*u,50*u);}else{ctx.moveTo(30*u,62*u);ctx.quadraticCurveTo(34*u,80*u,50*u,82*u);ctx.quadraticCurveTo(66*u,80*u,70*u,62*u);ctx.quadraticCurveTo(62*u,74*u,50*u,74*u);ctx.quadraticCurveTo(38*u,74*u,30*u,62*u);}});ctx.fill();
  // moustache
  P(()=>{ctx.moveTo(50*u,64*u);ctx.quadraticCurveTo(38*u,60*u,33*u,68*u);ctx.quadraticCurveTo(42*u,66*u,50*u,67*u);ctx.quadraticCurveTo(58*u,66*u,67*u,68*u);ctx.quadraticCurveTo(62*u,60*u,50*u,64*u);});ctx.fill();}
 // head covering / hair
 if(o.head==='dastaar'){const c=o.dastaar;ctx.fillStyle=c;P(()=>{ctx.moveTo(22*u,44*u);ctx.quadraticCurveTo(20*u,8*u,50*u,6*u);ctx.quadraticCurveTo(80*u,8*u,78*u,44*u);ctx.quadraticCurveTo(50*u,30*u,22*u,44*u);});ctx.fill();ctx.strokeStyle=shade(c,-0.3);ctx.lineWidth=1.6*u;for(let i=0;i<4;i++){P(()=>{ctx.moveTo((24+i*3)*u,(38-i*7)*u);ctx.quadraticCurveTo(50*u,(22-i*6)*u,(76-i*3)*u,(38-i*7)*u);});ctx.stroke();}
  P(()=>{ctx.moveTo(50*u,34*u);ctx.lineTo(42*u,10*u);});ctx.stroke();ctx.fillStyle='#e7c46a';P(()=>ctx.arc(50*u,30*u,1.8*u,0,7));ctx.fill();}
 else if(o.head==='patka'){const c=o.dastaar;ctx.fillStyle=c;P(()=>{ctx.moveTo(24*u,42*u);ctx.quadraticCurveTo(24*u,14*u,50*u,14*u);ctx.quadraticCurveTo(76*u,14*u,76*u,42*u);ctx.quadraticCurveTo(50*u,34*u,24*u,42*u);});ctx.fill();P(()=>ctx.arc(50*u,15*u,8*u,0,7));ctx.fill();ctx.strokeStyle=shade(c,-0.3);ctx.lineWidth=1.4*u;P(()=>ctx.arc(50*u,15*u,8*u,0,7));ctx.stroke();}
 else if(o.head==='hair'||o.head==='long'){ctx.fillStyle=o.hair;P(()=>{ctx.moveTo(25*u,48*u);ctx.quadraticCurveTo(22*u,18*u,50*u,20*u);ctx.quadraticCurveTo(78*u,18*u,75*u,48*u);ctx.quadraticCurveTo(70*u,32*u,56*u,32*u);ctx.quadraticCurveTo(40*u,28*u,25*u,48*u);});ctx.fill();}
 // eyebrows
 ctx.strokeStyle=o.hair==='#e8e4dc'?'#8d8a84':o.hair;ctx.lineWidth=2.2*u;ctx.lineCap='round';const angry=expr==='gussa',surpr=expr==='hairan';
 for(const s of[-1,1]){P(()=>{const x=50+s*11;ctx.moveTo((x-s*-6)*u,(angry?41:surpr?36:40)*u);ctx.lineTo((x+s*6)*u,(angry?44:surpr?35:39)*u);});ctx.stroke();}
 // eyes
 const blink=Math.max(0,Math.min(1,f.blink||0));
 for(const s of[-1,1]){const x=(50+s*11)*u,y=48*u;
  if(expr==='hansi'||expr==='pyaar'&&false){ctx.strokeStyle='#1b1210';ctx.lineWidth=2*u;P(()=>ctx.arc(x,y+1*u,4*u,Math.PI*1.1,Math.PI*1.9));ctx.stroke();continue;}
  if(expr==='pyaar'){heart(ctx,x,y,4.5*u,'#e0324b');continue;}
  const ry=(o.eyes==='almond'?3:o.eyes==='happy'?3.4:4.2)*(surpr?1.3:1)*(1-blink)*u;
  if(ry<0.6*u){ctx.strokeStyle='#1b1210';ctx.lineWidth=1.8*u;P(()=>{ctx.moveTo(x-4*u,y);ctx.lineTo(x+4*u,y);});ctx.stroke();continue;}
  ctx.fillStyle='#fff';P(()=>ctx.ellipse(x,y,(o.eyes==='almond'?5:4.4)*u,ry,0,0,7));ctx.fill();ctx.fillStyle='#2a1a10';P(()=>ctx.ellipse(x,y,2.3*u,Math.min(2.3*u,ry),0,0,7));ctx.fill();ctx.fillStyle='#fff';P(()=>ctx.arc(x+0.9*u,y-0.9*u,0.7*u,0,7));ctx.fill();
  if(o.eyes==='happy'){ctx.strokeStyle=skinD;ctx.lineWidth=1.2*u;P(()=>ctx.arc(x,y+5*u,4*u,Math.PI*1.15,Math.PI*1.85));ctx.stroke();}}
 // nose
 ctx.strokeStyle=skinD;ctx.lineWidth=1.6*u;P(()=>{ctx.moveTo(50*u,50*u);ctx.quadraticCurveTo(46*u,58*u,50*u,59*u);});ctx.stroke();
 // cheeks
 ctx.fillStyle='rgba(230,90,90,.22)';for(const s of[-1,1]){P(()=>ctx.ellipse((50+s*15)*u,58*u,4*u,2.5*u,0,0,7));ctx.fill();}
 // mouth
 const sm=expr==='neutral'?Math.max(o.smile,f.smile||0):({hansi:1,namaste:0.6,taali:0.9,pyaar:0.8,hairan:0,gussa:0}[expr]);
 ctx.lineWidth=2*u;ctx.strokeStyle='#5a1a14';
 if(expr==='hairan'){ctx.fillStyle='#3a0d0d';P(()=>ctx.ellipse(50*u,69*u,3.5*u,4.5*u,0,0,7));ctx.fill();}
 else if(expr==='gussa'){P(()=>{ctx.moveTo(43*u,71*u);ctx.quadraticCurveTo(50*u,66*u,57*u,71*u);});ctx.stroke();}
 else if(sm>0.75){ctx.fillStyle='#5a1a14';P(()=>{ctx.moveTo(41*u,67*u);ctx.quadraticCurveTo(50*u,79*u,59*u,67*u);ctx.closePath();});ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(44*u,67*u,12*u,2*u);}
 else{P(()=>{ctx.moveTo(43*u,68*u);ctx.quadraticCurveTo(50*u,(68+sm*8)*u,57*u,68*u);});ctx.stroke();}
 if(expr==='gussa'){ctx.fillStyle='rgba(220,40,40,.28)';P(()=>ctx.ellipse(50*u,55*u,24*u,26*u,0,0,7));ctx.fill();}
 // hands / extras
 if(expr==='namaste')hands(ctx,u,skin,'namaste',0);
 if(expr==='taali')hands(ctx,u,skin,'taali',f.t||0);
 if(typeof f.wave==='number')hands(ctx,u,skin,'wave',f.wave);
 if(expr==='pyaar'){heart(ctx,82*u,20*u,7*u,'#e0324b');heart(ctx,18*u,26*u,5*u,'#ff6b81');}
 if(expr==='hansi'){ctx.fillStyle='#7fd3ff';for(const s of[-1,1]){P(()=>ctx.ellipse((50+s*19)*u,52*u,1.8*u,3*u,0,0,7));ctx.fill();}}
 if(expr==='gussa'){ctx.strokeStyle='#b3192d';ctx.lineWidth=2*u;P(()=>{ctx.moveTo(78*u,14*u);ctx.lineTo(86*u,22*u);ctx.moveTo(86*u,14*u);ctx.lineTo(78*u,22*u);});ctx.stroke();}
 ctx.restore();}
function heart(ctx,x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x,y+r*0.9);ctx.bezierCurveTo(x-r*1.6,y-r*0.2,x-r*0.6,y-r*1.4,x,y-r*0.4);ctx.bezierCurveTo(x+r*0.6,y-r*1.4,x+r*1.6,y-r*0.2,x,y+r*0.9);ctx.fill();}
function hands(ctx,u,skin,kind,p){ctx.fillStyle=skin;ctx.strokeStyle=shade(skin,-0.3);ctx.lineWidth=1.2*u;
 const palm=(x,y,a)=>{ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.beginPath();ctx.ellipse(0,0,6*u,9*u,0,0,7);ctx.fill();ctx.stroke();ctx.restore();};
 if(kind==='namaste'){palm(47*u,90*u,0.25);palm(53*u,90*u,-0.25);}
 else if(kind==='taali'){const gap=4+Math.abs(Math.sin(p*Math.PI*2))*6;palm((50-gap)*u,88*u,0.4);palm((50+gap)*u,88*u,-0.4);}
 else{palm(84*u,72*u,Math.sin(p*Math.PI*2)*0.5);}}
return{KEY,SKINS,HAIR,DASTAAR,HEADS,BEARDS,EYES,STICKERS,GIFS,DEFAULTS,hex,toHex,shade,average,inferFromSamples,smileFromLandmarks,sanitize,load,save,draw};});
