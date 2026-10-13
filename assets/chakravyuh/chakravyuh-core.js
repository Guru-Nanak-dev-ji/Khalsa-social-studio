(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNChakra=m;})(this,function(){'use strict';
// चक्रव्यूह कथा — महाभारत (द्रोण पर्व) की अभिमन्यु कथा, 7 घेरे, हर घेरा एक प्रश्न. सिर्फ़ कथा के तथ्य, कोई गढ़ा हुआ उद्धरण नहीं.
const KEY='kdn-chakravyuh-v1',BADGE='चक्रव्यूह भेदक';
const RINGS=[
 {story:'कुरुक्षेत्र का युद्ध चल रहा है। एक वीर किशोर आगे बढ़ता है — अभिमन्यु।',q:'अभिमन्यु के पिता कौन थे?',opts:['अर्जुन','भीम','कर्ण','युधिष्ठिर'],a:0},
 {story:'उसकी माँ श्रीकृष्ण की बहन थीं।',q:'अभिमन्यु की माता कौन थीं?',opts:['द्रौपदी','सुभद्रा','कुंती','गांधारी'],a:1},
 {story:'कौरवों के सेनापति ने ऐसी व्यूह-रचना की जिसे भेदना बहुत कठिन था।',q:'चक्रव्यूह की रचना किसने की?',opts:['भीष्म','दुर्योधन','द्रोणाचार्य','शकुनि'],a:2},
 {story:'उस दिन अर्जुन युद्ध में दूर दूसरी ओर लड़ रहे थे।',q:'युद्ध के किस दिन चक्रव्यूह बना?',opts:['पहले दिन','दसवें दिन','तेरहवें दिन','अठारहवें दिन'],a:2},
 {story:'कथा कहती है कि अभिमन्यु ने व्यूह में घुसना माँ के गर्भ में ही सुन लिया था, पर निकलना नहीं।',q:'अभिमन्यु क्या नहीं जानता था?',opts:['व्यूह में घुसना','व्यूह से बाहर निकलना','धनुष चलाना','रथ चलाना'],a:1},
 {story:'अभिमन्यु भीतर घुस गया, पर पीछे आते पांडवों को द्वार पर ही रोक दिया गया।',q:'पांडवों को व्यूह के द्वार पर किसने रोका?',opts:['जयद्रथ','अश्वत्थामा','कृपाचार्य','दुःशासन'],a:0},
 {story:'अभिमन्यु वीरगति को प्राप्त हुआ, पर उसका वंश आगे चला।',q:'अभिमन्यु और उत्तरा के पुत्र कौन थे, जो आगे राजा बने?',opts:['जनमेजय','परीक्षित','प्रद्युम्न','घटोत्कच'],a:1}];
const LESSON='सीख: किसी भी काम में घुसने के साथ-साथ बाहर निकलने का रास्ता भी पूरा सीखो, और अकेले मत पड़ो — संगत साथ रखो।';
const fresh=()=>({v:1,ring:0,wrong:0,done:false,badge:false});
function validate(s){if(!s||s.v!==1)return fresh();const n=x=>Number.isFinite(x)&&x>=0?Math.trunc(x):0;const ring=Math.min(n(s.ring),RINGS.length);
 return{v:1,ring,wrong:n(s.wrong),done:ring===RINGS.length,badge:!!s.badge||ring===RINGS.length};}
function answer(s,i){s=validate(s);if(s.done)return{state:s,right:null,badgeNew:false};const right=i===RINGS[s.ring].a;
 if(!right)return{state:{...s,wrong:s.wrong+1},right:false,badgeNew:false};
 const ring=s.ring+1,done=ring===RINGS.length;return{state:{...s,ring,done,badge:s.badge||done},right:true,badgeNew:done&&!s.badge};}
const restart=s=>({...fresh(),badge:validate(s).badge});
return{KEY,BADGE,RINGS,LESSON,fresh,validate,answer,restart};});
