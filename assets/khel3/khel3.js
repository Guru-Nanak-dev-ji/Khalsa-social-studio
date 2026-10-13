(function(){'use strict';function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function btn(t,f,c){var b=el('button','gu-b'+(c?' '+c:''),t);b.type='button';b.addEventListener('click',f);return b}
function koins(id){var K=window.KDNKoins;if(!K)return 0;try{var s=K.validate(JSON.parse(localStorage.getItem(K.KEY)||'null')),r=K.claimSpot(s,id);localStorage.setItem(K.KEY,JSON.stringify(r.state));return r.added}catch(e){return 0}}
var RULES={jod:['पत्ते पलटो: एक पर गुरमुखी, दूसरे पर हिंदी।','सही जोड़ी (ਕ ↔ क, ਪਾਣੀ ↔ पानी) खुली रहती है।','सब जोड़ियाँ मिलाओ। स्तर 4 में 90 सेकंड हैं।','सिर्फ़ अक्खर और रोज़ के शब्द — गुरबाणी की पंक्तियाँ खेल में नहीं।'],
 rush:['संगत आती है — हर एक के ऊपर उसकी थाली का ऑर्डर है।','नीचे के बटन दबाकर थाली में व्यंजन रखो, फिर संगत को छूकर परोसो।','🙋 सेवादार साथी बीच-बीच में अपने आप एक को परोस देता है — मिलकर सेवा!','लक्ष्य तक परोसो; 3 से ज़्यादा संगत इंतज़ार में लौटे तो फिर से।'],
 khoj:['संकेत पढ़ो और सही जगह चुनो।','"🔎 और संकेत" से मदद लो — कम संकेत में ज़्यादा अंक।','आधे से ज़्यादा सही तो स्तर पार।','स्तर 4 में हर सवाल पर 20 सेकंड।']};
function Game(root,id,C,koinId){var st=load(),lv=Math.min(st.best+1,C.LEVELS.length),paused=false,ticks=[],self=this;
 function load(){try{return C.validate(JSON.parse(localStorage.getItem(C.KEY)))}catch(e){return C.fresh()}}
 var bar=el('div','k3-bar'),info=el('span','k3-info'),stage=el('div','k3-stage'),ov=el('div','k3-ov');ov.hidden=true;
 var pb=btn('⏸️ रोको',function(){setPause(!paused)}),rb=btn('🔁 फिर से',function(){start(lv)}),hb=btn('📜 नियम',function(){rules()});
 bar.append(info,pb,rb,hb);root.append(bar,stage,ov);
 function setPause(p){paused=p;pb.textContent=p?'▶️ चलाओ':'⏸️ रोको';if(p){ov.textContent='';ov.appendChild(el('h2',null,'⏸️ रुका हुआ'));ov.appendChild(btn('▶️ चलाओ',function(){setPause(false)}));ov.hidden=false}else ov.hidden=true}
 function rules(){paused=true;ov.textContent='';ov.appendChild(el('h2',null,'📜 नियम'));var ul=el('ul');RULES[id].forEach(function(t){ul.appendChild(el('li',null,t))});ov.appendChild(ul);
  var lvs=el('p');C.LEVELS.forEach(function(L,i){var b=btn('स्तर '+(i+1)+(L.n?' · '+L.n:''),function(){ov.hidden=true;paused=false;start(i+1)});b.disabled=i>st.best;lvs.appendChild(b)});ov.appendChild(lvs);ov.appendChild(el('p','gu-note','🏅 '+C.BADGE+(st.badge?' ✅':' — सब स्तर पार करो')+' · 💰 +5 koins पहली जीत पर (एक बार)'));ov.hidden=false}
 this.every=function(ms,f){var h=setInterval(function(){if(!paused)f()},ms);ticks.push(h);return h};
 this.paused=function(){return paused};this.stage=stage;
 this.info=function(t){info.textContent='स्तर '+lv+'/'+C.LEVELS.length+' · '+t};
 this.end=function(won,msg){ticks.forEach(clearInterval);ticks=[];ov.textContent='';ov.appendChild(el('h2',null,won?'🎉 स्तर '+lv+' पार!':'🙏 फिर कोशिश करो'));if(msg)ov.appendChild(el('p',null,msg));
  if(won){var r=C.win(load(),lv);st=r.state;try{localStorage.setItem(C.KEY,JSON.stringify(st))}catch(e){}if(r.payNow){var k=koins(koinId);ov.appendChild(el('p','gu-end','💰 +'+(k||5)+' koins'))}if(r.badgeNew)ov.appendChild(el('p','gu-end','🏅 badge मिला: '+C.BADGE));
   if(lv<C.LEVELS.length)ov.appendChild(btn('➡️ अगला स्तर',function(){ov.hidden=true;start(lv+1)}))}
  ov.appendChild(btn('🔁 फिर से',function(){ov.hidden=true;start(lv)}));ov.hidden=false};
 function start(n){ticks.forEach(clearInterval);ticks=[];lv=n;paused=false;pb.textContent='⏸️ रोको';ov.hidden=true;stage.textContent='';stage.className='k3-stage k3-'+id;self.run(n,C.LEVELS[n-1])}
 this.go=function(){rules()}}
function jod(g,n,L){var C=window.KDNJod,cards=C.deal(n),open=[],done=0,moves=0,left=L.secs;var grid=el('div','k3-grid'+(cards.length>12?' k3-g4':''));g.stage.appendChild(grid);
 function upd(){g.info(done+'/'+L.pairs+' जोड़ी · '+moves+' चाल'+(L.secs?' · ⏱️ '+left:''))}upd();
 if(L.secs)g.every(1000,function(){left--;upd();if(left<=0)g.end(false,'समय ख़त्म')});
 cards.forEach(function(c){var b=el('button','k3-card');b.type='button';b.setAttribute('aria-label','पत्ता');b.appendChild(el('span',null,c.t));b.addEventListener('click',function(){if(g.paused()||b.classList.contains('up')||open.length>=2)return;b.classList.add('up');open.push([c,b]);
  if(open.length===2){moves++;var a=open[0],z=open[1];if(C.match(a[0],z[0])){a[1].classList.add('ok');z[1].classList.add('ok');open=[];done++;upd();if(done===L.pairs)setTimeout(function(){g.end(true,moves+' चाल में')},400)}else setTimeout(function(){a[1].classList.remove('up');z[1].classList.remove('up');open=[];upd()},750)}});grid.appendChild(b)})}
function rush(g,n,L){var C=window.KDNRush,served=0,missed=0,tray=[],q=[],uid=0,menu=C.DISH.slice(0,L.dishes);
 var line=el('div','k3-line'),tb=el('div','k3-tray'),pad=el('div','k3-pad');g.stage.append(line,el('p','gu-note','👆 व्यंजन चुनो → संगत को छूकर परोसो'),tb,pad);
 function dish(id){return C.DISH.find(function(d){return d.id===id})}
 function upd(){g.info('🍽️ '+served+'/'+L.goal+' · 😔 '+missed+'/'+C.MISS);tb.textContent='🥘 थाली: '+(tray.length?tray.map(function(d){return dish(d).e}).join(' '):'ख़ाली');var c=btn('🧽 ख़ाली करो',function(){tray=[];upd()});tb.appendChild(c)}
 menu.forEach(function(d){pad.appendChild(btn(d.e+' '+d.n,function(){if(g.paused())return;if(!tray.includes(d.id)&&tray.length<3)tray.push(d.id);upd()},'k3-dish'))});
 function draw(){line.textContent='';q.forEach(function(p){var b=el('button','k3-guest');b.type='button';b.appendChild(el('span','k3-face','🙏'));b.appendChild(el('b',null,p.o.map(function(d){return dish(d).e}).join('')));var m=el('i','k3-pat');m.style.width=Math.max(0,100*p.w/L.wait)+'%';b.appendChild(m);
  b.addEventListener('click',function(){if(g.paused())return;if(C.fits(tray,p.o)){serve(p);tray=[];upd()}else{b.classList.add('k3-no');setTimeout(function(){b.classList.remove('k3-no')},300)}});line.appendChild(b)})}
 function serve(p){q=q.filter(function(x){return x!==p});served++;upd();draw();if(served>=L.goal)g.end(true,'सबको प्यार से परोसा 🙏')}
 function spawn(){if(q.length<5)q.push({id:uid++,o:C.order(n),w:L.wait});draw()}
 spawn();g.every(L.every,spawn);g.every(250,function(){q.forEach(function(p){p.w-=250});var gone=q.filter(function(p){return p.w<=0});if(gone.length){missed+=gone.length;q=q.filter(function(p){return p.w>0});upd();if(missed>C.MISS){g.end(false,'संगत ज़्यादा देर रुकी — साथ में फिर सेवा करें');return}}draw()});
 g.every(L.helper,function(){if(q.length){var p=q.slice().sort(function(a,b){return a.w-b.w})[0];serve(p);var t=el('p','k3-help','🙋 सेवादार साथी ने परोसा!');g.stage.appendChild(t);setTimeout(function(){t.remove()},1200)}});upd()}
function khoj(g,n,L){var C=window.KDNKhoj,qs=C.round(n),i=0,score=0,right=0,box=el('div','k3-q');g.stage.appendChild(box);
 function ask(){box.textContent='';if(i>=qs.length){var need=Math.ceil(qs.length/2)+(qs.length%2===0?1:0);g.end(right>=need,right+'/'+qs.length+' सही · ⭐ '+score+' अंक');return}var q=qs[i],shown=1,left=L.secs,lock=false;
  g.info('सवाल '+(i+1)+'/'+qs.length+' · ⭐ '+score);var cl=el('ul','k3-clues');box.appendChild(el('h3',null,'🗺️ यह जगह कौन-सी है?'));box.appendChild(cl);
  function showClues(){cl.textContent='';q.clues.slice(0,shown).forEach(function(c){cl.appendChild(el('li',null,'🔎 '+c))})}showClues();
  var more=btn('🔎 और संकेत',function(){if(shown<q.clues.length){shown++;showClues()}more.disabled=shown>=q.clues.length});more.disabled=shown>=q.clues.length;box.appendChild(more);
  var tm=el('p','k3-t');box.appendChild(tm);var h=null;if(L.secs){tm.textContent='⏱️ '+left;h=g.every(1000,function(){left--;tm.textContent='⏱️ '+left;if(left<=0)pick(null)})}
  var opts=el('div','k3-opts');q.opts.forEach(function(o){opts.appendChild(btn(o,function(){pick(o)}))});box.appendChild(opts);
  function pick(o){if(lock||g.paused())return;lock=true;if(h)clearInterval(h);var ok=o===q.ans;if(ok){right++;score+=C.pts(shown)}box.appendChild(el('p','gu-fb',(ok?'✅ सही! ':'📘 ')+q.ans+' — '+q.state));[].forEach.call(opts.querySelectorAll('button'),function(b){b.disabled=true});i++;setTimeout(ask,1300)}}ask()}
function init(){var b=document.getElementById('k3-main');if(!b)return;var id=b.dataset.game,C={jod:window.KDNJod,rush:window.KDNRush,khoj:window.KDNKhoj}[id];if(!C)return;var g=new Game(b,id,C,'khel3:'+id);g.run=function(n,L){({jod:jod,rush:rush,khoj:khoj})[id](g,n,L)};g.go()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();
