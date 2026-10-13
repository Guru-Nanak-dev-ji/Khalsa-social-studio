/* SPDX-License-Identifier: MIT — KDN's free, local cinematic presentation. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.KDNRealmCore=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const mission=Object.freeze({header:'किरत करो वंड छक्को',sharing:'सबकुछ सबका, सब को सबकुछ free',reason:'क्योंकि वाहेगुरु जी ने हमें सब मुफ्त में ही दिया है और देता ही जा रहा है।',bani:'ਦੇਦਾ ਦੇ ਲੈਦੇ ਥਕਿ ਪਾਹਿ ॥',signature:'New khalsa world order'});
 const realms={
  self:['पहला आईना','खुद को सुनने के लिए, एक पल ठहरिए।','स्वयं · सत्य की तलाश','amber'],
  family:['रिश्तों का आँगन','साथ निभाना और सही बात कहना—दोनों की जगह है।','परिवार · प्रेम और विवेक','rose'],
  community:['साझे नगर का द्वार','एक छोटा योगदान, बहुतों के लिए एक नई शुरुआत।','मोहल्ला · साथ और सेवा','jade'],
  society:['विचारों की सभा','मत अलग हो सकते हैं। सम्मान और संवाद साझा रहेंगे।','समाज · बराबर भागीदारी','indigo'],
  nature:['सरबत का संसार','पशु, पक्षी, धरती—इस कहानी में सबकी जगह है।','प्रकृति · सबका भला','jade'],
  economy:['आर्थिक मंडल','अपना हुनर पहचानिए। सीखने और साथ काम करने के रास्ते खोजिए।','हुनर · सहयोग · संभावना','amber'],
  social:['संगत की चौपाल','अपनी बात, अपनी रचना और एक-दूसरे से सीखने का आँगन।','संगत · रचना · संवाद','rose'],
  myneta:['पाँच साथियों की सभा','अपनी पंचायत चुनिए और जिम्मेदारी का अर्थ समझिए।','My Neta · भागीदारी','indigo'],
  knowledge:['ज्ञान का मंडल','हर जवाब के पीछे एक नया क्यों छुपा है।','ज्ञान · खोज · अभ्यास','indigo'],
  seva:['सेवा का आँगन','किरत और साझेदारी से एक-दूसरे का सहारा बनिए।','सेवा · मिलकर आगे','jade']
 };
 function scene(input={}){let id=input.id||'',key=id;if(/^pran-[0-4]$/.test(id))key=['self','family','community','society','nature'][Number(id.slice(-1))];if(!realms[key])key=/gyan|faq|library|news/.test(id)?'knowledge':/seva|community/.test(id)?'seva':/social|creator|poster|studio/.test(id)?'social':/work|economic|bazaar/.test(id)?'economy':'self';const v=realms[key];return {id,title:input.name||v[0],copy:input.purpose||v[1],eyebrow:v[2],tone:v[3]};}
 function progress(elapsed,duration){return Math.max(0,Math.min(1,elapsed/Math.max(1,duration)));}
 return {mission,scene,progress,doorDuration:2800,tourDuration:6800};
});
