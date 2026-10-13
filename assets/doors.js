(()=>{'use strict';const D=window.KDNDoors,grid=document.getElementById('doors'),crumb=document.getElementById('door-crumb'),h=document.getElementById('door-title');
function render(path,animate){const {node,trail}=D.find(path);h.textContent=node.icon+' '+node.title;crumb.replaceChildren();
 trail.forEach((n,i)=>{if(i)crumb.append(' › ');const a=document.createElement('a');a.href='#door='+trail.slice(1,i+1).map(x=>x.id).join('/');a.textContent=n.icon+' '+(i?n.title:'महल');if(i===trail.length-1)a.setAttribute('aria-current','page');crumb.append(a)});
 if(trail.length>1){const b=document.createElement('a');b.href='#door='+trail.slice(1,-1).map(x=>x.id).join('/');b.className='door-back';b.textContent='⬅ वापस · ਵਾਪਸ · Back';crumb.prepend(b,' ');}
 grid.replaceChildren();grid.classList.toggle('door-in',!!animate);node.doors.forEach((d,i)=>{const a=document.createElement('a');a.className='door'+(d.doors?' door-cat':'')+(d.soon?' door-soon':'');a.style.animationDelay=(i*60)+'ms';
  if(d.doors)a.href='#door='+path.concat(d.id).join('/');else if(d.soon){a.href='#';a.setAttribute('aria-disabled','true');a.onclick=e=>e.preventDefault()}else{a.href=d.href;if(/^https?:/.test(d.href)){a.target='_blank';a.rel='noopener noreferrer'}}
  a.innerHTML='<span class="leaf l"></span><span class="leaf r"></span><span class="door-ic"></span><b></b><small></small>';a.querySelector('.door-ic').textContent=d.icon;a.querySelector('b').textContent=d.title;a.querySelector('small').textContent=(d.sub||'')+(d.doors?' · '+d.doors.length+' 🚪':'');
  if(d.doors||d.href==='#control')a.addEventListener('click',e=>{if(d.href==='#control'){e.preventDefault();document.getElementById('control').scrollIntoView({behavior:'smooth'});return}e.preventDefault();a.classList.add('opening');setTimeout(()=>{location.hash='door='+path.concat(d.id).join('/')},450)});
  grid.append(a)});}
addEventListener('hashchange',()=>render(D.parseHash(location.hash),true));render(D.parseHash(location.hash),false);
})();
