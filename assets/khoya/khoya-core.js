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
  decoys:['🏛️','✨','🟨','🏺','✨','🟧','🏛️','✨','🟨','🏺','✨','🟧']},
 {id:'toota-ghar',ch:3,name:'टूटा घर',bg:'ghar',guide:'दलजीत',story:'बचपन का टूटा घर। यहाँ की हर चीज़ में एक याद छिपी है। 8 यादें ढूँढो।',item:{id:'ghar-kagaz',e:'📜',name:'घर के कागज़'},
  card:'📖 कहानी शुरू होती है… एक कच्चा, टूटा घर। रात को पिता शराब पीकर लौटते, और घर में डर फैल जाता। गली के बच्चे फटे कपड़ों पर हँसते। छोटा दलजीत चुपचाप सब सहता — पर उसके भीतर एक सवाल जलता रहा: "क्या ग़रीब होना गुनाह है?"',
  objs:[O('chappal','टूटी चप्पल','🩴',18,80,.7,25,.8),O('katora','खाली कटोरा','🥣',62,74,.7,0,.85),O('mombatti2','बुझी मोमबत्ती','🕯️',84,30,.65,-10,.75),O('khilona2','पुराना खिलौना','🧸',30,40,.65,15,.8),O('copy','स्कूल की कॉपी','📒',50,56,.6,-20,.8),O('roti2','सूखी रोटी','🍞',12,22,.6,10,.8),O('jhadu','झाड़ू','🧹',74,86,.7,40),O('moza','फटा मोज़ा','🧦',44,18,.55,-30,.75)],
  decoys:['🧱','🕸️','🪨','🧱','🪵','🕸️','🧱','🪨','🪵','🍂','🧱','🕸️']},
 {id:'kachehri',ch:3,name:'कचहरी',bg:'kachehri',guide:'दलजीत',story:'कचहरी की धूल भरी फ़ाइलों में माँ के घर का सच छिपा है। सबूत ढूँढो!',item:{id:'sach-dastavez',e:'📑',name:'सच्चा दस्तावेज़'},
  card:'📖 सालों बाद… एक लालची रिश्तेदार ने वकीलों और कुछ बिके हुए अफ़सरों के साथ मिलकर अनपढ़ माँ का इकलौता घर हड़पने की चाल चली। तारीख़ पर तारीख़। कचहरी के चक्करों ने दलजीत का मन हिला दिया — पर उसने ठान लिया: "माँ का घर कोई नहीं छीनेगा।"',
  objs:[O('file','फ़ाइल','📁',20,30,.65,-15,.8),O('kalam2','कलम','🖋️',70,64,.6,30,.8),O('hathoda','हथौड़ा','🔨',52,16,.6,0,.85),O('pin','पिन','📎',84,46,.5,20,.75),O('register','रजिस्टर','🗂️',34,74,.65,0,.8),O('ghadi2','दीवार घड़ी','🕰️',12,58,.6,0,.85),O('raseed','रसीद','🧾',62,36,.55,-25,.75),O('muhar','मुहर','🔏',86,82,.55,0,.8)],
  decoys:['📄','📃','📄','🗃️','📃','📄','🗃️','📃','📄','📄','📃','🗃️']},
 {id:'kothri',ch:3,name:'किताबों की कोठरी',bg:'kothri',guide:'दलजीत',story:'अँधेरी कोठरी, जहाँ रात-रात भर पढ़ाई हुई। ज्ञान के 8 औज़ार ढूँढो।',item:{id:'gyan-chabi',e:'🧠',name:'ज्ञान की चाबी'},
  card:'📖 फिर सबसे बड़ा दुख आया — छोटा भाई इस दुनिया से चला गया। टूटे मन ने गुरु महाराज की शरण ली। उसी अँधेरे में दलजीत ने किताबें उठाईं: मन का विज्ञान (dark psychology), सिस्टम कैसे चलता है (UPSC जितनी गहराई से), और कानों में 2x पर चलती audiobooks। "अगर सिस्टम से लड़ना है, तो सिस्टम को समझना होगा।"',
  objs:[O('headphone','हेडफ़ोन','🎧',22,24,.65,-10,.85),O('torch','टॉर्च','🔦',74,70,.6,30,.8),O('chai2','चाय का कप','☕',48,82,.6,0,.85),O('phone','फ़ोन','📱',84,24,.55,15,.75),O('notes','नोट्स','🗒️',14,66,.6,-20,.8),O('aage','2x बटन','⏩',60,44,.5,0,.7),O('diya2','दीया','🪔',36,50,.6,0,.8),O('chashma2','चश्मा','👓',30,12,.55,20,.75)],
  decoys:['📚','📕','📗','📘','📙','📚','📒','📕','📗','📘','📚','📙']},
 {id:'network',ch:3,name:'छिपा नेटवर्क',bg:'network',guide:'दलजीत',story:'शहर के नीचे छिपे एक काले नेटवर्क का अड्डा। सबूत की 8 चीज़ें ढूँढो — सावधान!',item:{id:'sach-saboot',e:'📹',name:'सच का सबूत'},
  card:'📖 दलजीत ने NGO खोले, अपने media channels शुरू किए, और भेस बदलकर उस छिपे नेटवर्क में घुस गया जो ग़रीबों का हक़ खाता था। ख़तरा हर कदम पर था — धमकियाँ, पीछा, और एक रात गोलियों की आवाज़। उसके दिमाग़ में दुश्मनों की एक सूची बन चुकी थी… और ग़ुस्सा कह रहा था: "बदला लो!"',
  objs:[O('laptop','लैपटॉप','💻',20,64,.65,0,.8),O('camera','कैमरा','🎥',72,28,.6,-15,.8),O('mic','माइक','🎙️',50,14,.55,0,.85),O('antenna','एंटीना','📡',86,60,.6,20,.75),O('gupt','गुप्त फ़ाइल','📂',34,36,.55,-20,.75),O('taar','तार','🔌',58,78,.55,30,.8),O('tape','पुराना टेप','📼',12,30,.55,10,.75),O('nakshe','शहर का नक्शा','🗺️',80,86,.55,0,.8)],
  decoys:['🌑','🕶️','🧱','🌑','⬛','🕸️','🌑','⬛','🧱','🕶️','🌑','🕸️']},
 {id:'guru-dar',ch:3,name:'गुरु दा दर',bg:'gurudar',guide:'दलजीत',story:'गुरु दे दर पर मन का आख़िरी युद्ध। शांति की 8 चीज़ें ढूँढो।',item:{id:'naya-savera',e:'🌅',name:'नया सवेरा'},
  card:'📖 सबूत हाथ में था, दुश्मन सामने। ग़ुस्से ने आख़िरी बार पुकारा: "अब बदला!" — पर गुरु दे दर पर दलजीत रुक गया। उसने महसूस किया: बदला अँधेरा बढ़ाता है, इंसाफ़ रोशनी। वह मुस्कुराया — "मैं ज़िंदगी नहीं, एक कहानी जी रहा हूँ!"',
  objs:[O('diya3','दीया','🪔',22,40,.6,0,.85),O('phool2','फूल','🌸',70,70,.6,15,.8),O('kabootar3','कबूतर','🕊️',80,20,.6,-10,.8),O('mala2','लकड़ी की माला','📿',44,84,.6,20,.8),O('haath','जुड़े हाथ','🙏',56,30,.55,0,.75),O('jal2','जल','💧',12,76,.55,0,.8),O('langar3','लंगर की थाली','🍛',34,62,.6,-15,.8),O('tara3','तारा','⭐',30,14,.5,0,.75)],
  decoys:['✨','🟨','🌼','✨','🟧','🌼','✨','🟨','🌼','✨','🟧','🌼']}];
