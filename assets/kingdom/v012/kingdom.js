(function(){
'use strict';
const K=window.KDNKingdomCore;if(!K||document.querySelector('.kg-dock'))return;
const root=new URL('../../../',document.currentScript.src),asset=name=>new URL('assets/kingdom/v012/'+name,root).href;
const path=decodeURI(location.pathname).slice(root.pathname.length),room=K.roomFor(path),immersive=document.body.dataset.heritage==='immersive';
let store;try{store=new K.Store(localStorage);}catch(e){store=new K.Store({getItem(){throw e;}});}
let sound=null,voiceButton=null,transition=0,paused=false;
const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
function button(text,fn,cls){const b=el('button',cls,text);b.type='button';b.addEventListener('click',fn);return b;}
function picture(path,cls,alt){const i=el('img',cls);i.src=new URL(path,root).href;i.alt=alt;return i;}
function note(text){return el('p','kg-note',text);}
document.body.classList.add('kdn-kingdom');
document.body.dataset.kingdomRoom=room.id;
if(!immersive){
 const bg=el('div','kg-scenery');bg.setAttribute('aria-hidden','true');bg.append(picture('assets/world/yin-medallion-v11.webp','kg-moon',''));document.body.prepend(bg);
 const header=el('header','kg-court-header');header.dataset.falconPerch='';const brand=el('a');brand.href=new URL('maze.html',root).href;brand.setAttribute('aria-label','प्रण का चक्रव्यूह खोलें');const icon=picture('icons/khalsa-v1-192.png','','');icon.width=54;icon.height=54;brand.append(icon);const copy=el('div');copy.append(el('small','','KHALSA DIGITAL WORLD'),el('strong','',room.name),el('p','kg-note','एक संसार · सीखना, सेवा, सहयोग'));header.append(brand,copy,el('span','kg-live','WORLD 0.12'));document.body.prepend(header);
 const panels=[...document.querySelectorAll('main > section,main > header,main > .panel,.workspace > .panel,.preview-column > .panel,main > .wrap > section')].filter(n=>!n.closest('dialog')&&!n.classList.contains('poster-preview'));
 if(panels.length===0){const main=document.querySelector('main');if(main)panels.push(main);}
 panels.forEach((n,i)=>{n.classList.add('kdn-device','kg-'+(i===0?room.device:['tv','phone','pager','led','arch','laptop'][i%6]));n.dataset.deviceLabel='KDN / '+room.device.toUpperCase()+' · '+String(i+1).padStart(2,'0');});
}
const ambient=el('div','kg-ambient');ambient.setAttribute('aria-hidden','true');for(const [cls,symbol]of [['kg-piece','♞'],['kg-piece two','♜'],['kg-card','♠'],['kg-card two','♦']])ambient.append(el('span',cls,symbol));document.body.append(ambient);
const dock=el('nav','kg-dock');dock.setAttribute('aria-label','इस संसार के साझा साधन');
function dockButton(symbol,label,fn){const b=button('',fn);b.append(el('span','',symbol),document.createTextNode(label));dock.append(b);return b;}
dockButton('✧','खोजो',()=>discover());const coinButton=dockButton('◉','मेरा संग्रह',inventory);dockButton('♜','दो द्वार',()=>portals());dockButton('♞ ♛','साथी',guides);document.body.append(dock);
const sheet=el('dialog','kg-sheet');sheet.id='kingdom-sheet';sheet.setAttribute('aria-labelledby','kingdom-title');const close=button('×',()=>sheet.close(),'kg-close');close.setAttribute('aria-label','संसार की स्क्रीन बंद करें');const eyebrow=el('div','kg-kicker','KDN · LIVING KINGDOM'),title=el('h2');title.id='kingdom-title';title.tabIndex=-1;const content=el('div'),status=el('p','kg-note');status.setAttribute('role','status');sheet.append(close,eyebrow,title,content,status);document.body.append(sheet);
function stopVoice(){if(sound){sound.pause();sound=null;}if(voiceButton){voiceButton.textContent=voiceButton.dataset.defaultText;voiceButton=null;}}
sheet.addEventListener('close',()=>{stopVoice();clearTimeout(transition);document.body.classList.remove('kg-dialog-open');});
function open(name){stopVoice();clearTimeout(transition);title.textContent=name;content.replaceChildren();status.textContent='';if(!sheet.open)sheet.showModal();document.body.classList.add('kg-dialog-open');sheet.scrollTop=0;title.focus();}
function updateCount(){const total=Object.values(K.totals(store.data)).reduce((a,b)=>a+b,0);coinButton.replaceChildren(el('span','','◉ '+total),document.createTextNode('Game coins'));}
function failure(){status.textContent=store.error||'इस फोन पर संग्रह सेव नहीं हो सका। कोई नया gift दर्ज नहीं हुआ।';}
function discover(slot){
 open('इस आँगन में क्या छुपा है?');if(!store.reload()){failure();return;}
 const slots=[0,1,2,3,4,5],pending=slots.filter(i=>!store.data.claims.includes(K.gift(room.id,i).id));
 if(slot===undefined)slot=pending.length?pending[0]:0;
 const g=K.gift(room.id,slot),owned=store.data.claims.includes(g.id);
 content.append(el('div','kg-gift',owned?'✦':'◉'),el('h3','',owned?'यह gift तुम्हारे संग्रह में है':g.coin+' coins · +'+g.amount),el('p','',room.name+' · छुपा कोना '+(slot+1)+' / 6'));
 content.append(note('ये केवल स्थानीय game coins हैं। न रुपये, न खरीदने-बेचने की मुद्रा। संग्रह इसी browser में रहेगा।'));
 if(!owned){const take=button('संग्रह में रखें',()=>{try{const result=store.claim(room.id,slot);updateCount();discover(slot);status.textContent=result.added?'✓ +'+g.amount+' '+g.coin+' game coins मिले।':'यह gift पहले लिया जा चुका है।';}catch(e){failure();}},'kg-primary');content.append(take);}
 else content.append(button('अगला छुपा कोना खोजें',()=>pending.length?discover(pending[0]):portals(),'kg-primary'));
 content.append(button('पूरा संग्रह और चाबियाँ',inventory));content.append(note('खाली दीवार या पृष्ठभूमि छुओ, या “खोजो” से सभी छह कोने ढूँढो। लिखने, पढ़ने और साधनों के बटन अपने काम करते रहेंगे।'));
}
function inventory(){
 open('तुम्हारा खजाना');store.reload();updateCount();if(store.error)failure();const totals=K.totals(store.data),grid=el('div','kg-coin-grid');
 K.coins.forEach((name,i)=>{const card=el('div','kg-coin-card');card.append(el('span','kg-coin',['✦','☀','✧','◇','❋','♞'][i]),el('small','',name),el('strong','',String(totals[name])));grid.append(card);});content.append(grid,note('Game collection · केवल इस browser का रिकॉर्ड। इन coins से भुगतान या ownership का अधिकार नहीं मिलता।'));
 const found=store.data.claims.length;content.append(el('h3','','गुप्त चाबियाँ · '+found+' gifts खोजे'));
 for(const k of K.keys){const unlocked=found>=k.at,box=el('div','kg-key'+(unlocked?'':' locked'));box.append(el('strong','',(unlocked?'🗝 ':'🔒 ')+k.name),el('p','',unlocked?k.task:Math.min(found,k.at)+' / '+k.at+' अलग gifts मिलने पर खुलेगी'));if(unlocked)box.append(button('इस अभ्यास का द्वार',()=>portals(K.rooms.find(r=>r.id===k.room))));content.append(box);}
 const actions=el('div','kg-actions');actions.append(button('संग्रह का JSON backup',()=>{const blob=new Blob([JSON.stringify({format:'kdn-game-collection',collection:store.data},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download='KDN-Game-Collection.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Backup डाउनलोड किया।';}),button('केवल यह संग्रह मिटाएँ',()=>{if(!confirm('सिर्फ game gifts और चाबियाँ मिटाएँ? लेखन, फोटो, सेवा और प्रश्नों की प्रगति सुरक्षित रहेगी।'))return;try{store.clear();inventory();}catch(e){failure();}}));content.append(actions);
}
function door(r){const b=button('',()=>{if(transition)return;stopVoice();b.classList.add('kg-entering');status.textContent=r.name+' का द्वार खुल रहा है…';transition=setTimeout(()=>{location.href=new URL(r.path,root).href;},reduced&&reduced.matches||paused?0:650);},'kg-door');b.append(el('strong','',r.name),el('small','',r.purpose));return b;}
function portals(preferred){
 open('एक द्वार के आगे दो और द्वार');const index=K.rooms.findIndex(r=>r.id===room.id),left=preferred||K.rooms[(index+1)%K.rooms.length],right=K.rooms[(K.rooms.indexOf(left)+1)%K.rooms.length];content.append(note('अभी: '+room.name+' · उसी app के अगले आँगन'));const pair=el('div','kg-map-grid');pair.append(door(left),door(right));content.append(pair,button('पूरे संसार का नक्शा',catalog),note('दोनों दरवाज़े खुले हैं। अपने काम के अनुसार रास्ता चुनो।'));
}
function catalog(){
 open('संसार का नक्शा');content.append(note(K.rooms.length+' सक्रिय मंज़िलें · 18 पन्ने (पुराने पन्ने और नया entry link)। 500+ पन्नों का विस्तार इसी साझा ढाँचे में होगा; अभी वे सभी बने नहीं हैं।'));
 const input=el('input','kg-search');input.type='search';input.placeholder='मंज़िल या काम खोजें';input.setAttribute('aria-label','मंज़िल या काम खोजें');const grid=el('div','kg-catalog');function render(){grid.replaceChildren();const found=K.rooms.filter(r=>(r.name+' '+r.purpose+' '+r.id).toLowerCase().includes(input.value.toLowerCase()));for(const r of found){const b=button('',()=>portals(r),'kg-mini-'+r.device);b.append(el('strong','',r.mark+' '+r.name),el('small','',r.purpose));grid.append(b);}if(!found.length)grid.append(note('यह मंज़िल अभी सूची में नहीं है।'));}input.addEventListener('input',render);content.append(input,grid);render();
 content.append(note('आगे: business सहयोग और ownership के प्रस्ताव। वास्तविक हिस्सेदारी, रोजगार और भुगतान के लिए अलग स्वीकृत व्यवस्था चाहिए; अभी यहाँ उनका लेन-देन नहीं होता।'));
}
const dialogue={
 start:['तर्क सिंह','दोनों द्वार एक ही संसार के रास्ते हैं। हर द्वार के भीतर सवाल या काम मिलता है। ज्ञान वाले quiz में सही उत्तर +10, गलत −3 है; प्रण के जवाबों का खेल rubric अलग है।'],
 feelings:['भावना कौर','अंक तुम्हारी इंसानी कीमत नहीं हैं। सोचने का समय लो, अपना उत्तर चुनो, और किसी दूसरे की निजी जानकारी बिना सहमति मत भरो। हम सीखने में साथी हैं।'],
 coins:['तर्क सिंह','हर मंज़िल के छह छुपे कोनों में अलग gifts हैं। “खोजो” से भी उन्हें पा सकते हो। 6, 12 और 24 gifts पर अभ्यास की चाबियाँ मिलती हैं। ये game coins हैं; इन्हें रुपये में बदला नहीं जा सकता।'],
 work:['भावना कौर','अपने हुनर और इच्छा के अनुसार सीखने या सेवा का रास्ता चुनो। Creator, पोस्टर और सेवा रिकॉर्ड अभी उपयोग कर सकते हो। वास्तविक नौकरी और company ownership की व्यवस्था अभी नहीं खुली है।']
};
function guides(){
 open('तर्क सिंह और भावना कौर');content.append(picture('assets/world/kdn-nihang-guides-v22.webp','kg-guides-portrait','तर्क सिंह और भावना कौर के रूपक मार्गदर्शक'),note('तैयार मार्गदर्शक संवाद · live AI chat अभी जुड़ी नहीं है। स्वागत आवाज़ें AI से बनाई गई हैं।'));
 const cards=el('div','kg-guides-grid');for(const [who,name,copy]of [['tark','तर्क सिंह','सवाल, प्रमाण और अगले कदम।'],['bhavana','भावना कौर','संवेदना, सहमति और साथ।']]){const c=el('div','kg-guide-card');c.append(el('h3','',name),el('p','',copy),voiceControl(who));cards.append(c);}content.append(cards);
 const reply=el('div','kg-bot-reply','किस बात को समझना चाहोगे?');reply.setAttribute('role','status');const actions=el('div','kg-actions');for(const [key,label]of [['start','द्वार और अंक'],['feelings','साथ और भावनाएँ'],['coins','Coins और चाबियाँ'],['work','काम और अवसर']])actions.append(button(label,()=>{const d=dialogue[key];reply.textContent=d[0]+'\n'+d[1];}));content.append(actions,reply);
 content.append(button(paused?'चलती चीजें फिर चलाएँ':'चलती चीजें रोकें',()=>{if(immersive){document.getElementById('motion-toggle').click();paused=document.body.classList.contains('motion-off');}else{paused=!paused;document.body.classList.toggle('motion-off',paused);}document.body.classList.toggle('kg-motion-off',paused);guides();}));
}
function voiceControl(who){const b=button((who==='tark'?'तर्क सिंह':'भावना कौर')+' की आवाज़ सुनें',()=>playVoice(who,b));return b;}
function playVoice(who,b){if(voiceButton===b){stopVoice();return;}stopVoice();b.dataset.defaultText=b.textContent;voiceButton=b;b.textContent='आवाज़ रोकें';sound=new Audio(asset(who==='tark'?'tark-welcome.mp3':'bhavana-welcome.mp3'));sound.addEventListener('ended',stopVoice,{once:true});sound.addEventListener('error',()=>{stopVoice();status.textContent='आवाज़ अभी नहीं चली। ऑनलाइन होकर फिर कोशिश करें; परिचय नीचे लिखा है।';},{once:true});sound.play().catch(()=>{stopVoice();status.textContent='आवाज़ चालू नहीं हो सकी; दोबारा सुनें दबाएँ।';});}
document.addEventListener('click',e=>{const voice=e.target.closest('[data-kdn-voice]');if(voice){playVoice(voice.dataset.kdnVoice,voice);return;}if(e.target.closest('[data-kdn-help]'))guides();});
document.addEventListener('click',e=>{
 if(e.defaultPrevented||e.button!==0||document.querySelector('dialog[open]')||e.target.closest('a,button,input,textarea,select,label,summary,canvas,video,audio,[contenteditable],.kg-dock,.boot,.question-caption,.room-guides,.room-orbits'))return;
 if(getSelection()&&String(getSelection()))return;
 // Discovery only on blank background/containers, never while selecting or reading text.
 if(!e.target.matches('body,main,section,.world-shell,.world-stage,.palace,.camera,.floor-grid,.heritage-banner,.kdn-device'))return;
 if([...e.target.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))return;
 const ripple=el('i','kg-ripple');ripple.style.left=e.clientX+'px';ripple.style.top=e.clientY+'px';document.body.append(ripple);setTimeout(()=>ripple.remove(),700);
 const x=Math.max(0,Math.min(2,Math.floor(e.clientX/Math.max(1,innerWidth)*3))),y=e.clientY<innerHeight/2?0:1;discover(y*3+x);
});
document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('kg-hidden',document.hidden);if(document.hidden)stopVoice();});
document.addEventListener('kdn:stop-guide-voice',stopVoice);window.addEventListener('pagehide',stopVoice);
window.addEventListener('storage',e=>{if(e.key===K.KEY){store.reload();updateCount();if(sheet.open)status.textContent='संग्रह दूसरे tab में बदला है। खजाना फिर खोलकर देखें।';}});
window.KDNKingdom={guides,portals,inventory};updateCount();
})();
