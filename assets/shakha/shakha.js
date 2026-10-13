(function(){'use strict';var S=window.KDNShakha,F=window.KDNFilter,X=window.KDNShare,L=window.KDNLocal,el=L.el,$=function(i){return document.getElementById(i)};
var st=L.load(S),root=S.RIDS[0],parent=null,msg;
function say(t,bad){msg.textContent=t;msg.className='sk-msg'+(bad?' bad':'')}
function rootSel(){var sel=$('sk-root');S.ROOTS.forEach(function(r){var o=el('option',null,r.t);o.value=r.id;sel.appendChild(o)});sel.value=root;sel.onchange=function(){root=sel.value;parent=null;draw()}}
function node(n){var li=el('li'),c=el('div','sk-node'+(n.mine?' mine':'')+(parent===n.id?' sel':''));
 c.appendChild(el('b',null,(n.title||'शाखा')+(n.by?' · ✍️ '+n.by:'')));c.appendChild(el('p',null,n.text));
 var row=el('div','sk-acts'),lk=el('button','sk-b',(st.likes[n.id]?'❤️ 1':'🤍 0')+' पसंद');lk.type='button';lk.onclick=function(){st=S.like(st,n.id);L.save(S,st);draw()};
 var go=el('button','sk-b','🌿 यहाँ से आगे लिखो');go.type='button';go.onclick=function(){parent=n.id;draw();$('sk-text').focus()};
 var sh=el('button','sk-b','🔗 शेयर');sh.type='button';sh.onclick=function(){L.copy(location.origin+location.pathname+'#b='+X.enc({r:n.root,c:S.chain(st,n.id)}),sh)};
 var sg=el('button','sk-b',st.suggest.includes(n.id)?'📨 सुझाव भेजा (review बाकी)':'📨 मुख्य कहानी में जोड़ने का सुझाव');sg.type='button';sg.onclick=function(){st=S.suggest(st,n.id);L.save(S,st);draw();say('📨 सुझाव review की कतार में — मुख्य कहानी अपने आप नहीं बदलेगी।')};
 row.append(lk,go,sh,sg);c.appendChild(row);li.appendChild(c);var kids=S.children(st,n.root,n.id);if(kids.length){var ul=el('ul');kids.forEach(function(k){ul.appendChild(node(k))});li.appendChild(ul)}return li}
function draw(){var r=S.ROOTS.find(function(x){return x.id===root}),t=$('sk-tree');t.textContent='';var ul=el('ul','sk-ul'),li=el('li'),c=el('div','sk-node root'+(parent===null?' sel':''));
 var a=el('a',null,'📖 '+r.t+' (मुख्य कहानी) ↗');a.href=r.href;c.appendChild(a);var b=el('button','sk-b','🌿 यहीं से नई शाखा');b.type='button';b.onclick=function(){parent=null;draw()};c.appendChild(b);li.appendChild(c);
 var kids=S.children(st,root,null);if(kids.length){var u2=el('ul');kids.forEach(function(k){u2.appendChild(node(k))});li.appendChild(u2)}ul.appendChild(li);t.appendChild(ul);
 var p=parent&&st.nodes.find(function(n){return n.id===parent});$('sk-where').textContent=p?'🌿 "'+(p.title||p.text.slice(0,30))+'" के आगे':'🌿 '+r.t+' के आगे (नई शाखा)';
 $('sk-count').textContent='🌳 '+st.nodes.length+' शाखाएँ · ❤️ '+Object.keys(st.likes).length+' · 📨 '+st.suggest.length+' सुझाव review के लिए';}
function init(){if(!S||!$('sk-tree'))return;msg=$('sk-msg');
 var q=new URLSearchParams(location.search).get('root');if(q&&S.RIDS.includes(q))root=q;
 var m=/#b=([A-Za-z0-9_-]+)/.exec(location.hash);if(m){var d=X.dec(m[1]);var r=d&&S.importChain(st,d.c,F);if(r&&!r.error){st=r.state;L.save(S,st);root=d.r;parent=d.c[d.c.length-1].id;say('🤝 दोस्त की शाखा खुली — अब तुम आगे लिखो!')}else say((r&&r.error||['लिंक ख़राब है']).join(' · '),true)}
 rootSel();$('sk-root').value=root;
 $('sk-form').onsubmit=function(e){e.preventDefault();var r=S.add(st,{root:root,parent:parent,title:$('sk-title').value.trim(),text:$('sk-text').value,by:$('sk-by').value.trim()},F);
  if(r.error){say(r.error.join(' · '),true);return}st=r.state;L.save(S,st);parent=r.node.id;$('sk-text').value='';$('sk-title').value='';
  var k=L.koins('shakha:'+r.node.id.slice(0,8));say('✅ शाखा सेव हुई'+(k?' · +'+k+' koins':'')+(r.badgeNew?' · 🏅 badge: '+S.BADGE:''));draw()};
 draw();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();
