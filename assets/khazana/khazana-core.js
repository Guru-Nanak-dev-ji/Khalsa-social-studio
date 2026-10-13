(function(root,f){const m=f(root);if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNKhazana=m;})(this,function(root){'use strict';
// 🏆 मेरा खज़ाना — सब games के badges एक जगह. सिर्फ़ इसी phone का localStorage पढ़ता है, कुछ लिखता नहीं. Game koins only, असली पैसा नहीं.
const J=()=>(root&&root.KDNJeevit)||(typeof require==='function'?(()=>{try{return require('../jeevit/jeevit-core.js');}catch{return null;}})():null);
const GAMES=[
 {id:'chabi',icon:'🗝️',game:'चाबी वाला द्वार',badge:'चक्रव्यूह भेदी',key:'kdn-chabi-v1',href:'./chabi.html',got:s=>s.done===true},
 {id:'chakravyuh',icon:'🏹',game:'चक्रव्यूह कथा',badge:'चक्रव्यूह भेदक',key:'kdn-chakravyuh-v1',href:'./chakravyuh.html',got:s=>s.badge===true},
 {id:'takht',icon:'🧊',game:'तख़्त Cube',badge:'तख़्त परिक्रमा',key:'kdn-takht-v1',href:'./takht.html',got:s=>s.badge===true},
 {id:'langar',icon:'🍛',game:'लंगर रसोई',badge:'लंगर सेवादार',key:'kdn-langar-v1',href:'./langar.html',got:s=>s.badge===true},
 {id:'titli',icon:'🦋',game:'Butterfly चुनाव',badge:'तितली प्रभाव',key:'kdn-titli-v1',href:'./titli.html',got:s=>s.badge===true},
 {id:'nanak-ghar',icon:'🏠',game:'नानक घर सेवा',badge:'नानक घर सेवादार',key:'kdn-nanak-ghar-v1',href:'./nanak-ghar.html',got:s=>s.badge===true},
 {id:'aaj-bhav',icon:'🌸',game:'मेरा आज का भाव',badge:'सात दिन का भाव-साधक',key:'kdn-aaj-bhav-v1',href:'./aaj-bhav.html',got:s=>!!(s.days&&Object.keys(s.days).length>=7)},
 {id:'sakhi',icon:'📖',game:'आज की साखी',badge:'साखी श्रोता',key:'kdn-sakhi-v1',href:'./sakhi.html',got:s=>s.badge===true||(Array.isArray(s.days)&&s.days.length>=7)},
 {id:'sankalp',icon:'🪔',game:'आज का संकल्प',badge:'संकल्प दीप',key:'kdn-sankalp-v1',href:'./sankalp.html',got:s=>s.badge===true},
 {id:'mala',icon:'📿',game:'सिमरन माला',badge:'सिमरन साधक',key:'kdn-mala-v1',href:'./mala.html',got:s=>s.badge===true},
 {id:'naksha',icon:'🌍',game:'KDN नक्शा',badge:'नक्शा यात्री',key:'kdn-naksha-v1',href:'./naksha.html',got:s=>s.badge===true},
 {id:'jeevit',icon:'📜',game:'जीवित तस्वीरें (मुख्य द्वार)',badge:'साखी संग्रह',key:'kdn-jeevit-v1',href:'./index.html',got:s=>{const j=J();return !!(j&&j.badge(s));}}];
const RANKS=[[0,'🚶 यात्री'],[1,'🔍 खोजी'],[3,'🙏 सेवादार'],[5,'🛡️ रक्षक'],[GAMES.length,'👑 खज़ाना रक्षक']];
const parse=raw=>{if(typeof raw!=='string'||!raw)return null;try{const v=JSON.parse(raw);return v&&typeof v==='object'?v:null;}catch{return null;}};
// read(key)→ raw string|null. हर game: 'got' (badge मिला), 'started' (खेलना शुरू), 'locked' (अभी बाकी)
function scan(read){return GAMES.map(g=>{const s=parse(read(g.key));let st='locked';if(s){st='started';try{if(g.got(s))st='got';}catch{}}return{...g,status:st};});}
function summary(rows){const got=rows.filter(r=>r.status==='got').length;let rank=RANKS[0][1];for(const[n,t]of RANKS)if(got>=n)rank=t;
 const next=rows.find(r=>r.status==='started')||rows.find(r=>r.status==='locked')||null;return{got,total:rows.length,pct:Math.round(got*100/rows.length),rank,next};}
return{GAMES,RANKS,parse,scan,summary};});
