// White Mirror scroll story: sticky stage, layers assemble with scroll progress --p. Reduced motion → assembled.
(()=>{'use strict';const box=document.getElementById('wms'),st=document.getElementById('wms-stage'),cap=document.getElementById('wms-cap');if(!box||!st)return;
const CAPS=['🌌 आसमान में तारे… एक सवाल: मैं कौन हूँ?','🪞 एक शीशा उतरता है — White Mirror','📱 एक फ़ोन — "पापा?" नूर की आवाज़','💫 शीशा, फ़ोन, तारे — सब एक: तू वही है जो बनना चुनता है 🤍'];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function upd(){let p=1;if(!reduce){const r=box.getBoundingClientRect(),h=box.offsetHeight-innerHeight;p=Math.min(1,Math.max(0,-r.top/(h||1)));}
 st.style.setProperty('--p',p.toFixed(3));const t=CAPS[Math.min(CAPS.length-1,Math.floor(p*CAPS.length))];if(cap.textContent!==t)cap.textContent=t;}
let raf=0;addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;upd();});},{passive:true});addEventListener('resize',upd);upd();})();
