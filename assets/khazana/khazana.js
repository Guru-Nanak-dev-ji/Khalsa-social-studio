(()=>{'use strict';const Z=window.KDNKhazana,K=window.KDNKoins,$=id=>document.getElementById(id);
const read=k=>{try{return localStorage.getItem(k);}catch{return null;}};
let kst=K.validate(Z.parse(read(K.KEY)));{const w=K.grantWelcome(kst);if(w.added){kst=w.state;try{localStorage.setItem(K.KEY,JSON.stringify(kst));}catch{}}}
const LABEL={got:'✅ badge मिला',started:'⏳ शुरू किया · पूरा कीजिए',locked:'🔒 अभी बाकी · खेलिए'};
function paint(){const rows=Z.scan(read),s=Z.summary(rows);$('h-koins').textContent=K.fmt(K.total(kst));
 $('rank').textContent=s.rank;$('count').textContent=`${s.got} / ${s.total} badges`;$('bar').style.width=s.pct+'%';$('bar').parentElement.setAttribute('aria-valuenow',s.pct);
 document.body.classList.toggle('open',s.got>0);document.body.classList.toggle('full',s.got===s.total);
 const n=$('next');if(s.next){n.hidden=false;n.href=s.next.href;n.textContent=`${s.next.icon} अगली चुनौती: ${s.next.game} →`;}else n.hidden=true;
 const g=$('grid');g.textContent='';rows.forEach((r,i)=>{const a=document.createElement('a');a.className='medal '+r.status;a.href=r.href;a.style.animationDelay=(i*.12)+'s';
  const ic=document.createElement('span');ic.className='ic';ic.textContent=r.icon;const b=document.createElement('strong');b.textContent='🏅 '+r.badge;
  const t=document.createElement('span');t.className='gm';t.textContent=r.game;const st=document.createElement('small');st.textContent=LABEL[r.status];a.append(ic,b,t,st);g.append(a);});}
paint();addEventListener('storage',paint);addEventListener('pageshow',paint);window.__kz={paint,scan:()=>Z.scan(read)};})();
