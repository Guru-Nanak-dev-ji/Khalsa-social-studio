// KDN जान layer: emoji particles, sliders, ताश/प्यादा mini-games, bounce-in. Original, free, offline.
(function(){'use strict';
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var EMO=['😁','💰','📚','⛑️','♟️','🃏','🦅','✨','🪔','🌼'];
var TIPS=['📚 रोज़ 10 मिनट पढ़ो — दिमाग़ चमकेगा','💰 पहले बचाओ, फिर ख़र्चो','⛑️ सेहत ही असली ख़ज़ाना','😁 मुस्कान मुफ़्त है, बाँटो','🦅 ऊँचा सोचो, धीरे बोलो','♟️ प्यादा भी चलते-चलते राजा बनता है','🤝 वंड छको — मिलकर खाओ','🪔 एक अच्छा काम, आज ही'];
function mk(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.textContent=h;return e;}
function sky(){if(reduce||document.querySelector('.jaan-sky')||document.body.dataset.jaan==='off')return;var s=mk('div','jaan-sky');s.setAttribute('aria-hidden','true');
 for(var i=0;i<9;i++){var p=mk('span','jaan-p',EMO[i%EMO.length]);p.style.left=(Math.random()*95)+'%';p.style.setProperty('--d',(12+Math.random()*10).toFixed(1)+'s');p.style.setProperty('--dl',(-Math.random()*18).toFixed(1)+'s');p.style.setProperty('--dx',((Math.random()-.5)*120|0)+'px');s.appendChild(p);}
 document.body.prepend(s);var m=mk('div','jaan-motifs');m.setAttribute('aria-hidden','true');['♟️','🃏','🦅'].forEach(function(x){m.appendChild(mk('span','',x));});document.body.appendChild(m);}
function slider(el){if(el.dataset.jaanDone)return;el.dataset.jaanDone='1';var f=[].slice.call(el.querySelectorAll('figure'));if(!f.length)return;var i=0,d=mk('div','jaan-dots');
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

var FUN={tv:['📺 चैनल बदलो',['📺 ख़बर: गाँव में नया लंगर 🍲','🎶 कीर्तन चैनल 🪕','⚽ खेल: पिंड का मैच 🏆','📚 ज्ञान: आज का सवाल ❓','😁 हँसी चैनल 🤣'],'📡 घुमाओ'],
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
function init(){intro();sky();[].forEach.call(document.querySelectorAll('.jaan-slider'),slider);[].forEach.call(document.querySelectorAll('[data-jaan-games]'),games);[].forEach.call(document.querySelectorAll('[data-jaan-fun]'),fun);reveal();}
if(typeof window!=='undefined'){window.KDNJaan={slider:slider,games:games};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();}
})();
