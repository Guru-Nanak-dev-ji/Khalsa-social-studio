'use strict';
// Living worlds v0.17: decorative background layer per page (data-world on this script).
(function(){
  var s=document.currentScript,world=(s&&s.dataset.world)||'gate',intro=s&&s.dataset.intro==='1';
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS='http://www.w3.org/2000/svg';
  function el(t,c,p){var e=document.createElement(t);if(c)e.className=c;(p||document.body).appendChild(e);return e;}
  function motes(bg,color,n,twinkle){
    if(reduce)return;var c=el('canvas','lw-canvas',bg),x=c.getContext('2d'),P=[],w,h;
    function size(){w=c.width=innerWidth;h=c.height=innerHeight;}size();addEventListener('resize',size);
    for(var i=0;i<n;i++)P.push({x:Math.random(),y:twinkle?Math.random()*.6+.2:Math.random(),r:Math.random()*1.8+.4,v:Math.random()*.0004+.0001,p:Math.random()*6});
    (function f(t){x.clearRect(0,0,w,h);P.forEach(function(q){
      if(!twinkle){q.y-=q.v;q.x+=Math.sin(t/3000+q.p)*.0002;if(q.y<0)q.y=1;}
      var a=twinkle?.35+.65*Math.abs(Math.sin(t/900+q.p*3)):.5+.4*Math.sin(t/1200+q.p);
      x.globalAlpha=a;x.fillStyle=color;x.beginPath();x.arc(q.x*w,q.y*h,q.r,0,7);x.fill();});
      if(!document.hidden||1)requestAnimationFrame(f);})(0);
  }
  function build(){
    document.documentElement.classList.add('lw');
    var bg=document.createElement('div');bg.className='lw-bg lw-'+world;bg.setAttribute('aria-hidden','true');
    document.body.insertBefore(bg,document.body.firstChild);
    el('div','lw-img',bg);
    if(world==='library'){
      el('div','lw-globe',bg);
      [[8,10],[82,14],[50,6]].forEach(function(p,i){var l=el('div','lw-lantern',bg);l.style.left=p[0]+'%';l.style.top=p[1]+'%';l.style.animationDelay=(i*.7)+'s';});
      motes(bg,'#ffe2a0',50,false);
    }else if(world==='city'){
      motes(bg,'#ffd27a',70,true);
      [[20,40],[70,35]].forEach(function(p){var l=el('div','lw-lantern',bg);l.style.left=p[0]+'%';l.style.top=p[1]+'%';});
      var b=document.createElementNS(NS,'svg');b.setAttribute('viewBox','0 0 70 34');b.setAttribute('class','lw-boat');
      b.innerHTML='<path d="M4 22h62l-9 9H13z" fill="#3a2410" stroke="#e9b85a" stroke-width="1.5"/><path d="M34 2v20M34 4l18 16H34z" fill="#f3d48a" stroke="#e9b85a"/><circle cx="20" cy="18" r="3" fill="#ffcf6a"/>';
      bg.appendChild(b);
    }else if(world==='sun'){
      var o=document.createElementNS(NS,'svg');o.setAttribute('viewBox','0 0 200 200');o.setAttribute('class','lw-orrery');
      o.innerHTML='<defs><radialGradient id="lwsun"><stop offset="0" stop-color="#fff4c0"/><stop offset=".5" stop-color="#ffb43a" stop-opacity=".8"/><stop offset="1" stop-color="#ff8a00" stop-opacity="0"/></radialGradient></defs>'+
        '<circle class="sun" cx="100" cy="100" r="34" fill="url(#lwsun)"/>'+
        '<g class="r"><circle cx="100" cy="100" r="52" fill="none" stroke="#f5c75a" stroke-width="1.2" stroke-dasharray="6 4"/><circle cx="152" cy="100" r="4" fill="#ffd77a"/></g>'+
        '<g class="r r2"><ellipse cx="100" cy="100" rx="74" ry="74" fill="none" stroke="#e8b04a" stroke-width="1"/><circle cx="100" cy="26" r="5" fill="#ffe39a"/></g>'+
        '<g class="r r3"><circle cx="100" cy="100" r="94" fill="none" stroke="#d9a03c" stroke-width="1.6" stroke-dasharray="2 6"/><circle cx="6" cy="100" r="3.5" fill="#ffd77a"/></g>';
      bg.appendChild(o);motes(bg,'#ffcf6a',30,false);
    }
    el('div','lw-scrim',bg);
    if(intro&&!sessionStorage.getItem('lw-gate')){
      var g=el('div','lw-intro');g.setAttribute('role','dialog');g.setAttribute('aria-label','महल का द्वार');
      el('div','lw-rays',g);el('div','lw-leaf l',g);el('div','lw-leaf r',g);
      var btn=el('button','lw-enter',g);btn.type='button';btn.textContent='🚪 द्वार खोलें';
      var go=function(){if(g.classList.contains('open'))return;sessionStorage.setItem('lw-gate','1');g.classList.add('open');
        setTimeout(function(){g.classList.add('gone');setTimeout(function(){g.remove();},800);},reduce?200:1700);};
      g.addEventListener('click',go);document.addEventListener('keydown',function k(e){if(e.key==='Enter'||e.key==='Escape'){go();document.removeEventListener('keydown',k);}});
      btn.focus();
    }
  }
  if(document.body)build();else document.addEventListener('DOMContentLoaded',build);
})();
