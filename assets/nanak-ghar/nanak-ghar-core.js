(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNNanakGhar=m;})(this,function(){'use strict';
// नानक घर सेवा board — सिर्फ़ इसी phone के localStorage में, कोई server नहीं. सिर्फ़ game koins.
const KEY='kdn-nanak-ghar-v1',BADGE='नानक घर सेवादार',MAX=100,MAXLEN=140,NEED=3;
const KINDS={maang:{icon:'🙏',name:'मदद माँगो'},madad:{icon:'🤲',name:'मदद करो'}};
const CATS=['🍛 खाना','📚 पढ़ाई','🏥 दवाई','👕 कपड़े','🧓 बुज़ुर्ग सेवा','🔧 और कुछ'];
const fresh=()=>({v:1,seq:0,posts:[],helped:[],badge:false});
const clean=t=>String(t||'').replace(/[\u0000-\u001f<>]/g,' ').replace(/\s+/g,' ').trim().slice(0,MAXLEN);
function validate(s){if(!s||s.v!==1||!Array.isArray(s.posts))return fresh();const n=x=>Number.isFinite(x)&&x>=0?Math.trunc(x):0;
 const posts=s.posts.filter(p=>p&&KINDS[p.kind]&&clean(p.text)).slice(-MAX).map(p=>({id:n(p.id),kind:p.kind,cat:CATS.includes(p.cat)?p.cat:CATS[5],text:clean(p.text),ts:n(p.ts),helpers:n(p.helpers),done:!!p.done}));
 const ids=posts.map(p=>p.id);const helped=[...new Set(Array.isArray(s.helped)?s.helped:[])].filter(x=>ids.includes(x));
 return{v:1,seq:Math.max(n(s.seq),...ids,0),posts,helped,badge:!!s.badge||helped.length>=NEED};}
function add(s,kind,cat,text,ts){s=validate(s);const t=clean(text);if(!KINDS[kind]||!t)return{state:s,post:null};
 const post={id:s.seq+1,kind,cat:CATS.includes(cat)?cat:CATS[5],text:t,ts:n0(ts),helpers:0,done:false};
 return{state:{...s,seq:post.id,posts:[...s.posts,post].slice(-MAX)},post};}
const n0=x=>Number.isFinite(x)&&x>=0?Math.trunc(x):0;
// "मैं मदद करूँगा" — हर माँग पर एक बार ही seva koins
function help(s,id){s=validate(s);const p=s.posts.find(x=>x.id===id);if(!p||p.kind!=='maang'||p.done||s.helped.includes(id))return{state:s,ok:false,badgeNew:false};
 const helped=[...s.helped,id],badge=s.badge||helped.length>=NEED;
 return{state:{...s,helped,badge,posts:s.posts.map(x=>x.id===id?{...x,helpers:x.helpers+1}:x)},ok:true,badgeNew:badge&&!s.badge};}
function done(s,id){s=validate(s);return{...s,posts:s.posts.map(x=>x.id===id?{...x,done:true}:x)};}
function remove(s,id){s=validate(s);return validate({...s,posts:s.posts.filter(x=>x.id!==id)});}
return{KEY,BADGE,KINDS,CATS,MAXLEN,NEED,fresh,validate,add,help,done,remove,clean};});
