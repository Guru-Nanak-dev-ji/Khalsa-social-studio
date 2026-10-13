(()=>{'use strict';const A=window.KDNAkarshan,K=window.KDNKoins,$=id=>document.getElementById(id);
const load=(k,v,f)=>{try{return v(JSON.parse(localStorage.getItem(k)||'null'));}catch{return f();}};
const save=(k,s)=>{try{localStorage.setItem(k,JSON.stringify(s));}catch{}};
let kst=load(K.KEY,K.validate,K.fresh);{const w=K.grantWelcome(kst);if(w.added){kst=w.state;save(K.KEY,kst);}}
let st=load(A.KEY,A.validate,A.fresh);const today=A.dayKey();
const DN=['रवि','सोम','मंगल','बुध','गुरु','शुक्र','शनि'];
const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),1700);}
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;};
function after(r){st=r.state;save(A.KEY,st);if(r.completeNew){const g=K.claimSpot(kst,'akarshan:'+today);kst=g.state;save(K.KEY,kst);
 toast(g.added?'🌟 आज की साधना पूरी · +'+g.added+' 💰':'🌟 आज की साधना पूरी');burst(24);}
 if(r.badgeNew)setTimeout(()=>toast('🏅 '+A.BADGE),1900);paint();}
// उड़ते सुनहरे कण चुंबक की ओर
function burst(n){if(reduce)return;const f=$('field'),m=$('magnet').getBoundingClientRect(),fr=f.getBoundingClientRect();
 for(let i=0;i<n;i++){const p=el('span','pt',['✨','💛','🌟','✦'][i%4]);const a=Math.random()*6.283,r=140+Math.random()*90;
  p.style.left=(m.left-fr.left+m.width/2+Math.cos(a)*r)+'px';p.style.top=(m.top-fr.top+m.height/2+Math.sin(a)*r)+'px';
  p.style.setProperty('--dx',(-Math.cos(a)*r)+'px');p.style.setProperty('--dy',(-Math.sin(a)*r)+'px');p.style.animationDelay=(i*35)+'ms';f.append(p);setTimeout(()=>p.remove(),1500+i*35);}}
function words(t){const f=$('orbit');f.textContent='';if(!t)return;t.split(' ').slice(0,10).forEach((w,i)=>{const s=el('span','ow',w);s.style.animationDelay=(i*120)+'ms';f.append(s);});}
function paint(){$('h-koins').textContent=K.fmt(K.total(kst));const d=A.get(st,today);
 $('intent').value=$('intent').value||d.intent;$('magnet').className='magnet'+(d.attracted?' on':'');
 $('attracted').hidden=!d.attracted;$('my-intent').textContent=d.intent?'“'+d.intent+'”':'';if(d.attracted&&!$('orbit').childElementCount)words(d.intent);
 $('steps').hidden=!d.attracted;
 $('s1').className='step'+(d.think?' ok':'');$('think').hidden=d.think;$('think-ok').hidden=!d.think;
 $('s2').className='step'+(d.grat.length>=3?' ok':'');[0,1,2].forEach(i=>{const g=$('g'+i);if(!g.value)g.value=d.grat[i]||'';});$('grat-ok').hidden=d.grat.length<3;
 $('s3').className='step'+(d.actDone?' ok':'');const V=$('vals');V.textContent='';A.VALUES.forEach(v=>{const b=el('button','val'+(d.act===v.id?' sel':''));b.type='button';
  b.append(el('span','vi',v.icon),el('b',null,v.title),el('small',null,v.hint));b.onclick=()=>after(A.chooseAct(st,today,v.id));V.append(b);});
 $('act').hidden=!d.act||d.actDone;$('act-ok').hidden=!d.actDone;
 $('done-all').hidden=!A.complete(d);
 const n=A.count(st),sk=A.streak(st,today);$('streak').textContent=`🔥 लगातार ${sk} दिन · कुल ${n} दिन पूरे · ${A.BADGE} के लिए ${A.NEED} दिन`+(n<A.NEED?` (${A.NEED-n} बाकी)`:'');
 const W=$('week');W.textContent='';A.week(st,today).forEach(w=>{const c=el('div','wd'+(w.done?' done':'')+(w.today?' today':''));const dt=new Date(w.day+'T12:00');
  c.append(el('span','wn',DN[dt.getDay()]),el('span','wi',w.done?'🧲':(w.started?'✨':'·')),el('span','wdn',String(dt.getDate())));c.title=w.day;W.append(c);});
 $('badge').hidden=!st.badge;}
$('intent').oninput=()=>{$('neg').hidden=!A.isNegative($('intent').value);};
$('ex').onclick=()=>{$('intent').value=A.EXAMPLES[Math.floor(Math.random()*A.EXAMPLES.length)];$('neg').hidden=true;};
$('magnet').onclick=$('pull').onclick=()=>{const t=A.clean($('intent').value);if(!t){toast('पहले अपनी भावना लिखिए ✍️');$('intent').focus();return;}
 const r=A.attract(st,today,t);$('magnet').classList.add('pulling');setTimeout(()=>$('magnet').classList.remove('pulling'),1200);burst(30);words(t);toast('🧲 भावना खिंच आई!');after(r);};
$('think').onclick=()=>after(A.think(st,today));
$('grat-save').onclick=()=>{const l=[0,1,2].map(i=>$('g'+i).value);if(l.map(x=>A.clean(x)).filter(Boolean).length<3)return toast('तीनों शुक्राने लिखिए 🙏');after(A.gratitude(st,today,l));};
$('act').onclick=()=>after(A.doAct(st,today));
$('say').onclick=()=>{if(!('speechSynthesis'in window))return toast('इस phone में आवाज़ नहीं है');speechSynthesis.cancel();const d=A.get(st,today);
 const u=new SpeechSynthesisUtterance((d.intent||A.clean($('intent').value)||'मैं शांत और मज़बूत हूँ')+'. जैसी भावना, वैसा फल. अब मेहनत से एक छोटा कदम उठाइए.');u.lang='hi-IN';u.rate=.9;speechSynthesis.speak(u);};
paint();window.__akarshan={state:()=>st,koins:()=>K.total(kst)};})();
