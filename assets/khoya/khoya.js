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
function paint(){$('h-koins').textContent=K.fmt(K.total(kst));const sc=C.SCENES[cur];
 const T=$('tabs');T.textContent='';C.SCENES.forEach((s,i)=>{const b=el('button','tab'+(i===cur?' on':'')+(st.cleared.includes(i)?' done':''),(st.cleared.includes(i)?'✅ ':C.unlocked(st,i)?'':'🔒 ')+(i+1));b.type='button';b.setAttribute('aria-label',s.name);b.disabled=!C.unlocked(st,i);b.onclick=()=>{cur=i;st.scene=i;save(C.KEY,st);drawScene();paint();};T.append(b);});
 $('s-name').textContent=(cur+1)+'. '+sc.name;$('s-story').textContent='🧭 '+sc.guide+': '+sc.story;
 const L=$('list');L.textContent='';sc.objs.forEach(o=>{const li=el('li',st.found[cur].includes(o.id)?'got':'',o.name);L.append(li);});
 $('count').textContent=`${st.found[cur].length}/${sc.objs.length} मिलीं`;
 const I=$('inv');I.textContent='';C.SCENES.forEach(s=>{if(st.inv.includes(s.item.id))I.append(el('span','it',s.item.e+' '+s.item.name));});if(!st.inv.length)I.textContent='अभी खाली — दृश्य पूरा करो तो चीज़ मिलेगी';
 const p=$('puz'),needP=st.cleared.includes(cur)&&cur<C.SCENES.length-1&&!st.puzzles.includes(cur);p.hidden=!needP;
 if(needP){const G=$('tiles');G.textContent='';st.tiles[cur].forEach((v,t)=>{const b=el('button','tile','⬆️');b.type='button';b.setAttribute('aria-label','टाइल '+(t+1));b.style.transform=`rotate(${v*90}deg)`;
   b.onclick=()=>{const r=C.rotate(st,cur,t);st=r.state;save(C.KEY,st);if(r.solved){toast('🚪 '+sc.item.e+' से अगला दरवाज़ा खुला!');setTimeout(()=>{cur++;st.scene=cur;save(C.KEY,st);drawScene();paint();},900);}paint();};G.append(b);});$('puz-item').textContent=sc.item.e+' '+sc.item.name;}
 $('next').hidden=!(st.cleared.includes(cur)&&st.puzzles.includes(cur)&&cur<C.SCENES.length-1);
 $('badge').hidden=!st.badge;$('city').classList.toggle('lit',st.badge);const pr=C.progress(st);$('prog').textContent=`🌟 नगर की रोशनी: ${pr.pct}% (${pr.got}/${pr.tot})`;$('bar').style.width=pr.pct+'%';}
function pick(id,b){const r=C.tap(st,cur,id);if(!r.ok)return;st=r.state;save(C.KEY,st);b.classList.add('got','pop');
 const o=C.SCENES[cur].objs.find(x=>x.id===id);toast('✨ '+o.name+' मिला!');
 if(r.clearedNew){const g=K.claimSpot(kst,'khoya:'+C.SCENES[cur].id);kst=g.state;save(K.KEY,kst);
  setTimeout(()=>toast(r.item.e+' '+r.item.name+' मिली'+(g.added?' · +'+g.added+' 💰':'')),1700);if(r.badgeNew)setTimeout(()=>toast('🏅 '+C.BADGE+' — बेगमपुरा रोशन!'),3400);}
 paint();}
$('scene').onclick=()=>{penalty=C.WRONG_MS;$('scene').classList.remove('shake');void $('scene').offsetWidth;$('scene').classList.add('shake');toast('❌ यहाँ नहीं · संकेत 4 सेकंड देर से');};
$('hint').onclick=()=>{const now=Date.now();const wait=lastHint?C.HINT_MS+penalty-(now-lastHint):penalty;if(wait>0)return toast('⏳ संकेत '+Math.ceil(wait/1000)+' सेकंड में');
 const h=C.hint(st,cur);if(!h)return toast('सब मिल गया!');lastHint=now;penalty=0;const b=document.querySelector(`.obj[data-id="${h.id}"]`);if(b){b.classList.add('glow');setTimeout(()=>b.classList.remove('glow'),3000);}toast('✨ '+h.name+' यहाँ चमक रहा है');};
$('next').onclick=()=>{cur++;st.scene=cur;save(C.KEY,st);drawScene();paint();};
$('say').onclick=()=>{if(!('speechSynthesis'in window))return toast('इस phone में आवाज़ नहीं है');speechSynthesis.cancel();const sc=C.SCENES[cur];const u=new SpeechSynthesisUtterance(sc.story);u.lang='hi-IN';u.rate=.9;speechSynthesis.speak(u);};
drawScene();paint();window.__khoya={state:()=>st,koins:()=>K.total(kst),scene:()=>cur};})();
