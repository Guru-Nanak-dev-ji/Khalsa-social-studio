(function(){'use strict';
function voice(){const vs=speechSynthesis.getVoices();return vs.find(v=>/hi[-_]IN/i.test(v.lang))||vs.find(v=>/^hi/i.test(v.lang));}
function say(text){if(!('speechSynthesis' in window)){alert('इस browser में आवाज़ उपलब्ध नहीं है।');return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='hi-IN';u.rate=.95;const v=voice();if(v)u.voice=v;speechSynthesis.speak(u);}
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('.say').forEach(b=>b.addEventListener('click',()=>{const el=document.getElementById(b.dataset.say);const art=b.closest('details');say((art?art.querySelector('summary').innerText+'। ':'')+el.innerText);}));
 document.getElementById('openall').addEventListener('click',e=>{const ds=[...document.querySelectorAll('details.art')];const open=!ds.every(d=>d.open);ds.forEach(d=>d.open=open);e.target.textContent=open?'सब बंद करें':'सब खोलें';});
 document.getElementById('readall').addEventListener('click',()=>{say([document.getElementById('pre').innerText,...[...document.querySelectorAll('details.art')].map(d=>d.querySelector('summary').innerText+'। '+d.querySelector('p').innerText)].join(' '));});
 document.getElementById('stop').addEventListener('click',()=>{if('speechSynthesis' in window)speechSynthesis.cancel();});
});})();
