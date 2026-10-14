(function(root,f){const m=f(root);if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNKhazana=m;})(this,function(root){'use strict';
// 🏆 मेरा खज़ाना — सब games के badges एक जगह. सिर्फ़ इसी phone का localStorage पढ़ता है, कुछ लिखता नहीं. Game koins only, असली पैसा नहीं.
const J=()=>(root&&root.KDNJeevit)||(typeof require==='function'?(()=>{try{return require('../jeevit/jeevit-core.js');}catch{return null;}})():null);
const GAMES=[
 {id:'chabi',icon:'🗝️',game:'चाबी वाला द्वार',badge:'चक्रव्यूह भेदी',key:'kdn-chabi-v1',href:'./chabi.html',got:s=>s.done===true},
 {id:'chakravyuh',icon:'🏹',game:'चक्रव्यूह कथा',badge:'चक्रव्यूह भेदक',key:'kdn-chakravyuh-v1',href:'./chakravyuh.html',got:s=>s.badge===true},
 {id:'shakha',icon:'🌳',game:'कहानी की शाखाएँ',badge:'शाखा लेखक',key:'kdn-shakha-v1',href:'./shakha.html',got:s=>s.badge===true},
 {id:'khel',icon:'🎮',game:'खेल बनाओ',badge:'खेल निर्माता',key:'kdn-khel-v1',href:'./khel-banao.html',got:s=>s.badge===true},
 {id:'guru',icon:'🙏',game:'दस गुरु साहिबान',badge:'दस गुरू यात्री',key:'kdn-guru-v1',href:'./guru.html',got:s=>s.badge===true},
 {id:'panj',icon:'🏛️',game:'पंज तख़्त',badge:'पंज तख़्त यात्री',key:'kdn-panj-v1',href:'./panj-takht.html',got:s=>s.badge===true},
 {id:'kakkar',icon:'🛡️',game:'पंज कक्कार',badge:'कक्कार ज्ञानी',key:'kdn-kakkar-v1',href:'./panj-kakkar.html',got:s=>s.badge===true},
 {id:'kirat',icon:'🛠️',game:'किरत करो',badge:'किरत साधक',key:'kdn-kirat-v1',href:'./kirat.html',got:s=>s.badge===true},
 {id:'sehat',icon:'⛑️',game:'सेहत जानकारी',badge:'सेहत साथी',key:'kdn-sehat-gyan-v1',href:'./sehat.html',got:s=>s.badge===true},
 {id:'itihas',icon:'📜',game:'सिख इतिहास',badge:'इतिहास यात्री',key:'kdn-itihas-v1',href:'./itihas.html',got:s=>s.badge===true},
 {id:'bhagat',icon:'🪔',game:'भगत बाणी',badge:'भगत बाणी यात्री',key:'kdn-bhagat-v1',href:'./bhagat.html',got:s=>s.badge===true},
 {id:'kshetra',icon:'🌾',game:'मालवा यात्रा',badge:'मालवा यात्री',key:'kdn-kshetra-v1',href:'./kshetra-malwa.html',got:s=>s.badge===true},
 {id:'majha',icon:'🛕',game:'माझा यात्रा',badge:'माझा यात्री',key:'kdn-kshetra-majha-v1',href:'./kshetra-majha.html',got:s=>s.badge===true},
 {id:'doaba',icon:'✈️',game:'दोआबा यात्रा',badge:'दोआबा यात्री',key:'kdn-kshetra-doaba-v1',href:'./kshetra-doaba.html',got:s=>s.badge===true},
 {id:'puadh',icon:'🌄',game:'पुआध यात्रा',badge:'पुआध यात्री',key:'kdn-kshetra-puadh-v1',href:'./kshetra-puadh.html',got:s=>s.badge===true},
 {id:'jod',icon:'🔤',game:'शब्द जोड़',badge:'अक्खर साथी',key:'kdn-jod-v1',href:'./shabad-jod.html',got:s=>s.badge===true},
 {id:'rush',icon:'🍛',game:'लंगर रश',badge:'लंगर सेवादार',key:'kdn-rush-v1',href:'./langar-rush.html',got:s=>s.badge===true},
 {id:'khoj',icon:'🗺️',game:'नक्शा खोज',badge:'नक्शा खोजी',key:'kdn-khoj-v1',href:'./naksha-khoj.html',got:s=>s.badge===true},
 {id:'neta',icon:'🗳️',game:'My Neta — राज्य',badge:'जागरूक नागरिक',key:'kdn-neta-v1',href:'./neta-rajya.html',got:s=>s.badge===true},
 {id:'swad',icon:'🍲',game:'हर राज्य का स्वाद',badge:'स्वाद यात्री',key:'kdn-swad-v1',href:'./swad.html',got:s=>s.badge===true},
 {id:'haq',icon:'📜',game:'वकील डायरेक्टरी',badge:'हक़ जानकार',key:'kdn-sewa-v1',href:'./vakil.html',got:s=>s.rightsBadge===true},
 {id:'madad',icon:'⛑️',game:'खत्री Aid',badge:'मदद साथी',key:'kdn-sewa-v1',href:'./khatri-aid.html',got:s=>s.aidBadge===true},
 {id:'virsa',icon:'🎙️',game:'पंजाब दा विरसा',badge:'विरसा सुनने वाला',key:'kdn-virsa-v1',href:'./virsa.html',got:s=>s.badge===true},
 {id:'takht',icon:'🧊',game:'तख़्त Cube',badge:'तख़्त परिक्रमा',key:'kdn-takht-v1',href:'./takht.html',got:s=>s.badge===true},
 {id:'langar',icon:'🍛',game:'लंगर रसोई',badge:'लंगर सेवादार',key:'kdn-langar-v1',href:'./langar.html',got:s=>s.badge===true},
 {id:'titli',icon:'🦋',game:'Butterfly चुनाव',badge:'तितली प्रभाव',key:'kdn-titli-v1',href:'./titli.html',got:s=>s.badge===true},
 {id:'nanak-ghar',icon:'🏠',game:'नानक घर सेवा',badge:'नानक घर सेवादार',key:'kdn-nanak-ghar-v1',href:'./nanak-ghar.html',got:s=>s.badge===true},
 {id:'aaj-bhav',icon:'🌸',game:'मेरा आज का भाव',badge:'सात दिन का भाव-साधक',key:'kdn-aaj-bhav-v1',href:'./aaj-bhav.html',got:s=>!!(s.days&&Object.keys(s.days).length>=7)},
 {id:'sakhi',icon:'📖',game:'आज की साखी',badge:'साखी श्रोता',key:'kdn-sakhi-v1',href:'./sakhi.html',got:s=>s.badge===true||(Array.isArray(s.days)&&s.days.length>=7)},
 {id:'sankalp',icon:'🪔',game:'आज का संकल्प',badge:'संकल्प दीप',key:'kdn-sankalp-v1',href:'./sankalp.html',got:s=>s.badge===true},
 {id:'mala',icon:'📿',game:'सिमरन माला',badge:'सिमरन साधक',key:'kdn-mala-v1',href:'./mala.html',got:s=>s.badge===true},
 {id:'gun',icon:'📜',game:'आज का गुण',badge:'गुण साधक',key:'kdn-gun-v1',href:'./gun.html',got:s=>s.badge===true||(Array.isArray(s.done)&&s.done.length>=7)},
 {id:'funnybook',icon:'🤣',game:'फनीबुक बनाम फेकबुक',badge:'हँसी का दर्पण',key:'kdn-fbher-v1',href:'./kahani.html#fb',got:s=>s.fb===true},
 {id:'her',icon:'👽',game:'HER — आवाज़ें',badge:'आवाज़ सुनने वाला',key:'kdn-fbher-v1',href:'./kahani.html#her',got:s=>s.her===true},
 {id:'gurcube',icon:'🧊',game:'ਗੁਰਮੁਖੀ Cube',badge:'अक्षर साधक',key:'kdn-gurcube-v1',href:'./gyan.html#gur-cube',got:s=>s.badge===true},
 {id:'whitemirror',icon:'🤍',game:'White Mirror',badge:'सफ़ेद शीशा',key:'kdn-whitemirror-v1',href:'./kahani.html',got:s=>s.badge===true},
 {id:'kahani',icon:'📖',game:'कहानी घर',badge:'कथा यात्री',key:'kdn-kahani-v1',href:'./kahani.html',got:s=>s.badge===true},
 {id:'funny',icon:'🤣',game:'फनीबुक',badge:'फनी साधक',key:'kdn-funny-v1',href:'./funnybook.html',got:s=>s.badge===true||(Array.isArray(s.done)&&s.done.length>=7)},
 {id:'vand',icon:'🍲',game:'वंड छक्को',badge:'वंड साधक',key:'kdn-vand-v1',href:'./vand.html',got:s=>s.badge===true||(Array.isArray(s.done)&&s.done.length>=7)},
 {id:'pathey',icon:'⚖️',game:'पाथेय',badge:'पाथेय साधक',key:'kdn-pathey-v1',href:'./pathey.html',got:s=>s.badge===true},
 {id:'akarshan',icon:'🧲',game:'आकर्षण का नियम',badge:'आकर्षण साधक',key:'kdn-akarshan-v1',href:'./akarshan.html',got:s=>s.badge===true},
 {id:'khoya',icon:'🏰',game:'My Kingdom Lands',badge:'खोजी सिंह',key:'kdn-khoya-v1',href:'./kingdom-lands.html',got:s=>s.badge===true},
 {id:'khoya2',icon:'👑',game:'My Kingdom Lands · अध्याय 2',badge:'राज्य रक्षक',key:'kdn-khoya-v1',href:'./kingdom-lands.html',got:s=>s.badge2===true},
 {id:'khoya3',icon:'🦁',game:'My Kingdom Lands · अध्याय 3',badge:'खालसा योद्धा',key:'kdn-khoya-v1',href:'./kingdom-lands.html',got:s=>s.badge3===true},
 {id:'naksha',icon:'🌍',game:'KDN नक्शा',badge:'नक्शा यात्री',key:'kdn-naksha-v1',href:'./naksha.html',got:s=>s.badge===true},
 {id:'baaz',icon:'🦅',game:'बाज उड़ान',badge:'बाज उड़ान',key:'kdn-baaz-v1',href:'./baaz.html',got:s=>s.badge===true},
 {id:'jeevit',icon:'📜',game:'जीवित तस्वीरें (मुख्य द्वार)',badge:'साखी संग्रह',key:'kdn-jeevit-v1',href:'./index.html',got:s=>{const j=J();return !!(j&&j.badge(s));}}];
const RANKS=[[0,'🚶 यात्री'],[1,'🔍 खोजी'],[3,'🙏 सेवादार'],[5,'🛡️ रक्षक'],[GAMES.length,'👑 खज़ाना रक्षक']];
const parse=raw=>{if(typeof raw!=='string'||!raw)return null;try{const v=JSON.parse(raw);return v&&typeof v==='object'?v:null;}catch{return null;}};
// read(key)→ raw string|null. हर game: 'got' (badge मिला), 'started' (खेलना शुरू), 'locked' (अभी बाकी)
function scan(read){return GAMES.map(g=>{const s=parse(read(g.key));let st='locked';if(s){st='started';try{if(g.got(s))st='got';}catch{}}return{...g,status:st};});}
function summary(rows){const got=rows.filter(r=>r.status==='got').length;let rank=RANKS[0][1];for(const[n,t]of RANKS)if(got>=n)rank=t;
 const next=rows.find(r=>r.status==='started')||rows.find(r=>r.status==='locked')||null;return{got,total:rows.length,pct:Math.round(got*100/rows.length),rank,next};}
return{GAMES,RANKS,parse,scan,summary};});
