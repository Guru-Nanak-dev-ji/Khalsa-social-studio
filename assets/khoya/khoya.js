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
function solvedGo(sc){(window.KLSound||{sfx(){}}).sfx('open');toast('🚪 '+sc.item.e+' से अगला दरवाज़ा खुला!');setTimeout(()=>{cur++;st.scene=cur;save(C.KEY,st);drawScene();paint();},900);}
function apply(r,sc){st=r.state;save(C.KEY,st);if(r.solved)solvedGo(sc);paint();}
const HOW={tiles:['🧩 टाइल घुमाओ','हर टाइल छूकर घुमाइए — सारे तीर ⬆️ ऊपर।'],gears:['⚙️ गियर मिलाओ','गियर छूने पर वह और उसके साथ जुड़े गियर घूमते हैं। सारे निशान 🔺 ऊपर लाइए।'],runes:['🔣 चिह्नों का क्रम','प्राचीन पत्थर पर लिखा क्रम पढ़िए और उसी क्रम में चिह्न छूइए। गलती हुई तो फिर से शुरू।'],match:['🃏 जोड़ी मिलाओ','दो पत्ते पलटिए — एक जैसे हों तो खुले रहेंगे। सारी जोड़ियाँ मिलाइए।']};
function drawPuz(sc){const p=cur,t=C.ptype(p),G=$('tiles'),z=st.pz[p];G.textContent='';G.className='pz-'+t;$('puz-title').textContent=HOW[t][0];$('puz-how').textContent=HOW[t][1];$('puz-item').textContent=sc.item.e+' '+sc.item.name;
 const btn=(cls,txt,lab,fn)=>{const b=el('button',cls,txt);b.type='button';b.setAttribute('aria-label',lab);b.onclick=fn;G.append(b);return b;};
 if(t==='tiles')st.tiles[p].forEach((v,i)=>{btn('tile','⬆️','टाइल '+(i+1),()=>apply(C.rotate(st,p,i),sc)).style.transform=`rotate(${v*90}deg)`;});
 if(t==='gears')z.g.forEach((v,i)=>{const b=btn('gear','⚙️','गियर '+(i+1),()=>apply(C.gear(st,p,i),sc));b.style.setProperty('--r',(v*60)+'deg');b.append(el('i','mark','🔺'));});
 if(t==='runes'){const seq=C.runeSeq(p);G.append(el('p','clue','📜 '+seq.map(i=>C.RUNE_SET[i].n).join(' → ')));const pr=el('p','clue2',(z.k?'✅ '.repeat(z.k):'')+'('+z.k+'/4)');G.append(pr);
  C.RUNE_SET.forEach((r,i)=>btn('rune',r.e,r.n,()=>{const x=C.rune(st,p,i);if(x.wrong)toast('❌ गलत क्रम — फिर से');apply(x,sc);}));}
 if(t==='match')C.matchCards(p).forEach((c,i)=>{const open=z.m.includes(i)||i===flipA||i===flipB;btn('card2'+(open?' open':''),open?c:'❔','पत्ता '+(i+1),()=>{
   if(open||flipB>=0)return;if(flipA<0){flipA=i;return paint();}flipB=i;paint();const a=flipA,b=i;setTimeout(()=>{flipA=flipB=-1;const r=C.match(st,p,a,b);apply(r,sc);},r0(a,b)?250:800);});});}
