(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNNaksha=m;})(this,function(){'use strict';
// 🌍 KDN नक्शा — सब द्वार एक नक्शे पर. सिर्फ़ इसी phone का localStorage. Game koins only, असली पैसा नहीं.
const KEY='kdn-naksha-v1',BADGE='नक्शा यात्री';
const NODES=[
 {id:'studio',icon:'🏰',name:'द्वार महल'},{id:'gyan',icon:'🏛',name:'ज्ञान मंडल'},{id:'chabi',icon:'🗝️',name:'चाबी वाला द्वार'},
 {id:'takht',icon:'🧊',name:'तख़्त Cube'},{id:'langar',icon:'🍛',name:'लंगर रसोई'},{id:'chakravyuh',icon:'🏹',name:'चक्रव्यूह कथा'},
 {id:'titli',icon:'🦋',name:'Butterfly चुनाव'},{id:'nanak-ghar',icon:'🏠',name:'नानक घर सेवा'},{id:'khazana',icon:'🏆',name:'मेरा खज़ाना'},
 {id:'aaj-bhav',icon:'🌸',name:'मेरा आज का भाव'},{id:'sakhi',icon:'📖',name:'आज की साखी'},{id:'sankalp',icon:'🪔',name:'आज का संकल्प'},{id:'mala',icon:'📿',name:'सिमरन माला'},{id:'gun',icon:'📜',name:'आज का गुण'},{id:'kingdom-lands',icon:'🏰',name:'My Kingdom Lands'},{id:'akarshan',icon:'🧲',name:'आकर्षण का नियम'},{id:'saathi',icon:'🎙️',name:'बोलने वाले AI साथी'},{id:'bhav',icon:'🎭',name:'मेरे भाव'},
 {id:'study',icon:'🎓',name:'स्टडी स्टूडियो'},{id:'goldtv',icon:'📺',name:'Golden TV'},{id:'ai-samvidhan',icon:'📜',name:'AI का खुला संविधान'},
 {id:'patta',icon:'🍃',name:'पत्ता उड़ाओ'},{id:'scroll-dwar',icon:'🚪',name:'Scroll से खुलता द्वार'},{id:'newsroom',icon:'🎙',name:'KNN न्यूज़ स्टूडियो'},
 {id:'news-channels',icon:'📡',name:'न्यूज़ चैनल'},{id:'ai-tools',icon:'🤖',name:'Free AI Tools'},{id:'reels',icon:'🎞️',name:'Reel Studio'},
 {id:'avatar',icon:'😀',name:'मेरा अवतार'},{id:'creator',icon:'✍️',name:'Creator'},{id:'audiobook',icon:'📖',name:'ऑडियोबुक'}
].map((n,i)=>({...n,href:'./'+n.id+'.html',x:[26,74,50][i%3],y:80+i*120}));
const IDS=NODES.map(n=>n.id);
const fresh=()=>({v:1,seen:[],badge:false});
function validate(s){if(!s||s.v!==1||!Array.isArray(s.seen))return fresh();return{v:1,seen:s.seen.filter((x,i,a)=>IDS.includes(x)&&a.indexOf(x)===i),badge:s.badge===true};}
function idFromPath(p){const m=/([a-z0-9-]+)\.html$/.exec(String(p||''));return m&&IDS.includes(m[1])?m[1]:null;}
function visit(s,id){s=validate(s);if(!IDS.includes(id)||s.seen.includes(id))return{state:s,isNew:false,badgeNew:false};
 const seen=[...s.seen,id],all=seen.length===IDS.length,badgeNew=all&&!s.badge;return{state:{v:1,seen,badge:s.badge||all},isNew:true,badgeNew};}
function progress(s){s=validate(s);return{seen:s.seen.length,total:IDS.length,pct:Math.round(s.seen.length*100/IDS.length)};}
function pathD(){return NODES.map((n,i)=>{if(!i)return`M${n.x*4} ${n.y}`;const p=NODES[i-1],my=(p.y+n.y)/2;return`C${p.x*4} ${my} ${n.x*4} ${my} ${n.x*4} ${n.y}`;}).join(' ');}
return{KEY,BADGE,NODES,IDS,fresh,validate,idFromPath,visit,progress,pathD};});
