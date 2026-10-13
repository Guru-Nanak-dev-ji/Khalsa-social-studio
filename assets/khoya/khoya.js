(()=>{'use strict';const C=window.KDNKhoya,K=window.KDNKoins,$=id=>document.getElementById(id);
const load=(k,v,f)=>{try{return v(JSON.parse(localStorage.getItem(k)||'null'));}catch{return f();}};
const save=(k,s)=>{try{localStorage.setItem(k,JSON.stringify(s));}catch{}};
let kst=load(K.KEY,K.validate,K.fresh);{const w=K.grantWelcome(kst);if(w.added){kst=w.state;save(K.KEY,kst);}}
let st=load(C.KEY,C.validate,C.fresh),cur=st.scene,lastHint=0,penalty=0;
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;};
function toast(t){const e=el('div','toast',t);document.body.append(e);setTimeout(()=>e.remove(),1600);}
const rnd=seed=>()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
function drawScene(){const sc=C.SCENES[cur],box=$('scene');box.textContent='';box.className='scene bg-'+sc.bg;
 const r=rnd(cur*97+13);sc.decoys.concat(sc.decoys).forEach(d=>{const e=el('span','decoy',d);e.style.left=(4+r()*88)+'%';e.style.top=(6+r()*86)+'%';e.style.transform=`translate(-50%,-50%) rotate(${Math.round(r()*80-40)}deg) scale(${(.7+r()*.9).toFixed(2)})`;e.setAttribute('aria-hidden','true');box.append(e);});
 sc.objs.forEach(o=>{const b=el('button','obj',o.e);b.type='button';b.dataset.id=o.id;b.setAttribute('aria-label',o.name);b.style.left=o.x+'%';b.style.top=o.y+'%';
  b.style.transform=`translate(-50%,-50%) rotate(${o.r}deg) scale(${o.s})`;b.style.opacity=o.o;if(st.found[cur].includes(o.id))b.classList.add('got');
  b.onclick=ev=>{ev.stopPropagation();pick(o.id,b);};box.append(b);});
 for(let i=0;i<14;i++){const f=el('i','fly');f.style.left=(r()*100)+'%';f.style.top=(r()*100)+'%';f.style.animationDelay=(-r()*8).toFixed(1)+'s';box.append(f);}
 box.append(el('div','fog'),el('div','fog f2'));}
let flipA=-1,flipB=-1;
function solvedGo(sc){if(cur===C.SCENES.length-1){(window.KLSound||{sfx(){}}).sfx('clear');const E=$('ending');E.hidden=false;E.classList.add('play');setTimeout(()=>E.scrollIntoView({block:'center'}),300);return;}(window.KLSound||{sfx(){}}).sfx('open');toast('🚪 '+sc.item.e+' से अगला दरवाज़ा खुला!');setTimeout(()=>{cur++;st.scene=cur;save(C.KEY,st);drawScene();paint();},900);}
function apply(r,sc){st=r.state;save(C.KEY,st);if(r.solved)solvedGo(sc);paint();}
const HOW_EXTRA={rings:['☀️🌙 सूरज-चाँद द्वार','दीवार पर लिखा है: "ऊपर बाहर सूरज जागे, भीतर चाँद उसके आगे।" बाहरी और भीतरी छल्ला छूकर घुमाइए — ऊपर के ▼ निशान पर सूरज और चाँद लाइए।'],
 scale:['⚖️ तराज़ू संतुलन','डायरी का पन्ना: "अग्नि जल से भारी, वायु सबसे हल्की। बाएँ पलड़े का पत्थर 4 तोले का।" शीशियाँ छूकर दाएँ पलड़े पर रखिए/हटाइए — तराज़ू बराबर करो तो संदूक खुलेगा।'],
 veena:['🎻 टूटी धुन · वीणा','▶ जुगनू देखो दबाइए — जुगनू जिस क्रम में तारों पर चमकें, उसी क्रम में तार छूइए।'],
 beam:['🔆 रोशनी का रास्ता','🪞 शीशे छूकर पलटिए ताकि बाएँ से आती रोशनी 💎 ताले के बिल्लौर तक पहुँचे।'],
 jigsaw:['🗿 टूटी ज्योति-मूर्ति','टुकड़ों को खींचकर (या छूकर फिर खाने को छूकर) सही जगह रखिए — मूर्ति जुड़ते ही पूरा राज्य रोशन होगा!']};
let dragInfo=null,pickJ=-1;
function dragify(b,onDrop){b.addEventListener('pointerdown',e=>{e.preventDefault();const g=b.cloneNode(true);g.classList.add('dragghost');document.body.append(g);dragInfo={g,b,moved:false,x:e.clientX,y:e.clientY};
  const mv=ev=>{if(Math.hypot(ev.clientX-dragInfo.x,ev.clientY-dragInfo.y)>8)dragInfo.moved=true;g.style.left=ev.clientX+'px';g.style.top=ev.clientY+'px';};mv(e);
  const up=ev=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);g.remove();const t=document.elementFromPoint(ev.clientX,ev.clientY),moved=dragInfo.moved;dragInfo=null;onDrop(t&&t.closest('[data-drop]'),moved);};
  document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up);});}
