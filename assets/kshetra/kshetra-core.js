(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNKshetra=m;})(this,function(){'use strict';
// 🗺️ KDN क्षेत्र — KDN का प्रस्तावित डिजिटल क्षेत्र-नक्शा (roadmap-1001: 101 = 5 मंडल × 20 + राजधानी नर्मदापुर). यह कोई आधिकारिक/सरकारी सीमा नहीं है।
// Facts checked Oct 2026: The Hindu + ThePrint (Bathinda Qila Mubarak, ASI), bathinda.nic.in (Damdama Sahib), Indian Express (Malwa 69 seats, "Bai-ji"), Malwai dialect refs.
const KEY='kdn-kshetra-v1',BADGE='मालवा यात्री';
const DISCLAIMER='यह KDN का प्रस्तावित डिजिटल क्षेत्र है — सीखने और सेवा के लिए। यह कोई आधिकारिक, प्रशासनिक या राजनीतिक सीमा नहीं है।';
const pad=n=>String(n).padStart(3,'0');
const SLOTS=[...Array.from({length:100},(_,i)=>({code:'KDN-S-'+pad(i+1),mandal:Math.floor(i/20)+1,status:'planned'})),{code:'राजधानी',mandal:0,name:'नर्मदापुर (प्रस्तावित राजधानी)',status:'planned'}];
const LIVE={'KDN-S-060':{name:'मालवा',href:'./kshetra-malwa.html'}};
SLOTS.forEach(s=>{const l=LIVE[s.code];if(l){s.name=l.name;s.href=l.href;s.status='published'}});
const CRAFTS=[
 {id:'phulkari',e:'🧵',n:'फुलकारी',s:'"फुल-कारी" यानी फूलों का काम। सादे कपड़े पर रेशमी धागे से उल्टी तरफ़ से टाँके — पीढ़ियों से माँ-दादी बेटियों को सिखाती आईं। पटियाला इसका बड़ा बाज़ार है, और फुलकारी को GI (भौगोलिक संकेत) पहचान भी मिली है।'},
 {id:'jutti',e:'👞',n:'पंजाबी जुत्ती',s:'चमड़े पर ज़री और धागे की कढ़ाई। पटियाला की जुत्ती दूर-दूर तक जानी जाती है — कारीगर हाथ से सिलाई करते हैं।'},
 {id:'paranda',e:'🎀',n:'परांदा',s:'बालों की चोटी में गूँथा जाने वाला रंगीन धागों का गुच्छा — लोक-गीतों में भी इसका ज़िक्र आता है।'},
 {id:'peerhi',e:'🪑',n:'पीढ़ी और मंजी',s:'लकड़ी और सूत से बुनी छोटी चौकी (पीढ़ी) और चारपाई (मंजी) — सत्थ और आँगन की पहचान।'},
 {id:'charkha',e:'🧶',n:'चरखा',s:'पुराने समय में त्रिंजण में लड़कियाँ मिलकर चरखा कातती और गीत गातीं — सूत से खेस और दरियाँ बनतीं।'}];
const FACTS=[
 {e:'🌊',t:'जगह',d:'मालवा पंजाब का दक्षिणी हिस्सा है — आम तौर पर सतलुज के दक्षिण और घग्गर के उत्तर। यह पंजाब का सबसे बड़ा क्षेत्र है (विधानसभा की 117 में से 69 सीटें)।'},
 {e:'🏰',t:'बठिंडा का क़िला मुबारक',d:'ASI द्वारा संरक्षित राष्ट्रीय महत्व का स्मारक। 1240 में रज़िया सुल्तान को यहीं क़ैद किया गया था।',flag:'"भारत का सबसे पुराना बचा हुआ क़िला" और इसकी सही उम्र (लगभग 1600 साल, ASI के अनुसार करीब 6वीं सदी) पर इतिहासकारों में मतभेद है।'},
 {e:'🛕',t:'तख़्त श्री दमदमा साहिब',d:'तलवंडी साबो (बठिंडा ज़िला) में। गुरु गोबिंद सिंह जी यहाँ लगभग नौ महीने ठहरे; इसे "गुरु की काशी" भी कहते हैं।',href:'./takht-3.html'},
 {e:'🗣️',t:'बोली — मलवई',d:'मालवा की पंजाबी बोली मलवई कहलाती है। आदर से "बाई जी" कहना यहाँ आम है। मलवई गिद्धा यहाँ का लोक-नृत्य है।'},
 {e:'🌾',t:'खेती और खाना',d:'गेहूँ-धान के साथ दक्षिणी ज़िले (बठिंडा, मानसा, फ़रीदकोट आदि) कपास-पट्टी के लिए जाने जाते हैं। लंगर-घरों में दाल, प्रशादा, खीर; घरों में साग-मक्की, लस्सी और पिन्नी।'},
 {e:'⚔️',t:'श्री मुक्तसर साहिब',d:'चाली मुक्तों की याद में हर साल माघी का मेला लगता है।',flag:'खिदराणे की लड़ाई का साल (1704 या 1705) स्रोतों में अलग-अलग मिलता है।'}];
const QUIZ=[['तख़्त श्री दमदमा साहिब किस ज़िले में है?',['बठिंडा','अमृतसर','जालंधर'],0],['मालवा की बोली को क्या कहते हैं?',['मलवई','माझी','दोआबी'],0],['बठिंडा के क़िले में किसे क़ैद किया गया था?',['रज़िया सुल्तान','अकबर','शेरशाह'],0]];
const SEVA_N=8; // जोड़ा घर: 8 जोड़ी जूते सही रैक नंबर पर रखो
const fresh=()=>({v:1,crafts:[],seva:false,quiz:false,badge:false});
function validate(s){if(!s||s.v!==1||!Array.isArray(s.crafts))return fresh();const crafts=[...new Set(s.crafts.filter(c=>CRAFTS.some(x=>x.id===c)))];const o={v:1,crafts,seva:s.seva===true,quiz:s.quiz===true,badge:false};o.badge=s.badge===true||done(o);return o;}
const done=s=>s.seva&&s.quiz&&s.crafts.length>=3;
function step(s,kind,val){s=validate(s);const was=s.badge,n={...s,crafts:[...s.crafts]};if(kind==='craft'&&CRAFTS.some(x=>x.id===val)&&!n.crafts.includes(val))n.crafts.push(val);if(kind==='seva')n.seva=true;if(kind==='quiz'&&val>=2)n.quiz=true;n.badge=was||done(n);return{state:n,badgeNew:n.badge&&!was};}
const counted=SLOTS.filter(s=>s.status==='published').length;
return{KEY,BADGE,DISCLAIMER,SLOTS,LIVE,CRAFTS,FACTS,QUIZ,SEVA_N,counted,fresh,validate,step};});
