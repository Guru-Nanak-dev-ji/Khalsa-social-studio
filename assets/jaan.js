// KDN जान layer: emoji particles, sliders, ताश/प्यादा mini-games, bounce-in. Original, free, offline.
(function(){'use strict';
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var EMO=['😁','💰','📚','⛑️','♟️','🃏','🦅','✨','🪔','🌼'];
var TIPS=['📚 रोज़ 10 मिनट पढ़ो — दिमाग़ चमकेगा','💰 पहले बचाओ, फिर ख़र्चो','⛑️ सेहत ही असली ख़ज़ाना','😁 मुस्कान मुफ़्त है, बाँटो','🦅 ऊँचा सोचो, धीरे बोलो','♟️ प्यादा भी चलते-चलते राजा बनता है','🤝 वंड छको — मिलकर खाओ','🪔 एक अच्छा काम, आज ही'];
function mk(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.textContent=h;return e;}
function sky(){if(reduce||document.querySelector('.jaan-sky')||document.body.dataset.jaan==='off')return;var s=mk('div','jaan-sky');s.setAttribute('aria-hidden','true');
 for(var i=0;i<9;i++){var p=mk('span','jaan-p',EMO[i%EMO.length]);p.style.left=(Math.random()*95)+'%';p.style.setProperty('--d',(12+Math.random()*10).toFixed(1)+'s');p.style.setProperty('--dl',(-Math.random()*18).toFixed(1)+'s');p.style.setProperty('--dx',((Math.random()-.5)*120|0)+'px');s.appendChild(p);}
 document.body.prepend(s);var m=mk('div','jaan-motifs');m.setAttribute('aria-hidden','true');['♟️','🃏','🦅'].forEach(function(x){m.appendChild(mk('span','',x));});document.body.appendChild(m);}
var IMG={city:'lworld/city',lib:'lworld/library',sun:'lworld/sun',gate:'lworld/gate',mehraab:'world/full-mehraab-ivory-v11',sfal:'world/falcon-silver-flight-v29',gfal:'world/falcon-golden-flight-v29'};'ghar kachehri pustak ghat kila network bazaar vedh meenar gurudar baag mahal darwaza kothri langar'.split(' ').forEach(function(k){IMG[k]='khoya/bg/'+k;});
function build(el){(el.dataset.jaanSlides||'').split(';').forEach(function(p,i){var a=p.split('|');if(!IMG[a[0]])return;var f=mk('figure',i?'':'on'),im=mk('img');im.src='./assets/'+IMG[a[0]]+'.'+'webp';im.alt=a[1]||'';im.decoding='async';f.append(im,mk('figcaption','',a[1]||''));el.appendChild(f);});}
function slider(el){if(el.dataset.jaanDone)return;el.dataset.jaanDone='1';if(el.dataset.jaanSlides)build(el);var f=[].slice.call(el.querySelectorAll('figure'));if(!f.length)return;var i=0,d=mk('div','jaan-dots');
 function go(n){f[i].classList.remove('on');d.children[i].classList.remove('on');i=(n+f.length)%f.length;f[i].classList.add('on');d.children[i].classList.add('on');}
 f.forEach(function(_,k){var b=mk('button');b.type='button';b.setAttribute('aria-label','तस्वीर '+(k+1));b.onclick=function(){go(k);};d.appendChild(b);});el.appendChild(d);f[0].classList.add('on');d.children[0].classList.add('on');
 var x0=null;el.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});el.addEventListener('touchend',function(e){if(x0==null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>30)go(i+(dx<0?1:-1));x0=null;});
 if(!reduce)setInterval(function(){if(!document.hidden)go(i+1);},4200);}
function games(el){if(el.dataset.jaanDone)return;el.dataset.jaanDone='1';el.classList.add('jaan-games');
 var a=mk('div','jaan-box');a.appendChild(mk('h3','jaan-head','🃏 ताश का पत्ता'));var c=mk('button','jaan-card');c.type='button';c.setAttribute('aria-label','पत्ता पलटो');var w=mk('i'),b=mk('b','','🦅'),t=mk('em','',TIPS[0]);w.append(b,t);c.appendChild(w);
 c.onclick=function(){if(!c.classList.contains('flip'))t.textContent=TIPS[Math.random()*TIPS.length|0];c.classList.toggle('flip');};a.append(c,mk('p','','छूकर पलटो — आज की सीख'));
 var g=mk('div','jaan-box');g.appendChild(mk('h3','jaan-head','♟️ प्यादा चलाओ'));var bd=mk('div','jaan-board'),pos=0,cells=[];for(var k=0;k<8;k++){var s=mk('span');bd.appendChild(s);cells.push(s);}cells[0].textContent='♟️';cells[7].textContent='👑';
 var msg=mk('p','','प्यादा 7 क़दम चले तो राजा!'),btn=mk('button','jaan-btn','आगे बढ़ो ➜');btn.type='button';msg.setAttribute('aria-live','polite');
 btn.onclick=function(){cells[pos].textContent='';pos=(pos+1)%8;if(pos===0){cells[7].textContent='👑';}cells[pos].textContent=pos===7?'👑♟️':'♟️';msg.textContent=pos===7?'🎉 प्यादा राजा बन गया! 😁':'क़दम '+pos+' / 7';};
 g.append(bd,btn,msg);el.append(a,g);}