function flashVeena(){const S=[...document.querySelectorAll('.string')];C.VEENA.forEach((k,n)=>setTimeout(()=>{const x=S[k];if(!x)return;x.classList.add('fire');(window.KLSound||{sfx(){}}).sfx('hint');setTimeout(()=>x.classList.remove('fire'),450);},n*650));}
const HOW={tiles:['🧩 टाइल घुमाओ','हर टाइल छूकर घुमाइए — सारे तीर ⬆️ ऊपर।'],gears:['⚙️ गियर मिलाओ','गियर छूने पर वह और उसके साथ जुड़े गियर घूमते हैं। सारे निशान 🔺 ऊपर लाइए।'],runes:['🔣 चिह्नों का क्रम','प्राचीन पत्थर पर लिखा क्रम पढ़िए और उसी क्रम में चिह्न छूइए। गलती हुई तो फिर से शुरू।'],match:['🃏 जोड़ी मिलाओ','दो पत्ते पलटिए — एक जैसे हों तो खुले रहेंगे। सारी जोड़ियाँ मिलाइए।']};
function drawPuz(sc){const p=cur,t=C.ptype(p),G=$('tiles'),z=st.pz[p],H=HOW[t]||HOW_EXTRA[t];G.textContent='';G.className='pz-'+t;$('puz-title').textContent=H[0];$('puz-how').textContent=H[1];$('puz-item').textContent=sc.item.e+' '+sc.item.name;
 const btn=(cls,txt,lab,fn)=>{const b=el('button',cls,txt);b.type='button';b.setAttribute('aria-label',lab);b.onclick=fn;G.append(b);return b;};
 if(!C.ready(st,p)){G.className='pz-place';const lock=el('div','lockz','🔒 '+C.partsFor(p).filter(x=>z.pl.includes(x.id)).map(x=>x.e).join(' ')+' ← यहाँ रखें');lock.dataset.drop='lock';lock.onclick=()=>{if(selItem)useOnLock(selItem);else toast('🎒 पहले झोले से चीज़ चुनिए');};G.append(lock);G.append(el('p','how','चाहिए: '+C.requiredItemIds(p).map(id=>(z.pl.includes(id)?'✅':'⬜')+' '+C.ITEMS[id].icon+' '+C.ITEMS[id].displayName).join(' · ')));
  G.append(el('p','how','🎒 झोले से चीज़ खींचकर ताले पर छोड़िए (या बस छू दीजिए):'));
  C.partsFor(p).filter(x=>!z.pl.includes(x.id)).forEach(x=>{const b=el('button','part',x.e+' '+x.name);b.type='button';G.append(b);dragify(b,(d,moved)=>{if(d||!moved)useOnLock(x.id);});});return;}
 if(t==='rings'){const w=el('div','rings');const o=el('button','ring outer'),i=el('button','ring inner');o.type=i.type='button';o.setAttribute('aria-label','बाहरी छल्ला');i.setAttribute('aria-label','भीतरी छल्ला');
  [[o,z.r[0]],[i,z.r[1]]].forEach(([b,v])=>{C.RING.forEach((e,k)=>{const sp=el('span','sym',e);sp.style.transform=`rotate(${k*60}deg) translateY(var(--rad)) rotate(${-k*60+v*60}deg)`;b.append(sp);});b.style.setProperty('--rot',(-v*60)+'deg');});
  o.onclick=()=>apply(C.ring(st,p,0),sc);i.onclick=e=>{e.stopPropagation();apply(C.ring(st,p,1),sc);};w.append(el('i','pin','▼'),o,i);G.append(w);
  G.append(el('p','clue2','ऊपर: '+C.RING[z.r[0]]+' बाहर · '+C.RING[z.r[1]]+' भीतर'));}
 if(t==='scale'){const sum=C.scaleSum(z.v),tilt=Math.max(-14,Math.min(14,(sum-C.STONE)*5));const sc2=el('div','scale');sc2.style.setProperty('--tilt',tilt+'deg');
  const beam=el('div','sbeam');beam.append(el('span','pan l','🪨 4'),el('span','pan r',C.VIALS.filter((v,i)=>z.v[i]).map(v=>v.e).join('')||'—'));sc2.append(beam,el('div','spost'));G.append(sc2);
  C.VIALS.forEach((v,i)=>btn('vial'+(z.v[i]?' on':''),v.e+' '+v.name,v.name+' शीशी',()=>apply(C.vial(st,p,i),sc)));G.append(el('p','clue2',sum===C.STONE?'⚖️ बराबर!':(sum<C.STONE?'⬆️ दायाँ पलड़ा हल्का':'⬇️ दायाँ पलड़ा भारी')));}
 if(t==='veena'){btn('btn ghost wide','▶ जुगनू देखो','जुगनू का क्रम देखें',flashVeena);const V=el('div','veena');for(let k=0;k<5;k++){const b=el('button','string');b.type='button';b.setAttribute('aria-label','तार '+(k+1));b.onclick=()=>{b.classList.add('fire');setTimeout(()=>b.classList.remove('fire'),250);
   if(window.KLSound&&window.KLSound.isOn()){window.KLSound.sfx('find');}const x=C.pluck(st,p,k);if(x.wrong)toast('❌ धुन टूटी — फिर से देखो');apply(x,sc);};V.append(b);}G.append(V,el('p','clue2','🎵 '+z.k+'/5'));}
 if(t==='beam'){const tr=C.trace(z.m),lit=new Set(tr.path.map(a=>a.join(','))),g=el('div','bgrid');for(let r=0;r<3;r++){g.append(el('span','bedge',r===0?'🔦':''));for(let c=0;c<3;c++){const mi=C.BEAM.mirrors.findIndex(([a,b])=>a===r&&b===c);
   const cell=el(mi>=0?'button':'span','bcell'+(lit.has(r+','+c)?' lit':''),mi>=0?(z.m[mi]?'⟍':'⟋'):'');if(mi>=0){cell.type='button';cell.setAttribute('aria-label','शीशा');cell.onclick=()=>apply(C.mirror(st,p,mi),sc);}g.append(cell);}g.append(el('span','bedge',r===2?(tr.hit?'💎✨':'💎'):''));}G.append(g);}
 if(t==='jigsaw'){const board=el('div','jboard');z.j.forEach((v,k)=>{const c=el('div','jslot'+(v>=0?' done':''));c.dataset.drop='j'+k;c.style.backgroundPosition=v>=0?`${(k%2)*100}% ${Math.floor(k/2)*100}%`:'';
   c.onclick=()=>{if(pickJ>=0){const r=C.jig(st,p,k,pickJ);pickJ=-1;if(!r.ok)toast('❌ यह टुकड़ा यहाँ नहीं');apply(r,sc);}};board.append(c);});G.append(board);
  const tray=el('div','jtray');C.JIG.forEach(k=>{if(z.j.includes(k))return;const b=el('button','jpiece'+(pickJ===k?' pick':''));b.type='button';b.setAttribute('aria-label','टुकड़ा');b.style.backgroundPosition=`${(k%2)*100}% ${Math.floor(k/2)*100}%`;
   dragify(b,(d,moved)=>{if(!moved){pickJ=k;return paint();}if(d&&d.dataset.drop[0]==='j'){const r=C.jig(st,p,+d.dataset.drop.slice(1),k);if(!r.ok)toast('❌ यह टुकड़ा यहाँ नहीं');apply(r,sc);}});tray.append(b);});G.append(tray);}
 if(t==='tiles')st.tiles[p].forEach((v,i)=>{btn('tile','⬆️','टाइल '+(i+1),()=>apply(C.rotate(st,p,i),sc)).style.transform=`rotate(${v*90}deg)`;});
 if(t==='gears')z.g.forEach((v,i)=>{const b=btn('gear','⚙️','गियर '+(i+1),()=>apply(C.gear(st,p,i),sc));b.style.setProperty('--r',(v*60)+'deg');b.append(el('i','mark','🔺'));});
 if(t==='runes'){const seq=C.runeSeq(p);G.append(el('p','clue','📜 '+seq.map(i=>C.RUNE_SET[i].n).join(' → ')));const pr=el('p','clue2',(z.k?'✅ '.repeat(z.k):'')+'('+z.k+'/4)');G.append(pr);
  C.RUNE_SET.forEach((r,i)=>btn('rune',r.e,r.n,()=>{const x=C.rune(st,p,i);if(x.wrong)toast('❌ गलत क्रम — फिर से');apply(x,sc);}));}
 if(t==='match')C.matchCards(p).forEach((c,i)=>{const open=z.m.includes(i)||i===flipA||i===flipB;btn('card2'+(open?' open':''),open?c:'❔','पत्ता '+(i+1),()=>{
   if(open||flipB>=0)return;if(flipA<0){flipA=i;return paint();}flipB=i;paint();const a=flipA,b=i;setTimeout(()=>{flipA=flipB=-1;const r=C.match(st,p,a,b);apply(r,sc);},r0(a,b)?250:800);});});}
