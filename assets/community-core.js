(function(root){
  'use strict';
  const KEY='kdn-community-local-v1';
  const TYPES=['food','education','health','environment','shelter','other'];
  // Fictional identifiers only. This is a personal selection sandbox, not a register of people.
  const CANDIDATES=Array.from({length:10},(_,i)=>'demo-'+String(i+1).padStart(2,'0'));
  function uid(){return typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);}
  function empty(){return {format:'kdn-community',version:1,services:[],choices:[]};}
  function date(value){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const d=new Date(value+'T00:00:00Z');return Number.isFinite(d.valueOf())&&d.toISOString().slice(0,10)===value;}
  function service(row){
    if(!row||typeof row!=='object'||Array.isArray(row))throw new Error('invalid');
    for(const [key,max] of [['id',160],['date',10],['notes',800]])if(typeof row[key]!=='string'||row[key].length>max)throw new Error('invalid');
    if(!row.id||!date(row.date)||!Array.isArray(row.types)||row.types.length<1||row.types.length>TYPES.length||new Set(row.types).size!==row.types.length||row.types.some(t=>!TYPES.includes(t)))throw new Error('invalid');
    return {id:row.id,date:row.date,types:[...row.types],notes:row.notes};
  }
  function choices(rows){
    if(!Array.isArray(rows)||rows.length>5||new Set(rows).size!==rows.length||rows.some(id=>!CANDIDATES.includes(id)))throw new Error('invalid');
    return [...rows];
  }
  function validate(value){
    if(!value||value.format!=='kdn-community'||value.version!==1||!Array.isArray(value.services)||value.services.length>500)throw new Error('invalid');
    const services=value.services.map(service);
    if(new Set(services.map(x=>x.id)).size!==services.length)throw new Error('invalid');
    return {format:'kdn-community',version:1,services,choices:choices(value.choices)};
  }
  function parse(raw){return validate(JSON.parse(raw));}
  function toggle(selected,id){
    const current=choices(selected);if(!CANDIDATES.includes(id))throw new Error('invalid');
    if(current.includes(id))return current.filter(x=>x!==id);
    if(current.length===5)throw new Error('limit');
    return [...current,id];
  }
  function points(selected){return choices(selected).length*5;}
  // Whole paise, derived from elapsed milliseconds; not a wallet or payable balance.
  function estimate(ms){if(!Number.isFinite(ms)||ms<0)throw new Error('invalid');return Math.floor(ms*12500/3600000);}
  class Store{
    constructor(storage){this.storage=storage;this.raw=null;this.data=empty();this.error=null;try{this.raw=storage.getItem(KEY);if(this.raw)this.data=parse(this.raw);}catch(e){this.error=e;}}
    commit(data){
      if(this.error)throw new Error('storage');
      if(this.storage.getItem(KEY)!==this.raw)throw new Error('conflict');
      const clean=validate(data),raw=JSON.stringify(clean);
      this.storage.setItem(KEY,raw);this.data=clean;this.raw=raw;
    }
    save(row){const item=service(row),next=this.data.services.slice(),i=next.findIndex(x=>x.id===item.id);if(i<0)next.push(item);else next[i]=item;this.commit({...this.data,services:next});}
    remove(id){this.commit({...this.data,services:this.data.services.filter(x=>x.id!==id)});}
    select(id){this.commit({...this.data,choices:toggle(this.data.choices,id)});}
    import(data){
      const incoming=validate(data),next=this.data.services.slice(),ids=new Set(next.map(x=>x.id));
      const fingerprint=x=>JSON.stringify([x.date,[...x.types].sort(),x.notes]);
      const seen=new Set(next.map(fingerprint));let added=0;
      for(const row of incoming.services){const mark=fingerprint(row);if(seen.has(mark))continue;const item={...row,id:ids.has(row.id)?uid():row.id};next.push(item);ids.add(item.id);seen.add(mark);added++;}
      // A backup must never silently replace current support choices.
      if(added)this.commit({...this.data,services:next});
      return added;
    }
    restoreChoices(data){const incoming=validate(data);this.commit({...this.data,choices:incoming.choices});}
  }
  const api={KEY,TYPES,CANDIDATES,uid,empty,date,service,validate,parse,toggle,points,estimate,Store};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.KDNCommunity=api;
})(typeof globalThis!=='undefined'?globalThis:this);
