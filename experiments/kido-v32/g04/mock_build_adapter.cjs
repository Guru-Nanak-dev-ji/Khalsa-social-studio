'use strict';
/* KDN V31 S1-GPT04 C12: bounded static builder operation for host-authenticated middleware.
 * Caller must wrap runTask() in C11 approval_stop_middleware.run(), and provide
 * authenticated STOP/lease/terminal. This does NOT accept task-supplied source code.
 */
const crypto=require('node:crypto');
const PAGE='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>KIDO Mock</title><main><h1>KIDO</h1><p>Free KIDO AI for Everyone</p></main></html>\n';
function operation({task,signal}){
 if(!task||task.operation!=='MOCK_STATIC_BUILD_TEST'||task.provider!=='MOCK_LOCAL'||task.scope!=='GREEN_MOCK_ONLY')throw Error('NOT_GREEN_MOCK_BUILD');
 if(!signal||typeof signal.aborted!=='boolean'||signal.aborted)throw Error('STOP_OR_SIGNAL_MISSING');
 const tests={doctype:PAGE.startsWith('<!doctype html>'),mobile:PAGE.includes('name="viewport"'),title:PAGE.includes('<title>KIDO Mock</title>'),mission:PAGE.includes('Free KIDO AI for Everyone')};
 if(Object.values(tests).some(v=>v!==true))throw Error('MOCK_STATIC_TEST_FAILED');
 if(signal.aborted)throw Error('STOP_BEFORE_RESULT');
 return Object.freeze({kind:'LOCAL_MOCK_STATIC_BUILD',html:PAGE,htmlSha256:crypto.createHash('sha256').update(PAGE).digest('hex'),tests});
}
function createRunner(middleware){
 if(!middleware||typeof middleware.run!=='function')throw Error('C11_MIDDLEWARE_REQUIRED');
 return Object.freeze({runTask:task=>middleware.run(task,operation)});
}
module.exports={operation,createRunner,PAGE};
