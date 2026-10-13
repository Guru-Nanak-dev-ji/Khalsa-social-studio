/* Refresh the offline shell without clearing draft storage or forcing navigation. */
(function(){
  'use strict';
  const check=document.getElementById('app-update-check'),reload=document.getElementById('app-update-reload'),status=document.getElementById('app-update-status');
  if(!check||!reload||!status||!('serviceWorker'in navigator))return;
  const sw=navigator.serviceWorker;let registration=null,starting=null,changed=false;
  check.hidden=false;
  function ready(){changed=true;status.textContent='नया पन्ना तैयार है। सेव की हुई यात्रा वहीं से जारी रहेगी।';reload.hidden=false;}
  function watch(worker){
    if(!worker)return;
    const report=()=>{
      if(worker.state==='installing')status.textContent='नया संस्करण डाउनलोड हो रहा है…';
      if(worker.state==='redundant'&&!changed)status.textContent='अपडेट पूरा नहीं हुआ। ऑनलाइन होकर फिर जाँचें।';
    };worker.addEventListener('statechange',report);report();
  }
  function start(){
    if(starting)return starting;
    starting=sw.register('./sw.js',{updateViaCache:'none'}).then(r=>{
      registration=r;r.addEventListener('updatefound',()=>watch(r.installing));watch(r.installing);return r;
    }).catch(error=>{starting=null;throw error;});
    return starting;
  }
  sw.addEventListener('controllerchange',ready);
  check.addEventListener('click',async()=>{
    check.disabled=true;status.textContent='अपडेट जाँच रहे हैं…';
    try{const r=registration||await start();await r.update();
      if(changed)ready();
      else if(r.installing||r.waiting)status.textContent='नया संस्करण तैयार हो रहा है…';
      else status.textContent='जाँच पूरी। नया संस्करण मिलने पर यहाँ खोलने का बटन आएगा।';
    }catch(_){status.textContent='अभी अपडेट नहीं मिल सका। ऑनलाइन होकर फिर जाँचें।';}
    finally{check.disabled=false;}
  });
  reload.addEventListener('click',()=>window.location.reload());
  const begin=()=>start().catch(()=>{status.textContent='यह पन्ना खुला है; ऑफलाइन अपडेट के लिए फिर जाँचें।';});
  if(document.readyState==='complete')begin();else window.addEventListener('load',begin,{once:true});
})();