const r0=(a,b)=>C.matchCards(cur)[a]===C.matchCards(cur)[b];
let lastBag=null;
// 🎒 झोला: बदलाव पर 'kl-bag-change' event, उसी से UI फिर बनता है
function bagSync(){const now=JSON.stringify(st.bag);if(now===lastBag)return;const prev=lastBag?JSON.parse(lastBag):null;lastBag=now;document.dispatchEvent(new CustomEvent('kl-bag-change',{detail:{prev,bag:st.bag}}));}
function renderBag(prev){const I=$('inv');I.textContent='';const cnt=(b,id)=>b?b.filter(x=>x.id===id).reduce((a,x)=>a+x.n,0):0;let picked=false;
 for(let k=0;k<C.CAP;k++){const x=st.bag[k],c=el('div','slot'+(x?'':' empty'));if(x){const d=C.ITEMS[x.id];c.append(el('span','si',d.icon),el('span','sn',d.displayName));if(d.stackable)c.append(el('b','sc','×'+x.n));c.title=d.displayName;c.dataset.item=x.id;
   if(prev&&cnt(prev,x.id)<cnt(st.bag,x.id)){c.classList.add('pick');picked=true;}
   if(selItem===x.id)c.classList.add('sel');dragify(c,(dz,moved)=>{if(moved){if(dz)useOnLock(x.id);return;}selItem=selItem===x.id?null:x.id;lastBag=null;bagSync();if(selItem)toast('👆 अब 🔒 ताले को छुइए');});}I.append(c);}
 $('bag-n').textContent=st.bag.length+'/'+C.CAP;if(picked&&prev)(window.KLSound||{sfx(){}}).sfx('pickup');}
