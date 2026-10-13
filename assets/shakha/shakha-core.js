(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNShakha=m;})(this,function(){'use strict';
// 🌳 कहानी की शाखाएँ — local only. Main story is NEVER auto-changed; suggestions wait for the owner's review.
const KEY='kdn-shakha-v1',BADGE='शाखा लेखक',MAXLEN=1500;
const ROOTS=[{id:'chetna',t:'🐦‍🔥 चेतना का सफ़र',href:'./kahani.html#safar'},{id:'ch1',t:'🦋 अध्याय 1 · सुनहरी तितली',href:'./kahani.html#ch1'},{id:'avatar',t:'🎭 अज्ञात अवतार',href:'./kahani.html#avatar'},
 {id:'wm',t:'🪞 White Mirror',href:'./kahani.html#wm'},{id:'fb',t:'🤣 फनीबुक बनाम 🤥 फेकबुक',href:'./kahani.html#fb'},{id:'her',t:'👽 HER — आवाज़ें',href:'./kahani.html#her'},
 {id:'kyon',t:'❓ क्यों?',href:'./kyon.html'},{id:'funny',t:'😄 फनीबुक चुटकुला',href:'./funnybook.html'}];
const RIDS=ROOTS.map(r=>r.id);
const fresh=()=>({v:1,nodes:[],likes:{},suggest:[],badge:false});
const okNode=n=>n&&typeof n.id==='string'&&/^[a-z0-9]{6,16}$/.test(n.id)&&typeof n.text==='string'&&n.text.trim().length>=10&&n.text.length<=MAXLEN&&RIDS.includes(n.root)&&(n.parent===null||typeof n.parent==='string');
function validate(s){if(!s||s.v!==1||!Array.isArray(s.nodes))return fresh();const nodes=s.nodes.filter(okNode).filter((n,i,a)=>a.findIndex(x=>x.id===n.id)===i).map(n=>({id:n.id,root:n.root,parent:n.parent,title:String(n.title||'').slice(0,60),text:n.text,by:String(n.by||'').slice(0,30),at:+n.at||0,mine:n.mine===true}));
 const likes={};for(const k in (s.likes||{}))if(s.likes[k]===true)likes[k]=true;const suggest=(Array.isArray(s.suggest)?s.suggest:[]).filter(x=>nodes.some(n=>n.id===x));
 return{v:1,nodes,likes,suggest:[...new Set(suggest)],badge:s.badge===true||nodes.some(n=>n.mine)};}
function uid(){return Math.random().toString(36).slice(2,10)}
function add(s,{root,parent=null,title='',text,by=''},F){s=validate(s);const c=F?F.check(title+' '+text+' '+by):{ok:true,why:[]};if(!c.ok)return{state:s,error:c.why};
 const n={id:uid(),root,parent,title,text:String(text).trim(),by,at:Date.now(),mine:true};if(!okNode(n))return{state:s,error:['✍️ कम से कम 10 अक्षर लिखो (ज़्यादा से ज़्यादा '+MAXLEN+')']};
 const badgeNew=!s.badge;return{state:{...s,nodes:[...s.nodes,n],badge:true},node:n,badgeNew};}
function importChain(s,chain,F){s=validate(s);if(!Array.isArray(chain))return{state:s,error:['लिंक ख़राब है']};let added=0;
 for(const n of chain){const m={...n,mine:false};if(!okNode(m))return{state:s,error:['लिंक ख़राब है']};if(F&&!F.check((m.title||'')+' '+m.text+' '+(m.by||'')).ok)return{state:s,error:['🚫 इस लिंक का text filter में रुका']};if(!s.nodes.some(x=>x.id===m.id)){s={...s,nodes:[...s.nodes,m]};added++}}
 return{state:s,added};}
function chain(s,id){s=validate(s);const out=[];let n=s.nodes.find(x=>x.id===id),g=0;while(n&&g++<50){out.unshift(n);n=n.parent?s.nodes.find(x=>x.id===n.parent):null}return out;}
function children(s,root,parent){return validate(s).nodes.filter(n=>n.root===root&&n.parent===parent);}
function like(s,id){s=validate(s);const likes={...s.likes};if(likes[id])delete likes[id];else likes[id]=true;return{...s,likes};}
function suggest(s,id){s=validate(s);return s.suggest.includes(id)?s:{...s,suggest:[...s.suggest,id]};}
return{KEY,BADGE,MAXLEN,ROOTS,RIDS,fresh,validate,add,importChain,chain,children,like,suggest};});
