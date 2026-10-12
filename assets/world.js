(function(){
'use strict';
const C=window.KDNWorldContent,W=window.KDNWorld,$=id=>document.getElementById(id),dialog=$('popup');
let store;try{store=new W.Store(window.localStorage);}catch(e){store=new W.Store({getItem(){throw e;}});}
let state=store.data||W.empty(),view=null,current=null,busy=false,route='light',introIndex=0,meterRunning=true,motionOff=false,sound=false,audio=null,lastTick=performance.now(),saveElapsed=0,toastTimer=0,journeyTimer=0,walkingTimer=0,bootTimer=0;
const media=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
let reduced=Boolean(media&&media.matches);
const views=['quiz','pledge','intro','profile','score','meter','people','traits','work','menu'];
function toast(text){$('scene-toast').textContent=text;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('scene-toast').textContent='',5000);}
function storageStatus(){ $('storage-status').textContent=store.error?'पुराना सेव रिकॉर्ड पढ़ा नहीं जा सका; उसे बदला नहीं गया। नई यात्रा अभी अस्थायी है।':state.saved?'इस browser में प्रगति सेव है। इसे साझा फोन पर रखने से दूसरे भी देख सकते हैं।':'प्रगति अभी केवल इस खुले पन्ने में है; पन्ना बंद या reload करने पर मिट जाएगी।'; }
function persist(){if(!state.saved)return;try{store.save(state);}catch(e){state.saved=false;$('popup-status').textContent=e.message;toast('प्रगति सेव नहीं हुई। मेनू से अपना backup लें।');}storageStatus();}
function formatTime(ms){const s=Math.floor(ms/1000);return [Math.floor(s/3600),Math.floor(s/60)%60,s%60].map(n=>String(n).padStart(2,'0')).join(':');}
function money(){const text='₹'+(W.paise(state.activeMs)/100).toFixed(2);$('rupees').textContent=text;$('meter-big').textContent=text;$('elapsed').textContent=formatTime(state.activeMs);}
function totals(){const rows=W.score(state);return Object.values(rows).reduce((n,r)=>n+r.points,0)+W.participation(state);}
function motion(){document.body.classList.toggle('motion-off',motionOff||reduced);document.body.classList.toggle('page-hidden',document.hidden);$('motion-toggle').textContent=reduced?'स्थिर दृश्य':motionOff?'गति चलाएँ':'गति रोकें';$('motion-toggle').setAttribute('aria-pressed',String(motionOff||reduced));}
function renderScene(){
 const phase=state.phase;$('gate-light').disabled=busy;$('gate-shadow').disabled=busy;$('open-question').disabled=busy;
 $('walk').hidden=phase!=='world';$('total-points').textContent=String(totals());document.body.dataset.path=state.route;
 $('gate-dots').replaceChildren(...C.gates.map((g,i)=>{const li=document.createElement('li');li.className=i<state.gate?'passed':i===state.gate?'current':'';li.setAttribute('aria-label',g.name+(i<state.gate?' पूरा':i===state.gate?' वर्तमान':''));return li;}));
 let title,label,note,place,left,right;
 if(phase==='gates'){const g=C.gates[state.gate];title=state.gate===0?'क्या तुम ईमानदार हो?':g.question;label='पाँच प्रण द्वार · '+String(state.gate+1).padStart(2,'0')+' / 05';note='चार जवाबों में अपना रास्ता चुनो। दोनों द्वार खुले हैं।';place=g.name+' · '+g.subtitle;left='आगे कदम रखूँगा';right='पहले समझना चाहूँगा';}
 else if(phase==='pledge'){title='क्या तुम यह प्रण आज से अभ्यास में ला सकते हो?';label='प्रण द्वार · पूरा संकल्प';note='पूरा प्रण पढ़ो। स्वीकार करना स्वैच्छिक है।';place='पाँच द्वार · एक साझा दुनिया';left='पूरा प्रण पढ़ूँगा';right='समझकर फैसला करूँगा';}
 else if(phase==='intro'){title='इस दुनिया में तुम्हारी जगह बराबर है।';label='परिचय · Khalsa Digital World';note='साथ, सेवा और सहयोग की योजना समझो।';place='KDN · वंड छको';left='परिचय में प्रवेश';right='मेरे सवाल भी हैं';}
 else if(phase==='profile'){title='Game of Takhats में तुम्हारा परिचय क्या होगा?';label='अपना परिचय · खेल का प्रवेश';note='नाम या alias, भाषा और सीखने की रुचि भरो।';place='परिवार की जानकारी वैकल्पिक है';left='मेरा परिचय';right='पहले फिर समझूँगा';}
 else{title='अगला कदम: ज्ञान, काम या सेवा?';label='GAME OF TAKHATS · '+(state.profile?state.profile.name:'साथी');note='द्वार छुओ या आगे चलो। रास्ते में नए सवाल मिलेंगे।';place='मंडल '+String(state.steps+1).padStart(2,'0')+' · बराबर भागीदारी';left=state.steps%2?'Study · ज्ञान':'JK / IQ · ज्ञान';right=state.steps%2?'Work · हुनर':'Seva · योगदान';}
 $('scene-question').textContent=title;$('scene-label').textContent=label;$('scene-note').textContent=note;$('scene-location').textContent=place;$('light-label').textContent=left;$('shadow-label').textContent=right;storageStatus();money();
}
function openView(name,title,eyebrow='KDN · सवाल मंडल'){
 if(busy)finishTravel();
 view=name;for(const id of views)$(id+'-view').hidden=id!==name;
 $('popup-title').textContent=title;$('popup-eyebrow').textContent=eyebrow;$('popup-status').textContent='';
 if(!dialog.open)dialog.showModal();dialog.scrollTop=0;$('popup-title').focus();
}
function closePopup(){if(dialog.open)dialog.close();view=null;if(current&&current.answered)current=null;renderScene();}
dialog.addEventListener('close',()=>{view=null;if(current&&current.answered)current=null;renderScene();});
$('popup-close').addEventListener('click',closePopup);
function finishTravel(){clearTimeout(journeyTimer);clearTimeout(walkingTimer);$('world-stage').classList.remove('walking');$('world-stage').classList.remove('travelling');$('gate-light').classList.remove('open');$('gate-shadow').classList.remove('open');busy=false;renderScene();}
function travel(path,after){if(busy||dialog.open)return;busy=true;route=path;const selected=$(path==='light'?'gate-light':'gate-shadow');selected.classList.add('open');$('world-stage').style.setProperty('--travel-x',path==='light'?'36%':'-36%');renderScene();if(reduced||motionOff){finishTravel();after();return;}
 journeyTimer=setTimeout(()=>{$('world-stage').classList.add('travelling');journeyTimer=setTimeout(()=>{finishTravel();after();},1050);},200);
}
function showQuiz(){
 if(!current)return;const knowledge=current.kind==='knowledge';openView('quiz',current.q.question,knowledge?'KBC शैली · ज्ञान का सवाल':'प्रण द्वार · अपना सच चुनो');
 $('quiz-category').textContent=knowledge?current.q.category+' · सही +10 / गलत −3':'आत्मचिंतन · भागीदारी +1';
 $('quiz-note').textContent=knowledge?(current.source==='hourly'?'60 सक्रिय मिनट का सवाल।':'चार विकल्प; जरूरत हो तो समय रोक सकते हो।'):'यहाँ सही–गलत का फैसला या ईमानदारी की जाँच नहीं। हर जवाब के बाद दोनों रास्ते खुले हैं।';
 $('timer-wrap').hidden=!knowledge;$('timer-fill').parentElement.hidden=!knowledge;$('lifelines').hidden=!knowledge;
 $('quiz-help').hidden=true;$('quiz-help').replaceChildren();$('answer-result').hidden=!current.answered;
 $('quiz-options').replaceChildren(...current.q.options.map((text,i)=>{
  const button=document.createElement('button');button.type='button';button.className='quiz-option';const letter=document.createElement('span');letter.textContent=String.fromCharCode(65+i);const label=document.createElement('b');label.style.fontWeight='400';label.textContent=text;button.append(letter,label);button.addEventListener('click',()=>choose(i));return button;
 }));
 paintQuiz();if(current.answered)feedback();
}
function newQuiz(source='door',room='any'){
 if(current&&!current.answered){showQuiz();return true;}
 const q=W.nextQuiz(state,room);if(!q){openScores();$('popup-status').textContent='इस संस्करण के 15 ज्ञान सवाल पूरे हुए। दोहराकर अंक नहीं बढ़ेंगे; नई यात्रा से फिर अभ्यास कर सकते हैं।';return false;}
 current={kind:'knowledge',q,source,remaining:30000,paused:false,answered:false,choice:null,used:{},removed:[]};showQuiz();return true;
}
function reflection(path){if(current&&!current.answered){showQuiz();return;}current={kind:'reflection',q:C.gates[state.gate],path,answered:false,choice:null,used:{},removed:[]};showQuiz();}
function paintQuiz(){if(!current)return;const q=current;Array.from($('quiz-options').children).forEach((b,i)=>{b.disabled=q.answered||q.removed.includes(i);b.classList.toggle('correct',q.answered&&q.kind==='knowledge'&&q.q.correct===i);b.classList.toggle('wrong',q.answered&&q.kind==='knowledge'&&q.choice===i&&q.q.correct!==i);b.classList.toggle('chosen',q.answered&&q.kind==='reflection'&&q.choice===i);b.hidden=q.removed.includes(i)&&!q.answered;});for(const [id,key]of [['ask-ai','hint'],['fifty','fifty'],['poll','poll']])$(id).disabled=q.answered||Boolean(q.used[key]);if(q.kind==='knowledge'){$('quiz-timer').textContent=String(Math.ceil(q.remaining/1000));$('timer-fill').style.width=(q.remaining/300)+'%';$('timer-pause').disabled=q.answered;$('timer-pause').textContent=q.paused?'समय चलाएँ':'समय रोकें';$('timer-pause').setAttribute('aria-pressed',String(q.paused));}}
function feedback(){const q=current;if(!q)return;$('answer-result').hidden=false;
 if(q.kind==='reflection'){$('answer-heading').textContent='+1 भागीदारी · तुम्हारा रास्ता खुला है';$('answer-explain').textContent=q.q.options[q.choice];$('answer-question').textContent=q.path==='shadow'?q.q.shadow:q.q.follow;$('quiz-continue').textContent=state.phase==='pledge'?'पूरा प्रण पढ़ें →':'अगला प्रण द्वार →';}
 else{const good=q.choice===q.q.correct;$('answer-heading').textContent=q.choice===null?'समय पूरा · 0 quiz अंक / +1 भागीदारी':good?'सही · +10 '+q.q.category+' / +1 भागीदारी':'इस बार सही नहीं · −3 '+q.q.category+' / +1 भागीदारी';$('answer-explain').textContent=q.q.explain;$('answer-question').textContent=q.q.next;$('quiz-continue').textContent='दुनिया में आगे जाएँ →';}
}
function beep(correct){if(!sound||!audio)return;try{if(audio.state==='suspended')audio.resume().catch(()=>{});const t=audio.currentTime;for(let i=0;i<(correct?2:1);i++){const osc=audio.createOscillator(),gain=audio.createGain();osc.type=correct?'sine':'triangle';osc.frequency.value=correct?(i?1046:784):150;gain.gain.setValueAtTime(.0001,t+i*.12);gain.gain.exponentialRampToValueAtTime(.055,t+i*.12+.015);gain.gain.exponentialRampToValueAtTime(.0001,t+i*.12+.35);osc.connect(gain);gain.connect(audio.destination);osc.start(t+i*.12);osc.stop(t+i*.12+.36);}}catch(_){}}
function choose(choice){if(!current||current.answered)return;current.answered=true;current.choice=choice;
 if(current.kind==='reflection'){state=W.reflect(state,choice,current.path);}else{state=W.answer(state,current.q.id,choice);if(choice!==null)beep(choice===current.q.correct);}
 persist();paintQuiz();feedback();renderScene();$('answer-heading').setAttribute('tabindex','-1');$('answer-heading').focus();
}
$('quiz-continue').addEventListener('click',()=>{const wasReflection=current&&current.kind==='reflection';current=null;closePopup();if(wasReflection&&state.phase==='pledge')openPledge();});
$('timer-pause').addEventListener('click',()=>{if(current&&!current.answered){current.paused=!current.paused;paintQuiz();}});
function help(key){if(!current||current.kind!=='knowledge'||current.answered||current.used[key])return false;current.used[key]=true;current.paused=true;$('quiz-help').hidden=false;paintQuiz();return true;}
$('ask-ai').addEventListener('click',()=>{if(!help('hint'))return;$('quiz-help').textContent='Ask AI अभी जुड़ा नहीं है। तैयार संकेत: '+current.q.hint+' समय रुका है; तैयार होने पर समय चलाएँ।';});
$('fifty').addEventListener('click',()=>{if(!help('fifty'))return;current.removed=[0,1,2,3].filter(i=>i!==current.q.correct).slice(0,2);paintQuiz();$('quiz-help').textContent='दो गलत विकल्प हटे। समय रुका है; तैयार होने पर समय चलाएँ।';});
$('poll').addEventListener('click',()=>{if(!help('poll'))return;let index=0;const other=[20,15,10];const values=[0,1,2,3].map(i=>i===current.q.correct?55:other[index++]);$('quiz-help').textContent='DEMO Audience Poll — कोई वास्तविक दर्शक नहीं। '+values.map((v,i)=>String.fromCharCode(65+i)+': '+v+'%').join(' · ')+'. यह सिर्फ lifeline का उदाहरण है। समय रुका है।';});
function openPledge(){openView('pledge','क्या तुम यह प्रण ईमानदारी से आज से लागू कर सकते हो?','पाँच प्रण द्वार · संकल्प');$('full-pledge').textContent=C.pledge;}
function openIntro(reset=true){if(reset)introIndex=0;const item=C.intro[introIndex];openView('intro',item.title,'KDN · प्रस्ताव और संभावना');$('intro-copy').textContent=item.text;$('intro-question').textContent=item.question;$('intro-progress').textContent=(introIndex+1)+' / '+C.intro.length;$('intro-next').textContent=introIndex===C.intro.length-1?'अपना परिचय खोलें →':'आगे समझें →';}
for(const [id,choice]of [['pledge-accept','accept'],['pledge-consider','consider']])$(id).addEventListener('click',()=>{state.pledgeChoice=choice;state.phase='intro';persist();renderScene();openIntro();});
$('intro-next').addEventListener('click',()=>{if(introIndex<C.intro.length-1){introIndex++;openIntro(false);}else{if(state.phase==='intro'){state.phase='profile';persist();}openProfile();renderScene();}});
function openProfile(){openView('profile','अपना परिचय पूरा करें','Game of Takhats · प्रवेश');$('profile-name').value=state.profile?state.profile.name:'';$('profile-language').value=state.profile?state.profile.language:'hi';$('profile-interest').value=state.profile?state.profile.interest:'JK';$('save-consent').checked=state.saved;}
$('profile-form').addEventListener('submit',e=>{e.preventDefault();const name=$('profile-name').value.trim();if(!name||!$('profile-form').reportValidity())return;const oldPhase=state.phase;state.profile={name,language:$('profile-language').value,interest:$('profile-interest').value};
 if(oldPhase==='profile')state.phase='world';
 if(state.saved&&!$('save-consent').checked){try{store.clear();state.saved=false;}catch(err){$('popup-status').textContent=err.message;return;}}
 else state.saved=$('save-consent').checked;
 persist();closePopup();if(oldPhase==='profile')newQuiz('entry','knowledge');else toast('परिचय अपडेट हुआ।');});
function openScores(){openView('score','अंकों की पाँच परतें','अभ्यास · कोई सार्वजनिक ranking नहीं');const scores=W.score(state);$('score-rows').replaceChildren(...W.categories.map(key=>{const row=document.createElement('div');row.className='score-row';const name=document.createElement('b');name.textContent=key;const meter=document.createElement('meter');meter.min=0;meter.max=100;meter.value=scores[key].percent;meter.setAttribute('aria-label',key+' सही जवाब प्रतिशत');const val=document.createElement('strong');val.textContent=scores[key].points+' अंक · '+scores[key].percent+'%';row.append(name,meter,val);return row;}));$('participation').textContent='भागीदारी: '+W.participation(state)+' · ज्ञान प्रयास: '+state.history.length+' / '+C.quiz.length;}
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
function menu(){openView('menu','यात्रा के साधन','KDN World · v0.10.0');storageStatus();}
function enter(path){if(busy)return;if(current&&!current.answered){showQuiz();return;}
 travel(path,()=>{state.route=path;if(state.phase==='gates')reflection(path);else if(state.phase==='pledge')openPledge();else if(state.phase==='intro')openIntro();else if(state.phase==='profile'){if(path==='light')openProfile();else openIntro();}else{state.steps++;persist();newQuiz('door',path==='light'?'knowledge':state.steps%2?'work':'seva');renderScene();}});
}
$('gate-light').addEventListener('click',()=>enter('light'));$('gate-shadow').addEventListener('click',()=>enter('shadow'));$('open-question').addEventListener('click',()=>enter(state.route));
$('walk').addEventListener('click',()=>{if(busy||dialog.open||state.phase!=='world')return;busy=true;$('world-stage').classList.add('walking');state.steps++;renderScene();walkingTimer=setTimeout(()=>{busy=false;$('world-stage').classList.remove('walking');renderScene();persist();if(current&&!current.answered)showQuiz();else if(Math.random()<.35)newQuiz('surprise');else toast('एक कदम आगे। सामने का कोई द्वार खोलो।');},reduced||motionOff?0:800);});
$('brand-info').addEventListener('click',()=>openIntro());$('menu-open').addEventListener('click',menu);$('score-open').addEventListener('click',openScores);$('meter-info').addEventListener('click',openMeter);
$('meter-toggle').addEventListener('click',()=>{meterRunning=!meterRunning;openMeter();});$('hourly-preview').addEventListener('click',()=>newQuiz('preview'));
$('quiz-practice').addEventListener('click',()=>newQuiz('practice'));
for(const button of document.querySelectorAll('[data-menu]'))button.addEventListener('click',()=>({intro:()=>openIntro(),profile:openProfile,people:openPeople,traits:openTraits,work:openWork,score:openScores}[button.dataset.menu])());
$('motion-toggle').addEventListener('click',()=>{if(reduced){toast('फोन में कम गति की पसंद सक्रिय है; दृश्य स्थिर रहेगा।');return;}motionOff=!motionOff;$('motion-toggle').textContent=motionOff?'गति चलाएँ':'गति रोकें';motion();});
$('sound-toggle').addEventListener('click',()=>{sound=!sound;if(sound){try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error('unavailable');audio=audio||new Audio();audio.resume().catch(()=>{});}catch(_){sound=false;toast('इस browser में ध्वनि उपलब्ध नहीं है।');}}$('sound-toggle').textContent=sound?'आवाज़ चालू':'आवाज़ बंद';$('sound-toggle').setAttribute('aria-pressed',String(sound));});
$('save-journey').addEventListener('click',()=>{if(!window.confirm('इस फोन के browser में परिचय, उत्तर, साथी और progress सेव करें? साझा फोन पर दूसरे इन्हें देख सकते हैं।'))return;state.saved=true;persist();storageStatus();});
$('download-journey').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({format:'kdn-world-backup',exportedAt:new Date().toISOString(),journey:state},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='KDN-My-Journey.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('popup-status').textContent='Backup डाउनलोड किया। इसमें आपका स्थानीय परिचय और उत्तर हो सकते हैं; सोचकर साझा करें।';});
$('reset-journey').addEventListener('click',()=>{if(!window.confirm('नई यात्रा शुरू करें? इस demo की सेव प्रगति और उत्तर हटेंगे। Creator और सेवा रिकॉर्ड नहीं बदलेंगे।'))return;try{if(store.raw!==null||store.error)store.clear();}catch(e){$('popup-status').textContent=e.message;return;}state=W.empty();current=null;finishTravel();closePopup();toast('नई यात्रा शुरू।');});
function dismissBoot(){clearTimeout(bootTimer);$('boot').hidden=true;lastTick=performance.now();}
$('skip-boot').addEventListener('click',dismissBoot);
function tick(){const now=performance.now(),delta=Math.max(0,Math.min(1500,now-lastTick));lastTick=now;if(document.hidden||!$('boot').hidden)return;
 state=W.accrue(state,delta,true,meterRunning);money();
 if(dialog.open&&view==='quiz'&&current&&current.kind==='knowledge'&&!current.answered&&!current.paused){current.remaining=Math.max(0,current.remaining-delta);paintQuiz();if(current.remaining===0)choose(null);}
 saveElapsed+=delta;if(saveElapsed>=30000){saveElapsed=0;persist();}
 if(state.phase==='world'&&!dialog.open&&!busy&&W.hourlyDue(state)){state.hourlyDone=Math.floor(state.activeMs/3600000);persist();newQuiz('hourly');}
}
const tickTimer=setInterval(tick,250);
document.addEventListener('visibilitychange',()=>{lastTick=performance.now();motion();if(document.hidden)persist();});
const reduceChanged=()=>{reduced=media.matches;motion();if(reduced&&busy){finishTravel();toast('कम गति सक्रिय है। सवाल खोलने के लिए द्वार छुएँ।');}};
if(media&&media.addEventListener)media.addEventListener('change',reduceChanged);
window.addEventListener('pagehide',()=>{persist();clearInterval(tickTimer);clearTimeout(journeyTimer);clearTimeout(walkingTimer);clearTimeout(bootTimer);if(!state.saved){state=W.empty();current=null;closePopup();}if(audio)audio.suspend().catch(()=>{});});
window.addEventListener('pageshow',event=>{if(event.persisted)window.location.reload();});
renderScene();motion();if(!reduced){$('boot').hidden=false;bootTimer=setTimeout(dismissBoot,1800);}else dismissBoot();
})();