document.addEventListener('kl-bag-change',e=>renderBag(e.detail.prev));
let selItem=null;
function useOnLock(id){selItem=null;const p=cur,d=C.ITEMS[id];if(!st.cleared.includes(p)||C.ready(st,p)||!C.requiredItemIds(p).includes(id)){(window.KLSound||{sfx(){}}).sfx('wrong');lastBag=null;bagSync();return toast('🚫 यह यहाँ फिट नहीं होता');}
 const r=C.place(st,p,id);if(r.ok){st=r.state;save(C.KEY,st);(window.KLSound||{sfx(){}}).sfx('find');toast('🔓 '+d.displayName+' लग गया');if(r.ready){const g=K.claimSpot(kst,'khoya-lock:'+p);kst=g.state;save(K.KEY,kst);(window.KLSound||{sfx(){}}).sfx('open');setTimeout(()=>toast('🔓✨ ताला खुला! अब पहेली'+(g.added?' · +'+g.added+' 💰':'')),1500);document.getElementById('puz').classList.add('unlock');setTimeout(()=>document.getElementById('puz').classList.remove('unlock'),1300);}paint();}}
function paint(){$('h-koins').textContent=K.fmt(K.total(kst));const sc=C.SCENES[cur];
 const T=$('tabs');T.textContent='';C.SCENES.forEach((s,i)=>{if(i===0||i===C.CH1)T.append(el('span','chap','📜 अध्याय '+s.ch));const b=el('button','tab'+(i===cur?' on':'')+(st.cleared.includes(i)?' done':''),(st.cleared.includes(i)?'✅ ':C.unlocked(st,i)?'':'🔒 ')+(i<C.CH1?i+1:i-C.CH1+1));b.type='button';b.setAttribute('aria-label',s.name);b.disabled=!C.unlocked(st,i);b.onclick=()=>{cur=i;st.scene=i;save(C.KEY,st);drawScene();paint();};T.append(b);});
 $('s-name').textContent='अध्याय '+sc.ch+' · '+(cur+1)+'. '+sc.name;$('s-story').textContent='🧭 '+sc.guide+': '+sc.story;
 const L=$('list');L.textContent='';sc.objs.forEach(o=>{const li=el('li',st.found[cur].includes(o.id)?'got':'',o.name);L.append(li);});
 $('count').textContent=`${st.found[cur].length}/${sc.objs.length} मिलीं`;
 bagSync();
 const p=$('puz'),needP=st.cleared.includes(cur)&&!st.puzzles.includes(cur);p.hidden=!needP;
 if(needP)drawPuz(sc);
 $('next').hidden=!(st.cleared.includes(cur)&&st.puzzles.includes(cur)&&cur<C.SCENES.length-1);
 $('badge').hidden=!st.badge;$('ending').hidden=!C.ending(st);$('badge2').hidden=!st.badge2;$('city').classList.toggle('lit',st.badge);const pr=C.progress(st);$('prog').textContent=`🌟 नगर की रोशनी: ${pr.pct}% (${pr.got}/${pr.tot})`;$('bar').style.width=pr.pct+'%';}
