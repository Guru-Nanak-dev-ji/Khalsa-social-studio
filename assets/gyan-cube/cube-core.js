(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNGurCube=m;})(this,function(){'use strict';
// ੳ ਅ ੲ ਸ ਹ ਕ — Gurmukhi cube puzzle. Front face math for CSS rotateX(rx) rotateY(ry).
const FACES=[{l:'ੳ',n:'ਊੜਾ',v:[0,0,1],t:'translateZ(var(--h))'},{l:'ਅ',n:'ਐੜਾ',v:[1,0,0],t:'rotateY(90deg) translateZ(var(--h))'},{l:'ੲ',n:'ਈੜੀ',v:[0,0,-1],t:'rotateY(180deg) translateZ(var(--h))'},
 {l:'ਸ',n:'ਸੱਸਾ',v:[-1,0,0],t:'rotateY(-90deg) translateZ(var(--h))'},{l:'ਹ',n:'ਹਾਹਾ',v:[0,-1,0],t:'rotateX(90deg) translateZ(var(--h))'},{l:'ਕ',n:'ਕੱਕਾ',v:[0,1,0],t:'rotateX(-90deg) translateZ(var(--h))'}];
const ORDER=[0,1,2,3,4,5],SPOT='gyan:cube';
const r=d=>d*Math.PI/180;
function rot(v,rx,ry){let[x,y,z]=v;const cy=Math.cos(r(ry)),sy=Math.sin(r(ry));[x,z]=[x*cy+z*sy,-x*sy+z*cy];const cx=Math.cos(r(rx)),sx=Math.sin(r(rx));[y,z]=[y*cx-z*sx,y*sx+z*cx];return[x,y,z];}
function front(rx,ry){let b=0,bz=-2;FACES.forEach((f,i)=>{const z=rot(f.v,rx,ry)[2];if(z>bz){bz=z;b=i;}});return b;}
function fresh(){return{step:0,done:false};}
function tap(s,face){if(s.done)return{state:s,ok:false,solved:false};if(face!==ORDER[s.step])return{state:{step:0,done:false},ok:false,solved:false};
 const step=s.step+1,done=step===ORDER.length;return{state:{step,done},ok:true,solved:done};}
return{FACES,ORDER,SPOT,front,fresh,tap};});
