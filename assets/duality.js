/* Reflection stays in memory. No storage, accounts, analytics or AI calls. */
(function(){
  'use strict';const D=window.KDNDuality,$=id=>document.getElementById(id);
  let state=D.create();
  const motion=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
  let paused=Boolean(motion&&motion.matches);
  function updateMotion(){
    const reduced=Boolean(motion&&motion.matches);
    $('motion-tools').hidden=reduced;
    document.body.classList.toggle('motion-running',!paused&&!reduced);
    document.body.classList.toggle('page-hidden',document.hidden);
    $('motion-toggle').textContent=paused?'घुमाव चलाएँ':'घुमाव रोकें';
    $('motion-toggle').setAttribute('aria-pressed',String(paused));
  }
  function render(moveFocus=true){
    const q=D.get(state.current),checkpoint=['checkpoint','complete'].includes(state.phase),feedback=state.phase==='feedback';
    document.body.dataset.route=state.route;
    $('question-area').hidden=checkpoint;$('checkpoint').hidden=!checkpoint;
    $('doors').hidden=state.phase!=='question';$('reveal').hidden=!feedback;
    $('journey-tools').hidden=false;
    $('question').textContent=q.question;
    $('question-kicker').textContent=q.id==='threshold'?'क्या यह चक्रव्यूह तुम्हारे लिए है?':q.title+' · जो आज सच लगे, वही चुनो';
    $('question-note').textContent=q.note;
    $('door-number').textContent='द्वार '+String(state.history.length+(state.phase==='question'?1:0)).padStart(2,'0')+' · '+(checkpoint?'विराम':q.title);
    $('answer-light').textContent=q.options[0].text;$('answer-shadow').textContent=q.options[1].text;
    $('back-answer').disabled=!state.history.length;
    $('total').textContent=String(state.history.length*3);
    if(feedback){
      const picked=q.options[state.history[state.history.length-1].choice];
      $('reveal-path').textContent=state.route==='light'?'4you.world · प्रकाश का द्वार':'not4you.world · छाया का द्वार';
      $('reveal-text').textContent=picked.reply;
      $('gain').textContent=Object.entries(picked.gain).map(([k,v])=>'+'+v+' '+D.dimensions[k]).join(' · ');
      $('next-door').textContent=state.history.length===D.bank.length?'इस यात्रा का विराम →':state.history.length%6===0?'इस मंडल का विराम →':'अगला द्वार खोलें →';
    }
    if(checkpoint){
      $('checkpoint-note').textContent=state.phase==='complete'?'इस संस्करण के सभी 25 सवाल पूरे हुए। ये जवाब तुम्हारी पूरी पहचान नहीं हैं। नई यात्रा में क्रम और रास्ते बदल सकते हैं।':state.history.length+' जवाबों के बाद थोड़ा ठहरो। कोई जीत या हार नहीं—देखो, किस अभ्यास को अपनी रोजमर्रा की दुनिया में ले जा सकते हो।';
      $('continue-journey').hidden=state.phase==='complete';
    }
    const rows=Object.entries(D.dimensions).map(([key,label])=>{
      const row=document.createElement('div');row.className='score-row';
      const name=document.createElement('span');name.textContent=label;
      const track=document.createElement('span');track.className='score-track';track.setAttribute('aria-hidden','true');
      const fill=document.createElement('span');fill.className='score-fill';fill.style.width=(state.scores[key]/Math.max(1,state.history.length*2)*100)+'%';track.append(fill);
      const number=document.createElement('b');number.textContent=String(state.scores[key]);row.append(name,track,number);return row;
    });$('scores').replaceChildren(...rows);
    if(moveFocus)$(checkpoint?'checkpoint-title':feedback?'reveal-title':'question').focus();
  }
  $('choice-light').addEventListener('click',()=>{state=D.answer(state,0);render();});
  $('choice-shadow').addEventListener('click',()=>{state=D.answer(state,1);render();});
  $('next-door').addEventListener('click',()=>{state=D.next(state);render();});
  $('continue-journey').addEventListener('click',()=>{state=D.next(state);render();});
  $('back-answer').addEventListener('click',()=>{state=D.back(state);render();});
  $('restart').addEventListener('click',()=>{if(state.history.length&&!window.confirm('नई यात्रा शुरू करें? इस पन्ने के जवाब और अभ्यास अंक मिटेंगे।'))return;state=D.create();render();});
  $('scores-toggle').addEventListener('click',()=>{const open=$('scores-panel').hidden;$('scores-panel').hidden=!open;$('scores-toggle').setAttribute('aria-expanded',String(open));});
  $('motion-toggle').addEventListener('click',()=>{paused=!paused;updateMotion();});
  $('motion-speed').addEventListener('change',()=>document.body.classList.toggle('motion-slower',$('motion-speed').value==='slower'));
  document.addEventListener('visibilitychange',updateMotion);
  const preferenceChanged=()=>{if(motion.matches)paused=true;updateMotion();};
  if(motion&&motion.addEventListener)motion.addEventListener('change',preferenceChanged);
  else if(motion&&motion.addListener)motion.addListener(preferenceChanged);
  // Clear the in-memory answers when leaving, including a back/forward-cache visit.
  window.addEventListener('pagehide',()=>{state=D.create();render(false);});
  window.addEventListener('pageshow',()=>updateMotion());
  render(false);updateMotion();
})();
