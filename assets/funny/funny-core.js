(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNFunny=m;})(this,function(){'use strict';
// 🤣 फनीबुक — हँसी से सच, किसी को चोट नहीं. रोज़ एक नर्म चुटकुला, punchline खोलो, मुस्कुराओ। दिन में एक बार +5 koins, 7 अलग दिन = फनी साधक. सिर्फ़ इसी phone का localStorage. मूल KDN हास्य, शास्त्र नहीं.
const KEY='kdn-funny-v1',BADGE='फनी साधक',NEED=7;
const JOKES=[
 {id:'chai',icon:'☕',setup:'सुबह की चाय ठंडी क्यों लगती है?',punch:'क्योंकि WhatsApp पहले खुल जाता है!'},
 {id:'phone',icon:'📱',setup:'मेरा phone बैटरी इतनी जल्दी क्यों खत्म करता है?',punch:'क्योंकि वो भी दिन भर रिश्तेदारों की लंबी बातें सुनता है!'},
 {id:'traffic',icon:'🚗',setup:'ट्रैफ़िक जाम में सबसे तेज़ क्या चलता है?',punch:'बगल वाली गाड़ी वाले का हॉर्न!'},
 {id:'whatsapp',icon:'💬',setup:'परिवार के WhatsApp ग्रुप में सबसे ज़्यादा कौन बोलता है?',punch:'वो जो ऑनलाइन नहीं — Good Morning forwards!'},
 {id:'alarm',icon:'⏰',setup:'अलार्म सुबह क्यों बजता है?',punch:'ताकि हम स्नूज़ दबाकर साबित करें — अभी भी हम ही बॉस हैं!'},
 {id:'rain',icon:'🌧️',setup:'बारिश में छाता घर पर क्यों छूट जाता है?',punch:'क्योंकि मौसम वाले भी हमारे जैसे भूलने वाले हैं!'},
 {id:'cricket',icon:'🏏',setup:'पड़ोसी क्रिकेट मैच देख रहे हैं — पता कैसे?',punch:'दीवार से भी cheer सुनाई देती है!'},
 {id:'wifi',icon:'📶',setup:'घर में WiFi सबसे कमज़ोर कहाँ होता है?',punch:'ठीक जहाँ हम बैठकर काम करना चाहते हैं!'},
 {id:'fridge',icon:'🧊',setup:'फ्रिज खोलते ही क्या याद आता है?',punch:'कि भूख नहीं थी — सिर्फ़ देखने का मन था!'},
 {id:'mirror',icon:'🪞',setup:'शीशा सुबह थोड़ा नाराज़ क्यों लगता है?',punch:'क्योंकि रात को हमने वादा किया था — जल्दी उठूँगा!'},
 {id:'auto',icon:'🛺',setup:'ऑटो वाले से मीटर लगाने को कहो तो क्या होता है?',punch:'वो कहते हैं — भाई, दिल से मीटर है, आँख से नहीं!'},
 {id:'lunch',icon:'🍱',setup:'ऑफिस में लंच बॉक्स खोलते ही सब क्यों इकट्ठा हो जाते हैं?',punch:'क्योंकि खुशबू भी मीटिंग बुलाना जानती है!'},
 {id:'slippers',icon:'🩴',setup:'घर की चप्पलें हमेशा एक गायब क्यों हो जाती हैं?',punch:'क्योंकि वो भी छुपन-छुपाई खेलना चाहती हैं!'},
 {id:'fan',icon:'🌀',setup:'पंखे की स्पीड रात को क्यों याद आती है?',punch:'क्योंकि सुबह उठकर पता चलता है — पूरी रात स्लो पर सोए!'}];
const RX=/^\d{4}-\d\d-\d\d$/;
const dayKey=d=>{d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const dayNum=k=>{const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(k);return m?Math.floor(Date.UTC(+m[1],+m[2]-1,+m[3])/864e5):0;};
const fromNum=n=>new Date(n*864e5).toISOString().slice(0,10);
const dayOfYear=k=>{if(!RX.test(k))return 1;return dayNum(k)-dayNum(k.slice(0,4)+'-01-01')+1;};
const jokeFor=k=>JOKES[dayOfYear(k)%JOKES.length];
const fresh=()=>({v:1,done:[],badge:false});
function validate(s){if(!s||s.v!==1||!Array.isArray(s.done))return fresh();
 const done=s.done.filter((k,i,a)=>typeof k==='string'&&RX.test(k)&&a.indexOf(k)===i).sort().slice(-400);
 return{v:1,done,badge:s.badge===true||done.length>=NEED};}
function mark(s,day){s=validate(s);if(!RX.test(day)||s.done.includes(day))return{state:s,firstToday:false,badgeNew:false};
 const done=[...s.done,day].sort(),badgeNew=!s.badge&&done.length>=NEED;return{state:{v:1,done,badge:s.badge||badgeNew},firstToday:true,badgeNew};}
const count=s=>validate(s).done.length;
function week(s,today){s=validate(s);const n=dayNum(today),out=[];for(let i=6;i>=0;i--){const k=fromNum(n-i);out.push({day:k,done:s.done.includes(k),today:i===0,icon:jokeFor(k).icon});}return out;}
return{KEY,BADGE,NEED,JOKES,dayKey,dayNum,fromNum,dayOfYear,jokeFor,fresh,validate,mark,count,week};});
