/* An additive view over the original stories. No storage, rewards or network writes. */
(function(){
'use strict';
const world=document.getElementById('kahani-world');
if(!world)return;
const viewport=document.getElementById('kw-viewport'),track=document.getElementById('kw-track');
const group=track.firstElementChild,copy=group.cloneNode(true);
copy.setAttribute('aria-hidden','true');track.appendChild(copy);
const pause=document.getElementById('kw-pause'),hud=document.querySelector('.kw-hud');
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
let offset=0,period=1,frame=0,last=0,manual=false,reading=false,visible=false,drag=null;
function wrap(value){return ((value%period)+period)%period;}
function paint(){track.style.transform='translate3d('+(-offset).toFixed(2)+'px,0,0)';}
function canMove(){return !manual&&!reading&&visible&&!document.hidden&&!reduce.matches&&!drag;}
function tick(time){
 frame=0;if(!canMove()){last=0;return;}
 if(last)offset=wrap(offset+Math.min(time-last,80)*.018);
 last=time;paint();frame=requestAnimationFrame(tick);
}
function sync(){
 if(frame){cancelAnimationFrame(frame);frame=0;}last=0;
 pause.disabled=reduce.matches;
 pause.setAttribute('aria-pressed',String(manual||reduce.matches));
 pause.textContent=reduce.matches?'स्थिर दृश्य':manual?'दृश्य चलाएँ':'दृश्य रोकें';
 if(canMove())frame=requestAnimationFrame(tick);
}
function measure(){
 const width=group.getBoundingClientRect().width;
 if(width>0){offset=offset/period*width;period=width;offset=wrap(offset);paint();}
 if(hud)document.body.style.setProperty('--kw-hud-height',Math.ceil(hud.getBoundingClientRect().height)+'px');
}
function checkVisible(){const box=viewport.getBoundingClientRect();visible=box.bottom>0&&box.top<window.innerHeight;sync();}
function followHash(){
 let target=null;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch(_e){/* Keep the original page usable for malformed links. */}
 reading=!!(target&&target.closest('.card'));
 if(target&&target.tagName==='DETAILS'){target.open=true;target.scrollIntoView({block:'start'});}
 sync();
}
function step(direction){manual=true;offset=wrap(offset+direction*260);paint();sync();}
pause.addEventListener('click',()=>{manual=!manual;sync();});
document.getElementById('kw-back').addEventListener('click',()=>step(-1));
document.getElementById('kw-forward').addEventListener('click',()=>step(1));
viewport.addEventListener('pointerdown',event=>{
 if(!event.isPrimary||event.button!==0)return;
 drag={id:event.pointerId,x:event.clientX,y:event.clientY,start:offset,active:false};sync();
});
viewport.addEventListener('pointermove',event=>{
 if(!drag||event.pointerId!==drag.id)return;
 const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
 if(!drag.active){
  if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>8){drag=null;sync();return;}
  if(Math.abs(dx)<8)return;
  drag.active=true;viewport.setPointerCapture(event.pointerId);
 }
 offset=wrap(drag.start-dx);paint();
});
function endDrag(event){
 if(!drag||event.pointerId!==drag.id)return;
 const id=drag.id;drag=null;
 if(viewport.hasPointerCapture(id))viewport.releasePointerCapture(id);
 sync();
}
// The window listener also releases a click that ends outside the scenery.
window.addEventListener('pointerup',endDrag);
window.addEventListener('pointercancel',endDrag);
viewport.addEventListener('lostpointercapture',endDrag);
window.addEventListener('blur',()=>{drag=null;sync();});
window.addEventListener('hashchange',followHash);
document.addEventListener('click',event=>{
 const link=event.target.closest?event.target.closest('a[href^="#"]'):null;
 if(link&&link.getAttribute('href')===location.hash)followHash();
});
document.addEventListener('visibilitychange',()=>{drag=null;sync();});
if(reduce.addEventListener)reduce.addEventListener('change',sync);
else reduce.addListener(sync);
if('IntersectionObserver' in window){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(viewport);}
else window.addEventListener('scroll',checkVisible,{passive:true});
if('ResizeObserver' in window){const observer=new ResizeObserver(measure);observer.observe(group);if(hud)observer.observe(hud);}
window.addEventListener('resize',()=>{measure();checkVisible();},{passive:true});
window.addEventListener('pagehide',()=>{if(frame)cancelAnimationFrame(frame);frame=0;last=0;drag=null;});
window.addEventListener('pageshow',()=>{measure();followHash();checkVisible();});
const rooms=document.getElementById('kw-old-rooms');
if(rooms&&window.KDNKingdomCore)window.KDNKingdomCore.rooms.forEach(room=>{
 const link=document.createElement('a');link.href='./'+room.path;link.textContent=room.name;rooms.appendChild(link);
});
document.querySelectorAll('section.card').forEach(section=>{
 const link=document.createElement('a');link.href='#kahani-world';link.className='kw-return';link.textContent='↑ मेहराबों और कहानियों पर लौटें';section.appendChild(link);
});
document.getElementById('kw-controls').hidden=false;
measure();followHash();checkVisible();
})();
