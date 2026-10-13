(()=>{'use strict';// ✨ fx: glass sheet with scroll-reveal cards. prefers-reduced-motion → सब तुरंत दिखे.
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const CARDS=[['🦅','बाज उड़ान','उड़ो, 💰 पकड़ो, badge जीतो','./baaz.html'],['🏆','मेरा खज़ाना','सब badges एक जगह','./khazana.html'],['📖','कहानी घर','White Mirror और भी','./kahani.html'],['📚','ज्ञान','पढ़ो, समझो, बाँटो','./gyan.html'],['🍛','लंगर रसोई','रोटी बेलो, सेवा करो','./langar.html'],['🧊','तख़्त Cube','घुमाओ और जानो','./takht.html'],['🌍','KDN नक्शा','दुनिया घूमो','./naksha.html'],['🚪','सब द्वार','हर पेज यहाँ से','./dwar.html']];
function init(){if(document.querySelector('.fx-fab'))return;const b=document.createElement('button');b.type='button';b.className='fx-fab';b.textContent='✨ खेल और द्वार';b.setAttribute('aria-expanded','false');
 const s=document.createElement('aside');s.className='fx-sheet';s.hidden=true;s.setAttribute('aria-label','खेल और द्वार');
 const x=document.createElement('button');x.type='button';x.className='fx-close';x.textContent='×';x.setAttribute('aria-label','बंद करें');
 const h=document.createElement('h2');h.textContent='✨ खेल और द्वार 🦅';const p=document.createElement('p');p.textContent='नीचे scroll करो — हर card धीरे से खुलेगा 😁💰📚';
 const grid=document.createElement('div');grid.className='fx-grid';
 for(const[i,t,d,u]of CARDS){const a=document.createElement('a');a.className='fx-card';a.href=u;const e=document.createElement('i');e.textContent=i;const bb=document.createElement('b');bb.textContent=t;const sm=document.createElement('small');sm.textContent=d;a.append(e,bb,sm);grid.append(a);}
 const gh=document.createElement('h3');gh.className='fx-gh';gh.textContent='🎮 खेल — यहीं खेलो, नगर वैसा ही रहेगा';const games=document.createElement('div');games.className='fx-games';games.dataset.jaanFun='shell';
 s.append(x,h,p,grid,gh,games);document.body.append(b,s);
 const cards=[...grid.children];let io=null;
 function open(){s.hidden=false;if(window.KDNJaan&&!games.dataset.jaanDone){window.KDNJaan.games(games);if(window.KDNJaan.fun)window.KDNJaan.fun(games);}b.setAttribute('aria-expanded','true');if(RM||!('IntersectionObserver'in window)){cards.forEach(c=>c.classList.add('fx-in'));return;}
  io=io||new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('fx-in');io.unobserve(e.target);}}),{root:s,threshold:.15});cards.forEach((c,i)=>{c.style.transitionDelay=(i%2)*80+'ms';io.observe(c);});}
 function close(){s.hidden=true;b.setAttribute('aria-expanded','false');b.focus();}
 b.addEventListener('click',()=>s.hidden?open():close());x.addEventListener('click',close);addEventListener('keydown',e=>{if(e.key==='Escape'&&!s.hidden)close();});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();
