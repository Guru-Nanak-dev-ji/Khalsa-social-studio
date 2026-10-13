(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNNeta=m;})(this,function(){'use strict';
// 🗳️ My Neta — राज्य ढाँचा. Strictly non-partisan: no party, no sitting politician names. Seat counts verified Oct 2026 against
// ECI Delimitation Order 2008 + ECI Atlas 2024 (Lok Sabha/assembly), Constitution 4th Schedule / Rajya Sabha (RS), punjabassembly.gov.in, hpvs.neva.gov.in, J&K Reorganisation Act + jkla.neva.gov.in.
const KEY='kdn-neta-v1',BADGE='जागरूक नागरिक';
const NOTE='यह पेज किसी दल या नेता के पक्ष/विपक्ष में नहीं है। मौजूदा नाम हम नहीं लिखते — वे बदलते रहते हैं; हमेशा नीचे दी आधिकारिक सूची देखें।';
const L=(t,u)=>({t,u});
const COMMON=[L('🗳️ वोटर सर्विस पोर्टल (ECI) — नाम, बूथ, अपना क्षेत्र खोजो','https://voters.eci.gov.in/'),L('📊 चुनाव नतीजे (ECI) — आपके क्षेत्र का विजेता','https://results.eci.gov.in/'),L('🏛️ लोक सभा — सभी सांसद (MP)','https://sansad.in/ls'),L('🏛️ राज्य सभा — सभी सदस्य','https://sansad.in/rs'),L('📄 RTI ऑनलाइन (केंद्र सरकार के विभाग)','https://rtionline.gov.in/'),L('📮 CPGRAMS — केंद्र सरकार शिकायत पोर्टल','https://pgportal.gov.in/'),L('⚖️ केंद्रीय सूचना आयोग (RTI अपील)','https://cic.gov.in/')];
const S=[
 {id:'punjab',name:'पंजाब',m:'🌾',kind:'राज्य',head:'मुख्यमंत्री (CM) — विधानसभा में बहुमत से; राज्यपाल संवैधानिक प्रमुख',vs:117,ls:13,rs:7,
  links:[L('पंजाब विधानसभा (MLA सूची)','https://www.punjabassembly.gov.in/'),L('मुख्य निर्वाचन अधिकारी, पंजाब','https://ceopunjab.gov.in/'),L('Connect — पंजाब सरकार शिकायत पोर्टल','https://connect.punjab.gov.in/')]},
 {id:'haryana',name:'हरियाणा',m:'🌻',kind:'राज्य',head:'मुख्यमंत्री (CM) — विधानसभा में बहुमत से; राज्यपाल संवैधानिक प्रमुख',vs:90,ls:10,rs:5,
  links:[L('हरियाणा विधानसभा — MLA सूची','https://haryanaassembly.gov.in/mla/'),L('मुख्य निर्वाचन अधिकारी, हरियाणा','https://www.ceoharyana.gov.in/')]},
 {id:'delhi',name:'दिल्ली',m:'🏙️',kind:'केंद्र शासित प्रदेश (विधानसभा सहित, NCT)',head:'मुख्यमंत्री (CM) + उपराज्यपाल (LG); कुछ विषय (जैसे पुलिस, भूमि) केंद्र के पास',vs:70,ls:7,rs:3,
  links:[L('दिल्ली सरकार — MLA, MP और मंत्री सूची','https://delhi.gov.in/'),L('मुख्य निर्वाचन अधिकारी, दिल्ली','https://www.ceodelhi.gov.in/'),L('RTI ऑनलाइन — दिल्ली सरकार','https://rtionline.delhi.gov.in/')]},
 {id:'rajasthan',name:'राजस्थान',m:'🏜️',kind:'राज्य',head:'मुख्यमंत्री (CM) — विधानसभा में बहुमत से; राज्यपाल संवैधानिक प्रमुख',vs:200,ls:25,rs:10,
  links:[L('राजस्थान विधानसभा','https://assembly.rajasthan.gov.in/'),L('मुख्य निर्वाचन अधिकारी, राजस्थान','https://ceorajasthan.nic.in/'),L('राजस्थान संपर्क — शिकायत पोर्टल','https://sampark.rajasthan.gov.in/'),L('RTI ऑनलाइन — राजस्थान','https://rti.rajasthan.gov.in/')]},
 {id:'up',name:'उत्तर प्रदेश',m:'🛕',kind:'राज्य (विधानसभा + विधान परिषद)',head:'मुख्यमंत्री (CM) — विधानसभा में बहुमत से; राज्यपाल संवैधानिक प्रमुख',vs:403,ls:80,rs:31,
  links:[L('उत्तर प्रदेश विधानसभा','https://uplegisassembly.gov.in/'),L('मुख्य निर्वाचन अधिकारी, उत्तर प्रदेश','https://ceouttarpradesh.nic.in/'),L('जनसुनवाई — UP शिकायत पोर्टल','https://jansunwai.up.nic.in/')]},
 {id:'himachal',name:'हिमाचल प्रदेश',m:'🏔️',kind:'राज्य',head:'मुख्यमंत्री (CM) — विधानसभा में बहुमत से; राज्यपाल संवैधानिक प्रमुख',vs:68,ls:4,rs:3,
  links:[L('हिमाचल विधानसभा (e-Vidhan)','https://hpvs.neva.gov.in/')]},
 {id:'jk',name:'जम्मू-कश्मीर',m:'🍁',kind:'केंद्र शासित प्रदेश (विधानसभा सहित, 2019 से)',head:'मुख्यमंत्री (CM) + उपराज्यपाल (LG); 90 चुनी सीटें, LG 5 तक सदस्य मनोनीत कर सकते हैं',vs:90,ls:5,rs:4,
  links:[L('जम्मू-कश्मीर विधानसभा (e-Vidhan)','https://jkla.neva.gov.in/'),L('मुख्य निर्वाचन अधिकारी, J&K','https://ceojk.nic.in/')]},
 {id:'chandigarh',name:'चंडीगढ़',m:'🌳',kind:'केंद्र शासित प्रदेश (बिना विधानसभा)',head:'कोई CM नहीं — प्रशासक (अनुच्छेद 239) शासन चलाते हैं; शहर के काम नगर निगम के पास',vs:0,ls:1,rs:0,
  links:[L('मुख्य निर्वाचन अधिकारी, चंडीगढ़','https://ceochandigarh.gov.in/')]}];
const STEPS=['वोटर सर्विस पोर्टल पर EPIC/नाम से अपना विधानसभा व लोकसभा क्षेत्र देखो','ECI नतीजे पेज पर उस क्षेत्र का विजेता देखो','विधानसभा/लोक सभा की आधिकारिक सूची में संपर्क देखो','काम न हो तो लिखित शिकायत (पोर्टल) या RTI — विनम्र, तथ्य के साथ'];
function quiz(x){const q=[['लोक सभा में '+x.name+' की कितनी सीटें?',[String(x.ls),String(x.ls+2),String(x.ls+5)],0]];
 q.push(x.vs?['विधानसभा में कितनी चुनी सीटें?',[String(x.vs),String(x.vs+10),String(x.vs-8)],0]:['चंडीगढ़ में विधानसभा है?',['नहीं — प्रशासक व नगर निगम','हाँ, 30 सीटें','हाँ, 60 सीटें'],0]);
 q.push(x.rs?['राज्य सभा में कितनी सीटें?',[String(x.rs),String(x.rs+3),String(x.rs+1)],0]:['चंडीगढ़ की राज्य सभा सीटें?',['0','1','2'],0]);return q}
S.forEach(s=>{s.quiz=quiz(s)});
const IDS=S.map(s=>s.id),fresh=()=>({v:1,done:[],badge:false});
function validate(s){if(!s||s.v!==1||!Array.isArray(s.done))return fresh();const done=[...new Set(s.done.filter(x=>IDS.includes(x)))];return{v:1,done,badge:s.badge===true||done.length===IDS.length};}
function finish(s,id,right,total){s=validate(s);if(right<Math.ceil(total*2/3)||s.done.includes(id)||!IDS.includes(id))return{state:s,isNew:false,badgeNew:false};const done=[...s.done,id],all=done.length===IDS.length;return{state:{v:1,done,badge:s.badge||all},isNew:true,badgeNew:all&&!s.badge};}
return{KEY,BADGE,NOTE,COMMON,S,STEPS,IDS,fresh,validate,finish};});
