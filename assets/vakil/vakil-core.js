(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNVakil=m;})(this,function(){'use strict';
// ⚖️ कानूनी साथी — वकील सूची. सिर्फ़ data/vakil.json की जाँची हुई entries. कोई नाम/नंबर गढ़ा नहीं जाता.
const KEY='kdn-vakil-v1',MAIL='khatrinewsnetwork@gmail.com';
const CATS=[{id:'zameen',icon:'🏡',name:'ज़मीन-जायदाद / घर'},{id:'parivar',icon:'👨‍👩‍👧',name:'परिवार'},{id:'apradh',icon:'🚔',name:'अपराध'},{id:'upbhokta',icon:'🛒',name:'उपभोक्ता'},{id:'rti',icon:'📄',name:'RTI'},{id:'naukri',icon:'🛠️',name:'नौकरी / मज़दूरी'},{id:'immigration',icon:'✈️',name:'इमिग्रेशन'}];
const CAT_IDS=CATS.map(c=>c.id);
// मुफ़्त कानूनी मदद — हर नंबर सरकारी/आधिकारिक site से जाँचा गया (13 Oct 2026)
const FREE=[
 {id:'nalsa',flag:'🇮🇳',name:'NALSA राष्ट्रीय कानूनी सहायता हेल्पलाइन',tel:'15100',info:'भारत · मुफ़्त · 24×7 IVRS, ज़िला DLSA से जोड़ते हैं',src:'https://nalsa.gov.in/faqs/'},
 {id:'telelaw',flag:'🇮🇳',name:'Tele-Law (टेली-लॉ)',tel:'',info:'भारत · मुफ़्त · CSC केंद्र या Tele-Law app से panel वकील से video/phone पर सलाह',src:'https://www.tele-law.in/'},
 {id:'lao',flag:'🇨🇦',name:'Legal Aid Ontario',tel:'1-800-668-8258',info:'कनाडा (Ontario) · सोम–शुक्र सुबह 8 से शाम 5 · 300+ भाषाएँ',src:'https://www.legalaid.on.ca/our-services/'}];
const clean=(t,n)=>String(t==null?'':t).replace(/[<>]/g,'').replace(/\s+/g,' ').trim().slice(0,n||200);
function validLawyer(x){return !!(x&&x.verified===true&&x.consent===true&&clean(x.name)&&clean(x.city)&&Array.isArray(x.cats)&&x.cats.some(c=>CAT_IDS.includes(c)));}
function lawyers(data){return(data&&Array.isArray(data.lawyers)?data.lawyers:[]).filter(validLawyer).map(x=>({id:clean(x.id,40),name:clean(x.name,80),city:clean(x.city,40),country:clean(x.country,20),cats:x.cats.filter(c=>CAT_IDS.includes(c)),phone:clean(x.phone,20),email:clean(x.email,80),langs:clean(x.langs,60)}));}
function cities(list){return [...new Set(list.map(l=>l.city))].sort();}
function filter(list,cat,city){return list.filter(l=>(!cat||l.cats.includes(cat))&&(!city||l.city===city));}
const catName=id=>(CATS.find(c=>c.id===id)||{}).name||'';
const FORMS={join:{tag:'वकील-जुड़ें',title:'⚖️ वकील के रूप में जुड़ें'},help:{tag:'कानूनी-मदद',title:'🙏 मुझे कानूनी मदद चाहिए'}};
function validForm(type,f){if(!FORMS[type]||!f)return{ok:false,why:'type'};const name=clean(f.name,80),city=clean(f.city,40),contact=clean(f.contact,80),cat=CAT_IDS.includes(f.cat)?f.cat:'',note=clean(f.note,400);
 if(!name)return{ok:false,why:'नाम लिखिए'};if(!city)return{ok:false,why:'शहर लिखिए'};if(!contact)return{ok:false,why:'phone या email लिखिए'};if(!cat)return{ok:false,why:'विषय चुनिए'};if(f.agree!==true)return{ok:false,why:'सहमति ✔ कीजिए'};
 return{ok:true,item:{type,name,city,contact,cat,note,bar:clean(f.bar,40)}};}
function message(it){const L=['['+FORMS[it.type].tag+'] KDN ⚖️ कानूनी साथी',FORMS[it.type].title,'नाम: '+it.name,'शहर: '+it.city,'संपर्क: '+it.contact,'विषय: '+catName(it.cat)];
 if(it.bar)L.push('Bar/enrolment no.: '+it.bar);if(it.note)L.push((it.type==='join'?'अनुभव: ':'मामला (छोटा सा): ')+it.note);L.push('page: not4you.world/vakil.html');return L.join('\n');}
const waLink=t=>'https://wa.me/?text='+encodeURIComponent(t);
const mailLink=t=>'mailto:'+MAIL+'?subject='+encodeURIComponent(t.split('\n')[0])+'&body='+encodeURIComponent(t);
function fresh(){return{v:1,sent:[]};}
function validate(s){if(!s||s.v!==1||!Array.isArray(s.sent))return fresh();return{v:1,sent:s.sent.filter(x=>x&&FORMS[x.type]&&typeof x.ts==='number').slice(-20).map(x=>({type:x.type,ts:x.ts,city:clean(x.city,40),cat:CAT_IDS.includes(x.cat)?x.cat:''}))};}
function record(s,it,ts){s=validate(s);return{v:1,sent:[...s.sent,{type:it.type,ts,city:it.city,cat:it.cat}].slice(-20)};}
return{KEY,MAIL,CATS,CAT_IDS,FREE,FORMS,clean,validLawyer,lawyers,cities,filter,catName,validForm,message,waLink,mailLink,fresh,validate,record};});
