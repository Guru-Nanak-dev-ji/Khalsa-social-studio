/* KDN free share buttons: no paid API, no backend. Only public share URLs + clipboard + navigator.share. */
(function(){"use strict";
var SITE="https://not4you.world";
var POSTS=[
{lang:"हिंदी",text:"🧬 One click and change your life! KDN अब live है: https://not4you.world — लंगर, सेवा, खेल, किताब, हँसी और खबरें, सब मुफ़्त। किरत करो, वंड छक्को 🙏"},
{lang:"ਪੰਜਾਬੀ",text:"🧬 One click and change your life! KDN ਹੁਣ live ਹੈ: https://not4you.world — ਲੰਗਰ, ਸੇਵਾ, ਖੇਡ, ਕਿਤਾਬ, ਹਾਸਾ ਤੇ ਖ਼ਬਰਾਂ, ਸਭ ਮੁਫ਼ਤ। ਕਿਰਤ ਕਰੋ, ਵੰਡ ਛਕੋ 🙏"},
{lang:"English",text:"🧬 One click and change your life! KDN is live: https://not4you.world — langar, seva, games, a book, laughs and news, all free. Work honestly, share with all 🙏"}];
var E=encodeURIComponent;
function copy(t){if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(t).then(function(){return true},function(){return fallback(t)});return Promise.resolve(fallback(t))}
function fallback(t){var a=document.createElement("textarea");a.value=t;a.setAttribute("readonly","");a.style.position="fixed";a.style.opacity="0";document.body.appendChild(a);a.select();var ok=false;try{ok=document.execCommand("copy")}catch(e){}a.remove();return ok}
function open(u){window.open(u,"_blank","noopener,noreferrer")}
var ACTIONS={
native:function(t){return navigator.share({text:t,url:SITE}).then(function(){return"✅ शेयर हो गया"},function(){return""})},
wa:function(t){open("https://wa.me/?text="+E(t));return"WhatsApp खुल रहा है…"},
fb:function(t){return copy(t).then(function(ok){open("https://www.facebook.com/sharer/sharer.php?u="+E(SITE));return ok?"📋 टेक्स्ट कॉपी हुआ — Facebook में paste करें":"Facebook खुल रहा है…"})},
x:function(t){open("https://x.com/intent/post?text="+E(t));return"X खुल रहा है…"},
tg:function(t){open("https://t.me/share/url?url="+E(SITE)+"&text="+E(t.replace(SITE,"").replace(/\s+—/," —")));return"Telegram खुल रहा है…"},
ig:function(t){return copy(t).then(function(ok){open("https://www.instagram.com/");return ok?"📋 कैप्शन कॉपी हुआ — Instagram में paste करें":"Instagram खुल रहा है…"})},
copy:function(t){return copy(t).then(function(ok){return ok?"📋 कॉपी हो गया":"कॉपी नहीं हुआ — टेक्स्ट दबाकर खुद कॉपी करें"})}};
var BTNS=[["wa","🟢 WhatsApp"],["fb","🔵 Facebook"],["x","✖ X"],["tg","✈ Telegram"],["ig","📸 Instagram"],["copy","📋 कॉपी करें"]];
function card(p){var d=document.createElement("div");d.className="post";var l=document.createElement("span");l.className="lang";l.textContent=p.lang;var ta=document.createElement("textarea");ta.value=p.text;ta.setAttribute("aria-label",p.lang+" पोस्ट");var row=document.createElement("div");row.className="row";var msg=document.createElement("p");msg.className="msg";msg.setAttribute("role","status");msg.setAttribute("aria-live","polite");
var list=BTNS.slice();if(typeof navigator.share==="function")list.unshift(["native","📤 फ़ोन से शेयर करें"]);
list.forEach(function(b){var btn=document.createElement("button");btn.type="button";btn.dataset.share=b[0];btn.textContent=b[1];if(b[0]==="native")btn.className="native";btn.addEventListener("click",function(){Promise.resolve(ACTIONS[b[0]](ta.value)).then(function(m){msg.textContent=m||""})});row.appendChild(btn)});
d.append(l,ta,row,msg);return d}
function init(){var root=document.getElementById("kdn-share");if(!root)return;var box=root.querySelector(".posts");POSTS.forEach(function(p){box.appendChild(card(p))})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
window.KDNShare={POSTS:POSTS,ACTIONS:ACTIONS,card:card};})();
