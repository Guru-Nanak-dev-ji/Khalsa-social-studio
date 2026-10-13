(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNKhoya=m;})(this,function(){'use strict';
// 🏰 My Kingdom Lands (मेरा राज्य · खोई हुई ज़मीनें) — बेगमपुरा की खोई रोशनी. अपनी कहानी, अपने चित्र (emoji/CSS). सिर्फ़ इसी phone का localStorage.
const KEY='kdn-khoya-v1',BADGE='खोजी सिंह',HINT_MS=20000,WRONG_MS=4000;
const O=(id,name,e,x,y,s,r,o)=>({id,name,e,x,y,s:s||1,r:r||0,o:o==null?1:o});
const SCENES=[
 {id:'darwaza',name:'पुराना दरवाज़ा',bg:'darwaza',guide:'तरक सिंह',story:'बेगमपुरा का पुराना दरवाज़ा धूल और कोहरे में छिपा है। यहाँ 8 चीज़ें खोजो, फिर दरवाज़ा खुलेगा।',item:{id:'chabi',e:'🗝️',name:'सुनहरी चाबी'},
  objs:[O('ghanti','घंटी','🔔',14,22,.8,-20,.8),O('diya','दीया','🪔',78,70,.9),O('tala','ताला','🔒',52,48,.7,15,.85),O('kabootar','कबूतर','🕊️',84,16,.8,10),O('lalten','लालटेन','🏮',8,62,.8,0,.75),O('jhanda','झंडा','🚩',62,12,.7,-25),O('patthar','पत्थर','🪨',30,82,.8),O('mashaal','मशाल','🔥',40,30,.6,0,.7)],
  decoys:['🧱','🌿','🕸️','🍂','🧱','🍃','🪵','🧱','🌿','🍂','🪵']},
 {id:'langar',name:'लंगर हॉल',bg:'langar',guide:'भावना कौर',story:'लंगर हॉल की रसोई सो गई है। बर्तन और सामान ढूँढो ताकि सबके लिए फिर से भोजन बने।',item:{id:'karchhi',e:'🥄',name:'सेवा की करछी'},
  objs:[O('roti','रोटी','🫓',20,70,.8,20),O('patila','पतीला','🍲',70,58,.9),O('gilas','गिलास','🥛',45,22,.7,0,.8),O('chawal','चावल','🍚',86,80,.75,-15),O('pyaz','प्याज़','🧅',10,34,.7,30,.85),O('gajar','गाजर','🥕',58,84,.7,-40),O('chai','चाय','🍵',32,46,.7,0,.8),O('nimbu','नींबू','🍋',80,28,.65,25,.8)],
  decoys:['🥣','🧺','🍽️','🥢','🧂','🥣','🍽️','🧺','🫙','🥄','🧂','🫙']},
 {id:'pustakalay',name:'पुस्तकालय',bg:'pustak',guide:'तरक सिंह',story:'ज्ञान का पुस्तकालय अँधेरे में है। किताबों के बीच छिपी चीज़ें ढूँढो और ज्ञान की लौ जलाओ।',item:{id:'kalam',e:'🪶',name:'सुनहरी कलम'},
  objs:[O('chashma','चश्मा','👓',22,30,.7,-15,.8),O('ghadi','घड़ी','⏰',74,18,.7,10),O('naksha','नक्शा','🗺️',50,64,.8,8,.85),O('dawat','दवात','🖋️',86,58,.65,-30),O('mombatti','मोमबत्ती','🕯️',12,76,.8),O('globe','ग्लोब','🌍',62,36,.65,0,.8),O('chitthi','चिट्ठी','✉️',36,86,.65,20),O('taraju','तराज़ू','⚖️',40,14,.65,0,.75)],
  decoys:['📚','📕','📗','📘','📙','📜','📚','📒','📕','📗','📘','📚']},
 {id:'baag',name:'बाग़',bg:'baag',guide:'भावना कौर',story:'बाग़ के फूल मुरझा गए हैं। पत्तों के बीच छिपी चीज़ें ढूँढो और बाग़ को फिर से हरा करो।',item:{id:'beej',e:'🌱',name:'जीवन का बीज'},
  objs:[O('titli','तितली','🦋',70,20,.7,15,.85),O('ghoda','घोंघा','🐌',18,80,.65),O('seb','सेब','🍎',44,40,.65,0,.8),O('mor','मोर','🦚',84,64,.85),O('balti','बाल्टी','🪣',30,58,.7,-20),O('suraj','सूरजमुखी','🌻',10,24,.75,0,.85),O('makhi','मधुमक्खी','🐝',56,74,.6,30),O('panchhi','चिड़िया','🐦',36,14,.6,-10,.8)],
  decoys:['🌳','🌿','🍀','🌲','🌾','🌿','🍃','🌳','🌱','🍀','🌾','🌲']},
 {id:'mahal',name:'सुनहरा महल',bg:'mahal',guide:'तरक सिंह और भावना कौर',story:'सुनहरे महल में बेगमपुरा की आख़िरी रोशनी सोई है। आख़िरी 8 चीज़ें खोजो और पूरे नगर में उजाला लौटाओ!',item:{id:'jyoti',e:'🌟',name:'नगर की ज्योति'},
  objs:[O('mukut','मुकुट','👑',50,16,.7,0,.85),O('heera','हीरा','💎',20,48,.6,20,.8),O('shankh','शंख','🐚',78,40,.65,-25),O('dhol','ढोल','🥁',14,80,.75),O('talwar','तलवार','🗡️',64,70,.7,45,.85),O('dhaal','ढाल','🛡️',86,82,.7),O('chabi2','संदूक','🧰',38,62,.65,-10,.8),O('sitara','तारा','⭐',30,26,.55,0,.75)],
  decoys:['🏛️','✨','🟨','🏺','✨','🟧','🏺','✨','🟨','🏛️','✨','🟧']},
 {id:'ghat',ch:2,name:'नदी घाट',bg:'ghat',guide:'भावना कौर',story:'अध्याय 2: नगर रोशन हुआ, पर राज्य की दूर की ज़मीनें अभी भी कोहरे में हैं। नदी घाट पर नाव वाले का सामान बिखर गया है, ढूँढो!',item:{id:'chappu',e:'🛶',name:'चाँदी का चप्पू'},
  objs:[O('machhli','मछली','🐟',22,74,.7,20,.8),O('kamal','कमल','🪷',66,82,.75),O('ghada','घड़ा','🏺',84,52,.7,-10,.85),O('jaal','रस्सी','🪢',40,36,.65,15,.8),O('batakh','बत्तख','🦆',12,46,.7),O('seep','सीप','🦪',56,62,.6,-20,.8),O('chaand','चाँद','🌙',78,14,.6,0,.75),O('langar2','लंगर (नाव का)','⚓',30,88,.65,25)],
  decoys:['🌊','🪨','🌿','🌊','🪵','🌾','🌊','🪨','🍃','🌊','🪵','🌾']},
 {id:'kila',ch:2,name:'पहाड़ी किला',bg:'kila',guide:'तरक सिंह',story:'पहाड़ी किले के पहरेदार सो गए हैं। किले की दीवारों में छिपी चीज़ें ढूँढो और राज्य की रक्षा जगाओ।',item:{id:'bigul',e:'📯',name:'जागृति का बिगुल'},
  objs:[O('teer','तीर','🏹',18,30,.7,-30,.85),O('kamaan','दूरबीन','🔭',72,22,.65,20),O('dhwaja','झंडी','🎌',50,12,.6,0,.8),O('ghoda2','घोड़ा','🐎',82,72,.8),O('baaz','बाज़','🦅',30,52,.7,10,.8),O('rassi','सीढ़ी','🪜',60,58,.7,-15),O('topi','पगड़ी का कपड़ा','🧣',12,82,.65,0,.8),O('sikka','सिक्का','🪙',44,84,.55,0,.75)],
  decoys:['🧱','🪨','🏔️','🧱','🌲','🪨','🧱','⛰️','🪨','🌲','🧱','🪨']},
 {id:'bazaar',ch:2,name:'रंगीन बाज़ार',bg:'bazaar',guide:'भावना कौर',story:'राज्य का बाज़ार चुप है। दुकानों के ढेर में छिपी चीज़ें ढूँढो और फिर से रौनक लाओ — ईमानदार व्यापार, सबका भला।',item:{id:'taraju2',e:'⚖️',name:'सच्चा तराज़ू'},
  objs:[O('aam','आम','🥭',20,40,.7,15,.85),O('chudi','चूड़ी','💍',64,30,.55,0,.75),O('pankha','पंखा','🪭',80,60,.7,-20),O('jooti','जूती','🥿',34,80,.65,10,.8),O('angoor','अंगूर','🍇',52,50,.65,0,.8),O('patang','पतंग','🪁',14,16,.7,-25),O('khilona','लट्टू','🪀',72,86,.6,0,.8),O('thaila','थैला','👜',44,22,.6,20,.8)],
  decoys:['🧺','🎁','🧶','🧺','🎀','🧵','🧺','🎁','🧶','🧵','🎀','🧺']},
 {id:'vedhshala',ch:2,name:'तारों की वेधशाला',bg:'vedh',guide:'तरक सिंह',story:'वेधशाला से राज्य के लोग तारे देखकर रास्ता ढूँढते थे। यहाँ छिपी चीज़ें खोजो, ताकि आसमान का नक्शा फिर बने।',item:{id:'tara',e:'🌠',name:'राह का तारा'},
  objs:[O('shani','शनि ग्रह','🪐',70,18,.7,15,.85),O('kampas','कंपास','🧭',24,62,.6,0,.8),O('ret','रेत घड़ी','⏳',82,64,.6,-15),O('dhoomketu','धूमकेतु','☄️',30,20,.65,20,.8),O('lens','आतिशी शीशा','🔍',52,78,.55,30,.8),O('kitab','पोथी','📔',12,84,.6,0,.85),O('suraj2','सूरज','☀️',46,40,.6,0,.7),O('chakra','पहिया','🛞',88,86,.6,0,.8)],
  decoys:['✨','⭐','🌟','✨','💫','⭐','✨','🌟','💫','✨','⭐','🌟']},
 {id:'meenar',ch:2,name:'प्रकाश मीनार',bg:'meenar',guide:'तरक सिंह और भावना कौर',story:'आख़िरी ज़मीन! प्रकाश मीनार की लौ से पूरा राज्य जुड़ा है। आख़िरी 8 चीज़ें खोजो — "जहाँ ग़म नहीं, वह बेगमपुरा" — और पूरे राज्य को रोशन करो!',item:{id:'lau',e:'🔆',name:'राज्य की लौ'},
  objs:[O('ghanta','बड़ा घंटा','🛎️',50,14,.65,0,.85),O('kalash','कलश','⚱️',22,50,.65,-10,.8),O('mor2','मोरपंख','🪶',76,40,.6,30,.75),O('dhoop','धूप','🪔',40,70,.6,0,.85),O('phool','गेंदा','🌼',84,78,.6,0,.8),O('sitar','सितार','🪕',14,78,.7,-20,.85),O('kabutar2','शांति का कबूतर','🕊️',62,24,.6,15,.8),O('ratna','रत्न','💠',56,86,.55,0,.75)],
  decoys:['🏛️','✨','🟨','🏺','✨','🟧','🏛️','✨','🟨','🏺','✨','🟧']}];
const N=SCENES.length,CH1=5;SCENES.forEach(x=>{x.ch=x.ch||1;});const BADGE2='राज्य रक्षक';
// पहेली: 4 टाइल घुमाओ, सबका तीर ऊपर (0) करो. शुरुआत तय है ताकि हल हमेशा हो.
const PUZ_START=[[1,2,3,1],[2,1,3,2],[3,3,1,2],[1,3,2,2],[2,2,1,3],[3,1,2,1],[1,1,3,2],[2,3,3,1],[3,2,1,1]];
const fresh=()=>({v:1,scene:0,found:SCENES.map(()=>[]),cleared:[],puzzles:[],inv:[],tiles:PUZ_START.map(t=>t.slice()),badge:false,badge2:false});
function validate(s){if(!s||s.v!==1||!Array.isArray(s.found))return fresh();const f=fresh();
 f.found=SCENES.map((sc,i)=>Array.isArray(s.found[i])?s.found[i].filter((id,j,a)=>sc.objs.some(o=>o.id===id)&&a.indexOf(id)===j):[]);
 const idx=a=>Array.isArray(a)?a.filter((x,j,b)=>Number.isInteger(x)&&x>=0&&x<N&&b.indexOf(x)===j):[];
 f.cleared=idx(s.cleared).filter(i=>f.found[i].length===SCENES[i].objs.length);f.puzzles=idx(s.puzzles).filter(i=>i<N-1&&f.cleared.includes(i));
 f.inv=SCENES.filter((sc,i)=>f.cleared.includes(i)).map(sc=>sc.item.id);
 if(Array.isArray(s.tiles)&&s.tiles.length===N-1)f.tiles=s.tiles.map((t,i)=>Array.isArray(t)&&t.length===4&&t.every(x=>Number.isInteger(x)&&x>=0&&x<4)?t.slice():PUZ_START[i].slice());
 f.scene=Number.isInteger(s.scene)&&s.scene>=0&&s.scene<N&&unlocked(f,s.scene)?s.scene:0;f.badge=[0,1,2,3,4].every(i=>f.cleared.includes(i));f.badge2=f.cleared.length===N;return f;}
// दृश्य i खुला है अगर i=0, या पिछला साफ़ + पहेली हल (पिछली चीज़ inventory में)
function unlocked(s,i){return i===0||(s.cleared.includes(i-1)&&s.puzzles.includes(i-1));}
function tap(s,i,id){s=validate(s);const sc=SCENES[i];if(!sc||!unlocked(s,i))return{state:s,ok:false};
 if(!sc.objs.some(o=>o.id===id))return{state:s,ok:false,wrong:true};if(s.found[i].includes(id))return{state:s,ok:false,again:true};
 const found=s.found.map((a,j)=>j===i?[...a,id]:a.slice()),st={...s,found};let clearedNew=false,badgeNew=false,badge2New=false;
 if(found[i].length===sc.objs.length&&!s.cleared.includes(i)){clearedNew=true;st.cleared=[...s.cleared,i];st.inv=[...s.inv,sc.item.id];if(!s.badge&&[0,1,2,3,4].every(j=>st.cleared.includes(j))){badgeNew=true;st.badge=true;}if(!s.badge2&&st.cleared.length===N){st.badge2=true;badge2New=true;}}
 return{state:st,ok:true,clearedNew,badgeNew,badge2New,item:clearedNew?sc.item:null};}
function hint(s,i){s=validate(s);const sc=SCENES[i];return sc?sc.objs.find(o=>!s.found[i].includes(o.id))||null:null;}
function canHint(last,now){return !last||now-last>=HINT_MS;}
function rotate(s,p,t){s=validate(s);if(!(p>=0&&p<N-1)||!(t>=0&&t<4)||!s.cleared.includes(p)||s.puzzles.includes(p))return{state:s,solved:false};
 const tiles=s.tiles.map(a=>a.slice());tiles[p][t]=(tiles[p][t]+1)%4;const solved=tiles[p].every(x=>x===0);
 return{state:{...s,tiles,puzzles:solved?[...s.puzzles,p]:s.puzzles},solved};}
const progress=s=>{s=validate(s);const tot=SCENES.reduce((a,sc)=>a+sc.objs.length,0),got=s.found.reduce((a,f)=>a+f.length,0);return{got,tot,pct:Math.round(got*100/tot),cleared:s.cleared.length};};
return{KEY,BADGE,BADGE2,CH1,HINT_MS,WRONG_MS,SCENES,PUZ_START,fresh,validate,unlocked,tap,hint,canHint,rotate,progress};});