const STORY_END='🦁 काफ़िर → खालसा। दलजीत ने दुश्मनों की सूची फाड़ दी और उसकी जगह लिखी "इंसाफ़ की सूची"। सबूत अदालत तक गए, सच media में आया, माँ का घर बचा। ग़ुस्सा इंसाफ़ में बदल गया — बिना किसी को मारे, सिर्फ़ सच, कानून और हिम्मत से। बेगमपुरा खालसा राज का सपना अब हर ग़रीब के हक़ का सपना है — जहाँ कोई ग़म नहीं।';
const N=SCENES.length,CH1=5;SCENES.forEach(x=>{x.ch=x.ch||1;});const BADGE2='राज्य रक्षक',BADGE3='खालसा योद्धा',CH=[[0,5],[5,10],[10,15]],inCh=(f,c)=>{for(let i=CH[c][0];i<CH[c][1];i++)if(!f.cleared.includes(i))return false;return true;};
// पहेली: 4 टाइल घुमाओ, सबका तीर ऊपर (0) करो. शुरुआत तय है ताकि हल हमेशा हो.
const PUZ_START=[[1,2,3,1],[2,1,3,2],[3,3,1,2],[1,3,2,2],[2,2,1,3],[3,1,2,1],[1,1,3,2],[2,3,3,1],[3,2,1,1],[1,2,1,2],[2,1,1,3],[3,3,2,1],[1,2,3,3],[2,3,1,1],[3,1,1,2]];

