(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNAkarshan=m;})(this,function(){'use strict';
// 🧲 आकर्षण का नियम — रोज़ एक भावना (सकारात्मक, वर्तमान काल), 3 कदम: सोचो · महसूस करो (3 शुक्राने) · करो. 7 अलग दिन पूरे = आकर्षण साधक. सिर्फ़ इसी phone का localStorage.
const KEY='kdn-akarshan-v1',BADGE='आकर्षण साधक',NEED=7,MAXLEN=120;
const RX=/^\d{4}-\d\d-\d\d$/;
const VALUES=[{id:'kirat',icon:'⚒️',title:'किरत करो',hint:'आज मेहनत का एक छोटा कदम'},{id:'vand',icon:'🍲',title:'वंड छको',hint:'आज किसी से कुछ बाँटो'},{id:'naam',icon:'🙏',title:'नाम जपो',hint:'आज 5 मिनट शांत याद'}];
const EXAMPLES=['मैं शांत और मज़बूत हूँ।','मैं हर दिन थोड़ा बेहतर बन रहा हूँ।','मेरे घर में प्यार और सुकून है।','मैं ईमानदारी से मेहनत करता हूँ और बरकत आ रही है।','मैं सबके साथ मीठा बोलता हूँ।'];
const clean=(s,n)=>String(s==null?'':s).replace(/[<>]/g,'').replace(/\s+/g,' ').trim().slice(0,n||MAXLEN);
const dayKey=d=>{d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const dayNum=k=>{const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(k);return m?Math.floor(Date.UTC(+m[1],+m[2]-1,+m[3])/864e5):0;};
const fromNum=n=>new Date(n*864e5).toISOString().slice(0,10);
// नकारात्मक शब्द पहचानो ताकि सकारात्मक रूप सुझा सकें (सिर्फ़ सलाह, रोक नहीं)
const NEG=/(नहीं|मत |कभी न|डर|बीमार|गरीब|हार)/;
const isNegative=t=>NEG.test(clean(t));
const fresh=()=>({v:1,days:{},badge:false});
function vDay(d){d=d||{};const g=(Array.isArray(d.grat)?d.grat:[]).map(x=>clean(x,60)).filter(Boolean).slice(0,3);
 return{intent:clean(d.intent),attracted:d.attracted===true,think:d.think===true,grat:g,act:VALUES.some(v=>v.id===d.act)?d.act:'',actDone:d.actDone===true};}
function validate(s){if(!s||s.v!==1||!s.days||typeof s.days!=='object'||Array.isArray(s.days))return fresh();
 const days={};Object.keys(s.days).filter(k=>RX.test(k)).sort().slice(-400).forEach(k=>{days[k]=vDay(s.days[k]);});
 const st={v:1,days,badge:false};st.badge=s.badge===true||count(st)>=NEED;return st;}
const complete=d=>!!(d&&d.intent&&d.attracted&&d.think&&d.grat.length>=3&&d.act&&d.actDone);
function count(s){return Object.values(s.days).filter(complete).length;}
const get=(s,day)=>s.days[day]||vDay();
function put(s,day,patch){if(!RX.test(day))return{state:s,completeNew:false,badgeNew:false};
 const before=complete(s.days[day]),d=vDay({...get(s,day),...patch}),days={...s.days,[day]:d},n={v:1,days,badge:s.badge};
 const completeNew=!before&&complete(d),badgeNew=!s.badge&&count(n)>=NEED;n.badge=s.badge||badgeNew;return{state:n,completeNew,badgeNew};}
function attract(s,day,text){const t=clean(text);if(!t)return{state:s,ok:false};return{...put(s,day,{intent:t,attracted:true}),ok:true};}
const think=(s,day)=>put(s,day,{think:true});
const gratitude=(s,day,list)=>put(s,day,{grat:list});
const chooseAct=(s,day,id)=>put(s,day,{act:id});
const doAct=(s,day)=>get(s,day).act?put(s,day,{actDone:true}):{state:s,completeNew:false,badgeNew:false};
// लगातार दिन (आज या कल तक)
function streak(s,today){let n=dayNum(today),c=0;if(!complete(s.days[fromNum(n)]))n--;while(complete(s.days[fromNum(n)])){c++;n--;}return c;}
function week(s,today){const n=dayNum(today),out=[];for(let i=6;i>=0;i--){const k=fromNum(n-i);out.push({day:k,done:complete(s.days[k]),started:!!(s.days[k]&&s.days[k].attracted),today:i===0});}return out;}
return{KEY,BADGE,NEED,MAXLEN,VALUES,EXAMPLES,clean,dayKey,dayNum,fromNum,isNegative,fresh,validate,complete,count,get,attract,think,gratitude,chooseAct,doAct,streak,week};});
