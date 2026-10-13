(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNGun=m;})(this,function(){'use strict';
// 📜 आज का गुण — हर दिन एक गुण (14 गुण बारी-बारी). "आज किया" दिन में एक बार, 7 अलग दिन = गुण साधक badge. सिर्फ़ इसी phone का localStorage.
const KEY='kdn-gun-v1',BADGE='गुण साधक',NEED=7;
const VIRTUES=[
 {id:'satya',icon:'💎',title:'सत्य',means:'सच बोलना और सच्चाई से जीना।',tip:'आज हर बात में सच बोलिए, एक छोटा झूठ भी नहीं।'},
 {id:'santokh',icon:'🌾',title:'संतोष',means:'जो मिला है उसमें खुश रहना, लालच से दूर।',tip:'आज जो आपके पास है उसकी 3 चीज़ें गिनकर धन्यवाद कहिए।'},
 {id:'daya',icon:'💗',title:'दया',means:'हर जीव का दुख समझना और उसे कम करना।',tip:'आज किसी जानवर या पक्षी को पानी या दाना दीजिए।'},
 {id:'nimrata',icon:'🌱',title:'निम्रता',means:'घमंड छोड़कर नरमी और मीठे बोल से रहना।',tip:'आज किसी से गलती हो तो प्यार से बात कीजिए, ऊँची आवाज़ नहीं।'},
 {id:'seva',icon:'🤲',title:'सेवा',means:'बिना बदले की चाह के दूसरों के काम आना।',tip:'आज घर या पड़ोस में एक काम बिना कहे कर दीजिए।'},
 {id:'kirat',icon:'⚒️',title:'किरत',means:'ईमानदारी और मेहनत से रोज़ी कमाना।',tip:'आज अपना काम पूरे मन और ईमानदारी से पूरा कीजिए।'},
 {id:'vand-chhako',icon:'🍲',title:'वंड छको',means:'अपनी कमाई और खाना मिल-बाँटकर खाना।',tip:'आज अपने खाने या चीज़ में से कुछ किसी के साथ बाँटिए।'},
 {id:'simran',icon:'🙏',title:'सिमरन',means:'मन को शांत करके प्रभु को याद करना।',tip:'आज 5 मिनट आँखें बंद करके शांति से नाम याद कीजिए।'},
 {id:'sahas',icon:'🦁',title:'साहस',means:'डर के आगे सही बात के लिए खड़े होना।',tip:'आज जिस काम से डर लगता था उसका पहला छोटा कदम उठाइए।'},
 {id:'kshama',icon:'🕊️',title:'क्षमा',means:'दूसरों की गलती माफ़ करके मन हल्का करना।',tip:'आज किसी एक की पुरानी नाराज़गी दिल से माफ़ कीजिए।'},
 {id:'ekta',icon:'🤝',title:'एकता',means:'सब इंसान बराबर हैं, सबको साथ लेकर चलना।',tip:'आज किसी अलग सोच वाले से प्यार से बात कीजिए।'},
 {id:'amanat',icon:'🔐',title:'अमानत',means:'किसी की दी हुई चीज़ और भरोसे को सँभालकर रखना।',tip:'आज किसी की उधार ली चीज़ या किया वादा पूरा लौटाइए।'},
 {id:'sabar',icon:'⏳',title:'सबर',means:'धीरज रखना, जल्दबाज़ी और गुस्से से बचना।',tip:'आज गुस्सा आए तो बोलने से पहले 10 तक गिनिए।'},
 {id:'vivek',icon:'🧭',title:'विवेक',means:'सोच-समझकर सही और गलत में फ़र्क करना।',tip:'आज कोई भी खबर आगे भेजने से पहले उसकी सच्चाई जाँचिए।'}];
const RX=/^\d{4}-\d\d-\d\d$/;
const dayKey=d=>{d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const dayNum=k=>{const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(k);return m?Math.floor(Date.UTC(+m[1],+m[2]-1,+m[3])/864e5):0;};
const fromNum=n=>new Date(n*864e5).toISOString().slice(0,10);
// साल का दिन (1 जनवरी = 1)
const dayOfYear=k=>{if(!RX.test(k))return 1;return dayNum(k)-dayNum(k.slice(0,4)+'-01-01')+1;};
const virtueFor=k=>VIRTUES[dayOfYear(k)%VIRTUES.length];
const fresh=()=>({v:1,done:[],badge:false});
function validate(s){if(!s||s.v!==1||!Array.isArray(s.done))return fresh();
 const done=s.done.filter((k,i,a)=>typeof k==='string'&&RX.test(k)&&a.indexOf(k)===i).sort().slice(-400);
 return{v:1,done,badge:s.badge===true||done.length>=NEED};}
function mark(s,day){s=validate(s);if(!RX.test(day)||s.done.includes(day))return{state:s,firstToday:false,badgeNew:false};
 const done=[...s.done,day].sort(),badgeNew=!s.badge&&done.length>=NEED;return{state:{v:1,done,badge:s.badge||badgeNew},firstToday:true,badgeNew};}
const count=s=>validate(s).done.length;
function week(s,today){s=validate(s);const n=dayNum(today),out=[];for(let i=6;i>=0;i--){const k=fromNum(n-i);out.push({day:k,done:s.done.includes(k),today:i===0,icon:virtueFor(k).icon});}return out;}
return{KEY,BADGE,NEED,VIRTUES,dayKey,dayNum,fromNum,dayOfYear,virtueFor,fresh,validate,mark,count,week};});
