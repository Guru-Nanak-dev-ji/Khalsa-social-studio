(function(){const C=window.SaathiCore,$=s=>document.querySelector(s);let who='tark',sel=new Set(),quotes=[];
fetch('./assets/saathi/bani.json').then(r=>r.json()).then(j=>quotes=j.quotes).catch(()=>{});
document.querySelectorAll('.pick button').forEach(b=>b.onclick=()=>{who=b.dataset.who;document.querySelectorAll('.pick button').forEach(x=>x.setAttribute('aria-pressed',x===b));});
const chips=$('#chips');C.MOODS.forEach(([id,label])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.m=id;b.setAttribute('aria-pressed','false');b.onclick=()=>{sel.has(id)?sel.delete(id):sel.add(id);b.setAttribute('aria-pressed',sel.has(id));};chips.appendChild(b);});
function mark(ids){ids.forEach(id=>{sel.add(id);const b=chips.querySelector('[data-m='+id+']');b&&b.setAttribute('aria-pressed','true');});}
const SR=window.SpeechRecognition||window.webkitSpeechRecognition,mic=$('#mic');
if(!SR){mic.disabled=true;mic.textContent='🎙️ (इस browser में नहीं)';}else mic.onclick=()=>{const r=new SR();r.lang='hi-IN';r.interimResults=false;mic.textContent='🎙️ सुन रहा हूँ…';r.onresult=e=>{const t=e.results[0][0].transcript;$('#say').value=t;mark(C.detect(t));};r.onerror=()=>{$('#note').textContent='आवाज़ नहीं पकड़ी गई — ऊपर बटन चुनें या लिखें।';};r.onend=()=>mic.textContent='🎙️ बोलकर बताएँ';try{r.start();}catch(e){}};
function speak(text,av){if(!('speechSynthesis' in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='hi-IN';const v=speechSynthesis.getVoices().find(v=>/^hi/i.test(v.lang));if(v)u.voice=v;u.rate=.95;u.pitch=who==='bhavna'?1.15:.9;u.onstart=()=>av.classList.add('speaking');u.onend=u.onerror=()=>av.classList.remove('speaking');speechSynthesis.speak(u);}
$('#go').onclick=()=>{const t=$('#say').value;mark(C.detect(t));const out=$('#out');out.hidden=false;const res=C.respond(who,[...sel],quotes);
const av=out.querySelector('.av');av.className='av '+who;out.querySelector('.nm').textContent=res.name+' · AI साथी';out.querySelector('.txt').textContent=res.text;$('#warn').hidden=!C.danger(t);
out.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});speak(res.speak,av);};
$('#stopv').onclick=()=>{window.speechSynthesis&&speechSynthesis.cancel();$('#out .av').classList.remove('speaking');};
$('#replay').onclick=()=>{const t=$('#out .txt').textContent;speak(t,$('#out .av'));};
window.__saathi={sel,pick:w=>{who=w;}};})();
