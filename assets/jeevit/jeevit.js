(()=>{'use strict';const J=window.KDNJeevit,K=window.KDNKoins;if(!J)return;
const load=(k,v)=>{try{return v(JSON.parse(localStorage.getItem(k)||'null'));}catch{return v(null);}};
const save=(k,s)=>{try{localStorage.setItem(k,JSON.stringify(s));}catch{}};
const synth=window.speechSynthesis;let card=null,cur=null;
function stop(){if(synth)synth.cancel();if(card)card.querySelector('.jv-play').textContent='▶ सुनें';}
function speak(){if(!synth||!cur)return;if(synth.speaking){stop();return;}const u=new SpeechSynthesisUtterance(J.speechText(cur));u.lang='hi-IN';u.rate=.9;
 const v=synth.getVoices().find(x=>/^hi/i.test(x.lang));if(v)u.voice=v;u.onend=()=>stop();synth.speak(u);card.querySelector('.jv-play').textContent='■ रोकें';}
function build(){card=document.createElement('div');card.id='jeevit-card';card.className='jv-card';card.hidden=true;card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-labelledby','jv-name');
 card.innerHTML='<div class="jv-inner"><button type="button" class="jv-close" aria-label="बंद करें">×</button><p class="jv-eyebrow">✨ जीवित तस्वीर</p><div class="jv-pic" aria-hidden="true"><i></i></div><h3 id="jv-name"></h3><ol class="jv-sakhi"></ol><div class="jv-row"><button type="button" class="jv-play">▶ सुनें</button><button type="button" class="jv-quiz-open">❓ सवाल का जवाब दें</button></div><div class="jv-quiz" hidden><p class="jv-q"></p><div class="jv-opts"></div><p class="jv-res" role="status" aria-live="polite"></p></div><p class="jv-progress"></p></div>';
 (document.getElementById('pledge-view')||document.body).append(card);
 card.querySelector('.jv-close').onclick=close;card.querySelector('.jv-play').onclick=speak;
 card.querySelector('.jv-quiz-open').onclick=()=>{stop();const qz=card.querySelector('.jv-quiz');qz.hidden=false;qz.scrollIntoView({block:'nearest'});};
 card.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();e.preventDefault();close();}});}
function progress(){const s=load(J.KEY,J.validate);const t=s.done.length+' / '+J.IDS.length+' साखियाँ पूरी';return J.badge(s)?'🏅 "'+J.BADGE+'" badge मिल गया! · '+t:t;}
function open(id,bg){if(!J.FIG[id])return;if(!card)build();cur=id;const f=J.FIG[id];stop();
 card.querySelector('.jv-pic i').style.backgroundImage=bg||'';card.querySelector('#jv-name').textContent=f.name;
 const ol=card.querySelector('.jv-sakhi');ol.replaceChildren(...f.sakhi.map(l=>{const li=document.createElement('li');li.textContent=l;return li;}));
 const qz=card.querySelector('.jv-quiz');qz.hidden=true;card.querySelector('.jv-q').textContent=f.q;card.querySelector('.jv-res').textContent='';
 const order=f.opts.map((_,i)=>i).sort(()=>Math.random()-.5);const box=card.querySelector('.jv-opts');
 box.replaceChildren(...order.map(i=>{const b=document.createElement('button');b.type='button';b.textContent=f.opts[i];b.onclick=()=>pick(i,b);return b;}));
 card.querySelector('.jv-progress').textContent=progress();card.hidden=false;card.querySelector('.jv-close').focus();}
function pick(i,btn){const f=J.FIG[cur];const r=J.answer(load(J.KEY,J.validate),cur,i);save(J.KEY,r.state);
 card.querySelectorAll('.jv-opts button').forEach(b=>{b.disabled=true;if(b.textContent===f.opts[f.a])b.classList.add('ok');});if(!r.right)btn.classList.add('bad');
 let msg=r.right?'✅ सही जवाब!':'❌ सही जवाब: '+f.opts[f.a];
 if(r.counted&&K){let ks;try{ks=K.validate(JSON.parse(localStorage.getItem(K.KEY)||'null'));}catch{ks=K.fresh();}const q=K.quiz(ks,r.right);save(K.KEY,q.state);msg+=' ('+(q.added>0?'+':'')+q.added+' अंक)';}
 else if(!r.counted)msg+=' · इस साखी के अंक पहले मिल चुके हैं।';
 card.querySelector('.jv-res').textContent=msg;card.querySelector('.jv-progress').textContent=progress();}
function close(){stop();if(card)card.hidden=true;}
document.addEventListener('click',e=>{const fig=e.target.closest&&e.target.closest('.pran-figure[data-figure]');if(!fig)return;open(fig.dataset.figure,getComputedStyle(fig).backgroundImage);});
document.addEventListener('keydown',e=>{const fig=e.target.closest&&e.target.closest('.pran-figure[data-figure]');if(fig&&(e.key==='Enter'||e.key===' ')){e.preventDefault();open(fig.dataset.figure,getComputedStyle(fig).backgroundImage);}});
window.KDNJeevitUI={open,close};})();