// नई पहेलियाँ: p%4 → 0 टाइल घुमाओ, 1 गियर मिलाओ, 2 चिह्न क्रम, 3 जोड़ी मिलाओ
const PTYPES=['tiles','gears','runes','match','rings','scale','veena','beam','runes','jigsaw','runes','match','gears','beam','tiles'],ptype=p=>PTYPES[p]||'tiles';
// नई पहेलियों के हिस्से: दृश्य पूरा करने पर झोले में आते हैं, फिर ताले पर खींचकर (या छूकर) रखो
const PARTS={4:[{id:'surya-tukda',e:'☀️',name:'सूरज का टुकड़ा'},{id:'chandra-lens',e:'🌙',name:'चाँद का लेंस'}],5:[{id:'agni',e:'🔥',name:'अग्नि की शीशी'},{id:'jal',e:'💧',name:'जल की शीशी'},{id:'vayu',e:'🌬️',name:'वायु की शीशी'}],
 10:[{id:'maa-chabi',e:'🔑',name:'माँ के घर की चाबी'}],11:[{id:'asli-raseed',e:'🧾',name:'असली रजिस्ट्री'}],12:[{id:'samvidhan-pothi',e:'📘',name:'संविधान की पोथी'}],13:[{id:'password',e:'📝',name:'गुप्त पासवर्ड'}],14:[{id:'dushman-suchi',e:'📃',name:'दुश्मनों की सूची (फाड़ने के लिए)'}],
 6:[{id:'chandi-taar',e:'🪡',name:'चाँदी के तार'}],7:[{id:'sheesha',e:'🪞',name:'जादुई शीशा'}],9:[{id:'jyoti-tukde',e:'🧩',name:'ज्योति-मूर्ति के टुकड़े'}]};
const partsFor=p=>PARTS[p]||[];
const RING=['☀️','🌙','⭐','🪔','💧','🌱'],RING_START=[3,4],RING_GOAL=[0,1];
const VIALS=[{id:'agni',name:'अग्नि',e:'🔥',w:3},{id:'jal',name:'जल',e:'💧',w:2},{id:'vayu',name:'वायु',e:'🌬️',w:1}],STONE=4;
const VEENA=[2,0,4,1,3];
const BEAM={n:3,mirrors:[[0,1],[2,1],[0,2],[1,0]],start:[0,0,1,1]};
function trace(m){const map={};BEAM.mirrors.forEach(([r,c],i)=>map[r+','+c]=m[i]);let r=0,c=-1,dr=0,dc=1;const path=[];
 for(let k=0;k<20;k++){r+=dr;c+=dc;if(r===2&&c===3)return{path,hit:true};if(r<0||c<0||r>2||c>2)return{path,hit:false};path.push([r,c]);const v=map[r+','+c];
  if(v===0){[dr,dc]=[-dc,-dr];}else if(v===1){[dr,dc]=[dc,dr];}}return{path,hit:false};}
