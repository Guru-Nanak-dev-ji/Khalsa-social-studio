(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNYojana=m;})(this,function(){'use strict';
// 🧭 योजना द्वार — roadmap-1001 (group targets) + planning steps summarised in our own words.
const TARGET=1001;
const GROUPS=[['main','🚪','मुख्य द्वार, कंट्रोल रूम, साझा सुविधाएँ',25],['region','🗺️','क्षेत्रीय दुनिया, नक्शे, प्रस्तावित तख़्त',151],['gurbani','📿','गुरबाणी, दर्शन, शिक्षा',175],['history','🏛️','इतिहास, विरासत, सर्व-धर्म स्थल',125],['stories','📖','कहानियाँ, किताबें, अध्याय',100],['games','🎮','खेल, पहेलियाँ, खोज',100],['seva','🍲','लंगर, सेवा, सामुदायिक मदद',75],['work','🌾','काम, हुनर, खेती, कारोबार',75],['news','📰','न्यूज़, KNN, स्टूडियो',50],['music','🎵','संगीत, MyTube, रचनात्मक कला',40],['funny','😂','Funnybook',25],['ai','🤖','AI, Creator, डिजिटल टूल',35],['rights','⚖️','हक़, सेहत, मदद संसाधन',25]].map(([id,e,name,target])=>({id,e,name,target}));
const STATUSES=['planned','building','review','checked','published'];
const ST_HI={planned:'योजना में',building:'बन रहा',review:'समीक्षा',checked:'जाँचा गया',published:'प्रकाशित'};
const RULES=['भाषा-संस्करण या दोहराया रास्ता अलग पेज नहीं गिना जाता।','रजिस्ट्री में दर्ज होना ≠ प्रकाशित होना।','हर पेज का साफ़ मक़सद और वापसी का रास्ता हो।','3D के साथ सादी सूची और खोज भी मिले।'];
const SOURCE='https://me-page.com/hi/blog/getting-started/how-to-plan-your-website-before-you-start-building';
// Own-words Hindi summary of the source's planning steps, each tied to how KDN applies it.
const STEPS=[['🎯','पहले मक़सद','एक मुख्य लक्ष्य तय करो; बाक़ी लक्ष्य उसकी मदद करें, टकराएँ नहीं।','KDN: सेवा, सीख और सिख विरासत — मुफ़्त, हिंदी पहले।'],
['👥','आने वाला कौन?','सोचो कि कौन आएगा, उसे क्या चाहिए और उसके मन में कौन-से सवाल होंगे।','बच्चे, परिवार, बुज़ुर्ग, मदद ढूँढने वाले।'],
['🧱','ढाँचा','हर पेज तभी बने जब उसका काम साफ़ हो — दूसरों की नक़ल में नहीं।','13 समूह, 1001 का लक्ष्य।'],
['🗺️','साइट-नक्शा','पेज आपस में कैसे जुड़ते हैं, काग़ज़ पर खींचो — छूटे या फ़ालतू पेज दिख जाएँगे।','सब (🗂️) सूची + यह योजना पेज।'],
['✍️','सामग्री पहले','लिखना और चित्र जुटाना डिज़ाइन से ज़्यादा समय लेते हैं — पहले से तैयारी करो।','कोई गढ़ा हुआ नाम/अंक नहीं; स्रोत जाँचो।'],
['🧭','यात्री का रास्ता','आगंतुक किस क्रम में चलेगा और हर क़दम पर अगला काम (बटन) साफ़ दिखे।','हर पेज पर वापसी और अगला लिंक।'],
['🔗','सरल नेविगेशन','मेनू छोटा, नाम जाने-पहचाने; कुछ ही क्लिक में ज़रूरी चीज़।','द्वार → समूह → पेज।'],
['📱','मोबाइल पहले','छोटी स्क्रीन पर पढ़ना, दबाना और जल्दी समझना आसान हो।','बड़े बटन, छोटे पैराग्राफ़।'],
['🔍','खोज में मिलना','साफ़ शीर्षक, समझ आने वाले URL, आपस में जुड़े पेज।','हर पेज का title + description।'],
['🛠️','बनाने का तरीक़ा','ऐसा तरीक़ा चुनो जो आज काम करे और कल बढ़ सके।','स्थिर पेज, मुफ़्त/ओपन सोर्स, offline cache।'],
['✅','बनाने से पहले जाँच','लक्ष्य, दर्शक, पेज सूची, नक्शा, सामग्री, बटन, मेनू, खोज-शब्द, मोबाइल — कुछ कम हो तो योजना पूरी करो।','हर PR: टेस्ट + CI पास, फिर merge।'],
['🔄','योजना बदल सकती है','लॉन्च के बाद राय और आँकड़ों से सुधार करते रहो; दूसरों से समीक्षा भी लो।','additive: पुराना हटाओ नहीं, सुधारो।']];
function stats(pages){const P=Array.isArray(pages)?pages:[];const by={};GROUPS.forEach(g=>by[g.id]={reg:0,pub:0});for(const p of P){const b=by[p.group];if(!b)continue;b.reg++;if(p.status==='published')b.pub++;}
 const reg=P.length,pub=P.filter(p=>p.status==='published').length;return{reg,pub,target:TARGET,groups:GROUPS.map(g=>({...g,...by[g.id],pct:Math.min(100,Math.round(by[g.id].pub*100/g.target))}))};}
return{TARGET,GROUPS,STATUSES,ST_HI,RULES,SOURCE,STEPS,stats};});
