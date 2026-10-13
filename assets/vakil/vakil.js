(()=>{'use strict';const V=window.KDNVakil,$=id=>document.getElementById(id);
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;};
const load=()=>{try{return V.validate(JSON.parse(localStorage.getItem(V.KEY)||'null'));}catch{return V.fresh();}};
let st=load(),all=[],cat='',type='help',msg='';
function chips(){const C=$('cats');C.textContent='';[{id:'',icon:'✨',name:'सभी'},...V.CATS].forEach(c=>{const b=el('button','chip'+(c.id===cat?' on':''),c.icon+' '+c.name);b.type='button';b.setAttribute('aria-pressed',String(c.id===cat));b.onclick=()=>{cat=c.id;chips();list();};C.append(b);});}
function list(){const L=$('list');L.textContent='';const r=V.filter(all,cat,$('city').value);
 if(!all.length){const e=el('div','empty');e.append(el('div','big','🌱 वकील जल्द जुड़ेंगे'),el('p',null,'अभी सूची में कोई वकील नहीं है। हम सिर्फ़ असली, सहमति देने वाले और जाँचे हुए वकील ही जोड़ेंगे। तब तक नीचे के मुफ़्त सरकारी नंबरों पर बात कीजिए, या "मुझे कानूनी मदद चाहिए" भरिए।'));L.append(e);return;}
 if(!r.length){L.append(el('p','empty','इस विषय/शहर में अभी कोई वकील नहीं। दूसरा शहर चुनिए या मदद का फ़ॉर्म भरिए।'));return;}
 r.forEach(l=>{const c=el('div','law');c.append(el('h3',null,'⚖️ '+l.name),el('p',null,'🏙️ '+l.city+(l.country?' · '+l.country:'')),el('p',null,l.cats.map(V.catName).join(' · ')));if(l.langs)c.append(el('p',null,'🗣️ '+l.langs));
  if(l.phone){const a=el('a','btn','📞 '+l.phone);a.href='tel:'+l.phone.replace(/[^\d+]/g,'');c.append(a);}if(l.email){const a=el('a','btn ghost','✉️ Email');a.href='mailto:'+l.email;c.append(a);}L.append(c);});}
function free(){const F=$('free');V.FREE.forEach(f=>{const c=el('div','fh');c.append(el('h3',null,f.flag+' '+f.name),el('p',null,f.info));
 if(f.tel){const a=el('a','btn','📞 '+f.tel);a.href='tel:'+f.tel.replace(/-/g,'');c.append(a);}const s=el('a','src',f.tel?'स्रोत: '+new URL(f.src).host:'🌐 '+new URL(f.src).host+' खोलें');s.href=f.src;s.target='_blank';s.rel='noopener';c.append(s);F.append(c);});}
function openForm(t){type=t;const j=t==='join';$('form').hidden=false;$('share').hidden=true;$('f-err').textContent='';$('f-title').textContent=V.FORMS[t].title;$('bar-row').hidden=!j;
 $('f-note-l').textContent=j?'अनुभव / कौन से मामले लेते हैं':'मामला छोटे में (निजी बातें न लिखें)';
 $('f-agree-t').textContent=j?'मैं असली वकील हूँ और सहमत हूँ कि जाँच के बाद मेरा नाम, शहर और संपर्क इस सूची में दिखे।':'मैं सहमत हूँ कि KDN इस संदेश के लिए मुझसे संपर्क करे।';$('f-name').focus();}
$('open-help').onclick=()=>openForm('help');$('open-join').onclick=()=>openForm('join');
$('form').onsubmit=e=>{e.preventDefault();const r=V.validForm(type,{name:$('f-name').value,city:$('f-city').value,contact:$('f-contact').value,cat:$('f-cat').value,bar:$('f-bar').value,note:$('f-note').value,agree:$('f-agree').checked});
 if(!r.ok){$('f-err').textContent='⚠️ '+r.why;return;}$('f-err').textContent='';msg=V.message(r.item);$('msg').textContent=msg;$('wa').href=V.waLink(msg);$('mail').href=V.mailLink(msg);$('share').hidden=false;
 st=V.record(st,r.item,Date.now());try{localStorage.setItem(V.KEY,JSON.stringify(st));}catch{}$('share').scrollIntoView({behavior:'smooth',block:'center'});};
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(msg);$('copy').textContent='✅ Copy हो गया';}catch{$('copy').textContent='लंबा दबाकर copy करें';}};
const fc=$('f-cat');fc.append(new Option('— चुनिए —',''));V.CATS.forEach(c=>fc.append(new Option(c.icon+' '+c.name,c.id)));
$('city').onchange=list;chips();free();list();
fetch('./data/vakil.json',{cache:'no-cache'}).then(r=>r.json()).then(d=>{all=V.lawyers(d);V.cities(all).forEach(c=>$('city').append(new Option(c,c)));list();}).catch(()=>list());
window.__vakil={all:()=>all,state:()=>st};})();
