(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNFilter=m;})(this,function(){'use strict';
// Basic shared-text filter: blocks phone numbers, emails/links and a small slur list. Not perfect — main story still needs human review.
const SLURS=['chutiya','chutiye','madarchod','behenchod','bhenchod','randi','harami','kutti','kamina','bhosdi','gandu','chamar','chuhra','bhangi','katua','mulla','paki','nigger','faggot','retard','चूतिया','मादरचोद','बहनचोद','भेनचोद','रंडी','हरामी','कमीना','भोसड़ी','गांडू','चमार','चूहड़ा','भंगी','कटुआ','ਚੂਤੀਆ','ਹਰਾਮੀ','ਕੰਜਰ','ਭੈਣਚੋਦ','ਮਾਦਰਚੋਦ'];
const DIG='0-9०-९੦-੯';
const PHONE=new RegExp('(?:\\+?['+DIG+'][\\s\\-.()]*){8,}');
const MAIL=/[^\s@]+@[^\s@]+\.[a-z]{2,}/i,URL=/(https?:\/\/|www\.)/i;
function norm(t){return String(t||'').toLowerCase().normalize('NFC')}
function check(t){const s=norm(t),why=[];if(PHONE.test(s))why.push('📵 फ़ोन नंबर नहीं');if(MAIL.test(s)||URL.test(s))why.push('🔗 email/link नहीं');
 if(SLURS.some(w=>new RegExp('(^|[^\\p{L}\\p{M}])'+w+'($|[^\\p{L}\\p{M}])','u').test(s)))why.push('🚫 अपशब्द नहीं');return{ok:!why.length,why};}
return{check,SLURS};});
