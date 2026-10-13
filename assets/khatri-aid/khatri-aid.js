(()=>{'use strict';const A=window.KDNAid,$=id=>document.getElementById(id);
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;};
let st=(()=>{try{return A.validate(JSON.parse(localStorage.getItem(A.KEY)||'null'));}catch{return A.fresh();}})(),mode='need',cat='',msg='';
const C=$('circle'),dots=A.GROUPS.map((g,i)=>{const d=el('div','dot',g);d.style.setProperty('--i',i);C.append(d);return d;});
function place(joined){const R=Math.min(C.clientWidth,C.clientHeight)/2-46,pts=A.ring(dots.length,joined?R:R*1.0);
 dots.forEach((d,i)=>{const sx=joined?pts[i].x:((i%4)-1.5)*(R*.62),sy=joined?pts[i].y:(Math.floor(i/4)-1)*(R*.75);d.style.transform=`translate(calc(-50% + ${sx}px),calc(-50% + ${sy}px))`;});C.classList.toggle('joined',joined);}
let joined=false;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
$('join').onclick=()=>{joined=!joined;place(joined);$('join').textContent=joined?'🔄 फिर से अलग देखो':'✨ सबको जोड़ो';};
place(false);addEventListener('resize',()=>place(joined));if(!reduce)setTimeout(()=>{joined=true;place(true);$('join').textContent='🔄 फिर से अलग देखो';},1400);else{joined=true;place(true);}
$('bani-t').textContent=A.BANI.text;$('bani-c').textContent=`— ${A.BANI.writer}, ${A.BANI.raag}, श्री गुरु ग्रंथ साहिब जी, अंग ${A.BANI.ang} · स्रोत: ${A.BANI.src}`;
function cats(){const G=$('cats');G.textContent='';$('hint').textContent=mode==='need'?'किस चीज़ में मदद चाहिए? एक card दबाइए।':'आप किस चीज़ में सेवा कर सकते हैं? एक card दबाइए।';
 A.CATS.forEach(c=>{const b=el('button','cat');b.type='button';b.append(el('span','ci',c.icon),el('span',null,c.name));
  b.onclick=()=>{if(c.href&&mode==='need'){location.href=c.href;return;}cat=c.id;openForm();};G.append(b);});}
function setMode(m){mode=m;$('m-need').classList.toggle('on',m==='need');$('m-give').classList.toggle('on',m==='give');$('m-need').setAttribute('aria-pressed',String(m==='need'));$('m-give').setAttribute('aria-pressed',String(m==='give'));$('form').hidden=true;cats();}
$('m-need').onclick=()=>setMode('need');$('m-give').onclick=()=>setMode('give');
function openForm(){const c=A.catOf(cat);$('form').hidden=false;$('share').hidden=true;$('f-err').textContent='';$('f-title').textContent=A.MODES[mode].title+' · '+c.icon+' '+c.name;
 $('f-note-l').textContent=mode==='need'?'क्या ज़रूरत है (छोटे में)':'आप क्या कर सकते हैं / कितना समय';$('form').scrollIntoView({behavior:'smooth'});}
$('form').onsubmit=e=>{e.preventDefault();const r=A.validForm(mode,{cat,name:$('f-name').value,city:$('f-city').value,contact:$('f-contact').value,note:$('f-note').value,agree:$('f-agree').checked});
 if(!r.ok){$('f-err').textContent='⚠️ '+r.why;return;}$('f-err').textContent='';msg=A.message(r.item);$('msg').textContent=msg;$('wa').href=A.waLink(msg);$('mail').href=A.mailLink(msg);$('share').hidden=false;
 st=A.record(st,r.item,Date.now());try{localStorage.setItem(A.KEY,JSON.stringify(st));}catch{}};
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(msg);$('copy').textContent='✅ Copy हो गया';}catch{$('copy').textContent='लंबा दबाकर copy करें';}};
cats();window.__aid={state:()=>st,join:v=>{joined=v;place(v);}};})();
