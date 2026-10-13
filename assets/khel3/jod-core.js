(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNJod=m;})(this,function(){'use strict';
// 🔤 शब्द जोड़ — memory: Gurmukhi letter/word ↔ Hindi. Only alphabet + everyday words; no Gurbani lines are used as game pieces.
const KEY='kdn-jod-v1',BADGE='अक्खर साथी';
const AKH=[['ਕ','क'],['ਖ','ख'],['ਗ','ग'],['ਘ','घ'],['ਚ','च'],['ਛ','छ'],['ਜ','ज'],['ਝ','झ'],['ਟ','ट'],['ਠ','ठ'],['ਡ','ड'],['ਤ','त'],['ਥ','थ'],['ਦ','द'],['ਧ','ध'],['ਨ','न'],['ਪ','प'],['ਫ','फ'],['ਬ','ब'],['ਭ','भ'],['ਮ','म'],['ਯ','य'],['ਰ','र'],['ਲ','ल'],['ਵ','व'],['ਸ','स'],['ਹ','ह']];
const SHABAD=[['ਪਾਣੀ','पानी'],['ਰੋਟੀ','रोटी'],['ਘਰ','घर'],['ਸੇਵਾ','सेवा'],['ਲੰਗਰ','लंगर'],['ਕਿਤਾਬ','किताब'],['ਦੋਸਤ','दोस्त'],['ਸੂਰਜ','सूरज'],['ਪਿਆਰ','प्यार'],['ਪਿੰਡ','पिंड (गाँव)'],['ਖੇਤ','खेत'],['ਦੁੱਧ','दूध']];
const LEVELS=[{n:'4 अक्खर',pool:'akh',pairs:4,secs:0},{n:'6 अक्खर',pool:'akh',pairs:6,secs:0},{n:'6 शब्द',pool:'shabad',pairs:6,secs:0},{n:'8 शब्द · 90 सेकंड',pool:'shabad',pairs:8,secs:90}];
function deal(lv,rnd){rnd=rnd||Math.random;const L=LEVELS[lv-1],src=(L.pool==='akh'?AKH:SHABAD).slice().sort(()=>rnd()-.5).slice(0,L.pairs);const cards=[];src.forEach((p,i)=>{cards.push({k:i,t:p[0],g:true},{k:i,t:p[1],g:false})});return cards.sort(()=>rnd()-.5);}
const match=(a,b)=>a.k===b.k&&a.g!==b.g;
const fresh=()=>({v:1,best:0,paid:false,badge:false});
function validate(s){if(!s||s.v!==1)return fresh();const best=Math.max(0,Math.min(LEVELS.length,Number(s.best)|0));return{v:1,best,paid:s.paid===true,badge:s.badge===true||best===LEVELS.length};}
function win(s,lv){s=validate(s);if(!(lv>=1&&lv<=LEVELS.length)||lv>s.best+1)return{state:s,payNow:false,badgeNew:false};const best=Math.max(s.best,lv),badge=best===LEVELS.length;return{state:{v:1,best,paid:true,badge:s.badge||badge},payNow:!s.paid,badgeNew:badge&&!s.badge};}
return{KEY,BADGE,AKH,SHABAD,LEVELS,deal,match,fresh,validate,win};});
