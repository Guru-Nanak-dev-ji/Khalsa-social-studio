'use strict';
// KIDO ONE Step 20 — provider interface. No SDK, API key, HTTP request or live calls.
const {planRoute}=require('./ai-router.cjs');
function createProviderRegistry(){
 const adapters=new Map();
 return Object.freeze({
  register(name,adapter){
   if(!['local','gemini','openai','grok','deepseek'].includes(name))throw Error('UNSUPPORTED_PROVIDER');
   if(!adapter||typeof adapter.dryRun!=='function'||typeof adapter.describe!=='function')throw Error('INVALID_ADAPTER');
   if(adapters.has(name))throw Error('DUPLICATE_ADAPTER');
   adapters.set(name,adapter);return name;
  },
  async prepare(request){
   const plan=planRoute(request);
   if(plan.status!=='DRY_RUN_PLAN')return plan;
   const adapter=adapters.get(plan.provider);
   if(!adapter)return {...plan,status:'ADAPTER_NOT_CONNECTED'};
   const description=adapter.describe();
   if(description?.canSend===true||description?.liveEnabled===true)throw Error('LIVE_ADAPTER_FORBIDDEN');
   const result=await adapter.dryRun({role:plan.role,taskId:request.taskId||null});
   if(result?.executed!==false||result?.externalCalls!==0)throw Error('DRY_RUN_CONTRACT_VIOLATION');
   return {...plan,adapterResult:result};
  }
 });
}
function mockProvider(name){return {describe:()=>({name,canSend:false,liveEnabled:false}),async dryRun({role,taskId}){return {role,taskId,executed:false,externalCalls:0,provider:name};}};}
module.exports={createProviderRegistry,mockProvider};
