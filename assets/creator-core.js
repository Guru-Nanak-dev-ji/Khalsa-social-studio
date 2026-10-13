(function(root){
  'use strict';
  const KEY='kdn-news-social-creator-v1';
  const fields=['id','created','updated','language','kind','platform','heading','body','source','tags'];
  const limits={id:160,created:40,updated:40,heading:200,body:30000,source:2048,tags:1000};
  const choices={language:['hi','pa','en'],kind:['news','social'],platform:['general','facebook','instagram','youtube','whatsapp']};
  function uid(){return typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);}
  function safeUrl(value){if(!value)return '';try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password?u.href:'';}catch{return '';}}
  function validate(value){
    if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('invalid');
    const result={};
    for(const key of fields){if(typeof value[key]!=='string')throw new Error('invalid');result[key]=value[key];}
    for(const [key,max] of Object.entries(limits))if(result[key].length>max)throw new Error('invalid');
    for(const [key,values] of Object.entries(choices))if(!values.includes(result[key]))throw new Error('invalid');
    if(!result.id||!Number.isFinite(Date.parse(result.created))||!Number.isFinite(Date.parse(result.updated)))throw new Error('invalid');
    if(result.source&&!safeUrl(result.source))throw new Error('source');
    if(![result.heading,result.body,result.tags].some(v=>v.trim()))throw new Error('empty');
    return result;
  }
  function parse(raw){
    const data=JSON.parse(raw);
    if(!data||data.format!=='kdn-creator'||data.version!==1||!Array.isArray(data.drafts)||data.drafts.length>500)throw new Error('invalid');
    const drafts=data.drafts.map(validate);
    if(new Set(drafts.map(x=>x.id)).size!==drafts.length)throw new Error('invalid');
    return drafts;
  }
  function serialize(drafts){return JSON.stringify({format:'kdn-creator',version:1,exportedAt:new Date().toISOString(),drafts},null,2);}
  function compose(d){const labels={hi:'स्रोत',pa:'ਸਰੋਤ',en:'Source'};return [d.heading.trim(),d.body.trim(),d.source?labels[d.language]+': '+d.source.trim():'',d.tags.trim()].filter(Boolean).join('\n\n');}
  function fingerprint(d){return JSON.stringify(['language','kind','platform','heading','body','source','tags'].map(k=>d[k]));}
  class Store{
    constructor(storage){this.storage=storage;this.raw=null;this.drafts=[];this.error=null;try{this.raw=storage.getItem(KEY);this.drafts=this.raw?parse(this.raw):[];}catch(e){this.error=e;}}
    commit(drafts){
      if(this.error)throw new Error('storage');
      // Never replace data that another tab changed after this tab loaded.
      if(this.storage.getItem(KEY)!==this.raw)throw new Error('conflict');
      const raw=serialize(drafts);parse(raw);
      this.storage.setItem(KEY,raw);this.raw=raw;this.drafts=drafts;
    }
    save(draft){const d=validate(draft);const next=this.drafts.slice();const i=next.findIndex(x=>x.id===d.id);if(i<0)next.push(d);else next[i]=d;this.commit(next);return d;}
    remove(id){this.commit(this.drafts.filter(x=>x.id!==id));}
    import(drafts){
      const incoming=drafts.map(validate),next=this.drafts.slice(),seen=new Set(next.map(fingerprint)),ids=new Set(next.map(x=>x.id));let added=0;
      for(const item of incoming){const f=fingerprint(item);if(seen.has(f))continue;const d={...item};if(ids.has(d.id))d.id=uid();next.push(d);ids.add(d.id);seen.add(f);added++;}
      if(added)this.commit(next);return added;
    }
  }
  function legacy(storage){
    const drafts=[];let skipped=0;
    for(const key of ['kdn-newsdesk-v03','kdn-sangat-post-studio-v1','kdn-sangat-draft-library-v1']){
      let data;try{const raw=storage.getItem(key);if(!raw)continue;data=JSON.parse(raw);}catch{skipped++;continue;}
      const rows=key==='kdn-sangat-post-studio-v1'?[data]:data;if(!Array.isArray(rows)){skipped++;continue;}
      for(const x of rows){try{
        if(!x||typeof x!=='object')throw new Error('invalid');
        const text=k=>typeof x[k]==='string'?x[k]:'';
        const now=new Date().toISOString(),stamp=Number.isFinite(Date.parse(x.created))?x.created:now;
        const d={id:uid(),created:stamp,updated:stamp,language:({Hindi:'hi',Punjabi:'pa',English:'en'})[x.language]||'hi',kind:key==='kdn-newsdesk-v03'?'news':'social',platform:choices.platform.includes(x.platform)?x.platform:'general',heading:text('title')||text('heading'),body:text('body'),source:text('source'),tags:text('tags')};
        drafts.push(validate(d));
      }catch{skipped++;}}
    }
    return {drafts,skipped};
  }
  // One-tap share links: free public intent URLs, no login or server.
  function shareLinks(text,link){
    const e=encodeURIComponent,u=safeUrl(link||'')||'';
    return {
      whatsapp:'https://wa.me/?text='+e(text),
      telegram:'https://t.me/share/url?url='+e(u)+'&text='+e(text),
      x:'https://twitter.com/intent/tweet?text='+e(Array.from(text).length>280?Array.from(text).slice(0,279).join('')+'…':text),
      facebook:'https://www.facebook.com/sharer/sharer.php?u='+e(u)+'&quote='+e(text),
      instagram:'https://www.instagram.com/'
    };
  }
  const api={KEY,uid,safeUrl,validate,parse,serialize,compose,Store,legacy,shareLinks};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.KDNCreator=api;
})(typeof globalThis!=='undefined'?globalThis:this);
