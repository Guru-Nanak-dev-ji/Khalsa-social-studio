(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNVand=m;})(this,function(){'use strict';
// 🍲 वंड छक्को — किरत करो, वंड छक्को. रोज़ चुनिए आज क्या बाँटा, थाली भरती है. दिन में एक बार +5 koins, 7 अलग दिन = वंड साधक badge. सिर्फ़ इसी phone का localStorage.
const KEY='kdn-vand-v1',BADGE='वंड साधक',NEED=7;
const KINDS=[
 {id:'khana',icon:'🍲',title:'खाना',means:'अपने खाने में से किसी भूखे या पड़ोसी को खिलाया।'},
 {id:'samay',icon:'⏰',title:'समय',means:'किसी की मदद के लिए अपना समय दिया।'},
 {id:'gyan',icon:'📚',title:'ज्ञान',means:'किसी को कुछ सिखाया या अच्छी सलाह दी।'},
 {id:'muskan',icon:'😊',title:'मुस्कान / मीठे बोल',means:'किसी उदास को मुस्कान और मीठे बोल दिए।'},
 {id:'cheez',icon:'🎁',title:'चीज़',means:'अपनी कोई चीज़ किसी ज़रूरतमंद को दी।'}];
const KIND_IDS=KINDS.map(k=>k.id);
// BaniDB (api.banidb.com) से जाँची: अंग 1245, verse 53371–53372, shabad 4480
const BANI={line:'घालि खाइ किछु हथहु देइ ॥ नानक राहु पछाणहि सेइ',gurmukhi:'ਘਾਲਿ ਖਾਇ ਕਿਛੁ ਹਥਹੁ ਦੇਇ ॥ ਨਾਨਕ ਰਾਹੁ ਪਛਾਣਹਿ ਸੇਇ',meaning:'जो मेहनत से कमाकर खाता है और अपने हाथ से कुछ बाँटता है, वही सही रास्ता पहचानता है।',ang:1245,raag:'सारंग की वार',writer:'गुरु नानक देव जी',source:'गुरु नानक देव जी, Ang 1245',src:'BaniDB (api.banidb.com) · verse 53371–53372 · shabad 4480'};
const RX=/^\d{4}-\d\d-\d\d$/;
const dayKey=d=>{d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const dayNum=k=>{const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(k);return m?Math.floor(Date.UTC(+m[1],+m[2]-1,+m[3])/864e5):0;};
const fromNum=n=>new Date(n*864e5).toISOString().slice(0,10);
const kindOf=id=>KINDS.find(k=>k.id===id)||null;
const fresh=()=>({v:1,done:[],kinds:{},badge:false});
function validate(s){if(!s||s.v!==1||!Array.isArray(s.done))return fresh();
 const done=s.done.filter((k,i,a)=>typeof k==='string'&&RX.test(k)&&a.indexOf(k)===i).sort().slice(-400),kinds={},src=s.kinds&&typeof s.kinds==='object'?s.kinds:{};
 for(const d of done)if(KIND_IDS.includes(src[d]))kinds[d]=src[d];
 return{v:1,done,kinds,badge:s.badge===true||done.length>=NEED};}
function mark(s,day,kindId){s=validate(s);if(!RX.test(day)||!KIND_IDS.includes(kindId)||s.done.includes(day))return{state:s,firstToday:false,badgeNew:false};
 const done=[...s.done,day].sort(),badgeNew=!s.badge&&done.length>=NEED;return{state:{v:1,done,kinds:{...s.kinds,[day]:kindId},badge:s.badge||badgeNew},firstToday:true,badgeNew};}
const count=s=>validate(s).done.length;
function week(s,today){s=validate(s);const n=dayNum(today),out=[];for(let i=6;i>=0;i--){const k=fromNum(n-i),kd=kindOf(s.kinds[k]);out.push({day:k,done:s.done.includes(k),today:i===0,icon:kd?kd.icon:'·'});}return out;}
return{KEY,BADGE,NEED,KINDS,KIND_IDS,BANI,dayKey,dayNum,fromNum,kindOf,fresh,validate,mark,count,week};});
