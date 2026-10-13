'use strict';
(function(root){
// Split text into chapters on headings like "अध्याय 1", "ਅਧਿਆਇ", "Chapter 2", "# Title" or "---".
const HEAD=/^\s*(?:#{1,3}\s+.+|(?:अध्याय|ਅਧਿਆਇ|ਅਧਿਆਏ|chapter|भाग|ਭਾਗ)\s*[\d०-९੦-੯IVXLC]+.*)$/i;
function splitChapters(text){
  const lines=String(text||'').replace(/\r\n?/g,'\n').split('\n');const out=[];let cur=null;
  const push=()=>{if(cur&&cur.body.trim())out.push({title:cur.title,body:cur.body.trim()});};
  for(const l of lines){if(HEAD.test(l)||/^\s*-{3,}\s*$/.test(l)){push();cur={title:/^\s*-{3,}/.test(l)?'':l.replace(/^#+\s*/,'').trim(),body:''};}else{if(!cur)cur={title:'',body:''};cur.body+=l+'\n';}}
  push();return out.map((c,i)=>({title:c.title||('अध्याय '+(i+1)),body:c.body}));
}
// Speech engines stop on long utterances, so speak sentence-sized pieces.
function chunks(text,max=220){
  const parts=String(text).split(/(?<=[।॥.!?\n])\s*/).map(s=>s.trim()).filter(Boolean);const out=[];
  for(let p of parts){while(p.length>max){let cut=p.lastIndexOf(' ',max);if(cut<40)cut=max;out.push(p.slice(0,cut));p=p.slice(cut).trim();}if(p)out.push(p);}
  return out;
}
const LANGS=['hi-IN','pa-IN','en-IN'];
function pickVoices(voices){return voices.filter(v=>LANGS.some(l=>v.lang.replace('_','-').toLowerCase().startsWith(l.slice(0,2))));}
const api={splitChapters,chunks,pickVoices,LANGS};
if(typeof module!=='undefined')module.exports=api;else root.AudiobookCore=api;
})(this);
