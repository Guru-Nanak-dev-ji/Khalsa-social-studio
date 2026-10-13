(function(){'use strict';
function init(){var K=window.KDNKapil,box=document.getElementById('kapil-slider');if(!K||!box)return;
 K.VIDEOS.filter(K.valid).forEach(function(v){var b=document.createElement('button');b.type='button';b.className='kp-card';b.setAttribute('aria-label','▶ '+v.t+' — '+K.CH[v.ch].name);
  b.innerHTML='<span class="kp-thumb"><span class="kp-e">'+v.e+'</span><span class="kp-play">▶</span></span><span class="kp-t"></span><span class="kp-ch"></span>';
  b.querySelector('.kp-t').textContent=v.t;b.querySelector('.kp-ch').textContent='📺 '+K.CH[v.ch].name;
  b.onclick=function(){var f=document.createElement('iframe');f.src=K.embed(v.id);f.title=v.t;f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;f.loading='lazy';f.referrerPolicy='strict-origin-when-cross-origin';var w=document.createElement('div');w.className='kp-card kp-live';w.appendChild(f);b.replaceWith(w)};
  box.appendChild(b)});
 document.querySelectorAll('[data-kp-go]').forEach(function(a){a.onclick=function(){box.scrollBy({left:(+a.dataset.kpGo)*box.clientWidth*.8,behavior:'smooth'})}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();
