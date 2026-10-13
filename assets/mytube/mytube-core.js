(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNMyTube=m;})(this,function(){'use strict';
// 📺 MyTube — Your channel. Your world. Local only, embed only. Curated IDs verified via YouTube oEmbed (2026-10-13), never invented.
const KEY='kdn-mytube-v1',ORIGINAL='https://mytube.khatri-news-8960.chatgpt.site';
const ARTISTS={manak:'🎤 कुलदीप माणक',labh:'💎 लाभ हीरा',sukhi:'🎶 सुखविंदर सुखी',maan:'🌾 गुरदास मान'};
const CURATED=[
 {p:'yt',id:'d-BRyn6aS78',a:'manak',e:'🤱',t:'माँ हुंदी ए माँ',by:'Saregama Punjabi'},
 {p:'yt',id:'48EthWTt3UE',a:'manak',e:'🙏',t:'साजना पंथ प्यारा (Jukebox)',by:'CTC Music'},
 {p:'yt',id:'heS4_KsEpZI',a:'manak',e:'🪔',t:'पंथ खालसा',by:'Saregama Gurbani'},
 {p:'yt',id:'m_pDblf5BaM',a:'labh',e:'🌅',t:'अमृत वेला हो गया (Jukebox)',by:'Anand Music Official'},
 {p:'yt',id:'_2PMCnSZk1Y',a:'labh',e:'🤲',t:'बख़्शी दीन दयाला',by:'Anand Music Official'},
 {p:'yt',id:'7tViJDqX-gI',a:'labh',e:'👫',t:'भैण कहे वीर मेरा',by:'Labh Heera - Topic'},
 {p:'yt',id:'WHsNnmk86Bg',a:'labh',e:'🕊️',t:'फ़क्करां दी जै जैकार',by:'Anand Music'},
 {p:'yt',id:'cqela3rKxcA',a:'labh',e:'📿',t:'नाम दी ख़ुमारी',by:'musicbankbhakti'},
 {p:'yt',id:'hM9zRtKsIf4',a:'labh',e:'🍂',t:'दुनिया तों तुर जाणा',by:'Rick-E Production'},
 {p:'yt',id:'THQdhRbsHsg',a:'sukhi',e:'🛡️',t:'औखी घड़ी ना देखण देई',by:'Vvanjhali Records'},
 {p:'yt',id:'Efnc_t4n_6E',a:'sukhi',e:'🙏',t:'इक टेकिया आसरा तेरा',by:'Amar Gurbani'},
 {p:'yt',id:'wSSrtsFrXPI',a:'maan',e:'🌳',t:'मावां ठंडियां छावां',by:'Gurdas Maan - Topic'},
 {p:'yt',id:'fsM-eXNNSSo',a:'maan',e:'💍',t:'छल्ला',by:'Gurdas Maan - Topic'},
 {p:'yt',id:'cLk90s4CK6k',a:'maan',e:'🗣️',t:'माँ बोली',by:'Speed Records'},
 {p:'yt',id:'GppbYq3Lw8w',a:'maan',e:'🌾',t:'पंजाब',by:'SagaHits'},
 {p:'yt',id:'1cHLSWmVnTE',a:'maan',e:'🏡',t:'अपना पंजाब होवे',by:'T-Series'},
 {p:'yt',id:'pjQyBF2gwjQ',a:'maan',e:'🌍',t:'की बणू दुनिया दा (Coke Studio)',by:'Coke Studio India'},
 {p:'yt',id:'ewiqDm2q1oQ',a:'maan',e:'🌺',t:'कर किरपा मेरी माँ',by:'SagaHits'},
 {p:'yt',id:'TEeI85jHNBQ',a:'maan',e:'🛤️',t:'पिंड दियां गलियां',by:'Sai Productions'}];
const ID={yt:/^[A-Za-z0-9_-]{11}$/,vimeo:/^\d{6,12}$/};
function parse(u){u=String(u||'').trim();let m;
 if((m=/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([A-Za-z0-9_-]{11})(?:[?&#/].*)?$/i.exec(u)))return{p:'yt',id:m[1]};
 if((m=/^(?:https?:\/\/)?(?:www\.|player\.)?vimeo\.com\/(?:video\/)?(\d{6,12})(?:[?#/].*)?$/i.exec(u)))return{p:'vimeo',id:m[1]};return null;}
function embed(v){return v.p==='yt'?'https://www.youtube-nocookie.com/embed/'+v.id+'?autoplay=1&rel=0':'https://player.vimeo.com/video/'+v.id+'?autoplay=1&dnt=1';}
function open(v){return v.p==='yt'?'https://www.youtube.com/watch?v='+v.id:'https://vimeo.com/'+v.id;}
const key=v=>v.p+':'+v.id,ok=v=>v&&ID[v.p]&&ID[v.p].test(v.id);
const fresh=()=>({v:1,mine:[],fav:[],lists:[]});
function validate(s){if(!s||s.v!==1)return fresh();const mine=(Array.isArray(s.mine)?s.mine:[]).filter(ok).map(v=>({p:v.p,id:v.id,t:String(v.t||'').slice(0,80)})).filter((v,i,a)=>a.findIndex(x=>key(x)===key(v))===i).slice(0,500);
 const fav=[...new Set((Array.isArray(s.fav)?s.fav:[]).filter(k=>typeof k==='string'&&ok({p:k.split(':')[0],id:k.split(':')[1]})))];
 const lists=(Array.isArray(s.lists)?s.lists:[]).filter(l=>l&&typeof l.name==='string'&&l.name.trim()).slice(0,50).map(l=>({name:l.name.trim().slice(0,40),items:[...new Set((l.items||[]).filter(k=>typeof k==='string'))]}));return{v:1,mine,fav,lists};}
function add(s,url,title){s=validate(s);const v=parse(url);if(!v)return{state:s,error:'🔗 सिर्फ़ YouTube या Vimeo का सही link'};if(s.mine.some(x=>key(x)===key(v))||CURATED.some(x=>key(x)===key(v)))return{state:s,error:'✅ यह पहले से है'};
 return{state:{...s,mine:[{...v,t:String(title||'').trim().slice(0,80)||'मेरी video'},...s.mine]},v};}
function fav(s,k){s=validate(s);return{...s,fav:s.fav.includes(k)?s.fav.filter(x=>x!==k):[...s.fav,k]};}
function newList(s,name){s=validate(s);name=String(name||'').trim().slice(0,40);if(!name||s.lists.some(l=>l.name===name))return s;return{...s,lists:[...s.lists,{name,items:[]}]};}
function toList(s,name,k){s=validate(s);return{...s,lists:s.lists.map(l=>l.name===name?{...l,items:l.items.includes(k)?l.items.filter(x=>x!==k):[...l.items,k]}:l)};}
function all(s){s=validate(s);return[...s.mine.map(v=>({...v,e:v.p==='yt'?'▶️':'🎞️',by:'मेरा channel',a:'mine'})),...CURATED];}
return{KEY,ORIGINAL,ARTISTS,CURATED,parse,embed,open,key,ok,fresh,validate,add,fav,newList,toList,all};});
