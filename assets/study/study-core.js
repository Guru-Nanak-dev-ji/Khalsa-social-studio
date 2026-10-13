(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNStudy=m;})(this,function(){'use strict';
// 🎓 स्टडी स्टूडियो — पाठ, reel का समय-क्रम, playlist, quiz. सब phone में, कोई paid API नहीं.
const W=1080,H=1920,DUR=24;
const WORLDS=[{id:'library',src:'./assets/lworld/library-m.webp',name:'ज्ञान library'},{id:'gate',src:'./assets/lworld/gate-m.webp',name:'महल का द्वार'},{id:'sun',src:'./assets/lworld/sun-m.webp',name:'सूरज संसार'},{id:'city',src:'./assets/lworld/city-m.webp',name:'रात का शहर'}];
// संस्कृति की छोटी कहानियाँ: कहानी का पाठ AI ने लिखा (काल्पनिक, सरल); पंक्ति हमेशा granth.json की सत्यापित पंक्ति।
const CULTURES=[
 {id:'awadh',region:'अवध (उत्तर प्रदेश)',title:'वन जाते भाई को माँ की सीख',q:'vr-ayodhya-40-9',story:'अयोध्या की गलियों में आज भी दादी-नानी यह प्रसंग सुनाती हैं। लक्ष्मण जी वन जाने लगे तो माता सुमित्रा ने उन्हें रोका नहीं, बल्कि कहा: राम को पिता समझना, सीता जी को माँ, और वन को ही अयोध्या।'},
 {id:'punjab',region:'पंजाब',title:'चरखे के पास बैठी सीख',q:'kabir-120',story:'सर्दी की शाम, पंजाब के एक गाँव में चरखा चल रहा है। पोती गुस्से में कुछ कड़वा बोल देती है। दादी कबीर जी का दोहा सुनाती हैं: ऐसी बात बोलो जो दूसरों को भी ठंडक दे और खुद को भी।'},
 {id:'kashi',region:'काशी (बनारस)',title:'जूते गाँठते संत की बात',q:'ravidas-5',story:'गंगा किनारे एक बच्चा पूछता है कि भक्ति के लिए बड़ा मंदिर चाहिए क्या? उसके गुरु मुस्कराकर रविदास जी की बाणी सुनाते हैं: सच्ची पूजा मन से होती है, मन ही धूप है।'},
 {id:'magadh',region:'मगध (बिहार)',title:'बोधि वृक्ष के नीचे की शांति',q:'dhp-5',story:'बिहार के एक स्कूल में दो दोस्त झगड़ पड़ते हैं। शिक्षक उन्हें बोधि वृक्ष की छाया में बैठाकर बुद्ध का वचन पढ़वाते हैं: वैर से वैर कभी शांत नहीं होता।'},
 {id:'kuru',region:'कुरुक्षेत्र (हरियाणा)',title:'मैदान में खड़े मन की उलझन',q:'gita-2-47',story:'परीक्षा से पहले एक लड़की घबराई हुई है। उसके पिता उसे कुरुक्षेत्र की कथा याद दिलाते हैं, जहाँ श्री कृष्ण ने कहा था: मेहनत तुम्हारे हाथ में है, फल की चिंता छोड़ दो।'},
 {id:'vedic',region:'सप्त सिंधु (वैदिक भारत)',title:'साथ चलो, साथ बोलो',q:'rv-10-191-2',story:'गाँव की पंचायत में बहस बढ़ रही है। एक बुज़ुर्ग ऋग्वेद का मंत्र पढ़ते हैं, जिसका अर्थ है कि हम साथ चलें, साथ बोलें और हमारे मन एक हों। सब शांत होकर फिर से बात शुरू करते हैं।'}];
function norm(q){return{id:q.id,title:q.book||'',line:q.short||q.original||q.line||'',full:q.original||q.line||'',meaning:q.meaning||'',source:q.source||'',speaker:q.speaker||''};}
function lessons(granth,bani){const g=(granth&&granth.quotes||[]).map(norm);const b=(bani&&bani.quotes||[]).map(q=>({...norm(q),title:'गुरबाणी',speaker:(q.source||'').split(',')[0]}));return g.concat(b).filter(l=>l.line&&l.meaning);}
function own(text,title){const t=String(text||'').trim().slice(0,400);if(!t)return null;const parts=t.split(/[।\n|]/).map(s=>s.trim()).filter(Boolean);return{id:'own',title:String(title||'मेरा पाठ').slice(0,40),line:parts[0]||t,full:t,meaning:parts.slice(1).join('। ')||'',source:'आपका अपना पाठ',speaker:'आप',own:true};}
// समय-क्रम (सेकंड): शीर्षक → पंक्ति → अर्थ → स्रोत
const STEPS=[{k:'title',at:0},{k:'line',at:3},{k:'meaning',at:10},{k:'source',at:18}];
function reveal(t,k){const s=STEPS.find(x=>x.k===k);if(!s)return 0;const p=(t-s.at)/1.5;return Math.max(0,Math.min(1,p));}
function chars(text,p){const a=Array.from(String(text));return a.slice(0,Math.ceil(a.length*Math.max(0,Math.min(1,p)))).join('');}
function narration(l){return[l.title,l.full||l.line,'अर्थ: '+l.meaning,l.speaker?('कहने वाले: '+l.speaker):'',l.source?('स्रोत: '+l.source):''].filter(Boolean).join('। ');}
function wrap(text,max){const w=String(text).split(/\s+/);const out=[];let cur='';for(const x of w){if((cur+' '+x).trim().length>max&&cur){out.push(cur);cur=x;}else cur=(cur+' '+x).trim();}if(cur)out.push(cur);return out;}
function shuffle(a,rnd){a=a.slice();rnd=rnd||Math.random;for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
// 3 सवाल: "यह किसने कहा?" — सही जवाब + दो दूसरे वक्ता
function quiz(seen,pool,rnd){const uniq=[...new Map(seen.filter(l=>!l.own).map(l=>[l.id,l])).values()];const qs=shuffle(uniq,rnd).slice(0,3);const spk=[...new Set(pool.map(l=>l.speaker).filter(Boolean))];
 return qs.map(l=>{const wrong=shuffle(spk.filter(s=>s!==l.speaker),rnd).slice(0,2);return{line:l.line,answer:l.speaker,options:shuffle([l.speaker,...wrong],rnd),source:l.source};});}
function culture(c,all){const l=all.find(x=>x.id===c.q);return l?{...c,lesson:l,ai:true}:null;}
function recMime(isType){const c=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];for(const m of c)if(!isType||isType(m))return m;return '';}
return{W,H,DUR,WORLDS,CULTURES,STEPS,lessons,own,reveal,chars,narration,wrap,quiz,culture,shuffle,recMime};});
