(()=>{'use strict';const C=window.KDNKahani,K=window.KDNKoins,$=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
const load=(k,v,f)=>{try{return v(JSON.parse(localStorage.getItem(k)||'null'));}catch{return f();}};
const save=(k,s)=>{try{localStorage.setItem(k,JSON.stringify(s));}catch{}};
let kst=load(K.KEY,K.validate,K.fresh);let st=load(C.KEY,C.validate,C.fresh);
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;};
const sv=(tag,a)=>{const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);return e;};
function toast(t){const e=el('div','toast',t);document.body.append(e);setTimeout(()=>e.remove(),1600);}
C.MAP.forEach(m=>{const li=el('li');li.append(el('b',null,m.title+' — '),el('span',null,m.text));$('map').append(li);});
const A=C.AVATAR;$('av-tag').textContent=A.tag;$('av-teaser').textContent=A.teaser;$('av-msg').textContent=A.msg;$('disc').textContent='⚠️ '+C.DISCLAIMER;
A.cast.forEach(c=>{const li=el('li');li.append(el('b',null,c.n+': '),el('span',null,c.r));$('cast').append(li);});
for(const [id,arr] of [['ep1',A.ep1],['ep2',A.ep2],['ep3',A.ep3],['ep4',A.ep4],['ep5',A.ep5],['ep6',A.ep6],['ep7',A.ep7],['ep8',A.ep8],['ep9',A.ep9],['ep10',A.ep10]])arr.forEach(l=>{const p=el('p',l.who?'line':'dir');if(l.who)p.append(el('b',null,l.who+': '));p.append(el('span',null,l.t));$(id).append(p);});
const W=C.WM;$('wm-tag').textContent=W.tag;$('wm-disc').textContent='⚠️ '+W.disclaimer;$('wm-next').textContent=W.next;
function helpBox(){const d=el('div','help');d.setAttribute('role','note');d.append(el('b',null,W.help.title));W.help.lines.forEach(l=>d.append(el('p',null,l)));d.append(el('small',null,W.help.src));return d;}
W.parts.forEach(pt=>{const sec=el('div','wmp');sec.id=pt.id;sec.append(el('h3',null,pt.title));pt.p.forEach((t,i)=>{sec.append(el('p',null,t));
 if(pt.quote&&i===0){const q=el('blockquote','gq');q.lang='pa';pt.quote.forEach(l=>q.append(el('p',null,l)));q.append(el('small',null,'— "कनेडा है बरो" से'));sec.append(q);}
 if(pt.inbox&&i===2){const ib=el('div','inbox');pt.inbox.forEach(m=>ib.append(el('p',null,m)));sec.append(ib);}
 if(pt.ring&&i===1){const r=el('div','ring');r.setAttribute('role','list');W.emotions.forEach((e,j)=>{const b=el('button','emo-b',e.n);b.type='button';b.setAttribute('role','listitem');b.style.setProperty('--c',e.c);b.style.setProperty('--a',(j*45)+'deg');b.onclick=()=>{$('emo-o').textContent=e.n+': "'+e.o+'"';};r.append(b);});
  r.append(el('span','ring-c','🤍 दयालू'));sec.append(r,el('p','res','भाव पर tap करें, वह अपनी जड़ बताएगा'));sec.lastChild.id='emo-o';}});
 if(pt.doors){const g=el('div','doors');pt.doors.forEach((d,j)=>{const a=el('a','dcard');a.href=d.h;a.style.animationDelay=(j*.25)+'s';a.append(el('span','di',d.i),el('b',null,d.t),el('small',null,d.s));if(d.q){const q=el('small','gq');q.lang='pa';q.textContent=d.q;a.append(q);}g.append(a);});sec.append(g);}
 if(pt.rules){sec.append(el('h3',null,'आख़िरी 7 नियम'));const ol=el('ol','rules');pt.rules.forEach(r=>ol.append(el('li',null,r)));sec.append(ol);if(pt.help)sec.append(helpBox());sec.append(el('p','mir',pt.mirror));pt.final.forEach(t=>sec.append(el('p',t.startsWith('—')?'end-s':null,t)));}
 else if(pt.help)sec.append(helpBox());$('wm-parts').append(sec);});
