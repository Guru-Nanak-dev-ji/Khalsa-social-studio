(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNTitli=m;})(this,function(){'use strict';
// Butterfly चुनाव — छोटे चुनाव, बड़ा असर (butterfly effect). सिर्फ़ game koins.
const KEY='kdn-titli-v1',BADGE='तितली प्रभाव',SLOGAN='One click and change your life 🧧';
const SCENES=[
 {t:'🌅 सुबह आँख खुली। phone हाथ में है।',c:[{x:'🙏 पहले पाँच मिनट शांत बैठूँ, धन्यवाद करूँ',k:1,e:'मन हल्का हुआ, दिन की शुरुआत मुस्कान से हुई।'},{x:'📱 सीधा reels scroll करूँ',k:-1,e:'एक घंटा कहाँ गया, पता ही नहीं चला। मन भारी है।'}]},
 {t:'🚌 रास्ते में एक बुज़ुर्ग का थैला गिर गया।',c:[{x:'🤝 रुककर थैला उठाऊँ',k:1,e:'बुज़ुर्ग ने आशीर्वाद दिया। आपका दिन चमक उठा।'},{x:'⏩ देर हो रही है, आगे बढ़ूँ',k:-1,e:'मन में हल्की चुभन रह गई।'}]},
 {t:'💼 काम पर किसी ने आपकी गलती पकड़ी।',c:[{x:'🙂 गलती मानूँ और सुधारूँ',k:1,e:'सबका भरोसा बढ़ा, आपने कुछ नया सीखा।'},{x:'😠 दूसरे पर दोष डालूँ',k:-1,e:'झगड़ा बढ़ा, दफ़्तर का माहौल बिगड़ गया।'}]},
 {t:'💰 शाम को कुछ पैसे बचे।',c:[{x:'🍛 थोड़ा दसवंध / दान में दूँ',k:1,e:'किसी भूखे को खाना मिला। वंड छको का सुख।'},{x:'🛍️ बेकार की चीज़ खरीद लूँ',k:-1,e:'चीज़ कोने में पड़ी है, मन फिर खाली।'}]},
 {t:'🌙 रात को घर में बहस हो गई।',c:[{x:'🫂 पहले मैं माफ़ी माँगूँ',k:1,e:'घर में फिर से हँसी लौट आई।'},{x:'🔇 चुप रहकर नाराज़ सो जाऊँ',k:-1,e:'रात बेचैनी में कटी।'}]}];
const RESULTS={swarg:{icon:'🌈',name:'स्वर्ग जैसा दिन',text:'छोटे-छोटे अच्छे चुनावों ने पूरा दिन स्वर्ग जैसा बना दिया। तितली के पंख जितना छोटा चुनाव भी तूफ़ान जितना बड़ा असर लाता है।'},
 beech:{icon:'🌤️',name:'धूप-छाँव वाला दिन',text:'कुछ अच्छा, कुछ कड़वा। अगली बार एक चुनाव बदलकर देखिए, सारा दिन बदल सकता है।'},
 narak:{icon:'⛈️',name:'नरक जैसा दिन',text:'हर छोटे गलत चुनाव ने अगले को और कठिन बना दिया। अच्छी ख़बर: कल फिर नया मौका है, बस एक click से शुरुआत।'}};
const fresh=()=>({v:1,step:0,karma:0,path:'',seen:[],badge:false});
function resultOf(k){return k>=3?'swarg':k<=-3?'narak':'beech';}
function validate(s){if(!s||s.v!==1)return fresh();const n=x=>Number.isFinite(x)?Math.trunc(x):0;const path=typeof s.path==='string'&&/^[ab]{0,5}$/.test(s.path)?s.path:'';
 const karma=[...path].reduce((a,ch,i)=>a+SCENES[i].c[ch==='a'?0:1].k,0);const seen=[...new Set(Array.isArray(s.seen)?s.seen:[])].filter(x=>x in RESULTS);
 return{v:1,step:path.length,karma,path,seen,badge:seen.includes('swarg')};}
function choose(s,i){s=validate(s);if(s.step>=SCENES.length||(i!==0&&i!==1))return{state:s,effect:null,result:null};
 const ch=SCENES[s.step].c[i],path=s.path+(i?'b':'a'),karma=s.karma+ch.k,step=path.length;let result=null,seen=s.seen,isNewResult=false;
 if(step===SCENES.length){result=resultOf(karma);isNewResult=!seen.includes(result);if(isNewResult)seen=[...seen,result];}
 const badge=seen.includes('swarg');return{state:{v:1,step,karma,path,seen,badge},effect:ch.e,result,isNewResult,badgeNew:badge&&!s.badge};}
const again=s=>({...fresh(),seen:validate(s).seen,badge:validate(s).badge});
return{KEY,BADGE,SLOGAN,SCENES,RESULTS,fresh,validate,choose,again,resultOf};});