const JIG=[2,0,3,1];
const GEAR_LINKS=[[0,1],[0,1,2],[1,2]],GEAR_MOVES=[[0,2,2],[1,0,2,2],[2,2,1],[0,0,2]];
const gearStart=p=>{const g=[0,0,0];GEAR_MOVES[p%4].forEach(m=>GEAR_LINKS[m].forEach(j=>g[j]=(g[j]+1)%6));return g;};
const RUNE_SET=[{e:'☀️',n:'सूरज'},{e:'🌙',n:'चाँद'},{e:'⭐',n:'तारा'},{e:'🪔',n:'दीया'},{e:'💧',n:'पानी'},{e:'🌱',n:'बीज'}];
const RUNE_SEQ=[[0,4,5,3],[1,2,3,0],[5,4,0,2],[3,0,1,2]],runeSeq=p=>RUNE_SEQ[Math.floor(p/4)%4];
const MATCH_SET=['🗝️','🪔','👑','🌸','🦚','🐚'],MATCH_ORDER=[[0,3,1,4,2,5,1,0,5,3,4,2],[2,0,5,1,3,4,0,2,4,5,1,3]];
const matchCards=p=>MATCH_ORDER[Math.floor(p/4)%2].map(i=>MATCH_SET[i]);
const pzFresh=p=>({...({tiles:{},gears:{g:gearStart(p)},runes:{k:0},match:{m:[]},rings:{r:RING_START.slice()},scale:{v:[0,0,0]},veena:{k:0},beam:{m:BEAM.start.slice()},jigsaw:{j:[-1,-1,-1,-1]}})[ptype(p)],pl:[]});
function pzValid(p,z){const t=ptype(p),f=pzFresh(p);if(!z||typeof z!=='object')return f;
 const pl=Array.isArray(z.pl)?partsFor(p).map(x=>x.id).filter(id=>z.pl.includes(id)):[];const ok=(a,n,mx)=>Array.isArray(a)&&a.length===n&&a.every(x=>Number.isInteger(x)&&x>=-1&&x<mx);
 if(t==='rings')return ok(z.r,2,6)&&z.r.every(x=>x>=0)?{r:z.r.slice(),pl}:{...f,pl};if(t==='scale')return ok(z.v,3,2)&&z.v.every(x=>x>=0)?{v:z.v.slice(),pl}:{...f,pl};
 if(t==='veena')return Number.isInteger(z.k)&&z.k>=0&&z.k<5?{k:z.k,pl}:{...f,pl};if(t==='beam')return ok(z.m,4,2)&&z.m.every(x=>x>=0)?{m:z.m.slice(),pl}:{...f,pl};
 if(t==='jigsaw')return ok(z.j,4,4)?{j:z.j.slice(),pl}:{...f,pl};
 if(t==='gears')return Array.isArray(z.g)&&z.g.length===3&&z.g.every(x=>Number.isInteger(x)&&x>=0&&x<6)?{g:z.g.slice(),pl}:{...f,pl};
 if(t==='runes')return Number.isInteger(z.k)&&z.k>=0&&z.k<4?{k:z.k,pl}:{...f,pl};
 if(t==='match')return Array.isArray(z.m)?{m:z.m.filter((x,i,a)=>Number.isInteger(x)&&x>=0&&x<12&&a.indexOf(x)===i),pl}:{...f,pl};return {...f,pl};}
const canPz=(s,p)=>p>=0&&p<N&&s.cleared.includes(p)&&!s.puzzles.includes(p);
const ready=(s,p)=>partsFor(p).every(x=>s.pz[p].pl.includes(x.id));
// 🎒 झोला (inventory): item definitions + 12 खाने, stack गिनती. Unity वाले design का web रूप.
const CAP=12,KAN='roshni-kan';
const ITEMS=(()=>{const d={};SCENES.forEach((sc,i)=>{d[sc.item.id]={itemId:sc.item.id,displayName:sc.item.name,icon:sc.item.e,stackable:false,maxStack:1,usableTags:['door:'+i]};
 partsFor(i).forEach(x=>{d[x.id]={itemId:x.id,displayName:x.name,icon:x.e,stackable:false,maxStack:1,usableTags:['lock:'+i]};});});
 d[KAN]={itemId:KAN,displayName:'रोशनी के कण',icon:'✨',stackable:true,maxStack:99,usableTags:['hint']};return d;})();