W.index.forEach(x=>{const a=el(x.id?'a':'span','wi'+(x.id?'':' soon'),'भाग '+x.n+(x.id?'':' · जल्द'));if(x.id)a.href='#'+x.id;$('wm-idx').append(a);});
{const M=window.KDNWhiteMirror,ch=W.choice,box=$('wm-choice');let ws=load(M.KEY,M.validate,M.fresh);box.append(el('p','cq',ch.q));const row=el('div','mrow'),out=el('p','res');
 for(const k of['black','white']){const b=el('button','mirror '+k);b.type='button';b.append(el('b',null,ch[k].t),el('small',null,ch[k].s));
  b.onclick=()=>{row.querySelectorAll('.mirror').forEach(x=>x.classList.remove('on'));b.classList.add('on');
   if(k==='white'){const r=M.finish(ws);ws=r.state;save(M.KEY,ws);out.textContent='🤍 सफ़ेद शीशा चमक उठा।';if(r.badgeNew){const g=K.claimSpot(kst,'whitemirror:done');kst=g.state;save(K.KEY,kst);toast('🏅 '+M.BADGE+(g.added?' · +'+g.added+' 💰':''));paint();}}
   else out.textContent='⬛ काला शीशा कुछ नहीं दिखाता। फिर से चुनिए।';};row.append(b);}
 box.append(row,out);}
const Y=[40,100,160];
function lines(){const s=$('lines');s.replaceChildren();C.TIMES.forEach((t,i)=>{s.append(sv('path',{d:`M10 ${Y[i]} H330`,class:'base'}));const tx=sv('text',{x:12,y:Y[i]-10,class:'lbl'});tx.textContent=t.icon+' '+t.name;s.append(tx);});
 st.picks.forEach((p,i)=>{const y=Y[i],x=90+i*0;const up=p==='a';s.append(sv('path',{d:`M90 ${y} C150 ${y} 170 ${y+(up?-22:22)} 320 ${y+(up?-22:22)}`,class:'br '+(up?'good':'bad')}));
  s.append(sv('path',{d:`M90 ${y} C150 ${y} 170 ${y+(up?22:-22)} 320 ${y+(up?22:-22)}`,class:'br ghost'}));const e=sv('text',{x:300,y:y+(up?-26:30),class:'emo'});e.textContent=up?'😇':'😈';s.append(e);});
 if(st.picks.length===C.CH1.length)s.append(sv('path',{d:`M330 ${Y[0]} C350 ${Y[1]} 310 ${Y[1]} 330 ${Y[2]}`,class:'thread'}));}
function paint(){$('h-koins').textContent=K.fmt(K.total(kst));lines();const i=st.picks.length,o=$('opts');o.replaceChildren();
 if(i<C.CH1.length){const c=C.CH1[i];$('q').textContent=c.q;for(const k of['a','b']){const b=el('button','btn'+(k==='b'?' ghost':''),c[k].t);b.type='button';b.onclick=()=>pick(k);o.append(b);}$('end').hidden=true;}
 else{$('q').textContent='🦋 अध्याय 1 पूरा।';const r=C.play(st.picks).end,e=$('end');e.replaceChildren(el('p','ei',r.icon),el('b',null,r.title),el('p',null,r.text));e.hidden=false;}
 $('badge').hidden=!st.badge;}
function pick(k){const i=st.picks.length,r=C.choose(st,k);if(!r.ok)return;st=r.state;save(C.KEY,st);$('res').textContent=C.CH1[i][k].r;
 if(r.badgeNew){const g=K.claimSpot(kst,'kahani:ch1');kst=g.state;save(K.KEY,kst);toast('🏅 '+C.BADGE+(g.added?' · +'+g.added+' 💰':''));}paint();}
$('again').onclick=()=>{st=C.restart(st);save(C.KEY,st);$('res').textContent='🐦‍🔥 चेतना फिर जन्मी — नया ब्रह्मांड।';paint();};
paint();window.__kahani={state:()=>st,koins:()=>K.total(kst)};})();
