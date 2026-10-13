(function(){'use strict';
function load(V){try{return V.validate(JSON.parse(localStorage.getItem(V.KEY)))}catch(e){return V.fresh()}}
function bonus(id){var K=window.KDNKoins;if(!K)return 0;try{var ks=K.validate(JSON.parse(localStorage.getItem(K.KEY)||'null')),r=K.claimSpot(ks,id);localStorage.setItem(K.KEY,JSON.stringify(r.state));return r.added}catch(e){return 0}}
function init(){var V=window.KDNVirsa,root=document.getElementById('virsa-artists');if(!V||!root)return;var st=load(V),msg=document.getElementById('virsa-badge');
 function show(){msg.textContent=st.badge?'🏅 '+V.BADGE+' — badge मिला!':'🎧 '+st.played.length+' / '+V.NEED+' गीत सुने · badge: '+V.BADGE}
 V.ARTISTS.forEach(function(a){var s=document.createElement('section');s.className='vr-artist';s.id='virsa-'+a.id;
  var h=document.createElement('h2');h.textContent=a.icon+' '+a.name;var g=document.createElement('span');g.lang='pa';g.className='vr-pa';g.textContent=' · '+a.pa;h.appendChild(g);
  var p=document.createElement('p');p.className='vr-sub';p.textContent=a.sub;var row=document.createElement('div');row.className='kp-row vr-row';
  a.songs.filter(V.valid).forEach(function(v){var b=document.createElement('button');b.type='button';b.className='kp-card';b.setAttribute('aria-label','▶ '+v.t+' — '+a.name);
   b.innerHTML='<span class="kp-thumb vr-thumb"><span class="kp-e"></span><span class="kp-play">▶</span></span><span class="kp-t"></span><span class="kp-ch"></span>';
   b.querySelector('.kp-e').textContent=v.e;b.querySelector('.kp-t').textContent=v.t;b.querySelector('.kp-ch').textContent='📺 '+v.by;
   b.onclick=function(){var f=document.createElement('iframe');f.src=V.PLATFORMS[v.p].embed(v.id);f.title=v.t;f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;f.referrerPolicy='strict-origin-when-cross-origin';var w=document.createElement('div');w.className='kp-card kp-live';w.appendChild(f);b.replaceWith(w);
    var r=V.play(st,v.id);st=r.state;try{localStorage.setItem(V.KEY,JSON.stringify(st))}catch(e){}show();if(r.badgeNew)bonus('virsa:badge')};
   row.appendChild(b)});
  var nav=document.createElement('div');nav.className='kp-nav';[['◀',-1],['▶',1]].forEach(function(x){var n=document.createElement('button');n.type='button';n.textContent=x[0];n.onclick=function(){row.scrollBy({left:x[1]*row.clientWidth*.8,behavior:'smooth'})};nav.appendChild(n)});
  var m=document.createElement('a');m.className='kp-all';m.href=V.PLATFORMS.yt.search(a.more);m.target='_blank';m.rel='noopener';m.textContent='और गीत ↗ ('+a.name+')';nav.appendChild(m);
  s.append(h,p,row,nav);root.appendChild(s)});
 show();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();
