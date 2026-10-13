(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNChabi=m;})(this,function(){'use strict';
// 🗝️ चाबी वाला द्वार — 7 कमरे। हर पहेली की पंक्ति assets/gyan/granth.json या assets/saathi/bani.json (पक्के स्रोत) से आती है।
const KEY='kdn-chabi-v1',BADGE='चक्रव्यूह भेदी';
const ROOMS=[
 {id:'r1',world:'gate',name:'सुनहरा प्रवेश द्वार',src:'bani',q:'ghaal-khaae',kind:'who',spots:[[18,62,'🪔'],[80,40,'🌸'],[52,82,'🐚']]},
 {id:'r2',world:'library',name:'ग्रंथों का पुस्तकालय',src:'granth',q:'gita-2-47',kind:'who',spots:[[14,34,'📜'],[86,66,'🪶'],[46,58,'📿']]},
 {id:'r3',world:'city',name:'रात का नगर',src:'granth',q:'dhp-5',kind:'meaning',spots:[[24,30,'🏮'],[74,76,'🌙'],[60,46,'⭐']]},
 {id:'r4',world:'sun',name:'सूर्य का आँगन',src:'granth',q:'rv-1-89-1',kind:'who',spots:[[30,70,'🌻'],[84,26,'☀️'],[12,48,'🕊️']]},
 {id:'r5',world:'gate',name:'जाली वाला गलियारा',src:'granth',q:'kabir-120',kind:'meaning',spots:[[70,58,'🔔'],[22,80,'🪷'],[50,30,'💎']]},
 {id:'r6',world:'library',name:'बेगमपुरा की किताब',src:'bani',q:'begampura',kind:'who',spots:[[82,82,'📖'],[36,42,'🕯️'],[62,22,'🗺️']]},
 {id:'r7',world:'city',name:'चक्रव्यूह का केंद्र',src:'granth',q:'mbh-3-314-118',kind:'meaning',spots:[[16,22,'🌀'],[88,50,'🛡️'],[44,74,'👑']]}];
const fresh=()=>({v:1,room:0,found:[],keys:0,wrong:{},done:false});
function validate(s){if(!s||s.v!==1)return fresh();const n=x=>Number.isInteger(x)&&x>=0?x:0;
 return{v:1,room:Math.min(n(s.room),ROOMS.length-1),found:Array.isArray(s.found)?s.found.filter(x=>/^r[1-7]:[0-2]$/.test(x)).slice(0,21):[],keys:Math.min(n(s.keys),ROOMS.length),wrong:{},done:s.done===true};}
function find(s,room,i){s=validate(s);const id=ROOMS[room].id+':'+i;if(room!==s.room||s.found.includes(id))return{state:s,isNew:false,id};return{state:{...s,found:[...s.found,id]},isNew:true,id};}
function foundIn(s,room){return ROOMS[room].spots.filter((_,i)=>s.found.includes(ROOMS[room].id+':'+i)).length;}
function author(q,src){if(src==='granth')return q.speaker;return q.source.split(',')[0].split('(')[0].trim();}
function lineOf(q,src){return src==='granth'?q.short||q.original:q.line;}
function hash(t){let h=7;for(const c of t)h=(h*31+c.codePointAt(0))>>>0;return h;}
function build(room,data){const R=ROOMS[room],pool=data[R.src].quotes,q=pool.find(x=>x.id===R.q);if(!q)throw new Error('missing '+R.q);
 const right=R.kind==='who'?author(q,R.src):q.meaning;
 const all=[...new Set([...data.granth.quotes.map(x=>R.kind==='who'?author(x,'granth'):x.meaning),...data.bani.quotes.filter(x=>x.id!=='sarbat').map(x=>R.kind==='who'?author(x,'bani'):x.meaning)])].filter(x=>x&&x!==right);
 const h=hash(R.id);const wrong=[];for(let k=0;wrong.length<3;k++){const c=all[(h+k*7)%all.length];if(!wrong.includes(c))wrong.push(c);}
 const opts=[...wrong];const c=h%4;opts.splice(c,0,right);
 const hint=R.kind==='who'?'संकेत: यह पंक्ति '+(R.src==='bani'?'श्री गुरु ग्रंथ साहिब जी':(q.book||q.source.split(',')[0]))+' से है।':'संकेत: '+(q.source||'')+' — शब्दों पर ध्यान दीजिए।';
 return{text:R.kind==='who'?'यह किसने कहा?':'इस पंक्ति का अर्थ क्या है?',line:lineOf(q,R.src),source:q.source,meaning:q.meaning,opts,c,hint};}
function answer(s,room,ok){s=validate(s);if(room!==s.room||!ok)return{state:s,unlocked:false};const last=room===ROOMS.length-1;
 return{state:{...s,keys:Math.max(s.keys,room+1),room:last?room:room+1,done:last?true:s.done},unlocked:true,finished:last};}
return{KEY,BADGE,ROOMS,fresh,validate,find,foundIn,build,answer,author};});