const bagValid=b=>Array.isArray(b)?b.filter(x=>x&&ITEMS[x.id]&&Number.isInteger(x.n)&&x.n>0).slice(0,CAP).map(x=>({id:x.id,n:Math.min(x.n,ITEMS[x.id].maxStack)})):[];
const count=(b,id)=>b.filter(x=>x.id===id).reduce((a,x)=>a+x.n,0);
const hasItem=(b,id,n)=>count(b,id)>=(n||1);
function addItem(b,id,n){n=n||1;const d=ITEMS[id];b=b.map(x=>({...x}));if(!d)return{bag:b,ok:false,added:0};let left=n;
 if(d.stackable)for(const x of b)if(x.id===id&&x.n<d.maxStack){const k=Math.min(left,d.maxStack-x.n);x.n+=k;left-=k;if(!left)break;}
 while(left>0&&b.length<CAP){const k=Math.min(left,d.maxStack);b.push({id,n:k});left-=k;}
 return{bag:b,ok:left===0,added:n-left,full:left>0};}
function removeItem(b,id,n){n=n||1;if(!hasItem(b,id,n))return{bag:b,ok:false};b=b.map(x=>({...x}));let left=n;
 for(let i=b.length-1;i>=0&&left;i--)if(b[i].id===id){const k=Math.min(left,b[i].n);b[i].n-=k;left-=k;}return{bag:b.filter(x=>x.n>0),ok:true};}
function useItem(b,id,tag){const d=ITEMS[id];if(!d||!hasItem(b,id))return{bag:b,ok:false,reason:'none'};if(!d.usableTags.includes(tag))return{bag:b,ok:false,reason:'tag'};return{...removeItem(b,id,1),reason:'ok'};}
// पुराने save से झोला बनाओ: पूरे दृश्यों की चीज़ें, जो अभी इस्तेमाल नहीं हुईं
function bagFromState(f){let b=[];f.cleared.forEach(i=>{const sc=SCENES[i];if(!f.puzzles.includes(i))b=addItem(b,sc.item.id).bag;partsFor(i).forEach(x=>{if(!f.puzzles.includes(i)&&!f.pz[i].pl.includes(x.id))b=addItem(b,x.id).bag;});});
 const k=f.found.reduce((a,x)=>a+x.length,0);if(k)b=addItem(b,KAN,Math.min(k,99)).bag;return b;}
function useKan(s,n){s=validate(s);const r=removeItem(s.bag,KAN,n||3);return{state:r.ok?{...s,bag:r.bag}:s,ok:r.ok};}
function pzSet(s,p,z,solved){z={...z,pl:s.pz[p].pl};const pz=s.pz.slice();pz[p]=z;let bag=s.bag;if(solved){const u=useItem(bag,SCENES[p].item.id,'door:'+p);if(u.ok)bag=u.bag;}return{state:{...s,pz,bag,puzzles:solved?[...s.puzzles,p]:s.puzzles},solved};}
function place(s,p,id){s=validate(s);if(!canPz(s,p)||!partsFor(p).some(x=>x.id===id)||s.pz[p].pl.includes(id))return{state:s,ok:false};const u=useItem(s.bag,id,'lock:'+p);if(!u.ok)return{state:s,ok:false,reason:u.reason};s={...s,bag:u.bag};
 const pz=s.pz.slice();pz[p]={...pz[p],pl:[...pz[p].pl,id]};return{state:{...s,pz},ok:true,ready:ready({...s,pz},p)};}
const go=(s,p,t)=>canPz(s,p)&&ptype(p)===t&&ready(s,p);
function ring(s,p,i){s=validate(s);if(!go(s,p,'rings')||!(i===0||i===1))return{state:s,solved:false};const r=s.pz[p].r.slice();r[i]=(r[i]+1)%6;return pzSet(s,p,{r},r[0]===RING_GOAL[0]&&r[1]===RING_GOAL[1]);}
const scaleSum=v=>v.reduce((a,x,i)=>a+(x?VIALS[i].w:0),0);
function vial(s,p,i){s=validate(s);if(!go(s,p,'scale')||!VIALS[i])return{state:s,solved:false};const v=s.pz[p].v.slice();v[i]=v[i]?0:1;return pzSet(s,p,{v},scaleSum(v)===STONE);}
function pluck(s,p,i){s=validate(s);if(!go(s,p,'veena'))return{state:s,solved:false};const k=s.pz[p].k;if(VEENA[k]!==i){const r=pzSet(s,p,{k:0},false);r.wrong=true;return r;}
 return k+1===VEENA.length?pzSet(s,p,{k:0},true):pzSet(s,p,{k:k+1},false);}
