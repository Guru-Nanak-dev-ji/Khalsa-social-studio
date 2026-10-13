(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNSankalp=m;})(this,function(){'use strict';
// 🪔 आज का संकल्प — सुबह संकल्प, शाम ✅. 7 दिन लगातार = संकल्प दीप badge. सिर्फ़ इसी phone का localStorage.
const KEY='kdn-sankalp-v1',BADGE='संकल्प दीप',NEED=7,MAX=60;
const RX=/^\d{4}-\d\d-\d\d$/;
const dayKey=d=>{d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const dayNum=k=>{const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(k);return m?Math.floor(Date.UTC(+m[1],+m[2]-1,+m[3])/864e5):0;};
const fromNum=n=>new Date(n*864e5).toISOString().slice(0,10);
const clean=t=>String(t==null?'':t).replace(/[\u0000-\u001f<>]/g,'').replace(/\s+/g,' ').trim().slice(0,MAX);
const fresh=()=>({v:1,days:{},badge:false});
function validate(s){if(!s||s.v!==1||typeof s.days!=='object'||!s.days||Array.isArray(s.days))return fresh();const days={};
 Object.keys(s.days).filter(k=>RX.test(k)).sort().slice(-400).forEach(k=>{const d=s.days[k];const text=clean(d&&d.text);if(text)days[k]={text,done:d.done===true};});
 const out={v:1,days,badge:s.badge===true};if(best(out)>=NEED)out.badge=true;return out;}
function pledge(s,day,text){s=validate(s);text=clean(text);if(!RX.test(day)||!text)return{state:s,ok:false};const old=s.days[day];if(old&&old.done)return{state:s,ok:false};
 return{state:{...s,days:{...s.days,[day]:{text,done:false}}},ok:true};}
function complete(s,day){s=validate(s);const d=s.days[day];if(!d||d.done)return{state:s,firstToday:false,badgeNew:false};
 const ns={...s,days:{...s.days,[day]:{...d,done:true}}};const badgeNew=!s.badge&&streak(ns,day)>=NEED;if(badgeNew)ns.badge=true;return{state:ns,firstToday:true,badgeNew};}
// लगातार ✅ दिन — आज पूरा न हुआ हो तो कल से गिनो
function streak(s,today){s=s&&s.v===1?s:fresh();let n=dayNum(today),c=0;const ok=k=>s.days[k]&&s.days[k].done;if(!ok(fromNum(n)))n--;while(ok(fromNum(n))){c++;n--;}return c;}
function best(s){const ks=Object.keys(s.days).filter(k=>s.days[k].done).map(dayNum).sort((a,b)=>a-b);let b=0,c=0,p=null;for(const n of ks){c=p!==null&&n===p+1?c+1:1;b=Math.max(b,c);p=n;}return b;}
function week(s,today){s=validate(s);const n=dayNum(today),out=[];for(let i=6;i>=0;i--){const k=fromNum(n-i),d=s.days[k];out.push({day:k,status:d?(d.done?'done':'pledged'):'none',today:i===0});}return out;}
return{KEY,BADGE,NEED,MAX,dayKey,dayNum,fromNum,clean,fresh,validate,pledge,complete,streak,best,week};});
