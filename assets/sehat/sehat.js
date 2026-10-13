'use strict';
// UI for the private sehat logger. No network calls; storage is localStorage only.
(function(){const S=window.SehatCore,$=id=>document.getElementById(id);
let st=load(),pending=[],lastNotified='';
function load(){try{return S.validate(JSON.parse(localStorage.getItem(S.KEY)||'null'));}catch(e){return S.fresh();}}
function save(){try{localStorage.setItem(S.KEY,JSON.stringify(st));}catch(e){}render();}
function el(tag,props,...kids){const e=document.createElement(tag);for(const k in props||{}){if(k==='class')e.className=props[k];else if(k.startsWith('on'))e.addEventListener(k.slice(2),props[k]);else e.setAttribute(k,props[k]);}for(const c of kids)e.append(c);return e;}
const hm=t=>{const d=new Date(t);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');};
function render(){const now=Date.now(),list=S.checklist(st,now);
 document.querySelectorAll('#call-doc,[data-doc]').forEach(a=>{a.href=st.doctor?'tel:'+st.doctor:'#doc';});
 $('doc').value=st.doctor;const box=$('meds');box.replaceChildren();$('nomed').hidden=list.length>0;
 for(const m of list){const logs=st.medLog.filter(x=>x.id===m.id&&S.dayKey(x.t)===S.dayKey(now));
  box.append(el('div',{class:'med'+(m.done?' done':'')},el('button',{class:'x',type:'button','aria-label':'हटाएँ',onclick:()=>{if(confirm(m.name+' सूची से हटाएँ?')){st=S.removeMed(st,m.id);save();}}},'✖ हटाएँ'),
   el('h3',{},(m.done?'✅ ':'⏳ ')+m.name+(m.dose?' · '+m.dose:'')),
   el('p',{},(m.times.length?'समय: '+m.times.join(', '):'समय नहीं लिखा')+' · आज '+m.taken+'/'+m.need+(logs.length?' (ली: '+logs.map(x=>hm(x.t)).join(', ')+')':'')),
   el('button',{class:'btn',type:'button',onclick:()=>{st=S.takeMed(st,m.id,Date.now());save();}},'💊 ले ली')));}
 $('undo').hidden=!st.medLog.length;
 const w=S.week(st,now),t=w[6],done=list.filter(m=>m.done).length,la=st.anx[st.anx.length-1];
 const stat=(b,s)=>el('div',{},el('b',{},b),s);
 $('today-box').replaceChildren(stat(list.length?done+'/'+list.length:'—','💊 दवाइयाँ'),stat(t.sleep!=null?t.sleep+' घंटे':'—','😴 नींद'),
  stat(la&&S.dayKey(la.t)===t.day?la.l+'/10':'—','😟 आख़िरी anxiety'),stat(t.anx!=null?String(t.anx):'—','📊 आज औसत'));
 const ls=st.sleep[st.sleep.length-1];$('sleep-msg').textContent=ls?(ls.type==='sleep'?'😴 सोए: ':'🌅 उठे: ')+hm(ls.t)+(t.sleep!=null?' · आज की नींद '+t.sleep+' घंटे':''):'';
 $('calm').hidden=!S.needsCalm(st,now)||calmClosed===(la&&la.t);chart(w);}
let calmClosed=null;
function chart(w){const NS='http://www.w3.org/2000/svg',W=360,H=180,P=24,bw=(W-P)/7,mk=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);return e;};
 const svg=mk('svg',{viewBox:'0 0 '+W+' '+H,width:'100%',role:'img','aria-label':'7 दिन का chart'});
 for(const y of[0,5,10]){const yy=H-20-(y/10)*(H-40);svg.append(mk('line',{x1:P,x2:W,y1:yy,y2:yy,stroke:'#b8862b55'}));const tx=mk('text',{x:2,y:yy+4,fill:'#f4c867','font-size':11});tx.textContent=y;svg.append(tx);}
 w.forEach((d,i)=>{const x=P+i*bw+4,b=(bw-8)/3,bar=(v,max,c,j)=>{if(v==null)return;const h=Math.max(2,Math.min(v,max)/max*(H-40));svg.append(mk('rect',{x:x+j*b,y:H-20-h,width:b-1,height:h,fill:c,rx:2}));};
  bar(d.anx,10,'#f08a5d',0);bar(d.sleep,10,'#8fb8ff',1);bar(d.meds,100,'#7fd17f',2);
  const tx=mk('text',{x:x+b*1.5,y:H-5,fill:'#fff4dc','font-size':11,'text-anchor':'middle'});tx.textContent=d.day.slice(8);svg.append(tx);});
 $('chart').replaceChildren(svg);}
// anxiety buttons
for(let i=1;i<=10;i++){const hue=120-(i-1)*13;$('anx').append(el('button',{type:'button',style:'background:hsl('+hue+',65%,62%)','aria-label':'Anxiety '+i,onclick:()=>{st=S.logAnx(st,i,$('anx-note').value,Date.now());$('anx-note').value='';$('anx-msg').textContent='✅ '+i+'/10 दर्ज हुआ, '+hm(Date.now());calmClosed=null;save();if(i>=8)$('calm').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}},String(i)));}
$('slept').onclick=()=>{st=S.logSleep(st,'sleep',Date.now());save();};$('woke').onclick=()=>{st=S.logSleep(st,'wake',Date.now());save();};
$('undo').onclick=()=>{st=S.undoMed(st);save();};
$('m-addtime').onclick=()=>{const v=$('m-time').value;if(v&&!pending.includes(v))pending.push(v);$('m-times').textContent=pending.length?'समय: '+pending.sort().join(', '):'';};
$('m-save').onclick=()=>{const v=$('m-time').value;if(v&&!pending.includes(v))pending.push(v);const r=S.addMed(st,$('m-name').value,$('m-dose').value,pending,Date.now());if(!r.ok){$('m-name').focus();return;}st=r.state;pending=[];$('m-name').value=$('m-dose').value=$('m-time').value='';$('m-times').textContent='';$('add').open=false;save();};
$('doc-save').onclick=()=>{st=S.setDoctor(st,$('doc').value);save();};
document.querySelectorAll('#call-doc,[data-doc]').forEach(a=>a.addEventListener('click',e=>{if(!st.doctor){e.preventDefault();$('doc').scrollIntoView();$('doc').focus();}}));
$('calm-close').onclick=()=>{const la=st.anx[st.anx.length-1];calmClosed=la&&la.t;render();};
$('export').onclick=()=>{const txt=S.summary(st,Date.now());$('sum').textContent=txt;$('sum').hidden=false;
 if(navigator.clipboard)navigator.clipboard.writeText(txt).catch(()=>{});
 const a=el('a',{href:URL.createObjectURL(new Blob([txt],{type:'text/plain;charset=utf-8'})),download:'sehat-saar-'+S.dayKey(Date.now())+'.txt'});document.body.append(a);a.click();a.remove();};
$('wipe').onclick=()=>{if(confirm('सारी दवाइयाँ, नींद, anxiety और doctor नंबर मिटा दें? यह वापस नहीं आएगा।')){localStorage.removeItem(S.KEY);st=S.fresh();$('sum').hidden=true;render();}};
$('notify').onclick=()=>{if(!('Notification' in window)){$('notify').textContent='❌ इस browser में reminder नहीं चलता';return;}Notification.requestPermission().then(p=>{$('notify').textContent=p==='granted'?'🔔 Reminder चालू (page खुला रहे तो)':'❌ Reminder की अनुमति नहीं मिली';});};
setInterval(()=>{const now=Date.now(),key=S.dayKey(now)+hm(now);if(key===lastNotified)return;const due=S.dueNow(st,now).filter(m=>!S.checklist(st,now).find(c=>c.id===m.id).done);
 if(due.length&&'Notification' in window&&Notification.permission==='granted'){lastNotified=key;try{new Notification('💊 दवाई का समय',{body:due.map(m=>m.name+(m.dose?' '+m.dose:'')).join(', '),tag:'sehat'});}catch(e){}}render();},20000);
// breathing text 4-7-8
const steps=[['4 गिनती साँस अंदर…',4],['7 गिनती रोकिए…',7],['8 गिनती धीरे बाहर…',8]];let si=0;(function tick(){$('bstep').textContent=steps[si][0];setTimeout(()=>{si=(si+1)%3;tick();},steps[si][1]*1000);})();
render();})();