var FUN={'shell':['🎲 नगर का पासा',['🎲 1 — लंगर में सेवा 🍲','🎲 2 — पुस्तकालय में 1 पन्ना 📚','🎲 3 — बाज़ के साथ उड़ान 🦅','🎲 4 — महल में दीया 🪔','🎲 5 — किसी को मुस्कान 😁','🎲 6 — ख़ज़ाने का सिक्का 💰'],'🎲 फेंको'],
'baaz':["🦅 बाज उड़ा", ["🦅 बाज ऊँचा उड़ा!", "💰 सिक्का पकड़ा!", "🌅 सूरज तक पहुँचा", "🪶 पंख थक गए 😁", "🏅 सीधा badge की ओर"], "🦅 उड़ाओ"],'gyan':["🧠 पहेली बूझो", ["🧠 बिना पैरों के चलती? — घड़ी ⏰", "🧠 जितना खींचो उतना छोटा? — पेंसिल ✏️", "🧠 सबसे तेज़? — मन 💭", "🧠 बाँटने से बढ़े? — ज्ञान 📚", "🧠 बिना पंख उड़े? — ख़बर 📰"], "🧠 बूझो"],
'avatar':["🎭 रूप बदलो", ["🦸 योद्धा", "🧙 ज्ञानी", "👩‍🍳 सेवादार", "🧑‍🚀 खोजी", "🦅 बाज़-सवार"], "🎭 बदलो"],
'audiobook':["🎧 धुन चुनो", ["🎧 धीमी धुन", "🎶 कीर्तन धुन", "🌧️ बारिश की आवाज़", "🌊 नदी की आवाज़", "🐦 सुबह की चिड़िया"], "🎧 चुनो"],
'akarshan':["🧲 चुंबक चलाओ", ["🧲 अच्छी सोच खिंची", "✨ मौक़ा आया", "💰 मेहनत का फल", "😁 ख़ुशी पास आई", "🤝 सही लोग मिले"], "🧲 खींचो"],
'ai-tools':["🤖 रोबोट जगाओ", ["🤖 बीप-बूप! नमस्ते", "🤖 अनुवाद तैयार", "🤖 कविता लिखी", "🤖 तस्वीर बनाई", "🤖 सवाल का जवाब"], "🔋 जगाओ"],
'ai-samvidhan':["📜 नियम खोलो", ["📜 सच बोलो", "📜 निजता बचाओ", "📜 किसी को नुक़सान नहीं", "📜 सबको बराबर", "📜 इंसान आख़िरी फ़ैसला"], "📜 खोलो"],
'kingdom-lands':["🏰 ज़मीन जीतो", ["🏰 पहाड़ी इलाक़ा मिला", "🌾 खेत मिले", "🌊 नदी का किनारा", "🌲 जंगल मिला", "👑 पूरा राज्य!"], "🚩 झंडा गाड़ो"],
'Begampura_FAQ_542_Offline_Reader':["❓ सवाल चुनो", ["❓ बेगमपुरा क्या है?", "❓ यहाँ कौन रहता है?", "❓ ग़म क्यों नहीं?", "❓ सबको बराबर कैसे?", "❓ मैं कैसे जुड़ूँ?"], "❓ चुनो"],
'sankalp':["🎯 निशाना लगाओ", ["🎯 बीच में! शाबाश", "🎯 थोड़ा बाहर — फिर से", "🏹 तीर सीधा", "🔥 संकल्प पक्का", "🏆 लक्ष्य पूरा"], "🏹 छोड़ो"],
'scroll-dwar':["📜 स्क्रॉल खोलो", ["📜 पहला राज़", "📜 पुराना नक्शा", "📜 कविता की पंक्ति", "📜 दादी की सीख", "📜 ख़ज़ाने का सुराग़"], "📜 खोलो"],
'study':["✏️ झटपट सवाल", ["✏️ 7 × 8 = 56", "✏️ भारत की राजधानी: दिल्ली", "✏️ H₂O = पानी", "✏️ 12 महीने, 52 हफ़्ते", "✏️ सूरज एक तारा है ⭐"], "✏️ पूछो"],
'sehat':["💧 पानी पियो", ["💧 1 गिलास — शाबाश", "🚶 10 मिनट टहलो", "😴 7 घंटे नींद", "🥗 हरी सब्ज़ी", "🧘 3 गहरी साँस"], "💧 पियो"],
'khatri-aid':["🛟 मदद भेजो", ["🛟 राशन पहुँचा", "📚 किताबें पहुँचीं", "⛑️ दवा पहुँची", "🧥 कंबल पहुँचे", "🤝 एक और परिवार जुड़ा"], "🛟 भेजो"],
'news-channels':["📡 एंटीना घुमाओ", ["📡 सिग्नल मिला!", "📺 पंजाबी चैनल", "📺 हिंदी ख़बरें", "📺 कनाडा अपडेट", "📶 फ़ुल सिग्नल"], "📡 घुमाओ"],
'studio':["🎛️ लीवर खींचो", ["🎛️ लाइट्स ऑन", "🎙️ माइक चालू", "🎥 कैमरा रोल", "🔴 लाइव!", "✨ जादू शुरू"], "🎛️ खींचो"],
'aaj-bhav':["🌦️ मन का मौसम", ["☀️ धूप — ख़ुश!", "⛅ हल्के बादल", "🌧️ बारिश — रो लो, ठीक है", "🌈 इंद्रधनुष आया", "🌬️ ताज़ी हवा"], "🌦️ देखो"],
'chabi':["🔐 ताला खोलो", ["🔓 खुल गया!", "🔒 ग़लत चाबी 😅", "🗝️ सुनहरी चाबी मिली", "📦 अंदर ख़ज़ाना", "🚪 नया दरवाज़ा"], "🗝️ घुमाओ"],
'gun':["💪 गुण चुनो", ["💪 हिम्मत +1", "🧠 समझ +1", "💛 दया +1", "🙏 नम्रता +1", "⏰ अनुशासन +1"], "🌟 चुनो"],
'patta':["🍃 पत्ता हवा में", ["🍃 उड़कर बाग़ में गिरा", "🍂 सुनहरा पत्ता", "🌿 हरा — नई शुरुआत", "🍁 लाल — जोश", "🃏 इक्का!"], "🌬️ फूँको"],
'nanak-ghar':["🪔 दीया जलाओ", ["🪔 1 दीया जला", "🪔🪔 रोशनी बढ़ी", "✨ आँगन जगमग", "🌙 रात उजली", "🙏 सबके लिए रोशनी"], "🪔 जलाओ"],
'sakhi':["📜 साखी का पन्ना", ["📜 सच्चा सौदा — भूखों को खिलाओ", "📜 बाँटकर खाओ", "📜 सबमें एक ज्योति", "📜 मेहनत की कमाई", "📜 नम्रता बड़ी ताक़त"], "📜 पलटो"],
'saathi':["🤗 जादू की झप्पी", ["🤗 झप्पी मिली!", "💛 मन हल्का", "😁 मुस्कान लौटी", "☕ चाय पर चलें?", "🫂 हम साथ हैं"], "🤗 झप्पी"],
'langar':["🫓 रोटी बेलो", ["🫓 गोल रोटी बनी!", "🫓 थोड़ी टेढ़ी — चलेगी 😁", "🍲 दाल तैयार", "🥛 खीर भी बनी", "🙏 100 लोग छके"], "🫓 बेलो"],
'mala':["📿 मनका फेरो", ["📿 1 मनका — शांति", "📿 सुकून की साँस", "🕊️ मन हल्का हुआ", "✨ ध्यान गहरा", "🙏 108 पूरे!"], "📿 फेरो"],
'funny':["🤣 चुटकुला पलटो", ["🤣 चाय ठंडी — WhatsApp गर्म!", "📱 बैटरी भी थक गई", "🚗 हॉर्न ही जीत गया", "🌧️ छाता घर पर है", "😁 हँसी से सच!"], "🤣 हँसो"],'pathey':["⚖️ तराज़ू भरो", ["⚒️ खेत में मेहनत", "🤲 पड़ोसी की मदद", "📚 बच्चे को पढ़ाया", "🍲 लंगर में सेवा", "⚖️ पाथेय संतुलित!"], "⚖️ तौलो"],'vand':["🍬 मिठाई बाँटो", ["🍬 पड़ोसी को मिली", "🍎 बच्चों में फल", "🫓 राहगीर को रोटी", "😁 सबके चेहरे खिले", "🤝 वंड साधक!"], "🎁 बाँटो"],
'vakil':["⚖️ तराज़ू संतुलित करो", ["⚖️ बराबर! इंसाफ़ 🙏", "📜 पहले लिखित सबूत रखो", "🆓 मुफ़्त कानूनी मदद मौजूद", "🤝 बात से सुलझाओ", "📞 Legal aid से पूछो"], "⚖️ तोलो"],
'kahani':["🎲 कहानी का पासा", ["🎲 एक बाज़, एक राज़…", "🎲 1925 का ख़त मिला", "🎲 शीशे ने बात की 🪞", "🎲 नूर ने पुकारा", "🎲 नया द्वार खुला 🚪"], "🎲 फेंको"],
'reels':["🎬 क्लैपर मारो", ["🎬 एक्शन!", "🎥 कट! बढ़िया शॉट", "🌟 टेक 2 — और अच्छा", "😁 बलूपर रील", "🏆 सुपरहिट!"], "🎬 एक्शन"],
'newsroom':["🗞️ हेडलाइन बनाओ", ["🗞️ गाँव में नया पुस्तकालय", "🗞️ लंगर में 500 छके", "🗞️ बच्चों ने पेड़ लगाए", "🗞️ बुज़ुर्गों का मेला", "🗞️ सच हमेशा जीतता"], "🖨️ छापो"],
tv:['📺 चैनल बदलो',['📺 ख़बर: गाँव में नया लंगर 🍲','🎶 कीर्तन चैनल 🪕','⚽ खेल: पिंड का मैच 🏆','📚 ज्ञान: आज का सवाल ❓','😁 हँसी चैनल 🤣'],'📡 घुमाओ'],
mandal:['🦅 बाज़ उड़ाओ',['🦅 बाज़ ने 1 चक्कर लगाया','🦅🦅 दो बाज़ साथ उड़े','🌄 बाज़ पहाड़ तक गया','🏰 बाज़ महल पर बैठा','✨ बाज़ सुनहरा हो गया'],'🚀 उड़ान'],
community:['🤝 हाथ मिलाओ',['🤝 1 नया साथी जुड़ा','💛 मोहब्बत फैली','🍲 लंगर में हाथ बँटाया','🌱 एक पेड़ लगाया','🎉 पूरा मोहल्ला एक'],'🤝 मिलाओ'],
naksha:['🧭 कम्पास घुमाओ',['🧭 उत्तर: 📚 ज्ञान घर','🧭 दक्षिण: 🍲 लंगर','🧭 पूरब: ☀️ सुबह का द्वार','🧭 पश्चिम: 🏰 क़िला','🧭 बीच में: 💰 ख़ज़ाना'],'🌀 घुमाओ'],
takht:['👑 ताज उछालो',['👑 ताज सीधा गिरा — आज तू राजा!','🪙 सिक्का निकला — सेवा कर','🦅 बाज़ ले उड़ा — फिर कोशिश','😁 ताज हँसते हुए गिरा','🙏 ताज सेवक के सिर पर'],'👑 उछालो'],
titli:['🦋 तितली पकड़ो',['🦋 पीली तितली पकड़ी!','🦋 उड़ गई… फिर से!','🌼 फूल पर बैठी तितली','🦋🦋 दो तितलियाँ!','🌈 सतरंगी तितली मिली'],'🫴 पकड़ो'],
bhav:['🎭 भाव मिलाओ',['😁 + 📚 = जिज्ञासा 🤔','😢 + 🤝 = सहारा 💛','😠 + 🧘 = शांति 🕊️','😨 + 🦅 = हिम्मत 💪','🤩 + 🍲 = वंड छको 🙏'],'🎭 मिलाओ'],
khazana:['💰 संदूक खोलो',['💰 10 koins मिले!','💎 हीरा — ज्ञान का','📜 पुराना नक्शा','🪙 सोने का सिक्का','🎁 सरप्राइज़: एक मुस्कान 😁'],'🗝️ खोलो'],
kyon:['❓ सवाल का पासा',['❓ आसमान नीला क्यों?','❓ हम सपने क्यों देखते हैं?','❓ सच कड़वा क्यों लगता है?','❓ माफ़ी से हल्कापन क्यों?','❓ किताबें दोस्त क्यों?'],'🎲 फेंको']};
function fun(el){if(el.dataset.jaanFunDone)return;el.dataset.jaanFunDone='1';var c=FUN[el.dataset.jaanFun];if(!c)return;var b=mk('div','jaan-box jaan-fun');b.appendChild(mk('h3','jaan-head',c[0]));
 var out=mk('p','jaan-fun-out',c[1][0]),n=0,cnt=mk('small','','0'),btn=mk('button','jaan-btn',c[2]);btn.type='button';out.setAttribute('aria-live','polite');
 btn.onclick=function(){n++;out.textContent=c[1][Math.random()*c[1].length|0];cnt.textContent=n+' बार 😁';out.classList.remove('pop');void out.offsetWidth;out.classList.add('pop');};
 b.append(out,btn,mk('br'),cnt);el.appendChild(b);}
