// Channel picker: puts the chosen News channel's name/logo into the logo bug, lower-third and ticker colour.
(()=>{'use strict';const C=window.KNNChannels,sel=document.getElementById('chan'),role=document.getElementById('anchorRole');if(!C||!sel)return;
let list=[];try{list=JSON.parse(localStorage.getItem('knn_channels')||'[]');}catch{}
function fill(){const cur=sel.value;sel.replaceChildren(new Option('KNN (मूल)',''),...list.map(c=>new Option(c.name+' · '+c.city,c.handle)));sel.value=cur;}
function apply(h){const c=list.find(x=>x.handle===h);if(!c){window.KNNChan=null;role.value='Anchor · KNN';localStorage.removeItem('knn_chan');return;}
 let img=null;if(c.logo&&C.logoOk(c.logo)){img=new Image();img.src=c.logo;}
 window.KNNChan={name:c.name,short:C.shortName(c.name),img,color:C.colorOk(c.tickerColor)?c.tickerColor:'#f2c66a'};role.value='Anchor · '+c.name;localStorage.setItem('knn_chan',h);}
sel.addEventListener('change',()=>apply(sel.value));
const want=new URLSearchParams(location.search).get('channel')||localStorage.getItem('knn_chan')||'';
fill();if(want){sel.value=want;apply(want);}
fetch(C.API+'/news/channels').then(r=>r.ok?r.json():Promise.reject()).then(j=>{list=j.channels||[];localStorage.setItem('knn_channels',JSON.stringify(list));fill();if(want&&!window.KNNChan){sel.value=want;apply(want);}}).catch(()=>{});
})();
