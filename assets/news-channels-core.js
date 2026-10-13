(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KNNChannels=m;})(this,function(){'use strict';
// Shared rules (mirrored in bot/worker.js; tests keep both in sync).
const API='https://kdn-telegram-bot.khatrinewsnetwork.workers.dev';
const SUFFIX=/(?:^|[\s\u00a0·\-])(news(?:\s+tv)?|न्यूज़?(?:\s+(?:टीवी|tv))?|ਨਿਊਜ਼?(?:\s+(?:ਟੀਵੀ|tv))?)$/iu;
const LANGS={hi:'हिंदी',pa:'ਪੰਜਾਬੀ',en:'English'};
function clean(s){return String(s==null?'':s).normalize('NFC').replace(/[\u0000-\u001f\u007f<>]/g,'').replace(/\s+/g,' ').trim();}
function nameError(name){const n=clean(name);if(n.length<6)return 'नाम बहुत छोटा है।';if(n.length>40)return 'नाम 40 अक्षरों से छोटा रखें।';
 const m=SUFFIX.exec(n);if(!m)return 'नाम के आख़िर में "News" या "News TV" (या न्यूज़) होना ज़रूरी है, जैसे "मालवा News"।';
 if(clean(n.slice(0,m.index)).length<2)return 'News से पहले अपने इलाक़े या channel का नाम लिखें।';return '';}
function slug(s){return clean(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,30);}
function handleError(h){return /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$/.test(String(h||''))?'':'Handle में 3–30 अंग्रेज़ी छोटे अक्षर, अंक या - हों, जैसे malwa-news।';}
function colorOk(c){return /^#[0-9a-f]{6}$/i.test(String(c||''));}
function logoOk(d){return d===''||d==null||(typeof d==='string'&&d.length<=60000&&/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(d));}
function validate(c){const e={};const ne=nameError(c.name);if(ne)e.name=ne;const he=handleError(c.handle);if(he)e.handle=he;
 const city=clean(c.city);if(city.length<2||city.length>40)e.city='शहर का नाम लिखें (2–40 अक्षर)।';
 if(!LANGS[c.lang])e.lang='भाषा चुनें।';if(!colorOk(c.tickerColor))e.tickerColor='Ticker का रंग चुनें।';if(!logoOk(c.logo))e.logo='Logo छोटी (60KB तक) PNG/JPG/WebP फ़ोटो हो।';return e;}
function shortName(name){const n=clean(name);return n.length>14?n.slice(0,13)+'…':n;}
return{API,SUFFIX,LANGS,clean,nameError,slug,handleError,colorOk,logoOk,validate,shortName};});
