// फनीबुक + HER renderer: safe DOM only (textContent), badge once, +5 game koins.
(()=>{'use strict';const F=window.KDNFbHer,K=window.KDNKoins,$=id=>document.getElementById(id);if(!F)return;
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;};
const load=(k,v,f)=>{try{return v(JSON.parse(localStorage.getItem(k)||'null'));}catch{return f();}};
const save=(k,s)=>{try{localStorage.setItem(k,JSON.stringify(s));}catch{}};
let st=load(F.KEY,F.validate,F.fresh),kst=K?load(K.KEY,K.validate,K.fresh):null;
function toast(t){const e=el('div','toast',t);document.body.append(e);setTimeout(()=>e.remove(),1800);}
function help(){const d=el('div','help');d.setAttribute('role','note');d.append(el('b',null,F.HELP.title));F.HELP.lines.forEach(l=>d.append(el('p',null,l)));d.append(el('small',null,F.HELP.src));return d;}
function chat(arr){const w=el('div','fbc');arr.forEach(([who,t])=>{const p=el('p','fbm');p.append(el('b',null,who+' '),el('span',null,t));w.append(p);});return w;}
function render(S,slides,badge){const box=$(S.id+'-body');if(!box)return;
 box.append(el('p','fb-sub',S.sub));box.lastChild.lang='pa';box.append(el('p','tag',S.tag),el('p','note disc','⚠️ '+S.disc));
 const sl=el('div','jaan-slider');sl.setAttribute('aria-label','तस्वीरें');sl.dataset.jaanSlides=slides;box.append(sl);if(window.KDNJaan)window.KDNJaan.slider(sl);
 const nav=el('nav','fb-chips');nav.setAttribute('aria-label','अध्याय');box.append(nav);
 S.ch.forEach((c,i)=>{const id=S.id+'-c'+(i+1),a=el('a','fb-chip',(c.e||S.icon)+' '+(i+1));a.href='#'+id;a.style.animationDelay=(i*.12)+'s';nav.append(a);
  const card=el('article','fb-ch');card.id=id;card.style.animationDelay=(i*.1)+'s';card.append(el('h3',null,(c.e||S.icon)+' '+c.t));if(c.s)card.append(el('p','fb-s',c.s));
  c.sc.forEach(x=>{const d=el('div','fb-sc');d.append(el('h4',null,x.h));
   if(x.poem)d.append(el('blockquote','fb-poem',x.poem.join('\n')));(x.after||[]).forEach(t=>d.append(el('p',null,t)));
   if(x.poem2)d.append(el('blockquote','fb-poem',x.poem2.join('\n')));(x.after2||[]).forEach(t=>d.append(el('p',null,t)));
   if(x.cut)d.append(el('p','fb-cut',F.CUT));if(x.joke)d.append(el('p','fb-joke',x.joke));
   (x.p||[]).forEach(t=>d.append(el('p',null,t)));if(x.c)d.append(chat(x.c));if(x.stat)d.append(el('p','fb-stat',x.stat));
   if(x.table){const tb=el('table','fb-tab');x.table.forEach((r,j)=>{const tr=el('tr');r.forEach(v=>tr.append(el(j?'td':'th',null,v)));tb.append(tr);});d.append(tb);}
   if(x.help)d.append(help());card.append(d);});box.append(card);});
 if(S.link){const a=el('a','btn fb-link','🤣 Funnybook पर जाएँ ↗');a.href=S.link;a.target='_blank';a.rel='noopener';box.append(a);}
 const b=el('button','btn fb-done',(st[S.id]?'🏅 ':'✅ ')+'कहानी पूरी पढ़ ली');b.type='button';const out=el('p','res');out.setAttribute('aria-live','polite');
 b.onclick=()=>{const r=F.finish(st,S.id);st=r.state;save(F.KEY,st);b.textContent='🏅 कहानी पूरी पढ़ ली';out.textContent='🏅 '+badge;
  if(r.badgeNew&&K){const g=K.claimSpot(kst,S.id+':done');kst=g.state;save(K.KEY,kst);toast('🏅 '+badge+(g.added?' · +'+g.added+' 💰':''));}};box.append(b,out);}
render(F.FB,'meenar|🎤 कवि दरबार;network|📱 वायरल;bazaar|🤣 हँसी का बाज़ार',F.BADGE_FB);
render(F.HER,'vedh|🛸 आसमान में चमक;city|🌆 शहर में आवाज़ें;sun|⭐ एक तारा हिलता है',F.BADGE_HER);
})();
