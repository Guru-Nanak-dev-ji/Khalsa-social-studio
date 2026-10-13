(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNMala=m;})(this,function(){'use strict';
// 📿 सिमरन माला — 108 मनके, हर tap पर एक नाम. पूरी माला = दिन की गिनती. 7 अलग दिन माला पूरी = सिमरन साधक badge. सिर्फ़ इसी phone का localStorage.
const KEY='kdn-mala-v1',BADGE='सिमरन साधक',NEED=7,BEADS=108;
const NAAMS=[{id:'waheguru',text:'वाहेगुरु'},{id:'satnam',text:'सतनाम'},{id:'ram',text:'राम'},{id:'hari',text:'हरि'}];
const RX=/^\d{4}-\d\d-\d\d$/;
const dayKey=d=>{d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const dayNum=k=>{const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(k);return m?Math.floor(Date.UTC(+m[1],+m[2]-1,+m[3])/864e5):0;};
const fromNum=n=>new Date(n*864e5).toISOString().slice(0,10);
const int=(x,max)=>Number.isInteger(x)&&x>=0&&x<=max?x:0;
const fresh=()=>({v:1,naam:'waheguru',bead:0,days:{},badge:false});
function validate(s){if(!s||s.v!==1||typeof s.days!=='object'||!s.days||Array.isArray(s.days))return fresh();const days={};
 Object.keys(s.days).filter(k=>RX.test(k)).sort().slice(-400).forEach(k=>{const n=int(s.days[k],9999);if(n>0)days[k]=n;});
 const naam=NAAMS.some(n=>n.id===s.naam)?s.naam:'waheguru';
 const out={v:1,naam,bead:int(s.bead,BEADS-1),days,badge:s.badge===true};if(daysDone(out)>=NEED)out.badge=true;return out;}
const naamText=id=>(NAAMS.find(n=>n.id===id)||NAAMS[0]).text;
function setNaam(s,id){s=validate(s);return NAAMS.some(n=>n.id===id)?{...s,naam:id}:s;}
// एक मनका आगे. 108वें पर माला पूरी: गिनती शून्य, आज की माला +1
function tap(s,day){s=validate(s);if(!RX.test(day))return{state:s,full:false,firstToday:false,badgeNew:false};
 const b=s.bead+1;if(b<BEADS)return{state:{...s,bead:b},full:false,firstToday:false,badgeNew:false};
 const n=(s.days[day]||0)+1,ns={...s,bead:0,days:{...s.days,[day]:n}};const badgeNew=!s.badge&&daysDone(ns)>=NEED;if(badgeNew)ns.badge=true;
 return{state:ns,full:true,firstToday:n===1,badgeNew};}
const restart=s=>({...validate(s),bead:0});
const daysDone=s=>Object.keys(s.days).filter(k=>s.days[k]>0).length;
const total=s=>Object.values(s.days).reduce((a,b)=>a+b,0);
function week(s,today){s=validate(s);const n=dayNum(today),out=[];for(let i=6;i>=0;i--){const k=fromNum(n-i);out.push({day:k,malas:s.days[k]||0,today:i===0});}return out;}
return{KEY,BADGE,NEED,BEADS,NAAMS,dayKey,dayNum,fromNum,fresh,validate,naamText,setNaam,tap,restart,daysDone,total,week};});
