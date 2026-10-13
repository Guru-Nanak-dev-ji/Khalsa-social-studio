(function(){
'use strict';
const C=window.KDNWorldContent,W=window.KDNWorld,$=id=>document.getElementById(id),dialog=$('popup');
let store;try{store=new W.Store(window.localStorage);}catch(e){store=new W.Store({getItem(){throw e;}});}
let state=store.data||W.empty(),view=null,current=null,busy=false,route='light',introIndex=0,meterRunning=true,motionOff=false,sound=false,audio=null,lastTick=performance.now(),saveElapsed=0,toastTimer=0,journeyTimer=0,walkingTimer=0,bootTimer=0,tvRemaining=0,tvHeld=false,slideTimer=0;
const media=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
let reduced=Boolean(media&&media.matches);
const views=['control','matches','quiz','pledge','intro','profile','score','meter','people','traits','work','menu'];
function toast(text){$('scene-toast').textContent=text;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('scene-toast').textContent='',5000);}
function storageStatus(){ $('storage-status').textContent=store.error?'पुराना सेव रिकॉर्ड पढ़ा नहीं जा सका; उसे बदला नहीं गया। नई यात्रा अभी अस्थायी है।':state.saved?'इस browser में प्रगति सेव है। इसे साझा फोन पर रखने से दूसरे भी देख सकते हैं।':'प्रगति अभी केवल इस खुले पन्ने में है; पन्ना बंद या reload करने पर मिट जाएगी।'; }
function persist(){state.introIndex=introIndex;state.scene=view==='quiz'?null:view;state.pending=current&&!current.answered?{kind:current.kind,id:current.kind==='reflection'?C.gates.indexOf(current.q):current.q.id,remaining:current.remaining??30000,paused:current.paused===true,path:current.path||state.route}:null;if(!state.saved)return;try{store.save(state);}catch(e){state.saved=false;$('popup-status').textContent=e.message;toast('प्रगति सेव नहीं हुई। मेनू से अपना backup लें।');}storageStatus();}
function formatTime(ms){const s=Math.floor(ms/1000);return [Math.floor(s/3600),Math.floor(s/60)%60,s%60].map(n=>String(n).padStart(2,'0')).join(':');}
function money(){const text='₹'+(W.paise(state.activeMs)/100).toFixed(2);$('rupees').textContent=text;$('meter-big').textContent=text;$('elapsed').textContent=formatTime(state.activeMs);}
function totals(){const rows=W.gameScore(state);return Object.values(rows).reduce((n,r)=>n+r.points,0)+W.participation(state);}
function motion(){document.body.classList.toggle('motion-off',motionOff||reduced);document.body.classList.toggle('page-hidden',document.hidden);$('motion-toggle').textContent=reduced?'स्थिर दृश्य':motionOff?'गति चलाएँ':'गति रोकें';$('motion-toggle').setAttribute('aria-pressed',String(motionOff||reduced));}
function renderScene(){
 const phase=state.phase;document.body.dataset.phase=phase;$('gate-light').disabled=busy;$('gate-shadow').disabled=busy;$('open-question').disabled=busy;
 $('walk').hidden=phase!=='world';$('total-points').textContent=String(totals());document.body.dataset.path=state.route;
 $('gate-dots').replaceChildren(...C.gates.map((g,i)=>{const li=document.createElement('li');li.className=i<state.gate?'passed':i===state.gate?'current':'';li.setAttribute('aria-label',g.name+(i<state.gate?' पूरा':i===state.gate?' वर्तमान':''));return li;}));
 let title,label,note,place,left,right;
 if(phase==='gates'){const g=C.gates[state.gate];title=state.gate===0?'चक्रव्यूह का प्रवेश':g.name+' का आँगन';label='पाँच प्रण द्वार · '+String(state.gate+1).padStart(2,'0')+' / 05';note='द्वार छुओ। भीतर golden TV पर सवाल मिलेगा।';place=g.name+' · '+g.subtitle;left='आगे कदम रखूँगा';right='पहले समझना चाहूँगा';}
 else if(phase==='pledge'){title='पाँच द्वार · अब पूरा प्रण';label='प्रण द्वार · पूरा संकल्प';note='पूरा प्रण पढ़ो। स्वीकार करना स्वैच्छिक है।';place='पाँच द्वार · एक साझा दुनिया';left='पूरा प्रण पढ़ूँगा';right='समझकर फैसला करूँगा';}
 else if(phase==='intro'){title='इस दुनिया में तुम्हारी जगह बराबर है।';label='परिचय · Khalsa Digital World';note='साथ, सेवा और सहयोग की योजना समझो।';place='KDN · वंड छको';left='परिचय में प्रवेश';right='मेरे सवाल भी हैं';}
 else if(phase==='profile'){title='हुनर से अपने रास्ते तक';label='अपना परिचय · खेल का प्रवेश';note='अपना काम, हुनर और आगे की इच्छा बताओ।';place='परिवार की जानकारी वैकल्पिक है';left='मेरा परिचय';right='पहले फिर समझूँगा';}
 else{title=['ज्ञान का आँगन','हुनर की गली','सेवा का मंडल','तर्क का खेल'][state.steps%4];label='GAME OF TAKHATS · '+(state.profile?state.profile.name:'साथी');note='द्वार छुओ या आगे चलो। रास्ते में नए सवाल मिलेंगे।';place='मंडल '+String(state.steps+1).padStart(2,'0')+' · बराबर भागीदारी';left=state.steps%2?'Study · ज्ञान':'JK / IQ · ज्ञान';right=state.steps%2?'Work · हुनर':'Seva · योगदान';}
 document.body.dataset.room=String((state.phase==='gates'?state.gate:state.steps+5)%4);$('world-stage').dataset.depth=String(state.gate+state.steps);$('scene-question').textContent=title;$('scene-label').textContent=label;$('scene-note').textContent=note;$('scene-location').textContent=place;$('light-label').textContent=left;$('shadow-label').textContent=right;storageStatus();money();
}
function openView(name,title,eyebrow='KDN · सवाल मंडल'){
 document.dispatchEvent(new Event('kdn:stop-guide-voice'));
 if(busy)finishTravel();
 dialog.dataset.view=name;dialog.classList.remove('tv-leaving','answered');document.body.classList.toggle('tv-open',name==='quiz');view=name;for(const id of views)$(id+'-view').hidden=id!==name;
 $('popup-title').textContent=title;$('popup-eyebrow').textContent=eyebrow;$('popup-status').textContent='';
 if(!dialog.open)dialog.showModal();dialog.scrollTop=0;$('popup-title').focus();persist();document.dispatchEvent(new CustomEvent('kdn:view',{detail:{name}}));
}
function closePopup(){document.dispatchEvent(new Event('kdn:stop-guide-voice'));clearTimeout(slideTimer);dialog.classList.remove('tv-leaving');document.body.classList.remove('tv-open');if(dialog.open)dialog.close();view=null;if(current&&current.answered)current=null;renderScene();}
dialog.addEventListener('close',()=>{document.dispatchEvent(new Event('kdn:stop-guide-voice'));document.body.classList.remove('tv-open');view=null;if(current&&current.answered)current=null;renderScene();});
$('popup-close').addEventListener('click',closePopup);
function finishTravel(){clearTimeout(journeyTimer);clearTimeout(walkingTimer);$('world-stage').classList.remove('walking');$('world-stage').classList.remove('travelling');$('gate-light').classList.remove('open');$('gate-shadow').classList.remove('open');busy=false;renderScene();}
function travel(path,after){if(busy||dialog.open)return;busy=true;route=path;renderScene();
 const start=()=>{const selected=$(path==='light'?'gate-light':'gate-shadow');selected.classList.add('open');const a=$('world-stage').getBoundingClientRect(),b=selected.getBoundingClientRect();$('world-stage').style.setProperty('--travel-x',((a.left+a.width/2-b.left-b.width/2)*4.5)+'px');
 if(reduced||motionOff||document.body.classList.contains('realm-still')){finishTravel();after();return;}
 journeyTimer=setTimeout(()=>{$('world-stage').classList.add('travelling');journeyTimer=setTimeout(()=>{finishTravel();after();},750);},650);};
 const info={id:'pran-'+state.gate};if(window.KDNRealm)window.KDNRealm.door(info,start,finishTravel);else start();
}

function showQuiz(){
 if(!current)return;const knowledge=current.kind==='knowledge';openView('quiz',current.q.question,knowledge?'GOLDEN TV · ज्ञान का सवाल':'GOLDEN TV · प्रण द्वार');
 $('quiz-category').textContent=knowledge?current.q.category+' · सही +10 / गलत −3':'चुने व्यवहार के game अंक · दोनों रास्ते खुले';
 $('quiz-note').textContent=knowledge?(current.source==='hourly'?'60 सक्रिय मिनट का सवाल।':'चार विकल्प; जरूरत हो तो समय रोक सकते हो।'):'आपके चुने व्यवहार पर तय game rubric लागू होगा; यह आपकी ईमानदारी की जाँच नहीं।';
 $('timer-wrap').hidden=!knowledge;$('timer-fill').parentElement.hidden=!knowledge;$('lifelines').hidden=!knowledge;
 $('quiz-help').hidden=true;$('quiz-help').replaceChildren();$('answer-result').hidden=!current.answered;
 $('quiz-options').replaceChildren(...current.q.options.map((text,i)=>{
  const button=document.createElement('button');button.type='button';button.className='quiz-option';const letter=document.createElement('span');letter.textContent=String.fromCharCode(65+i);const label=document.createElement('b');label.style.fontWeight='400';label.textContent=text;button.append(letter,label);button.addEventListener('click',()=>choose(i));return button;
 }));
 paintQuiz();if(current.answered)feedback();else{tvRemaining=0;tvHeld=false;}
}
function newQuiz(source='door',room='any'){
 if(current&&!current.answered){showQuiz();persist();return true;}
 const q=W.nextQuiz(state,room);if(!q){openScores();$('popup-status').textContent='इस संस्करण के 15 ज्ञान सवाल पूरे हुए। दोहराकर अंक नहीं बढ़ेंगे; नई यात्रा से फिर अभ्यास कर सकते हैं।';return false;}
 current={kind:'knowledge',q,source,remaining:30000,paused:false,answered:false,choice:null,used:{},removed:[]};showQuiz();persist();return true;
}
function reflection(path){if(current&&!current.answered){showQuiz();return;}current={kind:'reflection',q:C.gates[state.gate],path,answered:false,choice:null,used:{},removed:[]};showQuiz();persist();}
function paintQuiz(){if(!current)return;const q=current;Array.from($('quiz-options').children).forEach((b,i)=>{b.disabled=q.answered||q.removed.includes(i);b.classList.toggle('correct',q.answered&&q.kind==='knowledge'&&q.q.correct===i);b.classList.toggle('wrong',q.answered&&q.kind==='knowledge'&&q.choice===i&&q.q.correct!==i);b.classList.toggle('chosen',q.answered&&q.kind==='reflection'&&q.choice===i);b.hidden=q.removed.includes(i)&&!q.answered;});for(const [id,key]of [['ask-ai','hint'],['fifty','fifty'],['poll','poll']])$(id).disabled=q.answered||Boolean(q.used[key]);if(q.kind==='knowledge'){$('quiz-timer').textContent=String(Math.ceil(q.remaining/1000));$('timer-fill').style.width=(q.remaining/300)+'%';$('timer-pause').disabled=q.answered;$('timer-pause').textContent=q.paused?'समय चलाएँ':'समय रोकें';$('timer-pause').setAttribute('aria-pressed',String(q.paused));}}
function feedback(){const q=current;if(!q)return;dialog.classList.add('answered');$('answer-result').hidden=false;
 const r=W.reward(q.kind,q.kind==='reflection'?C.gates.indexOf(q.q):q.q.id,q.choice);
 $('positive-impact').value=r.positive;$('negative-impact').value=r.negative;$('positive-value').textContent=r.positive+'%';$('negative-value').textContent=r.negative+'%';
 $('reward-rule').textContent='इस जवाब का खेल-संकेत · '+r.reason;
 $('hold-tv').textContent=tvHeld?'TV आगे चलाएँ':'TV रोकें · पढ़ना बाकी है';$('hold-tv').setAttribute('aria-pressed',String(tvHeld));

 if(q.kind==='reflection'){$('answer-heading').textContent=(r.points>=0?'+':'')+r.points+' '+r.category+' अंक · कुल '+totals();$('answer-explain').textContent=q.q.options[q.choice];$('answer-question').textContent=q.path==='shadow'?q.q.shadow:q.q.follow;$('quiz-continue').textContent=state.phase==='pledge'?'पूरा प्रण पढ़ें →':'अगला प्रण द्वार →';}
 else{const good=q.choice===q.q.correct;$('answer-heading').textContent=q.choice===null?'समय पूरा · 0 quiz अंक / +1 भागीदारी':good?'सही · +10 '+q.q.category+' / +1 भागीदारी':'इस बार सही नहीं · −3 '+q.q.category+' / +1 भागीदारी';$('answer-explain').textContent=q.q.explain;$('answer-question').textContent=q.q.next;$('quiz-continue').textContent='दुनिया में आगे जाएँ →';}
}
function beep(correct){if(!sound||!audio)return;try{if(audio.state==='suspended')audio.resume().catch(()=>{});const t=audio.currentTime;for(let i=0;i<(correct?2:1);i++){const osc=audio.createOscillator(),gain=audio.createGain();osc.type=correct?'sine':'triangle';osc.frequency.value=correct?(i?1046:784):150;gain.gain.setValueAtTime(.0001,t+i*.12);gain.gain.exponentialRampToValueAtTime(.055,t+i*.12+.015);gain.gain.exponentialRampToValueAtTime(.0001,t+i*.12+.35);osc.connect(gain);gain.connect(audio.destination);osc.start(t+i*.12);osc.stop(t+i*.12+.36);}}catch(_){}}
function choose(choice){if(!current||current.answered)return;current.answered=true;current.choice=choice;
 if(current.kind==='reflection'){state=W.reflect(state,choice,current.path);beep(W.reward('reflection',C.gates.indexOf(current.q),choice).points>=0);}else{state=W.answer(state,current.q.id,choice);if(choice!==null)beep(choice===current.q.correct);}
 tvRemaining=2400;tvHeld=false;persist();paintQuiz();feedback();renderScene();$('answer-heading').setAttribute('tabindex','-1');$('answer-heading').focus();
}
function advanceTV(){if(!current||!current.answered||dialog.classList.contains('tv-leaving'))return;tvRemaining=0;dialog.classList.add('tv-leaving');const next=()=>{current=null;closePopup();persist();if(state.phase==='pledge'){openPledge();return;}if(state.phase==='world'){openControl();return;}$('world-stage').classList.add('room-reveal');setTimeout(()=>$('world-stage').classList.remove('room-reveal'),850);$('gate-light').focus({preventScroll:true});};slideTimer=setTimeout(next,reduced||motionOff?0:360);}
$('quiz-continue').addEventListener('click',advanceTV);
$('hold-tv').addEventListener('click',()=>{tvHeld=!tvHeld;if(tvRemaining<=0)tvRemaining=2400;feedback();});
$('timer-pause').addEventListener('click',()=>{if(current&&!current.answered){current.paused=!current.paused;paintQuiz();}});
function help(key){if(!current||current.kind!=='knowledge'||current.answered||current.used[key])return false;current.used[key]=true;current.paused=true;$('quiz-help').hidden=false;paintQuiz();return true;}
$('ask-ai').addEventListener('click',()=>{if(!help('hint'))return;$('quiz-help').textContent='Ask AI अभी जुड़ा नहीं है। तैयार संकेत: '+current.q.hint+' समय रुका है; तैयार होने पर समय चलाएँ।';});
$('fifty').addEventListener('click',()=>{if(!help('fifty'))return;current.removed=[0,1,2,3].filter(i=>i!==current.q.correct).slice(0,2);paintQuiz();$('quiz-help').textContent='दो गलत विकल्प हटे। समय रुका है; तैयार होने पर समय चलाएँ।';});
$('poll').addEventListener('click',()=>{if(!help('poll'))return;let index=0;const other=[20,15,10];const values=[0,1,2,3].map(i=>i===current.q.correct?55:other[index++]);$('quiz-help').textContent='DEMO Audience Poll — कोई वास्तविक दर्शक नहीं। '+values.map((v,i)=>String.fromCharCode(65+i)+': '+v+'%').join(' · ')+'. यह सिर्फ lifeline का उदाहरण है। समय रुका है।';});
function openPledge(){openView('pledge','क्या तुम यह प्रण ईमानदारी से आज से लागू कर सकते हो?','पाँच प्रण द्वार · संकल्प');$('full-pledge').textContent=C.pledge;}
function openIntro(reset=true){if(reset)introIndex=0;state.introIndex=introIndex;const item=C.intro[introIndex];$('guide-welcome').hidden=introIndex!==0;openView('intro',item.title,'KDN · प्रस्ताव और संभावना');$('intro-copy').textContent=item.text;$('intro-question').textContent=item.question;$('intro-progress').textContent=(introIndex+1)+' / '+C.intro.length;$('intro-next').textContent=introIndex===C.intro.length-1?'Control Room खोलें →':'आगे समझें →';}
for(const [id,choice]of [['pledge-accept','accept'],['pledge-consider','consider']])$(id).addEventListener('click',()=>{state.pledgeChoice=choice;state.phase='intro';persist();renderScene();openIntro();});
$('intro-next').addEventListener('click',()=>{if(introIndex<C.intro.length-1){introIndex++;openIntro(false);}else{if(state.phase==='intro'){state.phase='profile';persist();}openControl();renderScene();}});
function openProfile(){openView('profile','अपना परिचय पूरा करें','Game of Takhats · प्रवेश');$('profile-name').value=state.profile?state.profile.name:'';$('profile-language').value=state.profile?state.profile.language:'hi';$('profile-interest').value=state.profile?state.profile.interest:'JK';$('save-consent').checked=state.saved;
 const w=state.profile&&state.profile.work;
 for(const [id,key]of [['work-current','current'],['work-education','education'],['work-goal','goal'],['work-city','city']])$(id).value=w?w[key]:'';
 $('work-wish').value=w?w.wish:'tech';$('work-experience').value=w?w.experience:'new';$('work-hours').value=w?w.hours:5;$('work-mode').value=w?w.mode:'learn';
 for(const e of $('work-skills').querySelectorAll('input'))e.checked=!!w&&w.skills.includes(e.value);window.KDNPalace?.prepareProfile();
}

$('work-wish').replaceChildren(...C.workTracks.map(t=>{const o=document.createElement('option');o.value=t.id;o.textContent=t.name;return o;}));
$('work-skills').replaceChildren(...C.workSkills.map((skill,i)=>{const l=document.createElement('label'),x=document.createElement('input');x.type='checkbox';x.value=skill;x.id='skill-'+i;l.htmlFor=x.id;l.append(x,document.createTextNode(skill));return l;}));
$('profile-form').addEventListener('submit',e=>{
 e.preventDefault();if(window.KDNPalace&&!window.KDNPalace.validateProfile())return;if(!$('profile-form').reportValidity())return;
 let work;try{work=W.workProfile({current:$('work-current').value,education:$('work-education').value,goal:$('work-goal').value,city:$('work-city').value,wish:$('work-wish').value,experience:$('work-experience').value,hours:Number($('work-hours').value),mode:$('work-mode').value,skills:[...$('work-skills').querySelectorAll('input:checked')].map(x=>x.value),track:null});}catch(_){$('popup-status').textContent='काम, इच्छा और 1–40 घंटे का साप्ताहिक समय भरें।';return;}
 const name=$('profile-name').value.trim();if(!name)return;
 if(state.saved&&!$('save-consent').checked){try{store.clear();}catch(err){$('popup-status').textContent=err.message;return;}}
 state.profile={name,language:$('profile-language').value,interest:$('profile-interest').value,work};if(state.phase==='profile')state.phase='world';state.saved=$('save-consent').checked;persist();renderScene();if(window.KDNPalace)window.KDNPalace.profileDone();else openMatches();
});
function openMatches(){if(!state.profile||!state.profile.work){openProfile();return;}openView('matches','मेरे हुनर का अगला रास्ता','WORK · रुचि के अनुसार सुझाव');
 $('match-list').replaceChildren(...W.matchWork(state.profile.work).map(t=>{const box=document.createElement('article');box.className='match-card';const h=document.createElement('h3');h.textContent=t.name;const why=document.createElement('p');why.textContent=(t.preferred?'आपकी चुनी इच्छा। ':'दूसरा अभ्यास विकल्प। ')+(t.matched.length?'मिलते हुनर: '+t.matched.join(', '):'शुरुआती training से जाँचें।');const next=document.createElement('p');next.textContent=t.task;const b=document.createElement('button');b.type='button';b.textContent=state.profile.work.track===t.id?'✓ यह रास्ता चुना':'इस दिशा में सीखूँगा / काम करूँगा';b.setAttribute('aria-pressed',String(state.profile.work.track===t.id));b.addEventListener('click',()=>{state.profile.work.track=t.id;persist();openMatches();});box.append(h,why,next,b);return box;}));
 $('matches-next').disabled=!state.profile.work.track;$('match-summary').textContent=state.profile.work.track?'रास्ता चुना। वास्तविक काम की उपलब्धता और शर्तें बाद में तय होंगी।':'एक रुचि का रास्ता चुनें। यह किसी employer को आवेदन नहीं भेजता।';
}
$('matches-next').addEventListener('click',openControl);
$('work-matches').addEventListener('click',openMatches);
function openScores(){openView('score','अंकों की पाँच परतें','अभ्यास · कोई सार्वजनिक ranking नहीं');const scores=W.gameScore(state);$('score-rows').replaceChildren(...W.categories.map(key=>{const row=document.createElement('div');row.className='score-row';const name=document.createElement('b');name.textContent=key;const meter=document.createElement('meter');meter.min=0;meter.max=100;meter.value=scores[key].percent;meter.setAttribute('aria-label',key+' सही जवाब प्रतिशत');const val=document.createElement('strong');val.textContent=scores[key].points+' अंक · '+scores[key].percent+'%';row.append(name,meter,val);return row;}));$('participation').textContent='भागीदारी: '+W.participation(state)+' · ज्ञान प्रयास: '+state.history.length+' / '+C.quiz.length;}
function openMeter(){openView('meter','₹125 / घंटा · demo गणना','योजना समझें · अभी भुगतान नहीं');money();$('meter-toggle').textContent=meterRunning?'Demo मीटर रोकें':'Demo मीटर चलाएँ';}
function openPeople(){openView('people','अपने साथी जोड़ें','वैकल्पिक · अनुमति के साथ');renderAvatars();}
function renderAvatars(){const icons=['♞','♛','♜','♝','♚','♟'];$('avatar-list').replaceChildren(...state.avatars.map((a,i)=>{const tile=document.createElement('div');tile.className='avatar-tile';const symbol=document.createElement('span');symbol.className='avatar-symbol';symbol.textContent=icons[i%icons.length];symbol.setAttribute('aria-hidden','true');const name=document.createElement('div');name.textContent=a.name;const remove=document.createElement('button');remove.type='button';remove.textContent='हटाएँ';remove.setAttribute('aria-label',a.name+' का रूपक हटाएँ');remove.addEventListener('click',()=>{state.avatars.splice(i,1);persist();renderAvatars();});tile.append(symbol,name,remove);return tile;}));}
$('avatar-form').addEventListener('submit',e=>{e.preventDefault();if(!$('avatar-form').reportValidity())return;const name=$('avatar-name').value.trim();if(!name)return;if(state.avatars.length>=12){$('popup-status').textContent='अधिकतम 12 साथी; किसी पुराने रूपक को हटाकर नया जोड़ सकते हैं।';return;}state.avatars.push({name,relation:$('avatar-relation').value,consent:true});$('avatar-form').reset();persist();renderAvatars();$('popup-status').textContent='रूपक जुड़ा। यह स्थानीय प्रतीक है, AI स्वभाव विश्लेषण नहीं।';});
function openTraits(){openView('traits','आज मैं खुद को कैसे देखता हूँ?','30 संकेत · अपना अनुमान');renderTraits();}
$('trait-name').replaceChildren(...C.traits.map(t=>{const o=document.createElement('option');o.value=t;o.textContent=t;return o;}));
function traitSelected(){const key=$('trait-name').value;$('trait-value').value=key in state.traits?state.traits[key]:50;$('trait-output').textContent=$('trait-value').value+'%';}
$('trait-name').addEventListener('change',traitSelected);$('trait-value').addEventListener('input',()=>$('trait-output').textContent=$('trait-value').value+'%');
function renderTraits(){traitSelected();$('trait-list').replaceChildren(...Object.entries(state.traits).map(([name,value])=>{const row=document.createElement('div');row.className='trait-entry';const label=document.createElement('span');label.textContent=name;const num=document.createElement('b');num.textContent=value+'%';row.append(label,num);return row;}));}
$('trait-save').addEventListener('click',()=>{state.traits[$('trait-name').value]=Number($('trait-value').value);persist();renderTraits();$('popup-status').textContent='आपका अपना अनुमान दर्ज हुआ। अगला छोटा, संतुलित कदम क्या होगा?';});
function openWork(){openView('work','Likes से आगे · मेरा अगला काम','अपना रिकॉर्ड · अभी सत्यापित नहीं');$('task-list').replaceChildren(...C.tasks.map((text,id)=>{const task=state.tasks.find(t=>t.id===id);const row=document.createElement('div');row.className='task-item';const label=document.createElement('p');label.textContent=text;const button=document.createElement('button');button.type='button';button.textContent=!task?'यह काम चुनूँगा':task.done?'पूरा बताया गया · वापस योजना करें':'मैंने यह काम किया';button.addEventListener('click',()=>{const currentTask=state.tasks.find(t=>t.id===id);if(currentTask)currentTask.done=!currentTask.done;else state.tasks.push({id,done:false});persist();openWork();});row.append(label,button);return row;}));}
function openControl(){if(window.KDNPalace)window.KDNPalace.control();else openProfile();}
function menu(){openView('menu','यात्रा के साधन','KDN World · v0.14.0');storageStatus();}
function enter(path){if(busy||!$('boot').hidden)return;if(state.phase==='world'||state.phase==='profile'){openControl();return;}if(current&&!current.answered){showQuiz();return;}
 travel(path,()=>{state.route=path;if(state.phase==='gates')reflection(path);else if(state.phase==='pledge')openPledge();else if(state.phase==='intro')openIntro();else if(state.phase==='profile'){if(path==='light')openProfile();else openIntro();}else{state.steps++;persist();newQuiz('door',path==='light'?'knowledge':state.steps%2?'work':'seva');renderScene();}});
}
$('gate-light').addEventListener('click',()=>enter('light'));$('gate-shadow').addEventListener('click',()=>enter('shadow'));$('open-question').addEventListener('click',()=>enter(state.route));
$('walk').addEventListener('click',()=>{if(busy||dialog.open||state.phase!=='world')return;busy=true;$('world-stage').classList.add('walking');state.steps++;renderScene();walkingTimer=setTimeout(()=>{busy=false;$('world-stage').classList.remove('walking');renderScene();persist();if(current&&!current.answered)showQuiz();else if(Math.random()<.35)newQuiz('surprise');else{openControl();toast('एक कदम आगे। अपना अगला संसार चुनो।');}},reduced||motionOff?0:800);});
$('brand-info').addEventListener('click',()=>openIntro());$('menu-open').addEventListener('click',menu);$('score-open').addEventListener('click',openScores);$('meter-info').addEventListener('click',openMeter);
$('meter-toggle').addEventListener('click',()=>{meterRunning=!meterRunning;openMeter();});$('hourly-preview').addEventListener('click',()=>newQuiz('preview'));
$('quiz-practice').addEventListener('click',()=>newQuiz('practice'));
for(const button of document.querySelectorAll('[data-menu]'))button.addEventListener('click',()=>({intro:()=>openIntro(),profile:openProfile,people:openPeople,traits:openTraits,work:openWork,score:openScores}[button.dataset.menu])());
$('motion-toggle').addEventListener('click',()=>{if(reduced){toast('फोन में कम गति की पसंद सक्रिय है; दृश्य स्थिर रहेगा।');return;}motionOff=!motionOff;$('motion-toggle').textContent=motionOff?'गति चलाएँ':'गति रोकें';motion();});
$('sound-toggle').addEventListener('click',()=>{sound=!sound;if(sound){try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error('unavailable');audio=audio||new Audio();audio.resume().catch(()=>{});}catch(_){sound=false;toast('इस browser में ध्वनि उपलब्ध नहीं है।');}}$('sound-toggle').textContent=sound?'आवाज़ चालू':'आवाज़ बंद';$('sound-toggle').setAttribute('aria-pressed',String(sound));});
$('save-journey').addEventListener('click',()=>{if(!window.confirm('इस फोन के browser में परिचय, उत्तर, साथी और progress सेव करें? साझा फोन पर दूसरे इन्हें देख सकते हैं।'))return;state.saved=true;persist();storageStatus();});
$('download-journey').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({format:'kdn-world-backup',exportedAt:new Date().toISOString(),journey:state},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='KDN-My-Journey.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('popup-status').textContent='Backup डाउनलोड किया। इसमें आपका स्थानीय परिचय और उत्तर हो सकते हैं; सोचकर साझा करें।';});
$('reset-journey').addEventListener('click',()=>{if(!window.confirm('नई यात्रा शुरू करें? इस demo की सेव प्रगति और उत्तर हटेंगे। Creator और सेवा रिकॉर्ड नहीं बदलेंगे।'))return;try{if(store.raw!==null||store.error)store.clear();}catch(e){$('popup-status').textContent=e.message;return;}state=W.empty();state.saved=true;current=null;introIndex=0;window.KDNPalace?.forgetLocation();persist();finishTravel();closePopup();toast('नई यात्रा शुरू।');});
let bootDismissed=false;function dismissBoot(){clearTimeout(bootTimer);window.KDNRealm?.rememberIntro();$('boot').hidden=true;document.body.classList.remove('realm-welcome');lastTick=performance.now();if(bootDismissed)return;bootDismissed=true;if(window.KDNPalace?.resume())return;if(state.pending){const p=state.pending;current={kind:p.kind,q:p.kind==='reflection'?C.gates[p.id]:C.quiz.find(q=>q.id===p.id),path:p.path,remaining:p.remaining,paused:p.paused,source:'resume',answered:false,choice:null,used:{},removed:[]};showQuiz();return;}if(state.phase==='pledge')openPledge();else if(state.phase==='intro')openIntro(false);else if(state.phase==='profile'||state.phase==='world'){const restore={profile:openProfile,score:openScores,meter:openMeter,people:openPeople,traits:openTraits,work:openWork,menu,matches:openMatches};(restore[state.scene]||openControl)();}}
$('skip-boot').addEventListener('click',()=>window.KDNRealm?window.KDNRealm.begin(dismissBoot):dismissBoot());
$('realm-direct').addEventListener('click',dismissBoot);
function tick(){const now=performance.now(),delta=Math.max(0,Math.min(1500,now-lastTick));lastTick=now;if(document.hidden||!$('boot').hidden)return;
 state=W.accrue(state,delta,true,meterRunning);money();
 if(dialog.open&&view==='quiz'&&current&&current.answered&&tvRemaining>0&&!tvHeld&&!dialog.classList.contains('tv-leaving')){tvRemaining=Math.max(0,tvRemaining-delta);$('tv-countdown').textContent='TV '+Math.ceil(tvRemaining/1000)+' सेकंड में हटेगा';if(tvRemaining===0)advanceTV();}
 if(dialog.open&&view==='quiz'&&current&&current.kind==='knowledge'&&!current.answered&&!current.paused){current.remaining=Math.max(0,current.remaining-delta);paintQuiz();if(current.remaining===0)choose(null);}
 saveElapsed+=delta;if(saveElapsed>=30000){saveElapsed=0;persist();}
 if(state.phase==='world'&&(!dialog.open||view==='control')&&!document.querySelector('#palace-sheet[open],#kingdom-sheet[open]')&&!busy&&W.hourlyDue(state)){state.hourlyDone=Math.floor(state.activeMs/3600000);persist();newQuiz('hourly');}
}
const tickTimer=setInterval(tick,250);
document.addEventListener('visibilitychange',()=>{lastTick=performance.now();motion();if(document.hidden)persist();});
const reduceChanged=()=>{reduced=media.matches;motion();if(reduced&&busy){finishTravel();toast('कम गति सक्रिय है। सवाल खोलने के लिए द्वार छुएँ।');}};
if(media&&media.addEventListener)media.addEventListener('change',reduceChanged);
window.addEventListener('pagehide',()=>{persist();clearInterval(tickTimer);clearTimeout(journeyTimer);clearTimeout(walkingTimer);clearTimeout(bootTimer);clearTimeout(slideTimer);if(!state.saved){state=W.empty();current=null;closePopup();}if(audio)audio.suspend().catch(()=>{});});
window.addEventListener('pageshow',event=>{if(event.persisted)window.location.reload();});
window.KDNWorldUI={state:()=>state,persist,open:openView,close:closePopup,profile:openProfile,matches:openMatches,quiz:()=>newQuiz('practice'),intro:()=>openIntro(),control:openControl,walk:()=>{closePopup();$('walk').click();}};
introIndex=state.introIndex||0;if(!store.data&&!store.error){state.saved=true;persist();}renderScene();motion();$('boot').hidden=false;if(window.KDNRealm?.seen()&&(state.gate>0||state.phase!=='gates'))bootTimer=setTimeout(dismissBoot,1300);
})();
