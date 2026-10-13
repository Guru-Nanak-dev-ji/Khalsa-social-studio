'use strict';
(()=>{
const C=window.AudiobookCore,$=id=>document.getElementById(id),KEY='kdn-audiobook-v1',ss=window.speechSynthesis;
let st={text:'',ch:0,pos:0,rate:1,voice:'',lang:'hi-IN'};try{Object.assign(st,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){}
let chapters=[],parts=[],playing=false;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st));}catch(e){}};
const status=t=>$('ab-status').textContent=t;
function load(){chapters=C.splitChapters(st.text);if(st.ch>=chapters.length)st.ch=0;$('ab-chapters').replaceChildren(...chapters.map((c,i)=>{const b=document.createElement('button');b.type='button';b.className='chap'+(i===st.ch?' on':'');b.textContent=c.title;b.onclick=()=>{stop();st.ch=i;st.pos=0;save();load();};return b;}));show();}
function show(){const c=chapters[st.ch];parts=c?C.chunks(c.body):[];$('ab-title').textContent=c?c.title:'—';$('ab-reader').replaceChildren(...parts.map((p,i)=>{const s=document.createElement('span');s.textContent=p+' ';if(i===st.pos)s.className='now';return s;}));const tot=chapters.reduce((a,c)=>a+C.chunks(c.body).length,0)||1,done=chapters.slice(0,st.ch).reduce((a,c)=>a+C.chunks(c.body).length,0)+st.pos;$('ab-progress').value=Math.round(done/tot*100);$('ab-pct').textContent=Math.round(done/tot*100)+'%';}
function voices(){if(!ss)return;const all=ss.getVoices(),mine=C.pickVoices(all),list=mine.length?mine:all;$('ab-voice').replaceChildren(new Option('अपने आप ('+st.lang+')',''),...list.map(v=>new Option(v.name+' · '+v.lang,v.voiceURI)));$('ab-voice').value=st.voice;$('ab-vnote').hidden=all.length===0||C.pickVoices(all).some(v=>v.lang.toLowerCase().startsWith('pa'));}
function speak(){if(!playing)return;if(st.pos>=parts.length){if(st.ch<chapters.length-1){st.ch++;st.pos=0;save();load();}else{playing=false;st.pos=0;save();status('किताब पूरी हुई ✅ · Finished');return;}}
  const u=new SpeechSynthesisUtterance(parts[st.pos]);u.rate=st.rate;u.lang=st.lang;const v=ss.getVoices().find(x=>x.voiceURI===st.voice);if(v){u.voice=v;u.lang=v.lang;}
  u.onend=()=>{if(!playing)return;st.pos++;save();show();speak();};u.onerror=e=>{if(e.error!=='interrupted'&&e.error!=='canceled'){playing=false;status('ऑडियो समस्या: '+e.error);}};ss.speak(u);show();}
function play(){if(!ss){status('इस browser में आवाज़ (Text-to-Speech) नहीं है।');return;}if(!chapters.length){status('पहले text डालें · Add text first');return;}if(ss.paused&&ss.speaking){ss.resume();playing=true;status('▶ जारी है');return;}ss.cancel();playing=true;status('▶ सुनाया जा रहा है…');speak();}
function stop(){playing=false;if(ss)ss.cancel();}
$('ab-load').onclick=()=>{st.text=$('ab-text').value;st.ch=0;st.pos=0;save();load();status(chapters.length+' अध्याय तैयार · chapters ready');};
$('ab-file').onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{$('ab-text').value=t;$('ab-load').click();});};
$('ab-play').onclick=play;$('ab-pause').onclick=()=>{if(ss&&ss.speaking){ss.pause();playing=false;status('⏸ विराम · Paused');}};
$('ab-stop').onclick=()=>{stop();st.pos=0;save();show();status('⏹ बंद · Stopped');};
$('ab-prev').onclick=()=>{stop();st.pos=Math.max(0,st.pos-1);save();show();};$('ab-next').onclick=()=>{stop();st.pos=Math.min(parts.length-1,st.pos+1);save();show();};
$('ab-rate').value=st.rate;$('ab-rv').textContent=(+st.rate).toFixed(1)+'×';$('ab-rate').oninput=e=>{st.rate=+e.target.value;$('ab-rv').textContent=st.rate.toFixed(1)+'×';save();};
$('ab-lang').value=st.lang;$('ab-lang').onchange=e=>{st.lang=e.target.value;st.voice='';save();voices();};$('ab-voice').onchange=e=>{st.voice=e.target.value;save();};
$('ab-clear').onclick=()=>{if(!confirm('सारा text और progress हटाएँ?'))return;stop();st={text:'',ch:0,pos:0,rate:st.rate,voice:st.voice,lang:st.lang};save();$('ab-text').value='';load();};
$('ab-text').value=st.text;load();if(ss){voices();ss.onvoiceschanged=voices;}else status('इस browser में Text-to-Speech उपलब्ध नहीं है।');
document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing&&ss){ss.pause();playing=false;status('⏸ विराम');}});
const T=[['Piper TTS','https://github.com/OHF-Voice/piper1-gpl','तेज़ offline आवाज़ — हिंदी सहित कई भाषाएँ।'],['Coqui XTTS-v2','https://huggingface.co/coqui/XTTS-v2','आवाज़ clone करके audiobook — हिंदी समर्थन (non-commercial license)।'],['Kokoro TTS','https://huggingface.co/hexgrad/Kokoro-82M','छोटा, तेज़ open TTS model (Apache-2.0), हिंदी आवाज़ें।'],['Indic Parler-TTS','https://huggingface.co/ai4bharat/indic-parler-tts','AI4Bharat — हिंदी, ਪੰਜਾਬੀ समेत भारतीय भाषाएँ।'],['eSpeak NG','https://github.com/espeak-ng/espeak-ng','हल्का offline TTS, ਪੰਜਾਬੀ/हिंदी समर्थन।'],['LibriVox','https://librivox.org','Public-domain audiobooks मुफ़्त — volunteers की आवाज़।'],['Balabolka','https://www.cross-plus-a.com/balabolka.htm','Windows पर text से MP3 audiobook (freeware)।'],['Audiobookshelf','https://www.audiobookshelf.org','अपना audiobook server — open source।']];
$('ab-tools').innerHTML=T.map(([n,u,d])=>`<a class="tool" href="${u}" target="_blank" rel="noopener noreferrer"><b>${n}</b><p>${d}</p></a>`).join('');
})();
