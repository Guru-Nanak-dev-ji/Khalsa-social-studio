(function(){'use strict';const D=window.KDNDwar,K=window.KDNKoins,root=document.documentElement,bar=document.getElementById('prog'),done=document.getElementById('done');let given=false,tick=false;
function load(){try{return K.validate(JSON.parse(localStorage.getItem(K.KEY)||'null'));}catch(e){return K.fresh();}}
function give(){if(given)return;given=true;let s=K.grantWelcome(load()).state;const r=D.award(K,s);try{localStorage.setItem(K.KEY,JSON.stringify(r.state));}catch(e){}done.textContent=r.added?'🎉 द्वार पूरा खुला! +5 koins मिले':'✨ द्वार पूरा खुला! (koins पहले ही मिल चुके)';}
function upd(){tick=false;const p=D.progress(scrollY,root.scrollHeight-innerHeight);for(let i=0;i<D.STAGES;i++)root.style.setProperty('--l'+i,i===0?1:D.layer(p,i).toFixed(3));bar.style.width=(p*100)+'%';if(p>=0.98)give();}
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(upd);}},{passive:true});addEventListener('resize',upd);upd();})();
