(()=>{'use strict';const S=window.KDNSakhi,K=window.KDNKoins,$=id=>document.getElementById(id);
const load=(k,v,f)=>{try{return v(JSON.parse(localStorage.getItem(k)||'null'));}catch{return f();}};
const save=(k,s)=>{try{localStorage.setItem(k,JSON.stringify(s));}catch{}};
const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
let kst=load(K.KEY,K.validate,K.fresh);{const w=K.grantWelcome(kst);if(w.added){kst=w.state;save(K.KEY,kst);}}
let st=load(S.KEY,S.validate,S.fresh),items=[],off=0,timer=null,shown=0,cur=null;const today=S.dayKey();
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),1600);}
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;};
function paint(){$('h-koins').textContent=K.fmt(K.total(kst));const n=Math.min(st.days.length,S.NEED);$('days').textContent=`📅 साखी सुनी: ${n}/${S.NEED} दिन`;$('badge').hidden=!st.badge;}
function reveal(){const ls=$('lines').children;if(shown<ls.length){ls[shown].classList.add('on');shown++;}
 if(shown>=ls.length){clearInterval(timer);timer=null;$('skip').hidden=true;$('end').hidden=false;}}
function render(){clearInterval(timer);timer=null;if(!items.length)return;cur=items[S.indexFor(today,items.length,off)];
 $('which').textContent=off===0?'आज की साखी':(off<0?`${-off} दिन पहले की साखी`:`आगे की साखी (+${off})`);
 $('icon').textContent=cur.icon;$('title').textContent=cur.title;$('who').textContent=cur.who;
 const L=$('lines');L.textContent='';cur.lines.forEach(t=>L.append(el('p','line',t)));shown=0;
 $('seekh').textContent='🌱 सीख: '+cur.seekh;$('src').textContent='स्रोत: '+cur.source+' (सरल शब्दों में दोबारा कही गई)';$('end').hidden=true;
 const Q=$('quiz');Q.textContent='';cur.quiz.forEach((q,qi)=>{const box=el('div','q');box.append(el('p','qq',(qi+1)+'. '+q.q));
  q.o.forEach((o,oi)=>{const b=el('button','opt',o);b.type='button';b.onclick=()=>pickAns(box,q,qi,oi,b);box.append(b);});Q.append(box);});
 if(still){while(shown<cur.lines.length)reveal();}else{$('skip').hidden=false;reveal();timer=setInterval(reveal,3000);}}
function pickAns(box,q,qi,oi,b){if(box.dataset.done)return;box.dataset.done='1';const right=oi===q.a;
 box.querySelectorAll('.opt').forEach((x,i)=>{x.disabled=true;if(i===q.a)x.classList.add('right');});if(!right)b.classList.add('wrong');
 const r=S.answer(st,cur.id,qi);st=r.state;save(S.KEY,st);
 if(r.fresh){const g=K.quiz(kst,right);kst=g.state;save(K.KEY,kst);toast(right?'✅ सही · +'+g.added+' अंक':'❌ '+g.added+' अंक');}else toast(right?'✅ सही':'❌ सही जवाब हरे में');
 if(off===0&&[...$('quiz').children].every(x=>x.dataset.done))heard();paint();}
function heard(){const r=S.listen(st,today);st=r.state;save(S.KEY,st);
 if(r.firstToday){const g=K.claimSpot(kst,'sakhi:'+today);kst=g.state;save(K.KEY,kst);if(g.added)setTimeout(()=>toast('📖 आज की साखी पूरी · +'+g.added+' 💰'),900);}
 if(r.badgeNew)setTimeout(()=>toast('🏅 '+S.BADGE),2600);paint();}
$('skip').onclick=()=>{while(shown<(cur?cur.lines.length:0))reveal();};
$('prev').onclick=()=>{off--;render();};$('next').onclick=()=>{off++;render();};$('today').onclick=()=>{off=0;render();};
$('say').onclick=()=>{if(!cur)return;if(!('speechSynthesis'in window))return toast('इस phone में आवाज़ नहीं है');speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance([cur.title,...cur.lines,'सीख: '+cur.seekh].join('। '));u.lang='hi-IN';u.rate=.9;speechSynthesis.speak(u);};
fetch('./assets/sakhi/sakhi.json').then(r=>r.json()).then(d=>{items=(d.items||[]).filter(S.valid);render();}).catch(()=>{$('title').textContent='साखी लोड नहीं हुई, फिर से खोलिए';});
paint();window.__sakhi={state:()=>st,koins:()=>K.total(kst),cur:()=>cur};})();
