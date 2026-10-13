(function(){'use strict';
var CE={k:'📖',g:'🎮',j:'📚',n:'📰',s:'🙏',m:'🎵',c:'😂',t:'🧰'};
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function init(){var grid=document.getElementById('sab-grid');if(!grid)return;
 fetch('./assets/pages.json').then(function(r){return r.json()}).then(function(R){var cat='all',q='',chips=document.getElementById('sab-chips'),inp=document.getElementById('sab-q');
  document.getElementById('sab-count').textContent=R.pages.length+' / '+R.max;document.getElementById('sab-bar').style.width=Math.max(2,R.pages.length*100/R.max)+'%';
  function chip(id,label){var b=el('button','sab-chip',label);b.type='button';b.dataset.c=id;b.onclick=function(){cat=id;draw()};chips.appendChild(b)}
  chip('all','✨ सब');R.cats.forEach(function(c){chip(c.id,CE[c.id]+' '+c.name)});
  function draw(){[].forEach.call(chips.children,function(b){b.setAttribute('aria-pressed',b.dataset.c===cat)});grid.textContent='';var n=0,s=q.trim().toLowerCase();
   R.pages.forEach(function(p,i){if(cat!=='all'&&p.cat!==cat)return;if(s&&(p.name+' '+p.sub+' '+p.id).toLowerCase().indexOf(s)<0)return;n++;
    var a=el('a','sab-card');a.href=p.href;a.style.animationDelay=(n%12)*40+'ms';a.dataset.cat=p.cat;a.appendChild(el('span','sab-ic',p.icon));a.appendChild(el('b',null,p.name));a.appendChild(el('small',null,p.sub));a.appendChild(el('i','sab-tag',CE[p.cat]+' '+(R.cats.find(function(c){return c.id===p.cat})||{}).name));grid.appendChild(a)});
   document.getElementById('sab-found').textContent=n?'🔎 '+n+' पेज':'😅 कुछ नहीं मिला — दूसरा शब्द आज़माओ';}
  inp.oninput=function(){q=inp.value;draw()};draw();}).catch(function(){grid.textContent='⚠️ सूची नहीं खुली — internet/cache जाँचो'});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();
