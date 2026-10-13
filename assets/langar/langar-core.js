(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNLangar=m;})(this,function(){'use strict';
// किरत करो, वंड छको — लंगर रसोई seva game. सिर्फ़ game koins, असली पैसा नहीं.
const KEY='kdn-langar-v1',BADGE='लंगर सेवादार';
const STEPS=[
 {id:'aata',icon:'🌾',name:'आटा गूँधो',verb:'गूँधो',taps:6,done:'आटा तैयार'},
 {id:'roti',icon:'🫓',name:'रोटी सेको',verb:'पलटो',taps:8,done:'गरम रोटियाँ तैयार'},
 {id:'dal',icon:'🍲',name:'दाल पकाओ',verb:'चलाओ',taps:7,done:'दाल पक गई'},
 {id:'kheer',icon:'🥣',name:'खीर बनाओ',verb:'चलाओ',taps:5,done:'मीठी खीर तैयार'},
 {id:'pangat',icon:'🙏',name:'पंगत में परोसो',verb:'परोसो',taps:8,done:'सारी संगत ने छक लिया'},
 {id:'bartan',icon:'🧽',name:'बर्तन धोओ',verb:'धोओ',taps:6,done:'बर्तन चमक गए'}];
const fresh=()=>({v:1,step:0,taps:0,done:[],rounds:0,badge:false});
function validate(s){if(!s||s.v!==1)return fresh();const ids=STEPS.map(x=>x.id);const n=x=>Number.isFinite(x)&&x>=0?Math.trunc(x):0;
 const done=[...new Set(Array.isArray(s.done)?s.done:[])].filter(x=>ids.includes(x));const step=Math.min(n(s.step),STEPS.length-1);
 return{v:1,step,taps:Math.min(n(s.taps),STEPS[step].taps),done,rounds:n(s.rounds),badge:done.length===STEPS.length};}
// एक tap: अगर step पूरा हुआ तो stepDone, अगर आख़िरी step तो roundDone
function tap(s){s=validate(s);const st=STEPS[s.step];const taps=s.taps+1;
 if(taps<st.taps)return{state:{...s,taps},stepDone:null,firstTime:false,roundDone:false,badgeNew:false};
 const firstTime=!s.done.includes(st.id);const done=firstTime?[...s.done,st.id]:s.done;const last=s.step===STEPS.length-1;
 const badge=done.length===STEPS.length;
 return{state:{v:1,step:last?0:s.step+1,taps:0,done,rounds:s.rounds+(last?1:0),badge},stepDone:st,firstTime,roundDone:last,badgeNew:badge&&!s.badge};}
return{KEY,BADGE,STEPS,fresh,validate,tap};});
