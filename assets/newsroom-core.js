(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KNNCore=m;})(this,function(){
'use strict';
const SIZES={portrait:{w:1080,h:1920},landscape:{w:1920,h:1080}};
function size(mode){return SIZES[mode]||SIZES.portrait;}
// Video tiles: anchor alone = full area; with guest = split (stacked in portrait, side-by-side in landscape).
function layout(mode,hasGuest){const s=size(mode);const top=mode==='portrait'?260:120,bottom=mode==='portrait'?420:260;const H=s.h-top-bottom,W=s.w;
  if(!hasGuest)return[{x:0,y:top,w:W,h:H,who:'anchor'}];
  if(mode==='portrait'){const h=Math.floor((H-12)/2);return[{x:0,y:top,w:W,h,who:'anchor'},{x:0,y:top+h+12,w:W,h,who:'guest'}];}
  const w=Math.floor((W-12)/2);return[{x:0,y:top,w,h:H,who:'anchor'},{x:w+12,y:top,w,h:H,who:'guest'}];}
// cover-fit source into tile
function cover(sw,sh,t){if(!sw||!sh)return null;const s=Math.max(t.w/sw,t.h/sh);const w=t.w/s,h=t.h/s;return{sx:(sw-w)/2,sy:(sh-h)/2,sw:w,sh:h};}
function roomId(rand){rand=rand||Math.random;const a='abcdefghjkmnpqrstuvwxyz23456789';let s='knn-';for(let i=0;i<8;i++)s+=a[Math.floor(rand()*a.length)];return s;}
function validRoom(id){return /^knn-[a-z0-9]{8}$/.test(String(id||''));}
function guestLink(base,id){const u=new URL(base);u.search='';u.hash='';u.searchParams.set('room',id);return u.toString();}
function tickerText(items){return items.map(s=>String(s).trim()).filter(Boolean).join('   ◆   ');}
function pickMime(isSupported){const c=['video/mp4;codecs=avc1,mp4a','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];for(const m of c)if(isSupported(m))return m;return'';}
function clock(d){const p=n=>String(n).padStart(2,'0');return p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds());}
return{SIZES,size,layout,cover,roomId,validRoom,guestLink,tickerText,pickMime,clock};});
