(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNShare=m;})(this,function(){'use strict';
// URL-encoded share (no server): JSON → UTF-8 → base64url in the #hash.
const MAX=6000;
function enc(o){const j=JSON.stringify(o);const b=typeof Buffer!=='undefined'?Buffer.from(j,'utf8').toString('base64'):btoa(String.fromCharCode.apply(null,new TextEncoder().encode(j)));return b.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function dec(s){try{s=String(s||'').replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const j=typeof Buffer!=='undefined'?Buffer.from(s,'base64').toString('utf8'):new TextDecoder().decode(Uint8Array.from(atob(s),c=>c.charCodeAt(0)));return JSON.parse(j);}catch(e){return null}}
return{enc,dec,MAX};});
