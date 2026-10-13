/* KDN i18n — Hindi is the source; pa/en overlay via dictionary. Additive, story bodies untouched. */
(function(){
  'use strict';
  var KEY='kdn-lang-v1',LANGS=[['hi','🧡 हिंदी'],['pa','🎯 ਪੰਜਾਬੀ'],['en','✅ English']];
  var base=(document.currentScript&&document.currentScript.src)||'./assets/i18n/i18n.js';
  base=base.replace(/i18n\.js(\?.*)?$/,'');
  var orig=new WeakMap(),dict={},cur='hi',obs=null,busy=false;
  function get(){try{var v=localStorage.getItem(KEY);return v==='pa'||v==='en'?v:'hi'}catch(e){return 'hi'}}
  function skip(n){var e=n.parentElement;return !e||e.closest('script,style,textarea,input,[data-i18n-skip],article,.story,.kdn-lang')}
  function walk(fn){var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),n;while((n=w.nextNode()))if(!skip(n))fn(n)}
  function apply(){
    if(!document.body)return;busy=true;
    var t=(dict[cur]&&dict[cur].t)||{};
    walk(function(n){
      var src=orig.has(n)?orig.get(n):n.textContent,k=src.trim();
      if(cur==='hi'){if(orig.has(n)){n.textContent=src;orig.delete(n)}return}
      if(k&&t[k]){if(!orig.has(n))orig.set(n,src);var out=src.replace(k,t[k]);if(n.textContent!==out)n.textContent=out}
    });
    var note=document.querySelector('.kdn-lang-note');
    if(cur!=='hi'&&dict[cur]&&/kahani|funnybook/.test(location.pathname)){
      if(!note){note=document.createElement('p');note.className='kdn-lang-note';var h=document.querySelector('h1');(h&&h.parentNode?h.parentNode:document.body).insertBefore(note,h?h.nextSibling:document.body.firstChild)}
      note.textContent='📖 '+dict[cur]._note;
    }else if(note)note.remove();
    busy=false;
  }
  function load(l){
    if(l==='hi'||dict[l])return Promise.resolve();
    return fetch(base+l+'.json').then(function(r){return r.json()}).then(function(j){dict[l]=j}).catch(function(){});
  }
  function set(l){
    cur=l;try{localStorage.setItem(KEY,l)}catch(e){}
    document.documentElement.lang=l;
    var p=document.querySelector('.kdn-lang');
    if(p)p.querySelectorAll('button').forEach(function(b){var on=b.dataset.l===l;b.setAttribute('aria-pressed',on);b.textContent=(on?'🔘 ':'')+b.dataset.label});
    return load(l).then(apply);
  }
  function pill(){
    var d=document.createElement('div');d.className='kdn-lang';d.setAttribute('role','group');d.setAttribute('aria-label','भाषा / ਭਾਸ਼ਾ / Language');
    LANGS.forEach(function(x){var b=document.createElement('button');b.type='button';b.dataset.l=x[0];b.dataset.label=x[1];b.lang=x[0];b.textContent=x[1];b.onclick=function(){set(x[0])};d.appendChild(b)});
    document.body.appendChild(d);
  }
  function init(){
    pill();set(get());
    var tm;obs=new MutationObserver(function(){if(busy||cur==='hi')return;clearTimeout(tm);tm=setTimeout(apply,120)});
    obs.observe(document.body,{childList:true,subtree:true,characterData:true});
  }
  window.KDNLang={set:set,get:function(){return cur},langs:LANGS.map(function(x){return x[0]})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
