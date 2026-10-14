(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNPathey=m;})(this,function(){'use strict';
// ⚖️ पाथेय — किरत करो, वंड छक्को: जीवन का पाथेय. मनुष्य ही असली पूँजी है; उम्र भर की किरत (ईमानदार मेहनत) + सेवा/वंड (बाँटना) का संतुलन = पाथेय.
// रोज़ ⚒️ किरत और 🤲 सेवा — दोनों एक-एक बार. दिन में एक बार +5 koins, 7 अलग दिन दोनों = पाथेय साधक badge. सिर्फ़ इसी phone का localStorage. Game koins only, असली पैसा नहीं.
const KEY='kdn-pathey-v1',BADGE='पाथेय साधक',NEED=7,MAX_TILT=18,STEP=3;
const SIDES=[
 {id:'kirat',icon:'⚒️',title:'किरत',means:'आज मेहनत / ईमानदार काम किया।'},
 {id:'seva',icon:'🤲',title:'सेवा',means:'आज किसी की मदद की या कुछ बाँटा।'}];
const SIDE_IDS=SIDES.map(x=>x.id);
// BaniDB (api.banidb.com) से जाँची: अंग 1245, verse 53371–53372, shabad 4480 (वही पंक्ति जो vand-core में है)
const BANI={line:'घालि खाइ किछु हथहु देइ ॥ नानक राहु पछाणहि सेइ',gurmukhi:'ਘਾਲਿ ਖਾਇ ਕਿਛੁ ਹਥਹੁ ਦੇਇ ॥ ਨਾਨਕ ਰਾਹੁ ਪਛਾਣਹਿ ਸੇਇ',meaning:'जो मेहनत से कमाकर खाता है और अपने हाथ से कुछ बाँटता है, वही सही रास्ता पहचानता है।',ang:1245,raag:'सारंग की वार',writer:'गुरु नानक देव जी',source:'गुरु नानक देव जी, Ang 1245',src:'BaniDB (api.banidb.com) · verse 53371–53372 · shabad 4480'};
const RX=/^\d{4}-\d\d-\d\d$/;
const dayKey=d=>{d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const dayNum=k=>{const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(k);return m?Math.floor(Date.UTC(+m[1],+m[2]-1,+m[3])/864e5):0;};
const fromNum=n=>new Date(n*864e5).toISOString().slice(0,10);
const sideOf=id=>SIDES.find(x=>x.id===id)||null;
const fresh=()=>({v:1,kirat:[],seva:[],badge:false});
const clean=a=>Array.isArray(a)?a.filter((k,i,arr)=>typeof k==='string'&&RX.test(k)&&arr.indexOf(k)===i).sort().slice(-400):[];
const bothDays=s=>s.kirat.filter(d=>s.seva.includes(d));
function validate(s){if(!s||typeof s!=='object'||s.v!==1)return fresh();const o={v:1,kirat:clean(s.kirat),seva:clean(s.seva),badge:false};o.badge=s.badge===true||bothDays(o).length>=NEED;return o;}
function today(s,day){s=validate(s);return{kirat:s.kirat.includes(day),seva:s.seva.includes(day)};}
function mark(s,day,side){s=validate(s);const no={state:s,added:false,firstToday:false,bothNew:false,badgeNew:false};
 if(!RX.test(day)||!SIDE_IDS.includes(side)||s[side].includes(day))return no;
 const t=today(s,day),firstToday=!t.kirat&&!t.seva,st={...s,[side]:[...s[side],day].sort()},bothNew=st.kirat.includes(day)&&st.seva.includes(day);
 const badgeNew=!s.badge&&bothDays(st).length>=NEED;st.badge=s.badge||badgeNew;return{state:st,added:true,firstToday,bothNew,badgeNew};}
const both=s=>bothDays(validate(s)).length;
function balance(s){s=validate(s);const k=s.kirat.length,v=s.seva.length,tilt=Math.max(-MAX_TILT,Math.min(MAX_TILT,(v-k)*STEP));
 return{kirat:k,seva:v,both:bothDays(s).length,tilt,even:k===v,heavy:k===v?null:k>v?'kirat':'seva'};}
const iconFor=(k,v)=>k&&v?'⚖️':k?'⚒️':v?'🤲':'○';
function week(s,day){s=validate(s);const n=dayNum(day),out=[];for(let i=6;i>=0;i--){const d=fromNum(n-i),k=s.kirat.includes(d),v=s.seva.includes(d);out.push({day:d,kirat:k,seva:v,both:k&&v,any:k||v,today:i===0,icon:iconFor(k,v)});}return out;}
function streak(s,day){s=validate(s);let n=dayNum(day);const any=d=>s.kirat.includes(d)||s.seva.includes(d);if(!any(fromNum(n)))n--;let c=0;while(c<400&&any(fromNum(n-c)))c++;return c;}
return{KEY,BADGE,NEED,MAX_TILT,STEP,SIDES,SIDE_IDS,BANI,dayKey,dayNum,fromNum,sideOf,fresh,validate,today,mark,both,balance,iconFor,week,streak};});
