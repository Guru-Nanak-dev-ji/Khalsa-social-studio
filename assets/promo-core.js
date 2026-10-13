'use strict';
(function(root){
const APP='https://guru-nanak-dev-ji.github.io/Khalsa-social-studio/';
const BOT='t.me/Khalsaworld_bot';
const SCENES=[
 {icon:'🏰',title:'KDN',sub:'Khalsa Digital World',lines:['एक app, सब कुछ','खबर · Reel · किताब · खेल']},
 {icon:'🚪',title:'द्वार के अंदर द्वार',lines:['द्वारों वाला महल','हर द्वार में नई दुनिया','ऊपर रास्ता, बड़ा ⬅ वापस']},
 {icon:'📺',title:'KNN News Studio',lines:['अपना News channel','Guest को link से बुलाएँ','⏺ video record करें']},
 {icon:'🎬',title:'Reel Studio',lines:['मेहराब · शतरंज · ताश','एक tap में hashtags','#KhalsaDigitalWorld #KDN']},
 {icon:'📖',title:'Book Bar Audiobook',lines:['किताब डालें, app पढ़कर सुनाए','अध्याय-अध्याय','जहाँ रुके, वहीं से आगे']},
 {icon:'🤖',title:'Free AI Tools द्वार',lines:['काम के free AI tools','एक ही द्वार में']},
 {icon:'📲',title:'सब एक जगह',lines:['Telegram पर popup मंज़ूरी','WhatsApp · Instagram · YouTube','आपकी हाँ के बिना कुछ नहीं']},
 {icon:'🪙',title:'खेलो और जीतो',lines:['छूने से koins ✨','Quiz से अंक 🧠','1,25,000 welcome game koins','(game koins, असली पैसा नहीं)']},
 {icon:'💛',title:'हम बेहतर क्यों?',lines:['✔ 100% free, open-source','✔ कोई ads नहीं, कोई जासूसी नहीं','✔ photo phone में ही','✔ हिंदी-पंजाबी','किरत करो · वंड छको']},
 {icon:'🙏',title:'अभी जुड़ें',lines:['App: guru-nanak-dev-ji.github.io','/Khalsa-social-studio/','Telegram: '+BOT,'😀 मेरा अवतार — जल्द']}
];
const SCENE_MS=5000;
const TOTAL_MS=SCENES.length*SCENE_MS;
function sceneAt(ms){const t=((ms%TOTAL_MS)+TOTAL_MS)%TOTAL_MS;const i=Math.floor(t/SCENE_MS);return {index:i,progress:(t-i*SCENE_MS)/SCENE_MS};}
const api={APP,BOT,SCENES,SCENE_MS,TOTAL_MS,sceneAt};
if(typeof module!=='undefined')module.exports=api;else root.PromoCore=api;
})(this);
