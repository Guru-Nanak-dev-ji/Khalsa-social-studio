(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNVirsa=m;})(this,function(){'use strict';
// 🎙️ पंजाब दा विरसा — embed only. Every ID verified via YouTube oEmbed (2026-10-13); never invented, nothing rehosted.
// Extensible: add an ARTISTS entry, or a new PLATFORMS entry (platform:'yt' today).
const KEY='kdn-virsa-v1',BADGE='विरसा सुनने वाला',NEED=5;
const PLATFORMS={yt:{name:'YouTube',embed:id=>'https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0',idOk:id=>/^[A-Za-z0-9_-]{11}$/.test(id),search:q=>'https://www.youtube.com/results?search_query='+encodeURIComponent(q)}};
const ARTISTS=[
 {id:'manak',icon:'🎤',name:'कुलदीप माणक',pa:'ਕੁਲਦੀਪ ਮਾਣਕ',sub:'कलियों का बादशाह · लोक-गाथाएँ',more:'Kuldeep Manak songs',songs:[
  {p:'yt',id:'sVWdGOte6MY',e:'🏔️',t:'तेरे टिल्ले तों',by:'Saregama Music'},
  {p:'yt',id:'pqADVjGCV54',e:'✨',t:'जुगनी',by:'Saregama Punjabi'},
  {p:'yt',id:'LsP_mZvC-YE',e:'✉️',t:'चिट्ठियाँ साहिबाँ जट्टी ने',by:'Saregama Punjabi'},
  {p:'yt',id:'w0ugn_zhR8A',e:'🏹',t:'मिर्ज़ा साहिबाँ (lyrical)',by:'Saregama Punjabi'},
  {p:'yt',id:'KnHuC_NcwRY',e:'🌸',t:'हीर दी कली',by:'Kuldeep Manak Punjabi Songs'},
  {p:'yt',id:'SmS3WtM50QA',e:'💭',t:'साहिबाँ दा ख़याल',by:'Kuldeep Manak - Topic'},
  {p:'yt',id:'m7Yt6pelVYA',e:'🧣',t:'चादर',by:'Kuldeep Manak - Topic'},
  {p:'yt',id:'Qt5C0sOV4LI',e:'☀️',t:'सिखर दुपहरे वरगी',by:'Kuldeep Manak - Topic'},
  {p:'yt',id:'6FkhDgI5-4c',e:'👑',t:'Top Hits — माणक',by:'Saregama Punjabi'},
  {p:'yt',id:'fXAicd2tLAk',e:'📻',t:'Songs Playlist Vol 2',by:'Saregama Punjabi'}]},
 {id:'chamkila',icon:'🙏',name:'अमर सिंह चमकीला',pa:'ਅਮਰ ਸਿੰਘ ਚਮਕੀਲਾ',sub:'सिर्फ़ धार्मिक गीत · अमरजोत के साथ',more:'Amar Singh Chamkila dharmik geet',songs:[
  {p:'yt',id:'O9XfPHvGk1M',e:'🛕',t:'बाबा तेरा ननकाणा',by:'Saregama Punjabi'},
  {p:'yt',id:'TByDTIYWikw',e:'⚔️',t:'तलवार मैं कलगीधर दी',by:'Saregama Punjabi'},
  {p:'yt',id:'mI3UoIX4qaE',e:'🪶',t:'कलगियाँ वाला आ गया',by:'Amar Singh Chamkila - Topic'},
  {p:'yt',id:'XM7ZIGvow9w',e:'🕊️',t:'तुर चली जिंदड़िए',by:'Amar Singh Chamkila - Topic'},
  {p:'yt',id:'m-TnQ_PyZz0',e:'💧',t:'पाणी देया बुलबुलेया',by:'Music Pearls'},
  {p:'yt',id:'yqfDljwICik',e:'📿',t:'नाम जप ले',by:'InderjeetGrewal SoundSolution'},
  {p:'yt',id:'HZmj_6dk0zU',e:'🪔',t:'धार्मिक गीत — चमकीला और अमरजोत',by:'Saregama Gurbani'},
  {p:'yt',id:'fyVMZzFRJAs',e:'🎶',t:'Non-Stop धार्मिक गीत',by:'Saregama Gurbani'},
  {p:'yt',id:'97lOAKGrzn0',e:'🌅',t:'नेक अमल — Nonstop',by:'Saregama Gurbani'}]}
];
const ALL=ARTISTS.flatMap(a=>a.songs.map(s=>s.id));
const fresh=()=>({v:1,played:[],badge:false});
function validate(s){if(!s||s.v!==1||!Array.isArray(s.played))return fresh();const played=s.played.filter((x,i,a)=>ALL.includes(x)&&a.indexOf(x)===i);return{v:1,played,badge:s.badge===true||played.length>=NEED};}
function play(s,id){s=validate(s);if(!ALL.includes(id)||s.played.includes(id))return{state:s,badgeNew:false};const played=[...s.played,id],got=played.length>=NEED;return{state:{v:1,played,badge:s.badge||got},badgeNew:got&&!s.badge};}
function valid(song){const P=PLATFORMS[song.p];return !!P&&P.idOk(song.id);}
const CREDIT='सभी गीत उनके official / label channels से embed, अधिकार उनके पास';
return{KEY,BADGE,NEED,PLATFORMS,ARTISTS,ALL,fresh,validate,play,valid,CREDIT};});
