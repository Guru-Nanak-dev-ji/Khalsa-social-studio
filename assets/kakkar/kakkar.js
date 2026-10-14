(function(){'use strict';var C=window.KDNKakkar;function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function load(){try{return C.validate(JSON.parse(localStorage.getItem(C.KEY)))}catch(e){return C.fresh()}}
function koins(id){var K=window.KDNKoins;if(!K)return 0;try{var s=K.validate(JSON.parse(localStorage.getItem(K.KEY)||'null')),r=K.claimSpot(s,id);localStorage.setItem(K.KEY,JSON.stringify(r.state));return r.added}catch(e){return 0}}
function hub(box){box.textContent='';var st=load();
  var intro=el('section','gu-box');intro.appendChild(el('h2',null,'📜 संक्षिप्त परिचय'));intro.appendChild(el('p',null,C.INTRO));intro.appendChild(el('p','gu-note',C.NOTE));box.appendChild(intro);
  box.appendChild(el('p','gu-prog','🛡️ '+st.done.length+' / 5 quiz पूरे'+(st.badge?' · 🏅 '+C.BADGE:'')));
  var g=el('div','gu-grid');
  C.K.forEach(function(x){var a=el('button','gu-card'+(st.done.includes(x.n)?' done':''));a.type='button';a.setAttribute('aria-label',x.name);
    a.appendChild(el('span','gu-num',String(x.n)));a.appendChild(el('span','gu-m',x.m));a.appendChild(el('b',null,x.name));
    a.appendChild(el('small',null,x.en));if(st.done.includes(x.n))a.appendChild(el('i',null,'✅'));
    a.onclick=function(){location.hash=String(x.n)};g.appendChild(a)});
  box.appendChild(g);box.appendChild(el('p','gu-src',C.SRC));}
function page(box,n){var x=C.K[n-1];if(!x){hub(box);return;}box.textContent='';
  var top=el('section','gu-top');top.appendChild(el('div','gu-medal',x.m));top.appendChild(el('p','gu-num2','कक्कार '+n+' / 5'));
  top.appendChild(el('h1',null,x.m+' '+x.name));var pa=el('p','gu-pa',x.pa+' · '+x.en);pa.lang='pa';top.appendChild(pa);box.appendChild(top);
  var m=el('section','gu-box');m.appendChild(el('h2',null,'📖 मतलब'));m.appendChild(el('p',null,x.mean));box.appendChild(m);
  var w=el('section','gu-box');w.appendChild(el('h2',null,'🌟 क्यों ज़रूरी'));w.appendChild(el('p',null,x.why));box.appendChild(w);
  var t=el('section','gu-box');t.appendChild(el('h2',null,'🙏 सम्मान की सीख'));t.appendChild(el('p',null,x.tip));box.appendChild(t);
  var z=el('section','gu-box');z.appendChild(el('h2',null,'❓ छोटा quiz (+5 koins)'));var right=0,i=0,qb=el('div');z.appendChild(qb);box.appendChild(z);
  (function ask(){qb.textContent='';if(i>=x.quiz.length){var r=C.finish(load(),n,right,x.quiz.length);try{localStorage.setItem(C.KEY,JSON.stringify(r.state))}catch(e){}
    qb.appendChild(el('p','gu-end','🏁 '+right+' / '+x.quiz.length+' सही'+(right>=2?' 🙏':' — फिर से कोशिश करो')));
    if(r.isNew){var k=koins('kakkar:'+n);qb.appendChild(el('p','gu-end','💰 +'+(k||5)+' koins'))}
    if(r.badgeNew)qb.appendChild(el('p','gu-end','🏅 badge मिला: '+C.BADGE));
    if(right<2){var a=el('button','gu-b','🔁 फिर से');a.type='button';a.onclick=function(){i=0;right=0;ask()};qb.appendChild(a)}return}
   var q=x.quiz[i];qb.appendChild(el('p','gu-q',(i+1)+'. '+q[0]));q[1].map(function(o,j){return[o,j]}).sort(function(){return Math.random()-.5}).forEach(function(o){
    var b=el('button','gu-b',o[0]);b.type='button';b.onclick=function(){if(o[1]===q[2])right++;qb.appendChild(el('p','gu-fb',o[1]===q[2]?'✅ सही':'📘 सही उत्तर: '+q[1][q[2]]));[].forEach.call(qb.querySelectorAll('button'),function(y){y.disabled=true});i++;setTimeout(ask,900)};qb.appendChild(b)})})();
  var pn=el('nav','gu-pn');var back=el('a','gu-b','🛡️ सब कक्कार');back.href='#';pn.appendChild(back);
  if(n>1){var a1=el('a','gu-b','◀ '+(n-1));a1.href='#'+(n-1);pn.appendChild(a1)}
  if(n<5){var a2=el('a','gu-b',(n+1)+' ▶');a2.href='#'+(n+1);pn.appendChild(a2)}
  box.appendChild(pn);box.appendChild(el('p','gu-src',C.SRC));}
function route(){var b=document.getElementById('kk-main');if(!C||!b)return;var n=parseInt((location.hash||'').replace('#',''),10);if(n>=1&&n<=5)page(b,n);else hub(b)}
function init(){route();window.addEventListener('hashchange',route)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();