function mirror(s,p,i){s=validate(s);if(!go(s,p,'beam')||!(i>=0&&i<4))return{state:s,solved:false};const m=s.pz[p].m.slice();m[i]=1-m[i];return pzSet(s,p,{m},trace(m).hit);}
function jig(s,p,slot,piece){s=validate(s);if(!go(s,p,'jigsaw')||!(slot>=0&&slot<4)||!(piece>=0&&piece<4))return{state:s,solved:false,ok:false};const j=s.pz[p].j;
 if(j[slot]>=0||j.includes(piece)||piece!==slot)return{state:s,solved:false,ok:false};const nj=j.slice();nj[slot]=piece;const r=pzSet(s,p,{j:nj},nj.every((x,i)=>x===i));r.ok=true;return r;}
function gear(s,p,i){s=validate(s);if(!canPz(s,p)||ptype(p)!=='gears'||!ready(s,p)||!GEAR_LINKS[i])return{state:s,solved:false};
 const g=s.pz[p].g.slice();GEAR_LINKS[i].forEach(j=>g[j]=(g[j]+1)%6);return pzSet(s,p,{g},g.every(x=>x===0));}
function rune(s,p,idx){s=validate(s);if(!canPz(s,p)||ptype(p)!=='runes'||!ready(s,p))return{state:s,solved:false};
 const seq=runeSeq(p),k=s.pz[p].k;if(seq[k]!==idx){const r=pzSet(s,p,{k:0},false);r.wrong=true;return r;}
 return k+1===seq.length?pzSet(s,p,{k:0},true):pzSet(s,p,{k:k+1},false);}
function match(s,p,a,b){s=validate(s);if(!canPz(s,p)||ptype(p)!=='match'||a===b)return{state:s,solved:false,ok:false};
 const c=matchCards(p),m=s.pz[p].m;if(!ready(s,p)||!(a>=0&&a<12&&b>=0&&b<12)||m.includes(a)||m.includes(b)||c[a]!==c[b])return{state:s,solved:false,ok:false};
 const nm=[...m,a,b];const r=pzSet(s,p,{m:nm},nm.length===12);r.ok=true;return r;}
const fresh=()=>({v:1,scene:0,found:SCENES.map(()=>[]),cleared:[],puzzles:[],inv:[],tiles:PUZ_START.map(t=>t.slice()),badge:false,badge2:false,badge3:false,cards:[],bag:[],pz:SCENES.map((x,p)=>pzFresh(p))});
function validate(s){if(!s||s.v!==1||!Array.isArray(s.found))return fresh();const f=fresh();
 f.found=SCENES.map((sc,i)=>Array.isArray(s.found[i])?s.found[i].filter((id,j,a)=>sc.objs.some(o=>o.id===id)&&a.indexOf(id)===j):[]);
 const idx=a=>Array.isArray(a)?a.filter((x,j,b)=>Number.isInteger(x)&&x>=0&&x<N&&b.indexOf(x)===j):[];
 f.cleared=idx(s.cleared).filter(i=>f.found[i].length===SCENES[i].objs.length);f.puzzles=idx(s.puzzles).filter(i=>i<N&&f.cleared.includes(i));
 f.inv=SCENES.flatMap((sc,i)=>f.cleared.includes(i)?[sc.item.id,...partsFor(i).map(x=>x.id)]:[]);
 if(Array.isArray(s.tiles)&&s.tiles.length>=N-1)f.tiles=PUZ_START.map((d,i)=>{const t=s.tiles[i];return Array.isArray(t)&&t.length===4&&t.every(x=>Number.isInteger(x)&&x>=0&&x<4)?t.slice():d.slice();});if(0)f.tiles=s.tiles.map((t,i)=>Array.isArray(t)&&t.length===4&&t.every(x=>Number.isInteger(x)&&x>=0&&x<4)?t.slice():PUZ_START[i].slice());
 f.pz=SCENES.map((x,p)=>pzValid(p,Array.isArray(s.pz)?s.pz[p]:null));
  f.bag=Array.isArray(s.bag)?bagValid(s.bag):bagFromState(f);
 f.scene=Number.isInteger(s.scene)&&s.scene>=0&&s.scene<N&&unlocked(f,s.scene)?s.scene:0;f.badge=[0,1,2,3,4].every(i=>f.cleared.includes(i));f.badge2=inCh(f,1)&&inCh(f,0);f.badge3=inCh(f,2);f.cards=Array.isArray(s.cards)?s.cards.filter((x,i,a)=>Number.isInteger(x)&&SCENES[x]&&SCENES[x].card&&a.indexOf(x)===i):[];return f;}
