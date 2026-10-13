// 3D तख़्त दरबार: pure CSS 3D (rotated divs), drag/touch to tilt. Original, no libraries.
(function(){'use strict';
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var W=document.getElementById('t3-world'),S=document.getElementById('t3-stage'),M=document.getElementById('t3-msg');
function el(c,parent,txt){var e=document.createElement(c==='i'?'i':'div');if(c!=='i')e.className=c;if(txt)e.textContent=txt;(parent||W).appendChild(e);return e;}
// box(w,h,d,x,y,z,color): 6 faces of a cuboid; y is up
function box(w,h,d,x,y,z,bg){var b=el('t3-box');b.style.transform='translate3d('+x+'px,'+(-y-h/2)+'px,'+z+'px)';
 [[w,h,'translateZ('+d/2+'px)'],[w,h,'rotateY(180deg) translateZ('+d/2+'px)'],[d,h,'rotateY(90deg) translateZ('+w/2+'px)'],[d,h,'rotateY(-90deg) translateZ('+w/2+'px)'],[w,d,'rotateX(90deg) translateZ('+h/2+'px)'],[w,d,'rotateX(-90deg) translateZ('+h/2+'px)']].forEach(function(f,i){var e=el('i',b);e.style.width=f[0]+'px';e.style.height=f[1]+'px';e.style.left=(-f[0]/2)+'px';e.style.top=(-f[1]/2)+'px';e.style.transform=f[2];if(bg)e.style.background=bg;if(i>3)e.style.filter='brightness(1.15)';});return b;}
el('t3-floor');el('t3-wall');el('t3-wall l');el('t3-wall r');el('t3-banner',null,'🏛️ सेवा का तख़्त');
box(220,14,160,0,0,0,'linear-gradient(#a8742a,#6e4514)');box(180,14,120,0,14,0,'linear-gradient(#f2c66a,#c08a34)');box(140,36,90,0,28,0,'linear-gradient(#7a1f1f,#4e1010)');
[[-100,-70],[100,-70],[-100,70],[100,70]].forEach(function(p){box(14,170,14,p[0],14,p[1]);});
box(240,12,180,0,184,0,'linear-gradient(#f2c66a,#a8742a)');box(120,30,90,0,196,0,'linear-gradient(#ffe39a,#c99a3e)');
var SP=[['🦅',-160,150,-120,'बाज़ ने पहरा दिया 🦅'],['🦅',160,150,-120,'दूसरा बाज़ भी आया 🦅🦅'],['👑',0,82,0,'ताज सेवक के लिए है, राजा के लिए नहीं 🙏'],['🪔',-150,20,130,'दीया जला — रोशनी सबकी 🪔'],['🪔',150,20,130,'दरबार जगमग ✨'],['♟️',-60,20,170,'प्यादा भी दरबार तक पहुँचा ♟️'],['🃏',60,20,170,'ताश का पत्ता: आज मीठा बोलो 😁'],['📚',0,20,-160,'ज्ञान ही असली दौलत 📚']];
var seen={};SP.forEach(function(s,i){var e=el('t3-sprite click',null,s[0]);e.setAttribute('role','button');e.tabIndex=0;e.setAttribute('aria-label',s[4]);e.dataset.base='translate3d('+s[1]+'px,'+(-s[2])+'px,'+s[3]+'px)';e.style.animationDelay=(-i*.5)+'s';
 var act=function(){M.textContent=s[4];seen[i]=1;var n=Object.keys(seen).length;if(n===SP.length)M.textContent='🎉 पूरा दरबार देख लिया! 😁';};e.addEventListener('click',act);e.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();act();}});});
var rx=-18,ry=25,drag=null,auto=!reduce;
function sprites(){[].forEach.call(W.querySelectorAll('.t3-sprite'),function(e){e.style.transform=e.dataset.base+' rotateY('+(-ry)+'deg) rotateX('+(-rx)+'deg)';});}
function set(){rx=Math.max(-60,Math.min(5,rx));W.style.setProperty('--rx',rx+'deg');W.style.setProperty('--ry',ry+'deg');sprites();}
S.addEventListener('pointerdown',function(e){if(e.target.classList.contains('click'))return;drag={x:e.clientX,y:e.clientY,rx:rx,ry:ry};auto=false;S.setPointerCapture(e.pointerId);});
S.addEventListener('pointermove',function(e){if(!drag)return;ry=drag.ry+(e.clientX-drag.x)*.4;rx=drag.rx-(e.clientY-drag.y)*.3;set();});
['pointerup','pointercancel'].forEach(function(t){S.addEventListener(t,function(){drag=null;});});
function turn(dx,dy){auto=false;ry+=dx;rx+=dy;set();}
document.getElementById('t3-l').onclick=function(){turn(-30,0);};document.getElementById('t3-r').onclick=function(){turn(30,0);};
document.getElementById('t3-u').onclick=function(){turn(0,-10);};document.getElementById('t3-d').onclick=function(){turn(0,10);};
document.getElementById('t3-a').onclick=function(){auto=!auto&&!reduce;};
document.addEventListener('keydown',function(e){if(e.target!==document.body&&e.target!==S)return;if(e.key==='ArrowLeft')turn(-15,0);if(e.key==='ArrowRight')turn(15,0);});
set();(function tick(){if(auto&&!document.hidden){ry+=.25;set();}requestAnimationFrame(tick);})();
})();
