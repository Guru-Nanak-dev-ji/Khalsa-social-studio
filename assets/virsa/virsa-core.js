(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNVirsa=m;})(this,function(){'use strict';
// 🎙️ पंजाब दा विरसा — embed only. Every ID verified via YouTube oEmbed (2026-10-13; 5 more artists added same day); never invented, nothing rehosted.
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
  {p:'yt',id:'97lOAKGrzn0',e:'🌅',t:'नेक अमल — Nonstop',by:'Saregama Gurbani'}]},
 {id:'surinder',icon:'🌸',name:'सुरिंदर कौर',pa:'ਸੁਰਿੰਦਰ ਕੌਰ',sub:'पंजाब की कोयल · लोक-गीत',more:'Surinder Kaur songs',songs:[
  {p:'yt',id:'QYwQ-SBFrq4',e:'👁️',t:'अखियाँ च तूँ वसदा',by:'Saregama Punjabi'},
  {p:'yt',id:'75Ee5wTapDc',e:'🧵',t:'भाभो कहंदी ए सिंघा वेलणा लिया',by:'Saregama Punjabi'},
  {p:'yt',id:'eBIUtN71pv0',e:'👞',t:'जुत्ती कसूरी (lyrical)',by:'Saregama Punjabi'},
  {p:'yt',id:'RLCtRfT1kKg',e:'🎪',t:'मस्सिया दे मेले नूँ जावाँ',by:'Saregama Punjabi'},
  {p:'yt',id:'M6x6ob107Xo',e:'🏘️',t:'गलियाँ ते होइयाँ',by:'Surinder Kaur - Topic'},
  {p:'yt',id:'TWh41TGr83g',e:'🎶',t:'एह मुंडा निरा संचरी ऐ',by:'Saregama Punjabi'}]},
 {id:'yamla',icon:'🪕',name:'लाल चंद यमला जट्ट',pa:'ਲਾਲ ਚੰਦ ਯਮਲਾ ਜੱਟ',sub:'तूंबी के उस्ताद · लोक व धार्मिक',more:'Lal Chand Yamla Jatt songs',songs:[
  {p:'yt',id:'Fu1X0tp3Vi0',e:'🙏',t:'सतगुरु नानक तेरी लीला न्यारी',by:'Saregama Punjabi'},
  {p:'yt',id:'KOxniDZEeK4',e:'🌙',t:'जग देया चानणा तू मुख ना लुकावें',by:'Saregama Punjabi'},
  {p:'yt',id:'ogbsMaMoSNM',e:'🤍',t:'चिट्टा हो गया लहू',by:'Saregama Punjabi'},
  {p:'yt',id:'3iaSWKaT1gU',e:'📜',t:'कहंदे ने सियाणे',by:'Saregama Punjabi'},
  {p:'yt',id:'OGHXEYQHK58',e:'💔',t:'जान दुखाँ विच पा लई',by:'Saregama Punjabi'},
  {p:'yt',id:'3oVZe6R3odc',e:'🪕',t:'मैं तेरी तू मेरा',by:'Lal Chand Yamla Jatt - Topic'}]},
 {id:'mastana',icon:'🎙️',name:'आसा सिंह मस्ताना',pa:'ਆਸਾ ਸਿੰਘ ਮਸਤਾਨਾ',sub:'सुरीली आवाज़ · पुराने लोक-गीत',more:'Asa Singh Mastana songs',songs:[
  {p:'yt',id:'Ui6tuOgHWac',e:'🖤',t:'काली तेरी गुत्त',by:'Saregama Punjabi'},
  {p:'yt',id:'DK9LxGIcdkU',e:'🏡',t:'पेके जाण वालिए',by:'Saregama Punjabi'},
  {p:'yt',id:'MejuJebexZU',e:'🎡',t:'मेले नूँ चल मेरे नाल',by:'Saregama Punjabi'},
  {p:'yt',id:'loZU1BuN5Lo',e:'💭',t:'मैं तैनूँ याद आवाँगा',by:'Asa Singh Mastana - Topic'},
  {p:'yt',id:'4Hd_rMvM508',e:'🕊️',t:'जदों मेरी अर्थी उठा के चलणगे',by:'Asa Singh Mastana - Topic'}]},
 {id:'prakash',icon:'🌼',name:'प्रकाश कौर',pa:'ਪ੍ਰਕਾਸ਼ ਕੌਰ',sub:'लोक व शादी-गीत · कई गीत सुरिंदर कौर के साथ',more:'Prakash Kaur Punjabi songs',songs:[
  {p:'yt',id:'STpYtO-2MkI',e:'👞',t:'जुत्ती कसूरी',by:'Prakash Kaur - Topic'},
  {p:'yt',id:'ezBadWfKnMQ',e:'⛵',t:'गोरी रख के पत्तण दे',by:'Prakash Kaur - Topic'},
  {p:'yt',id:'t1w4vU-BmOs',e:'🧶',t:'काला डोरिया (सुरिंदर कौर के साथ)',by:'Saregama Punjabi'},
  {p:'yt',id:'6Y6GRSBNsh0',e:'🌾',t:'बाजरे दा सिट्टा (सुरिंदर कौर के साथ)',by:'Saregama Punjabi'},
  {p:'yt',id:'LZEFR6xb9fA',e:'🌽',t:'साडे तां वेहड़े मुड़ मकई दा',by:'Saregama Punjabi'}]},
 {id:'maan',icon:'🎵',name:'गुरदास मान',pa:'ਗੁਰਦਾਸ ਮਾਨ',sub:'पंजाबी लोक-गायकी की आवाज़',more:'Gurdas Maan songs',songs:[
  {p:'yt',id:'fsM-eXNNSSo',e:'💍',t:'छल्ला',by:'Gurdas Maan - Topic'},
  {p:'yt',id:'_Ohx6vcYnHk',e:'💛',t:'सजणा वे सजणा (lyrics)',by:'Saregama Music'},
  {p:'yt',id:'TEeI85jHNBQ',e:'🏘️',t:'पिंड दीयाँ गलियाँ',by:'Gurdas Maan'},
  {p:'yt',id:'beQg3PxsNcY',e:'🫓',t:'रोटी',by:'Gurdas Maan'},
  {p:'yt',id:'pjQyBF2gwjQ',e:'🎤',t:'की बणू दुनिया दा (Coke Studio)',by:'Coke Studio India'}]}
];
const ALL=ARTISTS.flatMap(a=>a.songs.map(s=>s.id));
const fresh=()=>({v:1,played:[],badge:false});
function validate(s){if(!s||s.v!==1||!Array.isArray(s.played))return fresh();const played=s.played.filter((x,i,a)=>ALL.includes(x)&&a.indexOf(x)===i);return{v:1,played,badge:s.badge===true||played.length>=NEED};}
function play(s,id){s=validate(s);if(!ALL.includes(id)||s.played.includes(id))return{state:s,badgeNew:false};const played=[...s.played,id],got=played.length>=NEED;return{state:{v:1,played,badge:s.badge||got},badgeNew:got&&!s.badge};}
function valid(song){const P=PLATFORMS[song.p];return !!P&&P.idOk(song.id);}
const CREDIT='सभी गीत उनके official / label channels से embed, अधिकार उनके पास';
return{KEY,BADGE,NEED,PLATFORMS,ARTISTS,ALL,fresh,validate,play,valid,CREDIT};});
