(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNRush=m;})(this,function(){'use strict';
// 🍛 लंगर रश — cooperative time-management: you + a sevadar helper serve the sangat. Vegetarian only.
const KEY='kdn-rush-v1',BADGE='लंगर सेवादार';
const DISH=[{id:'dal',e:'🍲',n:'दाल'},{id:'roti',e:'🫓',n:'प्रशादा (रोटी)'},{id:'sabzi',e:'🥔',n:'सब्ज़ी'},{id:'kheer',e:'🍚',n:'खीर'},{id:'chaah',e:'☕',n:'चाह'},{id:'paani',e:'💧',n:'पानी'}];
// goal = plates to serve; every = ms between new sangat; wait = patience ms; dishes = menu size; helper = ms between sevadar helps
const LEVELS=[{goal:6,every:4200,wait:16000,dishes:3,helper:7000},{goal:9,every:3400,wait:14000,dishes:4,helper:8000},{goal:12,every:2800,wait:12000,dishes:5,helper:9000},{goal:15,every:2300,wait:11000,dishes:6,helper:10000}];
const MISS=3;
function order(lv,rnd){rnd=rnd||Math.random;const L=LEVELS[lv-1],n=1+(lv>=3&&rnd()<.5?1:0),m=DISH.slice(0,L.dishes),o=[];while(o.length<n){const d=m[Math.floor(rnd()*m.length)].id;if(!o.includes(d))o.push(d)}return o;}
function fits(tray,ord){return tray.length===ord.length&&ord.every(d=>tray.includes(d));}
const fresh=()=>({v:1,best:0,paid:false,badge:false});
function validate(s){if(!s||s.v!==1)return fresh();const best=Math.max(0,Math.min(LEVELS.length,Number(s.best)|0));return{v:1,best,paid:s.paid===true,badge:s.badge===true||best===LEVELS.length};}
function win(s,lv){s=validate(s);if(!(lv>=1&&lv<=LEVELS.length)||lv>s.best+1)return{state:s,payNow:false,badgeNew:false};const best=Math.max(s.best,lv),badge=best===LEVELS.length;return{state:{v:1,best,paid:true,badge:s.badge||badge},payNow:!s.paid,badgeNew:badge&&!s.badge};}
return{KEY,BADGE,DISH,LEVELS,MISS,order,fits,fresh,validate,win};});
