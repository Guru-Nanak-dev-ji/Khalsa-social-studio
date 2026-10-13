(function(){if(window.__goldtv)return;window.__goldtv=1;
const base=(document.currentScript&&document.currentScript.src)?new URL('./',document.currentScript.src).href:'./assets/goldtv/';
if(window.GoldTVCore)run();else{const s=document.createElement('script');s.src=base+'goldtv-core.js';s.onload=run;document.head.appendChild(s);}
function run(){const C=window.GoldTVCore;
const css=document.createElement('link');css.rel='stylesheet';css.href=base+'goldtv.css';document.head.appendChild(css);
const KEY='goldtv_off',reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;let items=[],i=0,timer=null,paused=reduce;
function minBtn(){const b=document.createElement('button');b.id='goldtv-min';b.title='Golden TV चालू करें';b.setAttribute('aria-label','Golden TV चालू करें');b.textContent='📺';b.onclick=()=>{localStorage.removeItem(KEY);b.remove();show();};document.body.appendChild(b);}
function show(){if(document.getElementById('goldtv'))return;const w=document.createElement('div');w.id='goldtv';w.setAttribute('role','region');w.setAttribute('aria-label','Golden TV');w.setAttribute('aria-live','polite');
w.innerHTML='<span class="gt-logo" aria-hidden="true">📺</span><a class="gt-story"><span class="gt-tag"></span><span class="gt-text"></span></a><button class="gt-pp" aria-label="रोकें">⏸</button><button class="gt-x" aria-label="बंद करें">✕</button>';
document.body.appendChild(w);const pp=w.querySelector('.gt-pp');pp.textContent=paused?'▶':'⏸';
pp.onclick=()=>{paused=!paused;pp.textContent=paused?'▶':'⏸';pp.setAttribute('aria-label',paused?'चलाएँ':'रोकें');if(!paused)tick();};
w.querySelector('.gt-x').onclick=()=>{localStorage.setItem(KEY,'1');clearTimeout(timer);w.remove();minBtn();};render();loop();}
function render(){const w=document.getElementById('goldtv');if(!w||!items.length)return;const it=items[i],a=w.querySelector('.gt-story');a.href=it.href;a.querySelector('.gt-tag').textContent=it.tag;a.querySelector('.gt-text').textContent=it.text;a.classList.remove('gt-in');void a.offsetWidth;a.classList.add('gt-in');}
function tick(){i=C.next(i,items.length);render();}
function loop(){clearTimeout(timer);timer=setTimeout(()=>{if(!paused&&!document.hidden)tick();loop();},C.INTERVAL);}
async function load(){try{const r=await fetch(base+'feed.json',{cache:'no-cache'});items=C.clean((await r.json()).items);}catch(e){items=C.clean([{tag:'🧬 नारा',text:'एक click और बदल जाए ज़िंदगी 🧬',href:'./goldtv.html'}]);}
render();try{const r=await fetch(C.API+'/news/channels');if(r.ok){const j=await r.json();items=items.concat(C.fromChannels(j.channels));}}catch(e){}}
function start(){load().then(()=>{if(localStorage.getItem(KEY))minBtn();else show();});}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start):start();
window.GoldTV={items:()=>items};}})();
