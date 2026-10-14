(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNDasvandh=m;})(this,function(){'use strict';
// 🪙 दसवंध — a private, voluntary sharing planner. Data stays on this phone (localStorage). No payments, no donation links, no organisation recommended.
const KEY='kdn-dasvandh-v1',BADGE='दसवंधी',PART=0.1;
const BANI={line:'घालि खाइ किछु हथहु देइ ॥ नानक राहु पछाणहि सेइ',gurmukhi:'ਘਾਲਿ ਖਾਇ ਕਿਛੁ ਹਥਹੁ ਦੇਇ ॥ ਨਾਨਕ ਰਾਹੁ ਪਛਾਣਹਿ ਸੇਇ',meaning:'जो मेहनत से कमाकर खाता है और अपने हाथ से कुछ बाँटता है, वही सही रास्ता पहचानता है।',ang:1245,raag:'सारंग की वार',writer:'गुरु नानक देव जी',source:'गुरु नानक देव जी, Ang 1245',src:'BaniDB (api.banidb.com) · verse 53371–53372 · shabad 4480'};
const NOTE='दसवंध पूरी तरह आपकी अपनी, स्वेच्छा की बात है — कोई ज़बरदस्ती नहीं, कोई तय रकम नहीं। यह पेज न पैसा लेता है, न किसी संस्था की सिफ़ारिश करता है। सारा हिसाब सिर्फ़ इसी फ़ोन में रहता है। पैसा न हो तो समय (सेवा के घंटे) भी बाँटा जा सकता है।';
const KINDS=[{id:'paisa',e:'🪙',t:'पैसा (₹)'},{id:'seva',e:'🤲',t:'सेवा (घंटे)'},{id:'cheez',e:'🧺',t:'चीज़/अनाज (₹ में अंदाज़ा)'}];
const IDEAS=['🍛 लंगर में हाथ बँटाना','📚 किसी बच्चे को एक घंटा पढ़ाना','🧓 पड़ोस के बुज़ुर्ग का सौदा लाना','🧺 पुराने कपड़े/किताबें ज़रूरतमंद को','🩸 रक्तदान (सिर्फ़ सरकारी/मान्य ब्लड बैंक में)','🌳 एक पेड़ लगाकर उसे पानी देना'];
const okMonth=m=>/^\d{4}-(0[1-9]|1[0-2])$/.test(m),okDay=d=>/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(d);
const num=x=>{const n=Number(x);return isFinite(n)&&n>0?Math.round(n*100)/100:0};
const cl=(x,n)=>String(x==null?'':x).replace(/[\u0000-\u001f<>]/g,' ').trim().slice(0,n);
const fresh=()=>({v:1,months:{},sevaGoal:10,badge:false});
function month(m){return{income:num(m&&m.income),gave:Array.isArray(m&&m.gave)?m.gave.map(row).filter(Boolean).slice(-300):[]};}
function row(r){if(!r||!okDay(r.d)||!KINDS.some(k=>k.id===r.kind))return null;const amt=num(r.amt);if(!amt)return null;return{d:r.d,kind:r.kind,amt,note:cl(r.note,60)};}
function validate(s){if(!s||typeof s!=='object'||s.v!==1)return fresh();const o=fresh();if(s.months&&typeof s.months==='object')Object.keys(s.months).filter(okMonth).sort().slice(-36).forEach(k=>{o.months[k]=month(s.months[k])});o.sevaGoal=Math.min(200,num(s.sevaGoal)||10);o.badge=s.badge===true;return o;}
function setIncome(s,m,v){s=validate(s);if(!okMonth(m))return s;const mm=month(s.months[m]);mm.income=num(v);return{...s,months:{...s.months,[m]:mm}};}
function progress(s,m){s=validate(s);const mm=s.months[m]||month(null);let rs=0,hrs=0;mm.gave.forEach(r=>{if(r.kind==='seva')hrs+=r.amt;else rs+=r.amt});rs=Math.round(rs*100)/100;hrs=Math.round(hrs*100)/100;const target=Math.round(mm.income*PART*100)/100;
 const pctRs=target>0?Math.min(100,Math.round(rs*100/target)):0,pctSeva=Math.min(100,Math.round(hrs*100/s.sevaGoal));return{income:mm.income,target,rs,hrs,goal:s.sevaGoal,pctRs,pctSeva,done:pctRs>=100||pctSeva>=100};}
function give(s,r){s=validate(s);const x=row(r);if(!x)return{state:s,added:false,firstToday:false,badgeNew:false};const m=x.d.slice(0,7),mm=month(s.months[m]);const firstToday=!Object.values(s.months).some(v=>v.gave.some(g=>g.d===x.d));mm.gave.push(x);let n={...s,months:{...s.months,[m]:mm}};const done=progress(n,m).done,badgeNew=done&&!s.badge;if(badgeNew)n={...n,badge:true};return{state:n,added:true,firstToday,badgeNew};}
function remove(s,m,i){s=validate(s);if(!s.months[m])return s;const mm=month(s.months[m]);mm.gave.splice(i,1);return{...s,months:{...s.months,[m]:mm}};}
const dayKey=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
return{KEY,BADGE,PART,BANI,NOTE,KINDS,IDEAS,fresh,validate,setIncome,progress,give,remove,dayKey};});