function reveal(){var els=document.querySelectorAll('main section,.panel,.card,article');if(reduce||!('IntersectionObserver'in window))return;var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('jaan-on');io.unobserve(e.target);}});},{threshold:.08});
 [].forEach.call(els,function(e){if(e.getBoundingClientRect().top>innerHeight){e.classList.add('jaan-in');io.observe(e);}});}
function intro(){var o=document.querySelector('.jaan-intro');if(!o)return;var k='kdn-jaan-intro';try{if(sessionStorage.getItem(k)){o.remove();return;}}catch(e){}
 o.hidden=false;var close=function(){try{sessionStorage.setItem(k,'1');}catch(e){}o.classList.add('bye');setTimeout(function(){o.remove();},reduce?0:400);};
 [].forEach.call(o.querySelectorAll('[data-jaan-close]'),function(b){b.addEventListener('click',close);});document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});var f=o.querySelector('[data-jaan-close]');if(f)f.focus();}
function panjlink(){if(!/takht3?d?\.html/.test(location.pathname)||/takht-\d/.test(location.pathname)||document.querySelector('[data-jaan-panj]'))return;var p=document.createElement('p');p.setAttribute('data-jaan-panj','1');p.style.cssText='text-align:center;margin:16px 0;position:relative;z-index:2';var a=document.createElement('a');a.href='./panj-takht.html';a.textContent='🏛️ पंज तख़्त — इतिहास और दर्शन ➜';a.style.cssText='display:inline-block;padding:10px 18px;border-radius:999px;background:linear-gradient(135deg,#f6d27a,#c8962e);color:#2a1606;font-weight:800;text-decoration:none';p.appendChild(a);var h=document.querySelector('.jaan-shell-hero,.jaan-hero');if(h&&h.parentNode)h.parentNode.insertBefore(p,h);else document.body.appendChild(p);}
function endcard(){var p=location.pathname,M='क्या कहानी को आगे बढ़ाने के लिए साथ दोगे? बताओ आगे कहानी किस तरफ जाए';
function card(root){var d=mk('div','jaan-endcard');d.setAttribute('data-jaan-endcard',root);var t=document.createElement('p');t.textContent='🌳 '+M;var a=document.createElement('a');a.href='./shakha.html?root='+root;a.textContent='✍️ मेरी शाखा लिखो';var b=document.createElement('a');b.href='./khel-banao.html';b.textContent='🎮 अपना खेल बनाओ';d.appendChild(t);d.appendChild(a);d.appendChild(b);return d}
if(/kahani\.html/.test(p)){['safar','ch1','avatar','wm','fb','her'].forEach(function(id){var s=document.getElementById(id);if(s&&!s.querySelector('[data-jaan-endcard]'))s.appendChild(card(id==='safar'?'chetna':id))});return}
var r=/kyon\.html/.test(p)?'kyon':/funnybook\.html/.test(p)?'funny':null;if(!r||document.querySelector('[data-jaan-endcard]'))return;var h=document.querySelector('.jaan-shell-hero');if(h&&h.parentNode)h.parentNode.insertBefore(card(r),h);else document.body.appendChild(card(r));}
function init(){endcard();panjlink();intro();sky();[].forEach.call(document.querySelectorAll('.jaan-slider'),slider);[].forEach.call(document.querySelectorAll('[data-jaan-games]'),games);[].forEach.call(document.querySelectorAll('[data-jaan-fun]'),fun);reveal();}
if(typeof window!=='undefined'){window.KDNJaan={slider:slider,games:games,fun:fun};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();}
})();
