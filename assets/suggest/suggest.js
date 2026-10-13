/* 💬 सुझाव bubble — एक line लिखो या बोलो, owner के Telegram पर जाता है */
(function(){if(window.__kdnSuggest)return;window.__kdnSuggest=1;
const API='https://kdn-telegram-bot.khatrinewsnetwork.workers.dev',LS='kdn_suggest_list',OPEN='kdn_suggest_open',POS='kdn_suggest_pos';
const css=`#kdn-sg-b{position:fixed;left:10px;bottom:calc(78px + env(safe-area-inset-bottom));z-index:2147483000;border:1px solid #e9c46a;background:linear-gradient(180deg,#3a2410,#1c1007);color:#ffe7a3;border-radius:22px;padding:7px 12px;font:600 14px Mukta,'Noto Sans Devanagari',sans-serif;box-shadow:0 4px 14px #0008;cursor:pointer}
#kdn-sg-p{position:fixed;left:10px;bottom:calc(122px + env(safe-area-inset-bottom));width:min(300px,calc(100vw - 20px));z-index:2147483001;background:linear-gradient(180deg,#2b1a0b,#140b04);border:1.5px solid #d4a73a;border-radius:14px;color:#fbe9c0;font:14px Mukta,'Noto Sans Devanagari',sans-serif;box-shadow:0 8px 28px #000a;display:none}
#kdn-sg-p.on{display:block}#kdn-sg-p .h{display:flex;align-items:center;gap:6px;padding:6px 10px;border-bottom:1px solid #d4a73a55;cursor:move;touch-action:none;color:#ffd76a;font-weight:700}
#kdn-sg-p .h span{flex:1}#kdn-sg-p button{font:inherit;cursor:pointer}#kdn-sg-p .x{background:none;border:0;color:#ffd76a;font-size:16px}
#kdn-sg-p ol{list-style:none;margin:0;padding:6px 10px;max-height:130px;overflow:auto}#kdn-sg-p li{padding:3px 0;border-bottom:1px dashed #d4a73a33;font-size:13px;line-height:1.35}#kdn-sg-p li b{color:#ffd76a;font-weight:600;margin-left:4px}
#kdn-sg-p .r{display:flex;gap:5px;padding:8px 10px}#kdn-sg-p input{flex:1;min-width:0;background:#0d0703;color:#fff3d6;border:1px solid #d4a73a;border-radius:9px;padding:7px 8px;font:inherit}
#kdn-sg-p .m,#kdn-sg-p .s{border:1px solid #e9c46a;border-radius:9px;background:#3a2410;color:#ffe7a3;padding:6px 8px}#kdn-sg-p .s{background:linear-gradient(180deg,#e9c46a,#b8862b);color:#2a1606;font-weight:700}#kdn-sg-p .m.rec{background:#8b1d1d}
#kdn-sg-p .e{padding:0 10px 6px;font-size:12px;color:#ffb4a0;min-height:0}`;
const st=document.createElement('style');st.textContent=css;
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const load=()=>{try{return JSON.parse(localStorage.getItem(LS)||'[]');}catch(e){return [];}},save=l=>localStorage.setItem(LS,JSON.stringify(l.slice(-50)));
const LBL={sent:'✓ भेजा',fail:'✗ नहीं गया',wait:'… भेज रहे'};
function start(){document.head.appendChild(st);
const b=document.createElement('button');b.id='kdn-sg-b';b.type='button';b.textContent='💬 सुझाव';b.setAttribute('aria-label','सुझाव भेजें');
const p=document.createElement('div');p.id='kdn-sg-p';p.setAttribute('role','dialog');p.setAttribute('aria-label','सुझाव');
p.innerHTML='<div class="h"><span>💬 सुझाव · एक line में</span><button class="x" type="button" aria-label="बंद करें">✕</button></div><ol></ol><div class="e" aria-live="polite"></div><form class="r"><input maxlength="500" placeholder="जैसे: इस page पर बटन बड़ा करो" aria-label="सुझाव"><button class="m" type="button" aria-label="बोलकर लिखें">🎙️</button><button class="s" type="submit">भेजें</button></form>';
document.body.append(b,p);const ol=p.querySelector('ol'),inp=p.querySelector('input'),err=p.querySelector('.e'),mic=p.querySelector('.m');
function draw(){const l=load();ol.innerHTML=l.length?l.slice(-20).map(x=>`<li>${esc(x.text)}<b>${LBL[x.status]||''}</b></li>`).join(''):'<li>अभी कोई सुझाव नहीं। नीचे लिखिए या 🎙️ से बोलिए।</li>';ol.scrollTop=1e6;}
function setOpen(o){p.classList.toggle('on',o);sessionStorage.setItem(OPEN,o?'1':'');if(o){draw();}}
b.onclick=()=>setOpen(!p.classList.contains('on'));p.querySelector('.x').onclick=()=>setOpen(false);
try{const ps=JSON.parse(sessionStorage.getItem(POS)||'null');if(ps){p.style.left=ps.x+'px';p.style.top=ps.y+'px';p.style.bottom='auto';}}catch(e){}
const h=p.querySelector('.h');let d=null;h.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;const r=p.getBoundingClientRect();d={dx:e.clientX-r.left,dy:e.clientY-r.top};h.setPointerCapture(e.pointerId);});
h.addEventListener('pointermove',e=>{if(!d)return;const x=Math.max(0,Math.min(innerWidth-p.offsetWidth,e.clientX-d.dx)),y=Math.max(0,Math.min(innerHeight-60,e.clientY-d.dy));p.style.left=x+'px';p.style.top=y+'px';p.style.bottom='auto';sessionStorage.setItem(POS,JSON.stringify({x,y}));});
h.addEventListener('pointerup',()=>{d=null;});
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)mic.hidden=true;else{let r=null;mic.onclick=()=>{if(r){r.stop();return;}r=new SR();r.lang='hi-IN';r.interimResults=false;mic.classList.add('rec');r.onresult=e=>{inp.value=(inp.value+' '+e.results[0][0].transcript).trim();};r.onerror=()=>{err.textContent='आवाज़ नहीं पकड़ी, फिर से बोलिए।';};r.onend=()=>{mic.classList.remove('rec');r=null;};r.start();};}
p.querySelector('form').onsubmit=async e=>{e.preventDefault();const text=inp.value.trim();err.textContent='';if(!text)return;
const page=(location.pathname.split('/').pop()||'index.html')+(location.hash||'');const ts=Date.now();const l=load();const it={text,page,ts,status:'wait'};l.push(it);save(l);inp.value='';draw();
try{const r=await fetch(API+'/suggest',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text,page,ts})});it.status=r.ok?'sent':'fail';if(r.status===429)err.textContent='थोड़ा रुकिए, एक मिनट में 10 से ज़्यादा सुझाव नहीं।';else if(!r.ok)err.textContent='नहीं भेज पाए, दोबारा कोशिश करें।';}catch(x){it.status='fail';err.textContent='Internet नहीं है, बाद में भेजिए।';}
const l2=load();const j=l2.findIndex(x=>x.ts===ts);if(j>=0)l2[j].status=it.status;save(l2);draw();};
if(sessionStorage.getItem(OPEN))setOpen(true);
window.KDNSuggest={open:()=>setOpen(true)};}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start):start();})();
