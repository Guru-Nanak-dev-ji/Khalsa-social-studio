// Adds living layers to every .jaali-live element. Few nodes, paused off-screen, no work under reduced motion.
(function(){'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function el(c){const e=document.createElement('span');e.className=c;e.setAttribute('aria-hidden','true');return e;}
function enliven(box){if(box.dataset.jlDone)return;box.dataset.jlDone='1';
 box.prepend(el('jl-fog'));box.prepend(el('jl-sweep'));box.prepend(el('jl-lattice'));
 if(box.dataset.diyas!=='off'){const d=el('jl-diyas');d.append(el('jl-diya'),el('jl-diya'));box.append(d);}
 if(reduce)return;
 const n=Math.min(14,Math.round(box.clientWidth/30)),h=box.clientHeight||400;
 for(let i=0;i<n;i++){const m=el('jl-mote');m.style.left=(Math.random()*100)+'%';
  m.style.setProperty('--d',(9+Math.random()*9).toFixed(1)+'s');m.style.setProperty('--delay',(-Math.random()*15).toFixed(1)+'s');
  m.style.setProperty('--dx',((Math.random()-.5)*80|0)+'px');m.style.setProperty('--h',(h*(.6+Math.random()*.5)|0)+'px');
  const s=2+Math.random()*3;m.style.width=m.style.height=s.toFixed(1)+'px';box.append(m);}
 if('IntersectionObserver'in window)new IntersectionObserver(es=>es.forEach(e=>box.style.setProperty('--jl-play',e.isIntersecting?'running':'paused'))).observe(box);}
function parallax(){if(reduce)return;let raf=0,x=0,y=0;const set=()=>{raf=0;document.querySelectorAll('.jaali-live').forEach(b=>{b.style.setProperty('--px',x.toFixed(3));b.style.setProperty('--py',y.toFixed(3));});};
 const q=()=>{if(!raf)raf=requestAnimationFrame(set);};
 addEventListener('pointermove',e=>{x=e.clientX/innerWidth-.5;y=e.clientY/innerHeight-.5;q();},{passive:true});
 addEventListener('deviceorientation',e=>{if(e.gamma==null)return;x=Math.max(-1,Math.min(1,e.gamma/30))/2;y=Math.max(-1,Math.min(1,(e.beta-45)/30))/2;q();},{passive:true});
 addEventListener('scroll',()=>{y=(scrollY%600)/600-.5;q();},{passive:true});}
function run(){document.querySelectorAll('.jaali-live').forEach(enliven);parallax();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
window.KDNJaali={enliven};})();
