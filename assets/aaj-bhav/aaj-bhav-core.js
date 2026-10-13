(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNAajBhav=m;})(this,function(){'use strict';
// 🌸 मेरा आज का भाव — रोज़ का भाव, जाँची हुई पंक्ति (स्रोत सहित), 7 दिन की डायरी. सिर्फ़ इसी phone में.
const KEY='kdn-aaj-bhav-v1',BADGE='सात दिन का भाव-साधक';
const MOODS=[
 {id:'anand',icon:'😊',name:'आनंद',tags:['khushi'],img:'./assets/bhav/anand.webp',advice:'इस खुशी को बाँटिए। आज किसी एक इंसान को मुस्कान दीजिए और शुक्राना कीजिए।'},
 {id:'jigyasa',icon:'🤔',name:'जिज्ञासा',tags:['padhai'],img:'./assets/bhav/jigyasa.webp',advice:'आज कुछ नया सीखिए। एक सवाल लिखिए और उसका जवाब धीरे-धीरे ढूँढिए।'},
 {id:'bhay',icon:'😨',name:'भय',tags:['darr'],img:'./assets/bhav/bhay.webp',advice:'तीन गहरी साँस लीजिए। डर को लिख दीजिए, फिर एक छोटा कदम उठाइए।'},
 {id:'krodh',icon:'😠',name:'क्रोध',tags:['gussa'],img:'./assets/bhav/krodh.webp',advice:'अभी जवाब मत दीजिए। पानी पीजिए, थोड़ा टहलिए, फिर नरमी से बात कीजिए।'},
 {id:'udasi',icon:'😢',name:'उदासी',tags:['udaas','akela'],img:'',advice:'आप अकेले नहीं हैं। किसी अपने से बात कीजिए और थोड़ी देर बाहर धूप में बैठिए।'},
 {id:'shanti',icon:'🕊️',name:'शांति',tags:['hankar','kirat'],img:'',advice:'इस शांति को सँभालिए। कुछ पल चुप बैठकर नाम सिमरन कीजिए और नम्र रहिए।'}];
const dayKey=d=>{d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const fresh=()=>({v:1,days:{}});
function validate(s){const o=fresh();if(!s||typeof s!=='object'||!s.days||typeof s.days!=='object')return o;
 for(const[k,v]of Object.entries(s.days))if(/^\d{4}-\d\d-\d\d$/.test(k)&&MOODS.some(m=>m.id===v))o.days[k]=v;return o;}
function pick(s,mood,day){s=validate(s);if(!MOODS.some(m=>m.id===mood))return{state:s,firstToday:false};
 const first=!(day in s.days);return{state:{...s,days:{...s.days,[day]:mood}},firstToday:first};}
const diary=(s,n)=>Object.entries(validate(s).days).sort((a,b)=>a[0]<b[0]?1:-1).slice(0,n||7).map(([day,id])=>({day,mood:MOODS.find(m=>m.id===id)}));
const count=s=>Object.keys(validate(s).days).length;
const badge=s=>count(s)>=7;
// केवल स्रोत वाली पंक्तियाँ
function quotes(bani,granth){const out=[];
 for(const q of(bani&&bani.quotes)||[])if(q.source&&q.line)out.push({line:q.line,meaning:q.meaning||'',source:q.source,moods:q.moods||[]});
 for(const q of(granth&&granth.quotes)||[])if(q.source&&(q.short||q.original))out.push({line:q.short||q.original,meaning:q.meaning||'',source:(q.book?q.book+', ':'')+q.source,moods:q.moods||[]});return out;}
function quoteFor(list,mood,day){const m=MOODS.find(x=>x.id===mood);if(!m)return null;const c=list.filter(q=>q.moods.some(t=>m.tags.includes(t)));if(!c.length)return null;
 let h=0;for(const ch of String(day))h=(h*31+ch.charCodeAt(0))>>>0;return c[h%c.length];}
return{KEY,BADGE,MOODS,dayKey,fresh,validate,pick,diary,count,badge,quotes,quoteFor};});
