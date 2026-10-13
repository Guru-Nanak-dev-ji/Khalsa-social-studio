(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNBaaz=m;})(this,function(){'use strict';
// 🦅 बाज उड़ान — 2D canvas game. सिर्फ़ इसी phone का localStorage. Game koins only, असली पैसा नहीं.
const KEY='kdn-baaz-v1',BADGE='बाज उड़ान',GOAL=20;
const fresh=()=>({v:1,best:0,runs:0,badge:false});
function validate(s){if(!s||s.v!==1)return fresh();const n=x=>Number.isFinite(x)&&x>=0?Math.min(99999,Math.trunc(x)):0;return{v:1,best:n(s.best),runs:n(s.runs),badge:s.badge===true};}
// एक उड़ान खत्म: best/badge update. firstBadge=true सिर्फ़ पहली बार.
function finish(s,score){s=validate(s);score=Number.isFinite(score)&&score>0?Math.trunc(score):0;const firstBadge=!s.badge&&score>=GOAL;
 return{state:{...s,runs:s.runs+1,best:Math.max(s.best,score),badge:s.badge||score>=GOAL},newBest:score>s.best,firstBadge};}
// deterministic rng ताकि tests चल सकें
function rng(seed){let t=seed>>>0||1;return()=>{t+=0x6D2B79F5;let r=Math.imul(t^t>>>15,1|t);r^=r+Math.imul(r^r>>>7,61|r);return((r^r>>>14)>>>0)/4294967296;};}
const G=1400,FLAP=-430,SPEED=170,GAP=0.36,EVERY=1.55;
function newGame(seed,h){return{t:0,y:h*0.45,vy:0,h,score:0,over:false,next:0.9,cols:[],coins:[],r:rng(seed||7)};}
// x के units: px; falcon x fixed at 0.3*w (caller passes w)
function step(g,dt,flap,w){if(g.over)return g;dt=Math.min(dt,0.05);if(flap)g.vy=FLAP;g.vy+=G*dt;g.y+=g.vy*dt;g.t+=dt;
 const sp=SPEED+Math.min(120,g.score*4);g.next-=dt;
 if(g.next<=0){g.next=EVERY;const gap=g.h*GAP,top=g.h*0.12+g.r()*(g.h*0.76-gap);g.cols.push({x:w+40,top,gap,passed:false});if(g.r()<0.6)g.coins.push({x:w+40+sp*EVERY/2,y:g.h*0.2+g.r()*g.h*0.6,got:false});}
 const fx=w*0.3,R=16;
 for(const c of g.cols){c.x-=sp*dt;if(!c.passed&&c.x+30<fx){c.passed=true;g.score+=1;}
  if(fx+R>c.x-30&&fx-R<c.x+30&&(g.y-R<c.top||g.y+R>c.top+c.gap))g.over=true;}
 for(const k of g.coins){k.x-=sp*dt;if(!k.got&&Math.hypot(k.x-fx,k.y-g.y)<R+14){k.got=true;g.score+=2;}}
 g.cols=g.cols.filter(c=>c.x>-60);g.coins=g.coins.filter(k=>k.x>-30&&!k.got);
 if(g.y<R){g.y=R;if(g.vy<0)g.vy=0;}if(g.y>g.h-R)g.over=true;return g;}
return{KEY,BADGE,GOAL,fresh,validate,finish,rng,newGame,step};});
