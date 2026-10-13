(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNSewa=m;})(this,function(){'use strict';
// ⛑️ सेवा सहायता — सिर्फ़ सरकारी/आधिकारिक नंबर, हर एक का स्रोत साथ में (web से जाँचा, 13 Oct 2026). कोई वकील/व्यक्ति का नाम या नंबर गढ़ा नहीं गया.
const HELP=[
 {id:'112',tel:'112',e:'🚨',name:'आपात सहायता (ERSS) — पुलिस, आग, एम्बुलेंस',cat:'all',src:'https://www.112.gov.in/'},
 {id:'108',tel:'108',e:'🚑',name:'एम्बुलेंस (राज्य सेवा — ज़्यादातर राज्यों में)',cat:'health',src:'https://ddd.gov.in/helpline/'},
 {id:'1098',tel:'1098',e:'🧒',name:'चाइल्ड हेल्पलाइन — 24×7, मुफ़्त',cat:'all',src:'https://www.ncw.gov.in/other-useful-helplines/'},
 {id:'181',tel:'181',e:'👩',name:'महिला हेल्पलाइन',cat:'all',src:'https://www.ncw.gov.in/other-useful-helplines/'},
 {id:'14490',tel:'14490',e:'👩‍⚖️',name:'राष्ट्रीय महिला आयोग (NCW) 24×7 हेल्पलाइन',cat:'legal',src:'https://www.ncw.gov.in/other-useful-helplines/'},
 {id:'14567',tel:'14567',e:'👴',name:'एल्डरलाइन — बुज़ुर्गों के लिए (जानकारी, सहारा)',cat:'health',src:'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2314163'},
 {id:'14416',tel:'14416',e:'💛',name:'Tele-MANAS — मानसिक स्वास्थ्य, मुफ़्त 24×7 (1-800-891-4416 भी)',cat:'health',src:'https://telemanas.mohfw.gov.in/'},
 {id:'1930',tel:'1930',e:'💻',name:'साइबर अपराध / ऑनलाइन ठगी (cybercrime.gov.in)',cat:'legal',src:'https://www.ncw.gov.in/other-useful-helplines/'},
 {id:'15100',tel:'15100',e:'⚖️',name:'NALSA मुफ़्त कानूनी सहायता',cat:'legal',src:'https://nalsa.gov.in/faqs/'}];
const LEGAL=[
 {e:'🏛️',name:'NALSA — राष्ट्रीय विधिक सेवा प्राधिकरण',info:'मुफ़्त वकील, लोक अदालत; ऑनलाइन आवेदन',href:'https://nalsa.gov.in/'},
 {e:'🗺️',name:'राज्य विधिक सेवा प्राधिकरण (SLSA) — हर राज्य की सूची',info:'NALSA की आधिकारिक directory में हर राज्य का पता, फ़ोन और website',href:'https://nalsa.gov.in/directory/'},
 {e:'🏢',name:'ज़िला विधिक सेवा प्राधिकरण (DLSA)',info:'हर ज़िला अदालत परिसर में front office — वहीं आवेदन',href:'https://nalsa.gov.in/faqs/'},
 {e:'📱',name:'Tele-Law — वीडियो/फ़ोन पर मुफ़्त सलाह',info:'CSC केंद्र या Tele-Law app से panel वकील',href:'https://www.tele-law.in/'}];
const RIGHTS=[
 {id:'aid',e:'🆓',t:'मुफ़्त वकील का हक़',d:'महिलाएँ, बच्चे, SC/ST, हिरासत में व्यक्ति, आपदा पीड़ित, और तय आय से कम वाले लोग मुफ़्त कानूनी सहायता के हक़दार हैं (Legal Services Authorities Act, 1987, धारा 12)।'},
 {id:'fir',e:'📝',t:'शिकायत दर्ज कराने का हक़',d:'संज्ञेय अपराध की सूचना पुलिस को लिखवाई जा सकती है; उसकी मुफ़्त कॉपी पाने का हक़ है। थाना मना करे तो वरिष्ठ अधिकारी या मजिस्ट्रेट के पास जा सकते हैं।'},
 {id:'arrest',e:'🚔',t:'गिरफ़्तारी पर हक़',d:'गिरफ़्तारी का कारण जानने, वकील से मिलने, परिवार को सूचना देने और 24 घंटे में मजिस्ट्रेट के सामने पेश किए जाने का हक़ (संविधान अनुच्छेद 22)।'},
 {id:'consumer',e:'🛒',t:'उपभोक्ता का हक़',d:'ख़राब सामान या सेवा पर उपभोक्ता आयोग में शिकायत; edaakhil.nic.in से ऑनलाइन भी।'},
 {id:'rti',e:'📄',t:'जानकारी का हक़ (RTI)',d:'सरकारी दफ़्तर से जानकारी माँगने का हक़; आम तौर पर 30 दिन में जवाब (RTI Act, 2005)। rtionline.gov.in'},
 {id:'wage',e:'🛠️',t:'मज़दूरी का हक़',d:'तय न्यूनतम मज़दूरी और समय पर भुगतान का हक़; शिकायत श्रम विभाग में।'}];
const AID_CATS=[{id:'food',e:'🍛',t:'खाना / राशन',go:'./langar.html'},{id:'health',e:'🩺',t:'सेहत',go:'./sehat.html'},{id:'education',e:'📚',t:'पढ़ाई',go:'./study.html'},{id:'legal',e:'⚖️',t:'कानूनी',go:'./vakil.html'},{id:'job',e:'🛠️',t:'नौकरी',go:'./nanak-ghar.html'}];
const BADGES={rights:'हक़ जानकार',aid:'मदद साथी'};
const KEY='kdn-sewa-v1';
const fresh=()=>({v:1,read:[],reqs:[],joins:[],rightsBadge:false,aidBadge:false});
const cl=(t,n)=>String(t==null?'':t).replace(/[<>]/g,'').replace(/\s+/g,' ').trim().slice(0,n||200);
function validate(s){if(!s||s.v!==1)return fresh();const ids=RIGHTS.map(r=>r.id),read=[...new Set((s.read||[]).filter(x=>ids.includes(x)))];
 const reqs=(Array.isArray(s.reqs)?s.reqs:[]).filter(r=>r&&AID_CATS.some(c=>c.id===r.cat)).slice(-30).map(r=>({cat:r.cat,note:cl(r.note,400),city:cl(r.city,40),ts:+r.ts||0}));
 const joins=(Array.isArray(s.joins)?s.joins:[]).slice(-10).map(j=>({name:cl(j&&j.name,80),city:cl(j&&j.city,40),ts:+(j&&j.ts)||0,status:'review'}));
 return{v:1,read,reqs,joins,rightsBadge:s.rightsBadge===true||read.length===RIGHTS.length,aidBadge:s.aidBadge===true||reqs.length>0};}
function readRight(s,id){s=validate(s);if(!RIGHTS.some(r=>r.id===id)||s.read.includes(id))return{state:s,badgeNew:false};const read=[...s.read,id],all=read.length===RIGHTS.length;return{state:{...s,read,rightsBadge:s.rightsBadge||all},badgeNew:all&&!s.rightsBadge};}
function addReq(s,r){s=validate(s);if(!AID_CATS.some(c=>c.id===r.cat))return{state:s,error:'विषय चुनिए'};const note=cl(r.note,400);if(note.length<5)return{state:s,error:'ज़रूरत थोड़ा लिखिए'};
 const reqs=[...s.reqs,{cat:r.cat,note,city:cl(r.city,40),ts:Date.now()}].slice(-30);return{state:{...s,reqs,aidBadge:true},badgeNew:!s.aidBadge};}
function addJoin(s,j){s=validate(s);return{...s,joins:[...s.joins,{name:cl(j.name,80),city:cl(j.city,40),ts:Date.now(),status:'review'}].slice(-10)};}
const telOk=t=>/^\d{3,5}$/.test(t);
return{KEY,HELP,LEGAL,RIGHTS,AID_CATS,BADGES,fresh,validate,readRight,addReq,addJoin,telOk};});
