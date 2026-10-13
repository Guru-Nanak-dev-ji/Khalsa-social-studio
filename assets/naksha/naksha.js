(()=>{'use strict';const N=window.KDNNaksha,K=window.KDNKoins,$=id=>document.getElementById(id);
const rd=k=>{try{return JSON.parse(localStorage.getItem(k));}catch{return null;}},wr=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};
let kst=K.validate(rd(K.KEY));{const w=K.grantWelcome(kst);if(w.added){kst=w.state;wr(K.KEY,kst);}}
const H=N.NODES[N.NODES.length-1].y+80,svg='http://www.w3.org/2000/svg';
function toast(t){const el=$('toast');el.textContent=t;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,2200);}
function build(){const m=$('map');m.style.height=H+'px';const s=document.createElementNS(svg,'svg');s.setAttribute('viewBox',`0 0 400 ${H}`);s.setAttribute('preserveAspectRatio','none');s.setAttribute('aria-hidden','true');
 for(const c of['road','trail']){const p=document.createElementNS(svg,'path');p.setAttribute('d',N.pathD());p.setAttribute('class',c);s.append(p);}m.append(s);
 N.NODES.forEach((n,i)=>{const a=document.createElement('a');a.className='node';a.href=n.href;a.id='n-'+n.id;a.style.left=n.x+'%';a.style.top=n.y+'px';a.style.animationDelay=(i*.15%3)+'s';
  const ic=document.createElement('span');ic.className='ic';ic.textContent=n.icon;const t=document.createElement('strong');t.textContent=n.name;const st=document.createElement('small');a.append(ic,t,st);m.append(a);
  const li=document.createElement('a');li.className='row';li.href=n.href;li.id='l-'+n.id;li.append(n.icon+' '+n.name+' ',document.createElement('small'));$('list').append(li);});}
function paint(){let st=N.validate(rd(N.KEY));let gained=0;
 for(const id of st.seen){const g=K.claimSpot(kst,'naksha:'+id);if(g.added){kst=g.state;gained+=g.added;}}if(gained){wr(K.KEY,kst);toast('+'+gained+' 💰 नए द्वार देखने पर');}
 if(st.seen.length===N.IDS.length&&!st.badge){st={...st,badge:true};wr(N.KEY,st);setTimeout(()=>toast('🏅 '+N.BADGE+' badge मिला!'),1500);}
 const p=N.progress(st);$('h-koins').textContent=K.fmt(K.total(kst));$('prog').textContent=`${p.seen} / ${p.total} द्वार देखे`;$('bar').style.width=p.pct+'%';$('bar').parentElement.setAttribute('aria-valuenow',p.pct);
 $('badge').hidden=!st.badge;
 for(const n of N.NODES){const ok=st.seen.includes(n.id),lab=ok?'✅ देखा':'✨ अभी बाकी';for(const pre of['n-','l-']){const el=$(pre+n.id);el.classList.toggle('seen',ok);el.querySelector('small').textContent=lab;}}}
build();paint();addEventListener('pageshow',paint);addEventListener('storage',paint);window.__nk={paint};})();
