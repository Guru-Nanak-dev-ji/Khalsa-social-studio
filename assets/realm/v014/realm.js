/* SPDX-License-Identifier: MIT */
(function(){
 'use strict';
 const C=window.KDNRealmCore;if(!C)return;const base=new URL('./',document.currentScript.src),$=id=>document.getElementById(id),media=matchMedia('(prefers-reduced-motion: reduce)');
 let engine=null,loading=null,active=null,last=performance.now(),paused=false,tickId=null,seenMemory=false,disposed=false,bootObserver=null;
 const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 const btn=(text,fn,cls)=>{const n=make('button',cls,text);n.type='button';n.addEventListener('click',fn);return n;};
 const slow=()=>media.matches||paused||document.body.classList.contains('motion-off');
 function seen(){try{return seenMemory||localStorage.getItem('kdn-realm-intro-v014')==='seen';}catch(_){return seenMemory;}}
 function markSeen(){seenMemory=true;try{localStorage.setItem('kdn-realm-intro-v014','seen');}catch(_){}}
 const film=make('dialog','realm-film');film.id='realm-film';film.setAttribute('aria-labelledby','realm-film-title');
 const filmArt=make('div','realm-film-art');filmArt.setAttribute('aria-hidden','true');
 const vignette=make('div','realm-film-vignette'),top=make('div','realm-film-top'),label=make('span','','KDN · द्वार का परिचय');
 const cancel=btn('वापस',()=>complete(false),'realm-quiet'),skip=btn('सीधे प्रवेश करें →',()=>complete(true),'realm-skip');
 top.append(label,cancel);const copy=make('div','realm-film-copy'),chapter=make('p','realm-kicker'),title=make('h2'),desc=make('p','realm-film-description');title.id='realm-film-title';title.tabIndex=-1;
 const progress=make('div','realm-film-progress'),bar=make('span');progress.setAttribute('aria-hidden','true');progress.append(bar);copy.append(chapter,title,desc,progress,skip);film.append(filmArt,vignette,top,copy);document.body.append(film);
 film.addEventListener('cancel',e=>{e.preventDefault();complete(false);});film.addEventListener('close',()=>{if(active)complete(false);});
 const scene=make('div','realm-render');scene.setAttribute('aria-hidden','true');scene.append(make('div','realm-fallback'));let sceneHome=$('realm-scene');const opening=!!sceneHome;
 if(!sceneHome){sceneHome=make('div','realm-dormant');document.body.append(sceneHome);}sceneHome.append(scene);
 function load(){if(loading||!sceneHome||disposed)return loading;loading=import(new URL('realm-world.mjs',base).href).then(m=>{if(disposed)return null;engine=m.createWorld(scene);engine.setMode(active?active.mode:$('boot')&&!$('boot').hidden?'welcome':'gates',active?.tone);engine.setPaused(slow()||document.hidden||scene.classList.contains('force-light')||!!$('popup')?.open&&!active);scene.dataset.render='webgl';return engine;}).catch(()=>{if(!disposed)scene.dataset.render='light';return null;});return loading;}
 function moveScene(host){if(host&&scene.parentElement!==host)host.append(scene);engine?.resize();}
 function pulse(){if(tickId)return;last=performance.now();tickId=setInterval(()=>{const now=performance.now(),delta=Math.max(0,Math.min(250,now-last));last=now;if(!active||document.hidden)return;active.elapsed+=delta;const p=C.progress(active.elapsed,active.duration);bar.style.transform='scaleX('+p+')';engine?.setProgress(p);if(p===1)complete(true);},80);}
 function complete(proceed){if(!active)return;const task=active;active=null;clearInterval(tickId);tickId=null;document.body.classList.remove('realm-in-film');if(film.open)film.close();moveScene(sceneHome);engine?.setMode($('boot')&&!$('boot').hidden?'welcome':'gates');if(proceed){task.after?.();}else task.cancel?.();if(task.focus?.isConnected&&!document.querySelector('dialog[open]'))task.focus.focus({preventScroll:true});}
 function play(info,after,onCancel,tour=false){if(active)return false;document.dispatchEvent(new Event('kdn:stop-guide-voice'));const d=C.scene(info);film.dataset.tone=d.tone;chapter.textContent=tour?'विरासत · वर्तमान · आने वाला कल':d.eyebrow;title.textContent=tour?'एक संसार। सबके लिए।':d.title;desc.textContent=tour?'किरत, ज्ञान और सेवा से उठता हमारा साझा नगर।':d.copy;label.textContent=tour?'KDN · नगर का दर्शन':'KDN · द्वार का परिचय';skip.textContent=tour?'प्रण द्वार पर चलें →':'सीधे प्रवेश करें →';bar.style.transform='scaleX(0)';
  active={after,cancel:onCancel,focus:document.activeElement,mode:tour?'tour':'flight',tone:d.tone,elapsed:0,duration:slow()?600:tour?C.tourDuration:C.doorDuration};document.body.classList.add('realm-in-film');film.showModal();moveScene(filmArt);load();engine?.setMode(active.mode,d.tone);engine?.setPaused(slow()||scene.classList.contains('force-light'));engine?.setProgress(0);title.focus();pulse();return true;
 }
 function begin(after){markSeen();const done=()=>{after();document.body.classList.remove('realm-welcome');moveScene(sceneHome);engine?.setMode('gates');};return play({id:'self'},done,()=>{},true);}
 function door(info,after,onCancel){return play(info,after,onCancel,false);}
 function motion(){const value=slow();engine?.setPaused(value||document.hidden);document.body.classList.toggle('realm-still',value);const b=$('realm-motion');if(b){b.textContent=value?'गति चलाएँ':'गति रोकें';b.setAttribute('aria-pressed',String(value));}}
 $('realm-motion')?.addEventListener('click',()=>{if(media.matches)return;paused=!paused;motion();});
 $('realm-quality')?.addEventListener('click',()=>{const light=scene.classList.toggle('force-light');$('realm-quality').textContent=light?'3D दृश्य':'हल्का दृश्य';$('realm-quality').setAttribute('aria-pressed',String(light));engine?.setPaused(light||slow()||document.hidden);});
 $('realm-about')?.addEventListener('click',()=>{const info=$('realm-about-copy');info.hidden=!info.hidden;$('realm-about').setAttribute('aria-expanded',String(!info.hidden));});
 $('realm-replay')?.addEventListener('click',()=>play({id:'self'},()=>{},()=>{},true));
 document.addEventListener('visibilitychange',()=>{last=performance.now();engine?.setPaused(document.hidden||slow()||scene.classList.contains('force-light'));});media.addEventListener?.('change',motion);
 document.addEventListener('kdn:view',()=>{if(active)complete(false);engine?.setPaused(true);});$('popup')?.addEventListener('close',()=>motion());
 document.addEventListener('click',e=>{if(e.target.closest('#motion-toggle'))motion();});
 if($('boot')){document.body.classList.add('realm-welcome');bootObserver=new MutationObserver(()=>{if(disposed||!document?.body)return;document.body.classList.toggle('realm-welcome',!$('boot').hidden);if($('boot').hidden){sceneHome=$('realm-stage-art')||sceneHome;moveScene(sceneHome);engine?.setMode('gates');}});bootObserver.observe($('boot'),{attributes:true,attributeFilter:['hidden']});}
 const how=make('button','realm-home-button','✦ नगर का दर्शन');how.type='button';how.setAttribute('aria-label','KDN नगर का परिचय फिर देखें');how.addEventListener('click',()=>{if(!sceneHome){sceneHome=filmArt;filmArt.append(scene);load();}play({id:'self'},()=>{},()=>{},true);});document.querySelector('.world-footer>div,.kg-court-header')?.append(how);
 window.KDNRealm={begin,door,seen,play,complete,motion,rememberIntro:markSeen};motion();if(opening)load();
 window.addEventListener('pagehide',()=>{disposed=true;clearInterval(tickId);bootObserver?.disconnect();active=null;engine?.dispose();});
})();