const r0=(a,b)=>C.matchCards(cur)[a]===C.matchCards(cur)[b];
function paint(){$('h-koins').textContent=K.fmt(K.total(kst));const sc=C.SCENES[cur];
 const T=$('tabs');T.textContent='';C.SCENES.forEach((s,i)=>{if(i===0||i===C.CH1)T.append(el('span','chap','📜 अध्याय '+s.ch));const b=el('button','tab'+(i===cur?' on':'')+(st.cleared.includes(i)?' done':''),(st.cleared.includes(i)?'✅ ':C.unlocked(st,i)?'':'🔒 ')+(i<C.CH1?i+1:i-C.CH1+1));b.type='button';b.setAttribute('aria-label',s.name);b.disabled=!C.unlocked(st,i);b.onclick=()=>{cur=i;st.scene=i;save(C.KEY,st);drawScene();paint();};T.append(b);});
 $('s-name').textContent='अध्याय '+sc.ch+' · '+(cur+1)+'. '+sc.name;$('s-story').textContent='🧭 '+sc.guide+': '+sc.story;
 const L=$('list');L.textContent='';sc.objs.forEach(o=>{const li=el('li',st.found[cur].includes(o.id)?'got':'',o.name);L.append(li);});
 $('count').textContent=`${st.found[cur].length}/${sc.objs.length} मिलीं`;
 const I=$('inv');I.textContent='';C.SCENES.forEach(s=>{if(st.inv.includes(s.item.id))I.append(el('span','it',s.item.e+' '+s.item.name));});if(!st.inv.length)I.textContent='अभी खाली — दृश्य पूरा करो तो चीज़ मिलेगी';
 const p=$('puz'),needP=st.cleared.includes(cur)&&cur<C.SCENES.length-1&&!st.puzzles.includes(cur);p.hidden=!needP;
 if(needP)drawPuz(sc);
 $('next').hidden=!(st.cleared.includes(cur)&&st.puzzles.includes(cur)&&cur<C.SCENES.length-1);
 $('badge').hidden=!st.badge;$('badge2').hidden=!st.badge2;$('city').classList.toggle('lit',st.badge);const pr=C.progress(st);$('prog').textContent=`🌟 नगर की रोशनी: ${pr.pct}% (${pr.got}/${pr.tot})`;$('bar').style.width=pr.pct+'%';}
function pick(id,b){const r=C.tap(st,cur,id);if(!r.ok)return;st=r.state;save(C.KEY,st);b.classList.add('got','pop');
 const o=C.SCENES[cur].objs.find(x=>x.id===id);toast('✨ '+o.name+' मिला!');(window.KLSound||{sfx(){}}).sfx('find');
 if(r.clearedNew){setTimeout(()=>(window.KLSound||{sfx(){}}).sfx('clear'),600);const g=K.claimSpot(kst,'khoya:'+C.SCENES[cur].id);kst=g.state;save(K.KEY,kst);
  setTimeout(()=>toast(r.item.e+' '+r.item.name+' मिली'+(g.added?' · +'+g.added+' 💰':'')),1700);if(r.badge2New)setTimeout(()=>toast('👑 '+C.BADGE2+' — पूरा राज्य रोशन!'),3400);if(r.badgeNew)setTimeout(()=>toast('🏅 '+C.BADGE+' — बेगमपुरा रोशन! अध्याय 2 खुला'),3400);}
 paint();}
$('scene').onclick=()=>{penalty=C.WRONG_MS;$('scene').classList.remove('shake');void $('scene').offsetWidth;$('scene').classList.add('shake');((window.KLSound||{sfx(){}}).sfx('wrong'),toast('❌ यहाँ नहीं · संकेत 4 सेकंड देर से'));};
$('hint').onclick=()=>{const now=Date.now();const wait=lastHint?C.HINT_MS+penalty-(now-lastHint):penalty;if(wait>0)return toast('⏳ संकेत '+Math.ceil(wait/1000)+' सेकंड में');
 const h=C.hint(st,cur);if(!h)return toast('सब मिल गया!');lastHint=now;penalty=0;const b=document.querySelector(`.obj[data-id="${h.id}"]`);if(b){b.classList.add('glow');setTimeout(()=>b.classList.remove('glow'),3000);}toast('✨ '+h.name+' यहाँ चमक रहा है');(window.KLSound||{sfx(){}}).sfx('hint');};
$('next').onclick=()=>{cur++;st.scene=cur;save(C.KEY,st);drawScene();paint();};
$('say').onclick=()=>{if(!('speechSynthesis'in window))return toast('इस phone में आवाज़ नहीं है');speechSynthesis.cancel();const sc=C.SCENES[cur];const u=new SpeechSynthesisUtterance(sc.story);u.lang='hi-IN';u.rate=.9;speechSynthesis.speak(u);};
const SB=$('snd'),L=window.KLSound;if(L&&SB){let want=false;try{want=L.parsePref(localStorage.getItem(L.PREF));}catch{}
 const lab=()=>{SB.textContent=L.isOn()?'🎵 संगीत चालू':'🔇 संगीत बंद';SB.setAttribute('aria-pressed',String(L.isOn()));};
 if(want){SB.textContent='🎵 छूकर संगीत शुरू करें';document.addEventListener('pointerdown',function f(){document.removeEventListener('pointerdown',f,true);L.set(true,localStorage);lab();},true);}else lab();
 SB.onclick=e=>{e.stopPropagation();L.set(!L.isOn(),localStorage);lab();};}
drawScene();paint();window.__khoya={state:()=>st,koins:()=>K.total(kst),scene:()=>cur};})();
