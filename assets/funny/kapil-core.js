/* Kapil Sharma section — ONLY official channels, IDs verified via YouTube oEmbed on 2026-10-13. Embeds only, nothing rehosted. */
(function(g){
var CH={k9:{name:'Kapil Sharma K9',url:'https://www.youtube.com/@KapilSharmaK9'},nf:{name:'Netflix India',url:'https://www.youtube.com/@NetflixIndiaOfficial'},set:{name:'SET India',url:'https://www.youtube.com/@SETIndia'}};
var V=[
{id:'V16idqmsj4g',ch:'k9',e:'🎤',t:'Full Qawwali — Comedy, Music और हँसी'},
{id:'W_tqsT2bppk',ch:'k9',e:'🇮🇳',t:'80वाँ स्वतंत्रता दिवस — Indian Air Force के साथ'},
{id:'W8h7se91tA0',ch:'k9',e:'✈️',t:'Air Force Accuracy — "लगभग समय पर" कुछ नहीं'},
{id:'LjG8GDWmjbk',ch:'k9',e:'🐶',t:'प्यारा dog Jeevdya'},
{id:'N0sK6nkF4Pg',ch:'k9',e:'🏏',t:'Comedy का Sixer — Gavaskar और Shastri'},
{id:'7K9CLaGzwCA',ch:'k9',e:'🥁',t:'ढोल, नगाड़ा — हँसी का त्योहार'},
{id:'91esIFGUvs0',ch:'nf',e:'👨‍👦',t:'पिता-पुत्र के रिश्ते पर Kapil — comedy gold'},
{id:'J45jBgpod3Y',ch:'nf',e:'🎶',t:'Sunil Grover और Madhuri Dixit का मज़ेदार गाना'},
{id:'8fbP02NtpQ8',ch:'nf',e:'🪔',t:'Krushna और Kiku की नवरात्रि शुभकामनाएँ'},
{id:'M-G6dFK3090',ch:'nf',e:'📺',t:'The Great Indian Kapil Show — नया season'},
{id:'Mps-iDsK_Ks',ch:'set',e:'🐂',t:'The Kapil Sharma Show — Dr. Gulati और Chappu'}
];
function valid(v){return /^[A-Za-z0-9_-]{11}$/.test(v.id)&&!!CH[v.ch]}
function embed(id){return 'https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0'}
var api={CH:CH,VIDEOS:V,valid:valid,embed:embed,ALL:CH.k9.url+'/videos',CREDIT:'सभी videos उनके official channel से embed, अधिकार उनके पास'};
if(typeof module!=='undefined')module.exports=api;else g.KDNKapil=api;
})(typeof window!=='undefined'?window:globalThis);