// दृश्य i खुला है अगर i=0, या पिछला साफ़ + पहेली हल (पिछली चीज़ inventory में)
function unlocked(s,i){return i===0||(s.cleared.includes(i-1)&&s.puzzles.includes(i-1));}
function tap(s,i,id){s=validate(s);const sc=SCENES[i];if(!sc||!unlocked(s,i))return{state:s,ok:false};
 if(!sc.objs.some(o=>o.id===id))return{state:s,ok:false,wrong:true};if(s.found[i].includes(id))return{state:s,ok:false,again:true};
 const found=s.found.map((a,j)=>j===i?[...a,id]:a.slice()),st={...s,found};const ka=addItem(s.bag,KAN);st.bag=ka.bag;let full=false;let clearedNew=false,badgeNew=false,badge2New=false,badge3New=false;
 if(found[i].length===sc.objs.length&&!s.cleared.includes(i)){clearedNew=true;st.cleared=[...s.cleared,i];st.inv=[...s.inv,sc.item.id,...partsFor(i).map(x=>x.id)];for(const id2 of[sc.item.id,...partsFor(i).map(x=>x.id)]){const a=addItem(st.bag,id2);st.bag=a.bag;if(a.full)full=true;}if(!s.badge&&[0,1,2,3,4].every(j=>st.cleared.includes(j))){badgeNew=true;st.badge=true;}if(!s.badge2&&inCh(st,0)&&inCh(st,1)){st.badge2=true;badge2New=true;}if(!s.badge3&&inCh(st,2)){st.badge3=true;badge3New=true;}}
 return{state:st,ok:true,full,clearedNew,badgeNew,badge2New,badge3New,item:clearedNew?sc.item:null};}
function hint(s,i){s=validate(s);const sc=SCENES[i];return sc?sc.objs.find(o=>!s.found[i].includes(o.id))||null:null;}
function canHint(last,now){return !last||now-last>=HINT_MS;}
function rotate(s,p,t){s=validate(s);if(ptype(p)!=='tiles'||!(p>=0&&p<N)||!(t>=0&&t<4)||!s.cleared.includes(p)||s.puzzles.includes(p))return{state:s,solved:false};
 const tiles=s.tiles.map(a=>a.slice());tiles[p][t]=(tiles[p][t]+1)%4;const solved=tiles[p].every(x=>x===0);
 let bag=s.bag;if(solved){const u=useItem(bag,SCENES[p].item.id,'door:'+p);if(u.ok)bag=u.bag;}return{state:{...s,tiles,bag,puzzles:solved?[...s.puzzles,p]:s.puzzles},solved};}
const progress=s=>{s=validate(s);const tot=SCENES.reduce((a,sc)=>a+sc.objs.length,0),got=s.found.reduce((a,f)=>a+f.length,0);return{got,tot,pct:Math.round(got*100/tot),cleared:s.cleared.length};};
return{requiredItemIds:p=>partsFor(p).map(x=>x.id),CAP,KAN,ITEMS,bagValid,addItem,removeItem,hasItem,useItem,bagFromState,useKan,PARTS,partsFor,ready,place,RING,RING_GOAL,VIALS,STONE,scaleSum,VEENA,BEAM,trace,JIG,ring,vial,pluck,mirror,jig,ending:s=>validate(s).puzzles.includes(9),ending3:s=>validate(s).puzzles.includes(14),STORY_END,BADGE3,CH,seeCard:(s,i)=>{s=validate(s);return SCENES[i]&&SCENES[i].card&&!s.cards.includes(i)?{...s,cards:[...s.cards,i]}:s;},PTYPES,ptype,GEAR_LINKS,gearStart,RUNE_SET,runeSeq,matchCards,gear,rune,match,KEY,BADGE,BADGE2,CH1,HINT_MS,WRONG_MS,SCENES,PUZ_START,fresh,validate,unlocked,tap,hint,canHint,rotate,progress};});
