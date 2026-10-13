(function(){if(window.__goldtv)return;window.__goldtv=1;
const base=(document.currentScript&&document.currentScript.src)?new URL('./',document.currentScript.src).href:'./assets/goldtv/';
if(window.GoldTVCore)run();else{const s=document.createElement('script');s.src=base+'goldtv-core.js';s.onload=run;document.head.appendChild(s);}
if(!window.__kdnSuggest){const sg=document.createElement('script');sg.src=base+'../suggest/suggest.js';sg.defer=true;document.head.appendChild(sg);}
function run(){const C=window.GoldTVCore;
const css=document.createElement('link');css.rel='stylesheet';css.href=base+'goldtv.css';document.head.appendChild(css);
const KEY='goldtv_off',reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;const ICS='<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1" fill="currentColor"/><rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="currentColor"/></svg>',ICP='<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 2l10 6-10 6z" fill="currentColor"/></svg>';let items=[],i=0,timer=null,paused=reduce,feed=[],granth=[],chans=[],cyc=0;
function minBtn(){const b=document.createElement('button');b.id='goldtv-min';b.title='Golden TV चालू करें';b.setAttribute('aria-label','Golden TV चालू करें');b.textContent='📺';b.onclick=()=>{localStorage.removeItem(KEY);b.remove();show();};document.body.appendChild(b);lift();}
function show(){if(document.getElementById('goldtv'))return;const w=document.createElement('div');w.id='goldtv';w.setAttribute('role','region');w.setAttribute('aria-label','Golden TV');w.setAttribute('aria-live','polite');
w.innerHTML='<span class="gt-logo" aria-hidden="true">📺</span><a class="gt-story"><span class="gt-tag"></span><span class="gt-text"></span></a><button class="gt-pp" aria-label="रोकें"></button><button class="gt-x" aria-label="बंद करें">✕</button><span class="gt-sg"></span>';
document.body.appendChild(w);adopt();w.querySelector('.gt-logo').onclick=()=>{userPill=false;setPill();};const pp=w.querySelector('.gt-pp');pp.innerHTML=paused?ICP:ICS;
pp.onclick=()=>{paused=!paused;pp.innerHTML=paused?ICP:ICS;pp.setAttribute('aria-label',paused?'चलाएँ':'रोकें');if(!paused)tick();};
lift();addEventListener('resize',lift);addEventListener('scroll',lift,{passive:true});setInterval(lift,1500);w.querySelector('.gt-x').onclick=()=>{localStorage.setItem(KEY,'1');clearTimeout(timer);const sb=document.getElementById('kdn-sg-b');if(sb){sb.classList.remove('kdn-docked');sb.textContent='💬 सुझाव';document.body.appendChild(sb);}w.remove();minBtn();};['touchstart','pointerdown','wheel','keydown'].forEach(ev=>addEventListener(ev,busy,{passive:true,capture:true}));addEventListener('scroll',busy,{passive:true});render();loop();}
let userPill=false,nearPill=false,busyT=null;
function adopt(){const w=document.getElementById('goldtv'),b=document.getElementById('kdn-sg-b');if(!w||!b||b.classList.contains('kdn-docked'))return;b.classList.add('kdn-docked');b.textContent='💬';b.title='सुझाव भेजें';w.querySelector('.gt-sg').appendChild(b);}
window.__kdnDockAdopt=adopt;
function setPill(){const w=document.getElementById('goldtv');if(w)w.classList.toggle('gt-pill',userPill||nearPill);}
function busy(e){const w=document.getElementById('goldtv');if(!w||(e&&e.target&&e.target.closest&&e.target.closest('#goldtv,#kdn-sg-p')))return;userPill=true;setPill();clearTimeout(busyT);busyT=setTimeout(()=>{userPill=false;setPill();},2200);}
const CTRL='button,input,select,textarea,a[href],[role=button],[role=slider],label,summary,[onclick]';
function lift(){const w=document.getElementById('goldtv')||document.getElementById('goldtv-min');if(!w)return;const vh=innerHeight,rs=document.documentElement.style;let off=0;for(const el of document.body.querySelectorAll('*')){if(el===w||w.contains(el)||el.id==='goldtv-min'||el.id==='goldtv'||el.id==='kdn-sg-p'||el.closest('#kdn-sg-p'))continue;const cs=getComputedStyle(el);if(cs.position!=='fixed'&&cs.position!=='sticky')continue;if(cs.display==='none'||cs.visibility==='hidden')continue;const r=el.getBoundingClientRect();if(r.height<=0||r.height>vh*0.5||r.width<60)continue;if(r.bottom>=vh-24&&r.top<vh)off=Math.max(off,vh-r.top);}
rs.setProperty('--kdn-dock-off',Math.ceil(off)+'px');const dh=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--kdn-dock-h'))||40;
document.body.style.paddingBottom='calc('+(Math.ceil(off)+dh+14)+'px + env(safe-area-inset-bottom))';
if(w.id==='goldtv'){const top=vh-off-dh-10;let hit=false;for(const el of document.querySelectorAll(CTRL)){if(w.contains(el)||el.closest('#kdn-sg-p,#goldtv-min'))continue;const r=el.getBoundingClientRect();if(!r.width||!r.height)continue;if(r.bottom>top&&r.top<vh-off){const c=getComputedStyle(el);if(c.visibility==='hidden'||c.display==='none'||c.position==='fixed')continue;hit=true;break;}}nearPill=hit;setPill();place(w,top,vh-off);}}
function place(w,top,bot){w.classList.remove('gt-left','gt-ghost');if(!w.classList.contains('gt-pill'))return;const pw=w.offsetWidth+16,ctl=[...document.querySelectorAll(CTRL)].filter(el=>!w.contains(el)&&!el.closest('#kdn-sg-p,#goldtv-min')&&getComputedStyle(el).position!=='fixed').map(el=>el.getBoundingClientRect()).filter(r=>r.width&&r.height&&r.bottom>top&&r.top<bot);
const blocked=x0=>ctl.some(r=>r.right>x0&&r.left<x0+pw);if(!blocked(innerWidth-pw))return;if(!blocked(0)){w.classList.add('gt-left');return;}w.classList.add('gt-ghost');}
function render(){const w=document.getElementById('goldtv');if(!w||!items.length)return;const it=items[i],a=w.querySelector('.gt-story');a.href=it.href;a.querySelector('.gt-tag').textContent=it.tag;a.querySelector('.gt-text').textContent=it.text;a.classList.remove('gt-in');void a.offsetWidth;a.classList.add('gt-in');}
function rebuild(){items=C.build(feed,granth,cyc).concat(chans);}
function tick(){i=C.next(i,items.length);if(i===0&&granth.length){cyc++;rebuild();}render();}
function loop(){clearTimeout(timer);timer=setTimeout(()=>{if(!paused&&!document.hidden)tick();loop();},C.INTERVAL);}
async function load(){try{const r=await fetch(base+'feed.json',{cache:'no-cache'});feed=(await r.json()).items||[];}catch(e){feed=[{tag:'🧬 नारा',text:'एक click और बदल जाए ज़िंदगी 🧬',href:'./goldtv.html'}];}
try{const r=await fetch(base+'../gyan/granth.json');granth=(await r.json()).quotes||[];}catch(e){}cyc=Math.floor(Math.random()*20);rebuild();
render();try{const r=await fetch(C.API+'/news/channels');if(r.ok){const j=await r.json();chans=C.fromChannels(j.channels);rebuild();}}catch(e){}}
function start(){load().then(()=>{if(localStorage.getItem(KEY))minBtn();else show();});}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start):start();
window.GoldTV={items:()=>items};}})();
