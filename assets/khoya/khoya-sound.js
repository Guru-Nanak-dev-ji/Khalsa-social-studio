(function(root,f){const m=f(root);if(typeof module==='object'&&module.exports)module.exports=m;else root.KLSound=m;})(this,function(root){'use strict';
// 🎵 My Kingdom Lands — सारा संगीत और आवाज़ें WebAudio से इसी phone पर बनती हैं (कोई audio file नहीं, कोई copyright नहीं).
// Default बंद; आप 🎵 छूएँ तभी शुरू (mobile autoplay नियम). पसंद localStorage में याद रहती है.
const PREF='kdn-khoya-sound-v1',SA=130.81;
// राग जैसा शांत स्वर-समूह (सा रे ग प ध) — Sa के अनुपात
const SCALE=[1,9/8,5/4,3/2,5/3,2,9/4,5/2];
const SFX={pickup:[[3,0,.1],[5,.06,.1],[7,.12,.22]],find:[[5,0,.18],[7,.08,.25]],wrong:[[-12,0,.25]],hint:[[4,0,.15],[6,.1,.15],[4,.2,.2]],open:[[0,0,.2],[2,.12,.2],[3,.24,.2],[5,.36,.5]],clear:[[0,0,.25],[3,.15,.25],[5,.3,.25],[7,.45,.7]]};
const parsePref=raw=>raw==='on';
const freq=i=>i<0?SA/2:SA*2*SCALE[i%SCALE.length]*(i>=SCALE.length?2:1);
let ctx=null,master=null,on=false,timer=null,drone=[];
function ensure(){if(ctx)return ctx;const A=root&&(root.AudioContext||root.webkitAudioContext);if(!A)return null;ctx=new A();master=ctx.createGain();master.gain.value=.0001;master.connect(ctx.destination);return ctx;}
function tone(f,t0,dur,type,vol){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(vol||.2,t0+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+dur+.4);o.connect(g);g.connect(master);o.start(t0);o.stop(t0+dur+.5);}
function startAmbient(){const t=ctx.currentTime,lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=700;lp.connect(master);
 [[SA/2,'sawtooth',.05],[SA*3/4,'triangle',.05],[SA,'triangle',.04]].forEach(([f,ty,v])=>{const o=ctx.createOscillator(),g=ctx.createGain(),l=ctx.createOscillator(),lg=ctx.createGain();o.type=ty;o.frequency.value=f;g.gain.value=v;l.frequency.value=.1+Math.random()*.1;lg.gain.value=v*.6;l.connect(lg);lg.connect(g.gain);o.connect(g);g.connect(lp);o.start(t);l.start(t);drone.push(o,l);});
 const bell=()=>{if(!on)return;const n=ctx.currentTime;tone(freq(Math.floor(Math.random()*SCALE.length)),n,1.6,'sine',.06);timer=setTimeout(bell,1800+Math.random()*2600);};bell();}
function set(v,store){on=!!v;if(store)try{store.setItem(PREF,on?'on':'off');}catch{}
 if(on){if(!ensure())return false;ctx.resume&&ctx.resume();master.gain.cancelScheduledValues(ctx.currentTime);master.gain.exponentialRampToValueAtTime(.9,ctx.currentTime+1.2);if(!drone.length)startAmbient();}
 else if(ctx){clearTimeout(timer);master.gain.cancelScheduledValues(ctx.currentTime);master.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.4);setTimeout(()=>{if(!on){drone.forEach(o=>{try{o.stop();}catch{}});drone=[];}},500);}
 return on;}
function sfx(name){if(!on||!ctx||!SFX[name])return;const t=ctx.currentTime;SFX[name].forEach(([i,dt,d])=>tone(freq(i),t+dt,d,name==='wrong'?'square':'triangle',name==='wrong'?.08:.22));}
return{PREF,SCALE,SFX,parsePref,freq,set,sfx,isOn:()=>on};});
