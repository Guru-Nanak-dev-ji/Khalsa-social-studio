(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNKhoj=m;})(this,function(){'use strict';
// 🗺️ नक्शा खोज — guess the place from clues. Only well-documented facts (state/river/landmark/history); no disputed claims.
const KEY='kdn-khoj-v1',BADGE='नक्शा खोजी';
const p=(id,n,s,c)=>({id,n,s,c});
const INDIA=[p('agra','आगरा','उत्तर प्रदेश',['यमुना नदी के किनारे','ताजमहल यहीं है','उत्तर प्रदेश का शहर']),p('jaipur','जयपुर','राजस्थान',['"गुलाबी शहर" कहलाता है','हवा महल यहीं है','राजस्थान की राजधानी']),
 p('varanasi','वाराणसी','उत्तर प्रदेश',['गंगा के घाटों के लिए मशहूर','काशी भी कहते हैं','उत्तर प्रदेश में']),p('shimla','शिमला','हिमाचल प्रदेश',['पहाड़ों का शहर','हिमाचल प्रदेश की राजधानी','अंग्रेज़ों के समय गर्मियों की राजधानी']),
 p('srinagar','श्रीनगर','जम्मू-कश्मीर',['डल झील यहीं है','शिकारा नावें','जम्मू-कश्मीर का शहर']),p('kolkata','कोलकाता','पश्चिम बंगाल',['हावड़ा पुल','हुगली नदी के किनारे','पश्चिम बंगाल की राजधानी']),p('mumbai','मुंबई','महाराष्ट्र',['गेटवे ऑफ़ इंडिया','अरब सागर के किनारे','महाराष्ट्र की राजधानी'])];
const PUNJAB=[p('amritsar','अमृतसर','पंजाब',['श्री हरिमंदिर साहिब यहीं है','वाघा सीमा पास है','गुरु रामदास जी ने बसाया']),p('chandigarh','चंडीगढ़','केंद्र शासित प्रदेश',['रॉक गार्डन','ले कॉर्बूज़िए ने नक्शा बनाया','पंजाब और हरियाणा दोनों की राजधानी']),
 p('anandpur','श्री आनंदपुर साहिब','पंजाब',['1699 की वैसाखी','ख़ालसा की साजना यहीं हुई','तख़्त श्री केसगढ़ साहिब']),p('talwandi','तलवंडी साबो','पंजाब',['बठिंडा ज़िले में','तख़्त श्री दमदमा साहिब','गुरु गोबिंद सिंह जी यहाँ ठहरे']),
 p('goindwal','गोइंदवाल साहिब','पंजाब',['ब्यास नदी के पास','गुरु अमरदास जी का केंद्र','84 सीढ़ियों वाली बाउली']),p('fatehgarh','फ़तेहगढ़ साहिब','पंजाब',['सरहिंद के पास','छोटे साहिबज़ादों की शहादत','शहीदी जोड़ मेला'])];
const SIKH=[p('patna','पटना','बिहार',['गंगा के किनारे','गुरु गोबिंद सिंह जी का जन्म','तख़्त श्री पटना साहिब']),p('nanded','नांदेड़','महाराष्ट्र',['गोदावरी नदी के किनारे','तख़्त श्री हज़ूर साहिब','गुरु गोबिंद सिंह जी के अंतिम दिन']),
 p('delhi','दिल्ली','दिल्ली',['गुरुद्वारा शीश गंज साहिब','गुरु तेग़ बहादुर जी की शहादत (1675)','गुरुद्वारा बंगला साहिब']),p('amritsar2','अमृतसर','पंजाब',['श्री अकाल तख़्त साहिब','अमृत सरोवर','गुरु रामदास जी ने बसाया']),p('anandpur2','श्री आनंदपुर साहिब','पंजाब',['गुरु तेग़ बहादुर जी ने बसाया','होला मोहल्ला','तख़्त श्री केसगढ़ साहिब'])];
const LEVELS=[{n:'भारत · 3 विकल्प',pool:'INDIA',opts:3,rounds:4,clues:3,secs:0},{n:'पंजाब · 4 विकल्प',pool:'PUNJAB',opts:4,rounds:5,clues:3,secs:0},{n:'सिख इतिहास · कम संकेत',pool:'SIKH',opts:4,rounds:5,clues:2,secs:0},{n:'मिला-जुला · 20 सेकंड',pool:'ALL',opts:4,rounds:6,clues:2,secs:20}];
const POOLS={INDIA,PUNJAB,SIKH,ALL:[...INDIA,...PUNJAB,...SIKH.slice(0,3)]};
function round(lv,rnd){rnd=rnd||Math.random;const L=LEVELS[lv-1],pool=POOLS[L.pool].slice().sort(()=>rnd()-.5),qs=pool.slice(0,L.rounds);
 return qs.map(q=>{const others=POOLS.ALL.filter(x=>x.n!==q.n);const seen=new Set([q.n]),opts=[q.n];for(const o of others.sort(()=>rnd()-.5)){if(opts.length>=L.opts)break;if(!seen.has(o.n)){seen.add(o.n);opts.push(o.n)}}return{ans:q.n,state:q.s,clues:q.c.slice(0,L.clues),opts:opts.sort(()=>rnd()-.5)}});}
const pts=(cluesUsed)=>Math.max(1,4-cluesUsed);
const fresh=()=>({v:1,best:0,paid:false,badge:false});
function validate(s){if(!s||s.v!==1)return fresh();const best=Math.max(0,Math.min(LEVELS.length,Number(s.best)|0));return{v:1,best,paid:s.paid===true,badge:s.badge===true||best===LEVELS.length};}
function win(s,lv){s=validate(s);if(!(lv>=1&&lv<=LEVELS.length)||lv>s.best+1)return{state:s,payNow:false,badgeNew:false};const best=Math.max(s.best,lv),badge=best===LEVELS.length;return{state:{v:1,best,paid:true,badge:s.badge||badge},payNow:!s.paid,badgeNew:badge&&!s.badge};}
return{KEY,BADGE,LEVELS,POOLS,round,pts,fresh,validate,win};});