function pick(id,b){const r=C.tap(st,cur,id);if(!r.ok)return;st=r.state;save(C.KEY,st);b.classList.add('got','pop');
 const o=C.SCENES[cur].objs.find(x=>x.id===id);toast('✨ '+o.name+' मिला!');(window.KLSound||{sfx(){}}).sfx('find');
 if(r.full)setTimeout(()=>toast('🎒 झोला भर गया! (12 खाने) — पहले कुछ इस्तेमाल करो'),2600);if(r.clearedNew){setTimeout(()=>(window.KLSound||{sfx(){}}).sfx('clear'),600);const g=K.claimSpot(kst,'khoya:'+C.SCENES[cur].id);kst=g.state;save(K.KEY,kst);
  setTimeout(()=>toast(r.item.e+' '+r.item.name+' मिली'+(g.added?' · +'+g.added+' 💰':'')),1700);if(r.badge2New)setTimeout(()=>toast('👑 '+C.BADGE2+' — पूरा राज्य रोशन!'),3400);if(r.badgeNew)setTimeout(()=>toast('🏅 '+C.BADGE+' — बेगमपुरा रोशन! अध्याय 2 खुला'),3400);}
 paint();}
$('scene').onclick=()=>{penalty=C.WRONG_MS;$('scene').classList.remove('shake');void $('scene').offsetWidth;$('scene').classList.add('shake');((window.KLSound||{sfx(){}}).sfx('wrong'),toast('❌ यहाँ नहीं · संकेत 4 सेकंड देर से'));};
$('hint').onclick=()=>{const now=Date.now();const wait=lastHint?C.HINT_MS+penalty-(now-lastHint):penalty;if(wait>0){const u=C.useKan(st,3);if(!u.ok)return toast('⏳ संकेत '+Math.ceil(wait/1000)+' सेकंड में (या 3 ✨ कण)');st=u.state;save(C.KEY,st);toast('✨ 3 रोशनी के कण से संकेत');}
 const h=C.hint(st,cur);if(!h)return toast('सब मिल गया!');lastHint=now;penalty=0;const b=document.querySelector(`.obj[data-id="${h.id}"]`);if(b){b.classList.add('glow');setTimeout(()=>b.classList.remove('glow'),3000);}toast('✨ '+h.name+' यहाँ चमक रहा है');(window.KLSound||{sfx(){}}).sfx('hint');};
$('next').onclick=()=>{cur++;st.scene=cur;save(C.KEY,st);drawScene();paint();};
$('say').onclick=()=>{if(!('speechSynthesis'in window))return toast('इस phone में आवाज़ नहीं है');speechSynthesis.cancel();const sc=C.SCENES[cur];const u=new SpeechSynthesisUtterance(sc.story);u.lang='hi-IN';u.rate=.9;speechSynthesis.speak(u);};
const SB=$('snd'),L=window.KLSound;if(L&&SB){let want=false;try{want=L.parsePref(localStorage.getItem(L.PREF));}catch{}
 const lab=()=>{SB.textContent=L.isOn()?'🎵 संगीत चालू':'🔇 संगीत बंद';SB.setAttribute('aria-pressed',String(L.isOn()));};
 if(want){SB.textContent='🎵 छूकर संगीत शुरू करें';document.addEventListener('pointerdown',function f(){document.removeEventListener('pointerdown',f,true);L.set(true,localStorage);lab();},true);}else lab();
 SB.onclick=e=>{e.stopPropagation();L.set(!L.isOn(),localStorage);lab();};}
drawScene();paint();window.__khoya={state:()=>st,koins:()=>K.total(kst),scene:()=>cur};})();
