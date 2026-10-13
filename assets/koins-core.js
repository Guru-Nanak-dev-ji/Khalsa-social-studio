(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNKoins=m;})(this,function(){'use strict';
// Door Palace अंक + koins. Game koins only — असली पैसा नहीं.
// Values reused from existing game logic: hidden spot = kingdom-core gift amount (5); quiz +10 / −3 = world-core scoring.
const KEY='kdn-door-koins-v1',WELCOME=125000,SPOT=5,QUIZ_RIGHT=10,QUIZ_WRONG=-3,MAX_SPOTS=200;
const fresh=()=>({version:1,welcome:0,earned:0,score:0,spots:[]});
function validate(v){if(!v||v.version!==1)return fresh();const n=x=>Number.isFinite(x)?Math.trunc(x):0;
 return{version:1,welcome:v.welcome===WELCOME?WELCOME:0,earned:Math.max(0,n(v.earned)),score:n(v.score),spots:Array.isArray(v.spots)?v.spots.filter(s=>typeof s==='string'&&/^[a-z0-9/_:-]{1,60}$/.test(s)).slice(0,MAX_SPOTS):[]};}
function grantWelcome(s){s=validate(s);if(s.welcome)return{state:s,added:0};return{state:{...s,welcome:WELCOME},added:WELCOME};}
function claimSpot(s,id){s=validate(s);if(!/^[a-z0-9/_:-]{1,60}$/.test(id)||s.spots.includes(id)||s.spots.length>=MAX_SPOTS)return{state:s,added:0};return{state:{...s,earned:s.earned+SPOT,spots:[...s.spots,id]},added:SPOT};}
function quiz(s,right){s=validate(s);const d=right?QUIZ_RIGHT:QUIZ_WRONG;return{state:{...s,score:s.score+d},added:d};}
function total(s){s=validate(s);return s.welcome+s.earned;}
function fmt(n){return Number(n).toLocaleString('en-IN');}
function spotsFor(path){const base=(path.join('/')||'root');return[0,1].map(i=>base+':'+i);}
return{KEY,WELCOME,SPOT,QUIZ_RIGHT,QUIZ_WRONG,fresh,validate,grantWelcome,claimSpot,quiz,total,fmt,spotsFor};});
