(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNDoors=m;})(this,function(){'use strict';
const TREE={id:'root',icon:'🏰',title:'द्वार महल · ਦਰਵਾਜ਼ਾ ਮਹਿਲ · Door Palace',doors:[
 {id:'media',icon:'🎬',title:'Media',sub:'मीडिया · ਮੀਡੀਆ',doors:[
  {icon:'📺',title:'KNN News Studio',sub:'न्यूज़ स्टूडियो · ਨਿਊਜ਼',href:'./newsroom.html'},
  {icon:'📡',title:'न्यूज़ चैनल',sub:'अपना News चैनल बनाइए',href:'./news-channels.html'},
  {icon:'🎞️',title:'Reel Studio',sub:'Instagram Reels',href:'./reels.html'},
  {icon:'😀',title:'मेरा अवतार',sub:'अवतार · स्टिकर · GIF',href:'./avatar.html'},
  {icon:'✍️',title:'Creator',sub:'ख़बर · ਪੋਸਟ · Post',href:'./creator.html'},
  {icon:'🖼️',title:'Poster',sub:'फोटो पोस्टर',href:'./poster.html'},
  {icon:'📖',title:'Book Bar Audiobook',sub:'ਆਡੀਓਬੁੱਕ',href:'./audiobook.html'}]},
 {id:'knn',icon:'📺',title:'KNN News',sub:'न्यूज़ चैनल · स्टूडियो',doors:[
  {icon:'📡',title:'न्यूज़ चैनल',sub:'सभी चैनल · नया बनाइए',href:'./news-channels.html'},
  {icon:'🎙',title:'News Studio',sub:'Live · Guest · Record',href:'./newsroom.html'}]},
 {id:'ai',icon:'🤖',title:'AI',sub:'AI साथी · ਸਾਥੀ',doors:[
  {icon:'🤖',title:'AI साथी',sub:'AI Saathi',href:'./ai.html'},
  {icon:'🚪',title:'Free AI Tools',sub:'मुफ़्त AI द्वार',href:'./ai-tools.html'},
  {icon:'📜',title:'AI का खुला संविधान',sub:'AI के 13 नियम · सुनें',href:'./ai-samvidhan.html'},
  {icon:'🎙️',title:'बोलने वाले AI साथी',sub:'तर्क सिंह · भावना कौर',href:'./saathi.html'},
  {icon:'🎭',title:'मेरे भाव',sub:'अनेक होकर भी एक',href:'./bhav.html'},
  {icon:'🎓',title:'स्टडी स्टूडियो',sub:'ऑडियो-वीडियो पाठ · quiz',href:'./study.html'}]},
 {id:'social',icon:'📣',title:'Social',sub:'सोशल · ਸੋਸ਼ਲ',doors:[
  {icon:'✈️',title:'Telegram Bot',sub:'@Khalsaworld_bot',href:'https://t.me/Khalsaworld_bot'},
  {icon:'▶️',title:'YouTube',sub:'/yt · /channels',href:'https://t.me/Khalsaworld_bot?start=yt'},
  {icon:'🟢',title:'WhatsApp',sub:'Creator से भेजो',href:'./creator.html#whatsapp'},
  {icon:'🤝',title:'संगत दरबार',sub:'Community',href:'./community.html'}]},
 {id:'games',icon:'🎮',title:'Games & Quiz',sub:'खेल · ਖੇਡਾਂ · जल्द',doors:[
  {icon:'☯',title:'Game of Takhats',sub:'पाँच प्रण द्वार',href:'./maze.html'},
  {icon:'🍃',title:'पत्ता उड़ाओ',sub:'उड़ान game · koins',href:'./patta.html'},
  {icon:'📺',title:'Golden TV',sub:'हर 3 second नई कहानी',href:'./goldtv.html'},
  {icon:'🚪',title:'Scroll से खुलता द्वार',sub:'scroll करो · +5 koins',href:'./scroll-dwar.html'},
  {icon:'♞',title:'शतरंज Quiz',sub:'जल्द आ रहा · Soon',soon:true},
  {icon:'🃏',title:'ताश पत्ते Quiz',sub:'जल्द आ रहा · Soon',soon:true}]},
 {id:'gyan',icon:'🏛',title:'Gyan',sub:'ज्ञान मंडल · ਗਿਆਨ',doors:[
  {icon:'🏛',title:'ज्ञान मंडल',sub:'ਗਿਆਨ ਮੰਡਲ',href:'./gyan.html'},
  {icon:'🏠',title:'मुख्य द्वार',sub:'Home',href:'./index.html'}]},
 {id:'tools',icon:'⚙️',title:'Control Room',sub:'काम · Build · Install',href:'#control'}]};
function find(path){let node=TREE;const trail=[TREE];for(const id of path){const n=(node.doors||[]).find(d=>d.id===id);if(!n||!n.doors)break;node=n;trail.push(n);}return{node,trail};}
function parseHash(h){const m=/door=([a-z0-9/_-]+)/.exec(h||'');return m?m[1].split('/').filter(Boolean):[];}
function all(n=TREE,out=[]){(n.doors||[]).forEach(d=>{if(d.href)out.push(d);all(d,out)});return out;}
return{TREE,find,parseHash,all};});
