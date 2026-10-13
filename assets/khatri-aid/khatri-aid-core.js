(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNAid=m;})(this,function(){'use strict';
// 🤝 Khatri Aid — न छोटा न बड़ा. मदद माँगो / मदद करो. कोई server नहीं; संदेश आप ख़ुद WhatsApp/Email से भेजते हैं.
const KEY='kdn-khatri-aid-v1',MAIL='khatrinewsnetwork@gmail.com';
const CATS=[{id:'langar',icon:'🍛',name:'राशन / लंगर'},{id:'ilaj',icon:'🩺',name:'इलाज'},{id:'padhai',icon:'📚',name:'पढ़ाई'},{id:'kanooni',icon:'⚖️',name:'कानूनी',href:'./vakil.html'},{id:'naukri',icon:'🛠️',name:'नौकरी'},{id:'ghar',icon:'🏠',name:'घर / आश्रय'},{id:'man',icon:'💛',name:'मानसिक सहारा'}];
const CAT_IDS=CATS.map(c=>c.id);
const GROUPS=['किसान','मज़दूर','व्यापारी','विद्यार्थी','माँएँ','बुज़ुर्ग','कलाकार','सेवादार','कारीगर','ड्राइवर','अध्यापक','नौजवान'];
// BaniDB API से जाँचा: verseId 631, shabadId 56, अंग 15, सिरीराग, गुरु नानक देव जी
const BANI={text:'नीचा अंदरि नीच जाति नीची हू अति नीचु ॥ नानकु तिन कै संगि साथि वडिआ सिउ किआ रीस ॥',gurmukhi:'ਨੀਚਾ ਅੰਦਰਿ ਨੀਚ ਜਾਤਿ ਨੀਚੀ ਹੂ ਅਤਿ ਨੀਚੁ ॥ ਨਾਨਕੁ ਤਿਨ ਕੈ ਸੰਗਿ ਸਾਥਿ ਵਡਿਆ ਸਿਉ ਕਿਆ ਰੀਸ ॥',ang:15,raag:'सिरीराग',writer:'गुरु नानक देव जी',src:'BaniDB (api.banidb.com) · verse 631 · shabad 56'};
const MODES={need:{tag:'मदद-चाहिए',title:'🙏 मदद चाहिए'},give:{tag:'मदद-करूँगा',title:'🤝 मदद करना चाहता हूँ'}};
const clean=(t,n)=>String(t==null?'':t).replace(/[<>]/g,'').replace(/\s+/g,' ').trim().slice(0,n||200);
const catOf=id=>CATS.find(c=>c.id===id)||null;
function validForm(mode,f){if(!MODES[mode]||!f)return{ok:false,why:'type'};const cat=CAT_IDS.includes(f.cat)?f.cat:'',name=clean(f.name,80),city=clean(f.city,40),contact=clean(f.contact,80),note=clean(f.note,400);
 if(!cat)return{ok:false,why:'विषय चुनिए'};if(!name)return{ok:false,why:'नाम लिखिए'};if(!city)return{ok:false,why:'शहर लिखिए'};if(!contact)return{ok:false,why:'phone या email लिखिए'};if(f.agree!==true)return{ok:false,why:'सहमति ✔ कीजिए'};
 return{ok:true,item:{mode,cat,name,city,contact,note}};}
function message(it){const c=catOf(it.cat);return['['+MODES[it.mode].tag+'] KDN 🤝 Khatri Aid',MODES[it.mode].title+' · '+c.icon+' '+c.name,'नाम: '+it.name,'शहर: '+it.city,'संपर्क: '+it.contact].concat(it.note?[(it.mode==='need'?'ज़रूरत: ':'मैं क्या कर सकता हूँ: ')+it.note]:[]).concat(['page: not4you.world/khatri-aid.html']).join('\n');}
const waLink=t=>'https://wa.me/?text='+encodeURIComponent(t);
const mailLink=t=>'mailto:'+MAIL+'?subject='+encodeURIComponent(t.split('\n')[0])+'&body='+encodeURIComponent(t);
function fresh(){return{v:1,sent:[]};}
function validate(s){if(!s||s.v!==1||!Array.isArray(s.sent))return fresh();return{v:1,sent:s.sent.filter(x=>x&&MODES[x.mode]&&CAT_IDS.includes(x.cat)&&typeof x.ts==='number').slice(-20).map(x=>({mode:x.mode,cat:x.cat,ts:x.ts}))};}
function record(s,it,ts){s=validate(s);return{v:1,sent:[...s.sent,{mode:it.mode,cat:it.cat,ts}].slice(-20)};}
// बराबर घेरे: सब एक ही आकार, एक बड़े घेरे पर बराबर दूरी
function ring(n,r){return Array.from({length:n},(_,i)=>{const a=-Math.PI/2+i*2*Math.PI/n;return{x:+(Math.cos(a)*r).toFixed(2),y:+(Math.sin(a)*r).toFixed(2)};});}
return{KEY,MAIL,CATS,CAT_IDS,GROUPS,BANI,MODES,clean,catOf,validForm,message,waLink,mailLink,fresh,validate,record,ring};});
