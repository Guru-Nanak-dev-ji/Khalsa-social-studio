(function(){'use strict';// 🌍 नक्शा: इस page को "देखा" चिह्नित करता है. सिर्फ़ इसी phone में.
try{const m=/([a-z0-9-]+)\.html$/.exec(location.pathname);if(!m)return;const K='kdn-naksha-v1';let s=null;try{s=JSON.parse(localStorage.getItem(K));}catch{}
if(!s||s.v!==1||!Array.isArray(s.seen))s={v:1,seen:[],badge:false};if(s.seen.includes(m[1])||s.seen.length>60)return;s.seen.push(m[1]);localStorage.setItem(K,JSON.stringify(s));}catch{}})();
