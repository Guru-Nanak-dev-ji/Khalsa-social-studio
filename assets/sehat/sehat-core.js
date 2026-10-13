'use strict';
// Private health logger core. Everything stays in this browser (localStorage). No meds/numbers are built in.
(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.SehatCore=m;})(this,function(){
const KEY='kdn-sehat-v1',MAX=60;
const clean=(s,n)=>String(s==null?'':s).replace(/[<>]/g,'').replace(/\s+/g,' ').trim().slice(0,n||MAX);
const pad=n=>String(n).padStart(2,'0');
const dayKey=t=>{const d=new Date(t);return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());};
const okTime=s=>/^([01]\d|2[0-3]):[0-5]\d$/.test(s);
function fresh(){return{v:1,meds:[],doctor:'',medLog:[],sleep:[],anx:[]};}
function validate(s){if(!s||s.v!==1)return fresh();const f=fresh();
 f.meds=(Array.isArray(s.meds)?s.meds:[]).filter(m=>m&&clean(m.name)).map(m=>({id:clean(m.id,20),name:clean(m.name),dose:clean(m.dose,30),times:(Array.isArray(m.times)?m.times:[]).filter(okTime).slice(0,6)}));
 f.doctor=cleanPhone(s.doctor);const num=x=>typeof x==='number'&&isFinite(x);
 f.medLog=(Array.isArray(s.medLog)?s.medLog:[]).filter(x=>x&&num(x.t)&&typeof x.id==='string');
 f.sleep=(Array.isArray(s.sleep)?s.sleep:[]).filter(x=>x&&num(x.t)&&(x.type==='sleep'||x.type==='wake'));
 f.anx=(Array.isArray(s.anx)?s.anx:[]).filter(x=>x&&num(x.t)&&Number.isInteger(x.l)&&x.l>=1&&x.l<=10).map(x=>({l:x.l,t:x.t,note:clean(x.note,80)}));return f;}
function cleanPhone(p){return String(p||'').replace(/[^\d+]/g,'').slice(0,16);}
function addMed(s,name,dose,times,now){name=clean(name);if(!name)return{ok:false,state:s};times=(times||[]).filter(okTime);if(!times.length)times=[];
 const m={id:'m'+(now||Date.now()).toString(36)+s.meds.length,name,dose:clean(dose,30),times:[...new Set(times)].sort().slice(0,6)};return{ok:true,state:{...s,meds:[...s.meds,m]}};}
function removeMed(s,id){return{...s,meds:s.meds.filter(m=>m.id!==id)};}
function setDoctor(s,p){return{...s,doctor:cleanPhone(p)};}
function takeMed(s,id,t){if(!s.meds.some(m=>m.id===id))return s;return{...s,medLog:[...s.medLog,{id,t}]};}
function undoMed(s){return{...s,medLog:s.medLog.slice(0,-1)};}
function logSleep(s,type,t){return{...s,sleep:[...s.sleep,{type,t}]};}
function logAnx(s,l,note,t){l=Math.round(Number(l));if(!(l>=1&&l<=10))return s;return{...s,anx:[...s.anx,{l,t,note:clean(note,80)}]};}
function doses(s){return s.meds.reduce((a,m)=>a+Math.max(1,m.times.length),0);}
function checklist(s,now){const k=dayKey(now);return s.meds.map(m=>{const n=s.medLog.filter(x=>x.id===m.id&&dayKey(x.t)===k).length,need=Math.max(1,m.times.length);return{...m,taken:n,need,done:n>=need};});}
// Sleep hours attributed to the day of waking: last 'sleep' before each 'wake' (within 20h).
function sleepByDay(s){const ev=[...s.sleep].sort((a,b)=>a.t-b.t),out={};let start=null;
 for(const e of ev){if(e.type==='sleep')start=e.t;else if(start!=null){const h=(e.t-start)/36e5;if(h>0&&h<=20){const k=dayKey(e.t);out[k]=Math.round(((out[k]||0)+h)*10)/10;}start=null;}}return out;}
function week(s,now){const sl=sleepByDay(s),D=doses(s),out=[];
 for(let i=6;i>=0;i--){const d=new Date(now);d.setHours(12,0,0,0);d.setDate(d.getDate()-i);const k=dayKey(d);
  const a=s.anx.filter(x=>dayKey(x.t)===k).map(x=>x.l);
  const taken=s.meds.reduce((acc,m)=>acc+Math.min(Math.max(1,m.times.length),s.medLog.filter(x=>x.id===m.id&&dayKey(x.t)===k).length),0);
  out.push({day:k,anx:a.length?Math.round(a.reduce((p,c)=>p+c,0)/a.length*10)/10:null,anxMax:a.length?Math.max(...a):null,sleep:sl[k]!=null?sl[k]:null,meds:D?Math.round(taken/D*100):null});}return out;}
function needsCalm(s,now){const last=s.anx[s.anx.length-1];return!!last&&last.l>=8&&now-last.t<6*36e5;}
function summary(s,now){const w=week(s,now),L=['🧡 सेहत सार — पिछले 7 दिन ('+w[0].day+' से '+w[6].day+')','(यह जानकारी मरीज़ ने खुद दर्ज की है।)',''];
 L.push('दवाइयाँ:');if(!s.meds.length)L.push('  (कोई दवाई दर्ज नहीं)');for(const m of s.meds)L.push('  • '+m.name+(m.dose?' '+m.dose:'')+(m.times.length?' — समय: '+m.times.join(', '):''));L.push('');
 L.push('दिन | Anxiety औसत (सबसे ज़्यादा) | नींद घंटे | दवाई ली %');
 for(const d of w)L.push(d.day+' | '+(d.anx==null?'-':d.anx+' ('+d.anxMax+')')+' | '+(d.sleep==null?'-':d.sleep)+' | '+(d.meds==null?'-':d.meds+'%'));
 const notes=s.anx.filter(x=>x.note&&dayKey(x.t)>=w[0].day);if(notes.length){L.push('','Anxiety notes:');for(const x of notes){const d=new Date(x.t);L.push('  '+dayKey(x.t)+' '+pad(d.getHours())+':'+pad(d.getMinutes())+' — '+x.l+'/10 — '+x.note);}}
 L.push('','यह doctor की जगह नहीं है। दवाई का समय/मात्रा doctor के कहने पर ही बदलें।');return L.join('\n');}
function dueNow(s,now){const d=new Date(now),hm=pad(d.getHours())+':'+pad(d.getMinutes());return s.meds.filter(m=>m.times.includes(hm));}
return{KEY,MAX,fresh,validate,addMed,removeMed,setDoctor,cleanPhone,takeMed,undoMed,logSleep,logAnx,checklist,sleepByDay,week,needsCalm,summary,dueNow,dayKey};});
