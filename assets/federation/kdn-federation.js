/* KDN Federation navigation v1. Read-only DOM enhancement; no network calls. */
(function(){
  'use strict';
  if(document.querySelector('[data-kdn-federation]')) return;
  const home=document.querySelector('body > a.kdn-home');
  if(!home) return;
  const nav=document.createElement('nav');
  nav.className='kdn-fed';
  nav.setAttribute('aria-label','KDN Federation — मुख्य नेविगेशन');
  nav.setAttribute('data-kdn-federation','v1');
  home.parentNode.insertBefore(nav,home);
  nav.appendChild(home);
  const add=(label,url)=>{const a=document.createElement('a');a.href=url;a.textContent=label;nav.appendChild(a);};
  add('🗂️ सारे द्वार','./sab.html');
  add('🏛️ सेवाएँ','./directory.html');
  const details=document.createElement('details');
  const summary=document.createElement('summary');summary.textContent='🌐 11 वेबसाइटें';details.appendChild(summary);
  const links=document.createElement('div');links.className='kdn-fed-domains';
  const domains=[
    ['NOT4YOU','https://not4you.world/'],['Khalsa Homes','https://khalsa.homes/'],['Sikh Website','https://sikh.website/'],
    ['Khalsa Buzz','https://khalsa.buzz/'],['Khalsa Legal','https://khalsa-legal.world/'],['Khalsa News','https://khalsa-news.world/'],
    ['Khalsa Konnect','https://khalsa-konnect.shop/'],['Khalsa LOL','https://khalsa.lol/'],['KIDO-G','https://kido-g.net/']
  ];
  for(const [label,url] of domains){const a=document.createElement('a');a.href=url;a.textContent=label;links.appendChild(a);}
  for(const label of ['khalsa.website — DNS जाँच','khalsa.church — DNS जाँच']){const span=document.createElement('span');span.className='kdn-fed-unavailable';span.textContent=label;links.appendChild(span);}
  details.appendChild(links);nav.appendChild(details);
})();
