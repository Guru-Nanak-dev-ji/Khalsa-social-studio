(function(){'use strict';var C=window.KDNDasvandh;function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function btn(t,f,c){var b=el('button','gu-b'+(c?' '+c:''),t);b.type='button';b.addEventListener('click',f);return b}
function inp(type,ph,a){var i=el('input','dv-in');i.type=type;if(ph)i.placeholder=ph;if(a)for(var k in a)i.setAttribute(k,a[k]);return i}
function lab(t,c){var l=el('label','dv-l');l.appendChild(el('span',null,t));l.appendChild(c);return l}
function box(h){var s=el('section','gu-box');s.appendChild(el('h2',null,h));return s}
function load(){try{return C.validate(JSON.parse(localStorage.getItem(C.KEY)))}catch(e){return C.fresh()}}
var st=load(),msg,today=C.dayKey(new Date()),cur=today.slice(0,7);function save(){try{localStorage.setItem(C.KEY,JSON.stringify(st))}catch(e){}}
function koins(id){var K=window.KDNKoins;if(!K)return 0;try{var s=K.validate(JSON.parse(localStorage.getItem(K.KEY)||'null')),r=K.claimSpot(s,id);localStorage.setItem(K.KEY,JSON.stringify(r.state));return r.added}catch(e){return 0}}
function toast(t){var p=el('p','dv-toast',t);msg.appendChild(p);setTimeout(function(){p.remove()},6000)}
function init(){var b=document.getElementById('dv-main');if(!b||!C)return;
 var bani=el('section','dv-bani');bani.appendChild(el('p','g',C.BANI.gurmukhi+' ॥'));bani.appendChild(el('p','h',C.BANI.line+' ॥'));bani.appendChild(el('p',null,C.BANI.meaning));bani.appendChild(el('small',null,'— '+C.BANI.source+' · '+C.BANI.raag));b.appendChild(bani);
 b.appendChild(el('p','dv-note',C.NOTE));msg=el('div');msg.setAttribute('aria-live','polite');b.appendChild(msg);
 var s1=box('🗓️ इस महीने की किरत'),mi=inp('month',null,{value:cur}),inc=inp('number','इस महीने की कमाई ₹ (चाहें तो)',{min:0,step:'1'});s1.appendChild(lab('महीना',mi));s1.appendChild(lab('कमाई ₹',inc));
 s1.appendChild(btn('💾 सहेजो',function(){st=C.setIncome(st,cur,inc.value);save();draw()}));b.appendChild(s1);
 var s2=box('🪙 दसवंध का घड़ा'),jar=el('div','dv-jar','🏺'),meters=el('div');s2.appendChild(jar);s2.appendChild(meters);b.appendChild(s2);
 var s3=box('➕ आज क्या बाँटा?'),d=inp('date',null,{value:today}),k=el('select','dv-in');C.KINDS.forEach(function(x){var o=el('option',null,x.e+' '+x.t);o.value=x.id;k.appendChild(o)});var a=inp('number','₹ या घंटे',{min:0,step:'0.5'}),n=inp('text','किस बात में (चाहें तो, जैसे लंगर सेवा)',{maxlength:60});
 [lab('तारीख़',d),lab('किस्म',k),lab('कितना',a),lab('ब्योरा',n)].forEach(function(x){s3.appendChild(x)});
 s3.appendChild(btn('🤲 जोड़ो',function(){var r=C.give(st,{d:d.value,kind:k.value,amt:a.value,note:n.value});if(!r.added){toast('⚠️ तारीख़ और कितना — ठीक भरो');return}st=r.state;save();if(r.firstToday){var g=koins('dasvandh:'+d.value);if(g)toast('💰 +'+g+' koins — आज बाँटा, वाहेगुरु मेहर करे')}if(r.badgeNew)toast('🏅 badge मिला: '+C.BADGE);a.value='';n.value='';cur=d.value.slice(0,7);mi.value=cur;draw()}));b.appendChild(s3);
 var s4=box('📋 इस महीने का हिसाब'),list=el('div');s4.appendChild(list);b.appendChild(s4);
 var s5=box('💡 पैसा नहीं? समय भी दसवंध है');var u=el('ul','dv-ideas');C.IDEAS.forEach(function(x){u.appendChild(el('li',null,x))});s5.appendChild(u);var gl=inp('number',null,{min:1,max:200,value:st.sevaGoal});s5.appendChild(lab('महीने का सेवा-घंटे लक्ष्य',gl));s5.appendChild(btn('🎯 लक्ष्य रखो',function(){var v=Number(gl.value);if(v>0){st.sevaGoal=Math.min(200,v);save();draw()}}));b.appendChild(s5);
 mi.addEventListener('change',function(){if(/^\d{4}-\d{2}$/.test(mi.value)){cur=mi.value;draw()}});
 function meter(t,p){var w=el('div','dv-meter');w.appendChild(el('p',null,t));var bar=el('div','dv-bar'),i=el('i');i.style.width=p+'%';bar.appendChild(i);w.appendChild(bar);return w}
 function draw(){var p=C.progress(st,cur);inc.value=p.income||'';meters.textContent='';jar.textContent=p.done?'🏺✨':'🏺';
  meters.appendChild(meter(p.target>0?'🪙 ₹'+p.rs+' / ₹'+p.target+' (कमाई का 10%) · '+p.pctRs+'%':'🪙 ₹'+p.rs+' बाँटे — कमाई लिखोगे तो 10% का लक्ष्य दिखेगा',p.pctRs));
  meters.appendChild(meter('🤲 '+p.hrs+' / '+p.goal+' सेवा-घंटे · '+p.pctSeva+'%',p.pctSeva));
  meters.appendChild(el('p','gu-prog',p.done?'✅ इस महीने का दसवंध पूरा — शुक्राना!':'धीरे-धीरे, जितना हो सके। '+(st.badge?'🏅 '+C.BADGE:'')));
  list.textContent='';var mm=st.months[cur];if(!mm||!mm.gave.length){list.appendChild(el('p',null,'अभी कुछ नहीं जोड़ा।'));return}
  var t=el('table','dv-t'),h=el('tr');['तारीख़','किस्म','कितना','ब्योरा',''].forEach(function(x){h.appendChild(el('th',null,x))});t.appendChild(h);
  mm.gave.forEach(function(r,i){var tr=el('tr'),kd=C.KINDS.filter(function(x){return x.id===r.kind})[0];[r.d,kd.e,r.kind==='seva'?r.amt+' घंटे':'₹'+r.amt,r.note].forEach(function(x){tr.appendChild(el('td',null,String(x)))});var td=el('td');td.appendChild(btn('🗑️',function(){if(confirm('यह पंक्ति हटाएँ?')){st=C.remove(st,cur,i);save();draw()}}));tr.appendChild(td);t.appendChild(tr)});list.appendChild(t)}
 draw()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init()})();
