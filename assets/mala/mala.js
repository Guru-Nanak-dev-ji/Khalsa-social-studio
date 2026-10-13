(()=>{'use strict';const M=window.KDNMala,K=window.KDNKoins,$=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
const load=(k,v,f)=>{try{return v(JSON.parse(localStorage.getItem(k)||'null'));}catch{return f();}};
const save=(k,s)=>{try{localStorage.setItem(k,JSON.stringify(s));}catch{}};
let kst=load(K.KEY,K.validate,K.fresh);{const w=K.grantWelcome(kst);if(w.added){kst=w.state;save(K.KEY,kst);}}
let st=load(M.KEY,M.validate,M.fresh),voice=false;const today=M.dayKey(),beads=[];
const DN=['रवि','सोम','मंगल','बुध','गुरु','शुक्र','शनि'];
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),1600);}
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;};
const sv=(tag,a)=>{const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);return e;};
// 108 मनके गोल धागे पर, ऊपर सुमेरु (गुरु मनका) और फुंदना
(function build(){const g=$('ring'),C=170,R=142;g.append(sv('circle',{cx:C,cy:C,r:R,class:'thread'}));
 for(let i=0;i<M.BEADS;i++){const a=-Math.PI/2+(i+1)*2*Math.PI/(M.BEADS+1),c=sv('circle',{cx:(C+R*Math.cos(a)).toFixed(1),cy:(C+R*Math.sin(a)).toFixed(1),r:4.6,class:'bead'});beads.push(c);g.append(c);}
 g.append(sv('path',{d:`M${C} ${C-R} l-7 -22 l7 6 l7 -6 z`,class:'tassel'}),sv('circle',{cx:C,cy:C-R,r:9,class:'sumeru'}));})();
function paint(){$('h-koins').textContent=K.fmt(K.total(kst));const b=st.bead;
 beads.forEach((c,i)=>c.setAttribute('class','bead'+(i<b?' on':'')+(i===b?' next':'')));
 $('count').textContent=b+' / '+M.BEADS;$('naam').textContent=M.naamText(st.naam);
 const n=st.days[today]||0;$('todaym').textContent=n?`📿 आज ${n} माला पूरी · शाबाश!`:'📿 आज की पहली माला पूरी करने पर +5 koins';
 $('days').textContent=`🌼 ${M.daysDone(st)} दिन माला पूरी · सिमरन साधक के लिए ${M.NEED} दिन · कुल ${M.total(st)} माला`;
 document.querySelectorAll('.nm').forEach(x=>x.setAttribute('aria-pressed',x.dataset.id===st.naam?'true':'false'));
 const W=$('week');W.textContent='';M.week(st,today).forEach(w=>{const c=el('div','wd'+(w.malas?' done':'')+(w.today?' today':''));const dt=new Date(w.day+'T12:00');
  c.append(el('span','wn',DN[dt.getDay()]),el('span','wi',w.malas?'📿'+w.malas:'·'),el('span','wdn',String(dt.getDate())));c.title=w.day;W.append(c);});
 $('badge').hidden=!st.badge;}
function say(t){if(!('speechSynthesis'in window))return false;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='hi-IN';u.rate=.85;speechSynthesis.speak(u);return true;}
const NB=$('naams');M.NAAMS.forEach(n=>{const b=el('button','nm',n.text);b.type='button';b.dataset.id=n.id;b.onclick=()=>{st=M.setNaam(st,n.id);save(M.KEY,st);paint();};NB.append(b);});
function step(){const r=M.tap(st,today);st=r.state;save(M.KEY,st);if(navigator.vibrate)navigator.vibrate(r.full?[60,40,60]:8);
 const P=$('pulse');P.classList.remove('go');void P.getBoundingClientRect();P.classList.add('go');
 if(voice)say(M.naamText(st.naam));
 if(r.full){$('mala').classList.add('full');setTimeout(()=>$('mala').classList.remove('full'),1500);
  if(r.firstToday){const g=K.claimSpot(kst,'mala:'+today);kst=g.state;save(K.KEY,kst);toast(g.added?'📿 माला पूरी · +'+g.added+' 💰':'📿 माला पूरी');}else toast('📿 एक और माला पूरी!');
  if(r.badgeNew)setTimeout(()=>toast('🏅 '+M.BADGE),1800);}
 paint();}
$('mala').addEventListener('click',step);
$('voice').onclick=()=>{voice=!voice;$('voice').setAttribute('aria-pressed',String(voice));$('voice').textContent=voice?'🔊 हर मनके पर नाम बोले: चालू':'🔇 हर मनके पर नाम बोले: बंद';if(voice&&!say(M.naamText(st.naam))){voice=false;toast('इस phone में आवाज़ नहीं है');}};
$('restart').onclick=()=>{if(!st.bead)return;st=M.restart(st);save(M.KEY,st);toast('🔄 माला फिर से शुरू');paint();};
paint();window.__mala={state:()=>st,koins:()=>K.total(kst),tap:step};})();
