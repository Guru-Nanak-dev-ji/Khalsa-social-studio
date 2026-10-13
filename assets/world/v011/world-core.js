(function(root,factory){const content=typeof module==='object'&&module.exports?require('./world-content.js'):root.KDNWorldContent;const api=factory(content);if(typeof module==='object'&&module.exports)module.exports=api;else root.KDNWorld=api;})(typeof globalThis!=='undefined'?globalThis:this,function(C){
'use strict';
const KEY='kdn-immersive-world-v1',categories=['JK','IQ','Study','Work','Seva'];
const empty=()=>({version:1,phase:'gates',gate:0,route:'light',pledgeChoice:null,profile:null,history:[],reflections:[],activeMs:0,hourlyDone:0,steps:0,avatars:[],traits:{},tasks:[],saved:false});
function score(state){const result=Object.fromEntries(categories.map(c=>[c,{points:0,correct:0,attempts:0,percent:0}]));for(const h of state.history){const q=C.quiz.find(q=>q.id===h.id);if(!q)continue;const row=result[q.category];row.attempts++;if(h.choice===q.correct){row.correct++;row.points+=10;}else if(h.choice!==null)row.points-=3;}for(const row of Object.values(result))row.percent=row.attempts?Math.round(100*row.correct/row.attempts):0;return result;}
function reward(kind,id,choice){
 if(kind==='reflection'){const r=C.gateRubric[id];if(!r||!Number.isInteger(choice)||choice<0||choice>3)return null;const value=r.values[choice];return {points:value/10,positive:Math.max(0,value),negative:Math.max(0,-value),reason:r.reasons[choice],category:r.category};}
 const q=C.quiz.find(q=>q.id===id);if(!q)return null;const value=choice===null?0:choice===q.correct?100:-30;return {points:value/10,positive:Math.max(0,value),negative:Math.max(0,-value),reason:q.explain,category:q.category};
}
function gameScore(state){const rows=score(state);for(const h of state.reflections){if(h.rubric!==2)continue;const r=reward('reflection',h.gate,h.choice);if(r)rows[r.category].points+=r.points;}return rows;}
function workProfile(w){if(!w||typeof w!=='object')throw Error('Work profile missing');
 const text=(key,max,required=true)=>{if(typeof w[key]!=='string'||w[key].length>max||required&&!w[key].trim())throw Error('Invalid work field');return w[key].trim();};
 if(!C.workTracks.some(t=>t.id===w.wish)||!['learn','volunteer','paid'].includes(w.mode)||!['new','practiced','professional'].includes(w.experience)||!Number.isInteger(w.hours)||w.hours<1||w.hours>40||!Array.isArray(w.skills)||w.skills.length>12||w.skills.some(v=>!C.workSkills.includes(v))||new Set(w.skills).size!==w.skills.length)throw Error('Invalid work preferences');
 return {current:text('current',100),education:text('education',80,false),goal:text('goal',180),city:text('city',80,false),wish:w.wish,mode:w.mode,experience:w.experience,hours:w.hours,skills:[...w.skills],track:C.workTracks.some(t=>t.id===w.track)?w.track:null};
}
function matchWork(work){const w=workProfile(work);return C.workTracks.map(t=>({...t,matched:t.skills.filter(x=>w.skills.includes(x)),preferred:t.id===w.wish})).sort((a,b)=>Number(b.preferred)-Number(a.preferred)||b.matched.length-a.matched.length).slice(0,3);}
function answer(state,id,choice){const q=C.quiz.find(q=>q.id===id);if(!q||state.history.some(h=>h.id===id)||!(choice===null||Number.isInteger(choice)&&choice>=0&&choice<4))return state;return {...state,history:[...state.history,{id,choice}]};}
function nextQuiz(state,room='any',random=Math.random){const rest=C.quiz.filter(q=>!state.history.some(h=>h.id===q.id));const preferred=rest.filter(q=>q.room===room);const pool=preferred.length?preferred:rest;if(!pool.length)return null;return pool[Math.min(pool.length-1,Math.max(0,Math.floor(random()*pool.length)))];}
function reflect(state,choice,route){if(state.phase!=='gates'||!Number.isInteger(choice)||choice<0||choice>3||!['light','shadow'].includes(route))return state;return {...state,route,gate:state.gate+1,phase:state.gate===4?'pledge':'gates',reflections:[...state.reflections,{gate:state.gate,choice,route,rubric:2}]};}
const paise=ms=>Math.floor(Math.max(0,ms)*12500/3600000);
function accrue(state,delta,visible,running){if(!visible||!running||!Number.isFinite(delta)||delta<=0)return state;return {...state,activeMs:state.activeMs+Math.min(delta,1500)};}
const hourlyDue=state=>Math.floor(state.activeMs/3600000)>state.hourlyDone;
const participation=state=>state.history.length+state.reflections.length;
function validate(data){
 if(!data||data.version!==1||!['gates','pledge','intro','profile','world'].includes(data.phase)||!Number.isInteger(data.gate)||data.gate<0||data.gate>5||!['light','shadow'].includes(data.route)||!Array.isArray(data.history)||data.history.length>C.quiz.length||!Array.isArray(data.reflections)||data.reflections.length>5)throw Error('Invalid journey');
 const out=empty();out.phase=data.phase;out.gate=data.gate;out.route=data.route;
 const ids=new Set();for(const h of data.history){if(!C.quiz.some(q=>q.id===h.id)||ids.has(h.id)||!(h.choice===null||Number.isInteger(h.choice)&&h.choice>=0&&h.choice<4))throw Error('Invalid answer');ids.add(h.id);out.history.push({id:h.id,choice:h.choice});}
 for(let i=0;i<data.reflections.length;i++){const h=data.reflections[i];if(h.gate!==i||!Number.isInteger(h.choice)||h.choice<0||h.choice>3||!['light','shadow'].includes(h.route))throw Error('Invalid reflection');if(h.rubric!==undefined&&h.rubric!==2)throw Error('Invalid rubric');out.reflections.push({gate:i,choice:h.choice,route:h.route,...(h.rubric===2?{rubric:2}:{})});}
 if(out.gate!==out.reflections.length||out.phase==='gates'&&out.gate===5||out.phase!=='gates'&&out.gate!==5)throw Error('Invalid stage');
 if(data.pledgeChoice!==null&&!['accept','consider'].includes(data.pledgeChoice))throw Error('Invalid pledge');out.pledgeChoice=data.pledgeChoice;
 for(const key of ['activeMs','hourlyDone','steps']){if(!Number.isFinite(data[key])||data[key]<0||data[key]>1e12)throw Error('Invalid clock');out[key]=data[key];}
 if(!Number.isInteger(out.steps)||!Number.isInteger(out.hourlyDone)||out.hourlyDone>Math.floor(out.activeMs/3600000))throw Error('Invalid progress');
 if(data.profile!==null){const p=data.profile;if(!p||typeof p.name!=='string'||!p.name.trim()||p.name.length>40||!['hi','pa','en'].includes(p.language)||!categories.includes(p.interest))throw Error('Invalid profile');out.profile={name:p.name.trim(),language:p.language,interest:p.interest};if(p.work!==undefined)out.profile.work=workProfile(p.work);}
 if(out.phase==='world'&&!out.profile)throw Error('Profile missing');
 if(!Array.isArray(data.avatars)||data.avatars.length>12)throw Error('Invalid avatars');for(const a of data.avatars){if(!a||typeof a.name!=='string'||!a.name.trim()||a.name.length>30||!['family','friend','fictional'].includes(a.relation)||a.consent!==true)throw Error('Consent required');out.avatars.push({name:a.name.trim(),relation:a.relation,consent:true});}
 if(!data.traits||typeof data.traits!=='object'||Array.isArray(data.traits))throw Error('Invalid reflections');for(const [key,value]of Object.entries(data.traits)){if(!C.traits.includes(key)||!Number.isInteger(value)||value<0||value>100)throw Error('Invalid percentage');out.traits[key]=value;}
 if(!Array.isArray(data.tasks)||data.tasks.length>3)throw Error('Invalid tasks');const used=new Set();for(const t of data.tasks){if(!Number.isInteger(t.id)||t.id<0||t.id>=C.tasks.length||used.has(t.id)||typeof t.done!=='boolean')throw Error('Invalid task');used.add(t.id);out.tasks.push({id:t.id,done:t.done});}
 out.saved=data.saved===true;return out;
}
class Store{constructor(storage){this.storage=storage;this.raw=null;this.data=null;this.error=null;try{this.raw=storage.getItem(KEY);if(this.raw)this.data=validate(JSON.parse(this.raw));}catch(e){this.error=e;}}
 save(state){if(this.error)throw Error('पुराना सेव रिकॉर्ड पढ़ा नहीं जा सका; उसे नहीं बदला गया।');if(this.storage.getItem(KEY)!==this.raw)throw Error('दूसरे टैब में प्रगति बदली है। पहले इस यात्रा का backup लें।');const valid=validate(state),raw=JSON.stringify(valid);this.storage.setItem(KEY,raw);this.raw=raw;this.data=valid;}
 clear(){if(this.error||this.storage.getItem(KEY)!==this.raw)throw Error('सेव रिकॉर्ड बदला है; उसे नहीं हटाया गया।');this.storage.removeItem(KEY);this.raw=null;this.data=null;}
}
return {KEY,categories,empty,score,answer,nextQuiz,reflect,paise,accrue,hourlyDue,participation,validate,Store,reward,gameScore,workProfile,matchWork};
});
