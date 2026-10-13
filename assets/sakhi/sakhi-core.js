(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNSakhi=m;})(this,function(){'use strict';
// 📖 आज की साखी — रोज़ एक साखी (तारीख़ से), 7 दिन सुनने पर badge. सिर्फ़ इसी phone का localStorage. Game koins only.
const KEY='kdn-sakhi-v1',BADGE='साखी श्रोता',NEED=7;
const dayKey=d=>{d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const dayNum=k=>{const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(k);return m?Math.floor(Date.UTC(+m[1],+m[2]-1,+m[3])/864e5):0;};
const indexFor=(day,n,off)=>{n=n||1;return(((dayNum(day)+(off|0))%n)+n)%n;};
const fresh=()=>({v:1,days:[],answered:[],badge:false});
function validate(s){if(!s||s.v!==1)return fresh();const ok=a=>Array.isArray(a)?a:[];
 const days=ok(s.days).filter((x,i,a)=>/^\d{4}-\d\d-\d\d$/.test(x)&&a.indexOf(x)===i).slice(-400);
 const answered=ok(s.answered).filter((x,i,a)=>typeof x==='string'&&/^[a-z0-9:-]{1,60}$/.test(x)&&a.indexOf(x)===i).slice(-300);
 return{v:1,days,answered,badge:s.badge===true||days.length>=NEED};}
function listen(s,day){s=validate(s);if(!/^\d{4}-\d\d-\d\d$/.test(day)||s.days.includes(day))return{state:s,firstToday:false,badgeNew:false};
 const days=[...s.days,day],badgeNew=!s.badge&&days.length>=NEED;return{state:{...s,days,badge:s.badge||badgeNew},firstToday:true,badgeNew};}
// हर सवाल का koins सिर्फ़ एक बार (साखी+सवाल)
function answer(s,id,qi){s=validate(s);const k=id+':'+qi;if(s.answered.includes(k))return{state:s,fresh:false};return{state:{...s,answered:[...s.answered,k]},fresh:true};}
function valid(item){return !!(item&&item.id&&item.title&&item.source&&item.seekh&&Array.isArray(item.lines)&&item.lines.length>=4&&item.lines.length<=6&&Array.isArray(item.quiz)&&item.quiz.length===2&&item.quiz.every(q=>q.q&&Array.isArray(q.o)&&q.o.length>=2&&q.a>=0&&q.a<q.o.length));}
return{KEY,BADGE,NEED,dayKey,dayNum,indexFor,fresh,validate,listen,answer,valid};});
