'use strict';
/** V32/G04 C19: deterministic task mutation test generator for existing C14.
 * No arbitrary user input is executed, no provider, queue, network or mutation
 * of production state. The accessor witness is a KNOWN GAP, not safe admission.
 */
const {assertSafeTask}=require('./approval_stop_middleware_c14.cjs');
const BASE=Object.freeze({taskId:'TASK-C19',tenantId:'TENANT-LOCAL',workerId:'S1-GPT04',sourceSha256:'a'.repeat(64),inputSha256:'b'.repeat(64),operation:'MOCK_STATIC_BUILD_TEST',scope:'GREEN_MOCK_ONLY',provider:'MOCK_LOCAL',attemptId:'ATTEMPT-C19',leaseId:'LEASE-C19',fence:1,stopRevision:0,approvalId:'APPROVAL-C19'});
const INVALID=Object.freeze({
 taskId:['../task','',null],tenantId:['','../tenant',null],workerId:['x','',null],
 sourceSha256:['z'.repeat(64),'abc',null],inputSha256:['not-sha','',null],
 operation:['SHELL_EXEC','FETCH_REMOTE','PAID_API'],scope:['RED','AMBER','PRODUCTION'],provider:['OPENAI_PAID','GROK','OLLAMA_CLOUD'],
 attemptId:['x','',null],leaseId:['../lease','',null],fence:[0,-1,true],stopRevision:[-1,true,1.5],approvalId:['x','',null]
});
const FIELDS=Object.keys(INVALID);
function mutate(index){
 if(!Number.isSafeInteger(index)||index<0)throw Error('INVALID_MUTATION_INDEX');
 const field=FIELDS[index%FIELDS.length];const bad=INVALID[field][Math.floor(index/FIELDS.length)%INVALID[field].length];
 return {field,index,task:{...BASE,[field]:bad}};
}
function evaluate(iterations=1000){
 if(!Number.isSafeInteger(iterations)||iterations<1||iterations>10000)throw Error('INVALID_ITERATIONS');
 let blocked=0,admitted=0;const coverage=Object.create(null),errors=Object.create(null);
 for(let i=0;i<iterations;i++){
  const m=mutate(i);coverage[m.field]=(coverage[m.field]||0)+1;
  try{assertSafeTask(m.task);admitted++;}
  catch(e){blocked++;errors[e.code||'OTHER']=(errors[e.code||'OTHER']||0)+1;}
 }
 return Object.freeze({schema:'KDN-V32-G04-C19-NEGATIVE-MATRIX',iterations,blocked,admitted,fieldsTested:FIELDS.length,coverage,errors,realWorkerAckVerified:false,autonomousLoopsCertified:0});
}
function accessorWitness(){
 const input={...BASE};let reads=0;
 Object.defineProperty(input,'tenantId',{enumerable:true,get(){reads++;return BASE.tenantId}});
 let admitted=false;try{assertSafeTask(input);admitted=true}catch{}
 return {schema:'KDN-V32-G04-C19-KNOWN-ISSUE-WITNESS',admitted,sideEffectGetterReads:reads,
  finding:'C14_ACCEPTS_ACCESSOR_ON_TRUST_ENVELOPE',fixRequired:true,realWorkerAckVerified:false};
}
module.exports={BASE,INVALID,FIELDS,mutate,evaluate,accessorWitness};
if(require.main===module)process.stdout.write(JSON.stringify({matrix:evaluate(1000),knownIssue:accessorWitness()},null,2)+'\n');
