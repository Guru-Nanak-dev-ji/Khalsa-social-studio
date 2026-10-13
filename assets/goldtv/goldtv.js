(function(){if(window.__goldtv)return;window.__goldtv=1;
const base=(document.currentScript&&document.currentScript.src)?new URL('./',document.currentScript.src).href:'./assets/goldtv/';
if(window.GoldTVCore)run();else{const s=document.createElement('script');s.src=base+'goldtv-core.js';s.onload=run;document.head.appendChild(s);}
function run(){const C=window.GoldTVCore;
const css=document.createElement('link');css.rel='stylesheet';css.href=base+'goldtv.css';document.head.appendChild(css);
const KEY='goldtv_off',reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;const ICS='<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1" fill="currentColor"/><rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="currentColor"/></svg>',ICP='<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 2l10 6-10 6z" fill="currentColor"/></svg>';let items=[],i=0,timer=null,paused=reduce;
function minBtn(){const b=document.createElement('button');b.id='goldtv-min';b.title='Golden TV चालू करें';b.setAttribute('aria-label','Golden TV चालू करें');b.textContent='📺';b.onclick=()=>{localStorage.removeItem(KEY);b.remove();show();};document.body.appendChild(b);lift();}
function show(){if(document.getElementById('goldtv'))return;const w=document.createElement('div');w.id='goldtv';w.setAttribute('role','region');w.setAttribute('aria-label','Golden TV');w.setAttribute('aria-live','polite');
w.innerHTML='<span class="gt-logo" aria-hidden="true">📺</span><a class="gt-story"><span class="gt-tag"></span><span class="gt-text"></span></a><button class="gt-pp" aria-label="रोकें"></button><button class="gt-x" aria-label="बंद करें">✕</button>';
document.body.appendChild(w);const pp=w.querySelector('.gt-pp');pp.innerHTML=paused?ICP:ICS;
pp.onclick=()=>{paused=!paused;pp.innerHTML=paused?ICP:ICS;pp.setAttribute('aria-label',paused?'चलाएँ':'रोकें');if(!paused)tick();};
lift();addEventListener('resize',lift);addEventListener('scroll',lift,{passive:true});setInterval(lift,1500);w.querySelector('.gt-x').onclick=()=>{localStorage.setItem(KEY,'1');clearTimeout(timer);w.remove();minBtn();};render();loop();}
function lift(){const w=document.getElementById('goldtv')||document.getElementById('goldtv-min');if(!w)return;const vh=innerHeight;let off=0;for(const el of document.body.querySelectorAll('*')){if(el===w||w.contains(el)||el.id==='goldtv-min'||el.id==='goldtv')continue;const cs=getComputedStyle(el);if(cs.position!=='fixed'&&cs.position!=='sticky')continue;if(cs.display==='none'||cs.visibility==='hidden')continue;const r=el.getBoundingClientRect();if(r.height<=0||r.height>vh*0.5||r.width<60)continue;if(r.bottom>=vh-4&&r.top<vh)off=Math.max(off,vh-r.top);}
w.style.bottom=off?('calc('+Math.ceil(off+6)+'px + env(safe-area-inset-bottom))'):'';document.body.style.paddingBottom=(Math.ceil(off)+64)+'px';}
function render(){const w=document.getElementById('goldtv');if(!w||!items.length)return;const it=items[i],a=w.querySelector('.gt-story');a.href=it.href;a.querySelector('.gt-tag').textContent=it.tag;a.querySelector('.gt-text').textContent=it.text;a.classList.remove('gt-in');void a.offsetWidth;a.classList.add('gt-in');}
function tick(){i=C.next(i,items.length);render();}
function loop(){clearTimeout(timer);timer=setTimeout(()=>{if(!paused&&!document.hidden)tick();loop();},C.INTERVAL);}
async function load(){try{const r=await fetch(base+'feed.json',{cache:'no-cache'});items=C.clean((await r.json()).items);}catch(e){items=C.clean([{tag:'🧬 नारा',text:'एक click और बदल जाए ज़िंदगी 🧬',href:'./goldtv.html'}]);}
render();try{const r=await fetch(C.API+'/news/channels');if(r.ok){const j=await r.json();items=items.concat(C.fromChannels(j.channels));}}catch(e){}}
function start(){load().then(()=>{if(localStorage.getItem(KEY))minBtn();else show();});}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start):start();
window.GoldTV={items:()=>items};}})();
