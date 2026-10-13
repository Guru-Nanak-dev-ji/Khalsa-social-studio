(()=>{'use strict';const N=window.KDNNanakGhar,K=window.KDNKoins,$=id=>document.getElementById(id);
const load=(k,v,f)=>{try{return v(JSON.parse(localStorage.getItem(k)||'null'));}catch{return f();}};
const save=(k,s)=>{try{localStorage.setItem(k,JSON.stringify(s));}catch{}};
let kst=load(K.KEY,K.validate,K.fresh);{const w=K.grantWelcome(kst);if(w.added){kst=w.state;save(K.KEY,kst);}}
let st=load(N.KEY,N.validate,N.fresh),kind='maang',filter='all';
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),1100);}
N.CATS.forEach(c=>{const o=document.createElement('option');o.textContent=c;$('cat').append(o);});
document.querySelectorAll('[data-kind]').forEach(b=>b.onclick=()=>{kind=b.dataset.kind;document.querySelectorAll('[data-kind]').forEach(x=>x.classList.toggle('on',x===b));$('text').placeholder=kind==='maang'?'आपको किस चीज़ की ज़रूरत है?':'आप कौन-सी सेवा दे सकते हैं?';});
document.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{filter=b.dataset.f;document.querySelectorAll('[data-f]').forEach(x=>x.classList.toggle('on',x===b));paint();});
$('text').oninput=()=>$('left').textContent=`${N.MAXLEN-$('text').value.length} अक्षर बचे`;
$('post').onclick=()=>{const r=N.add(st,kind,$('cat').value,$('text').value,Date.now());if(!r.post){toast('✍️ पहले कुछ लिखिए');return;}st=r.state;save(N.KEY,st);$('text').value='';$('text').oninput();toast(kind==='maang'?'🙏 माँग board पर लगी':'🤲 सेवा board पर लगी');paint();};
function card(p){const d=document.createElement('article');d.className='post '+p.kind+(p.done?' done':'');
 const h=document.createElement('header');h.textContent=`${N.KINDS[p.kind].icon} ${N.KINDS[p.kind].name} · ${p.cat}`;const t=document.createElement('p');t.textContent=p.text;
 const m=document.createElement('small');m.textContent=(p.ts?new Date(p.ts).toLocaleDateString('hi-IN'):'')+(p.helpers?` · 🤝 ${p.helpers} सेवादार`:'')+(p.done?' · ✅ पूरी हुई':'');
 const row=document.createElement('div');row.className='row';
 if(p.kind==='maang'&&!p.done){const b=document.createElement('button');b.className='btn';b.textContent=st.helped.includes(p.id)?'✅ आपने हाथ बढ़ाया':'🤝 मैं मदद करूँगा';b.disabled=st.helped.includes(p.id);
  b.onclick=()=>{const r=N.help(st,p.id);if(!r.ok)return;st=r.state;const g=K.ring(kst);kst=g.state;save(K.KEY,kst);save(N.KEY,st);toast(`🙏 सेवा! +${g.added} 💰`);if(r.badgeNew)setTimeout(()=>toast('🏅 '+N.BADGE),1100);paint();};row.append(b);
  const c=document.createElement('button');c.className='btn ghost sm';c.textContent='✅ पूरी हुई';c.onclick=()=>{st=N.done(st,p.id);save(N.KEY,st);paint();};row.append(c);}
 const x=document.createElement('button');x.className='btn ghost sm';x.textContent='🗑️ हटाएँ';x.onclick=()=>{if(confirm('यह पर्ची हटाएँ?')){st=N.remove(st,p.id);save(N.KEY,st);paint();}};row.append(x);
 d.append(h,t,m,row);return d;}
function paint(){$('h-koins').textContent=K.fmt(K.total(kst));const b=$('board');b.innerHTML='';
 const ps=st.posts.filter(p=>filter==='all'||p.kind===filter).slice().reverse();
 if(!ps.length){const e=document.createElement('p');e.className='empty';e.textContent='🏠 अभी board खाली है। पहली पर्ची आप लगाइए!';b.append(e);}
 ps.forEach(p=>b.append(card(p)));$('stat').textContent=`🤝 आपकी सेवाएँ: ${st.helped.length} · badge के लिए ${N.NEED}`;$('badge').hidden=!st.badge;}
$('text').oninput();paint();window.__ng={state:()=>st,add:(k,c,t)=>{st=N.add(st,k,c,t,Date.now()).state;save(N.KEY,st);paint();}};})();
