'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {classifyLegacyFile}=require('../kido-one/autonomy/legacy-agent-classifier.cjs');
test('classifies historical agent filenames without reading code',()=>{const x=classifyLegacyFile({root:'ai-army',relativePath:'autopilot/engine.js'});assert.equal(x.status,'INVENTORY_ONLY');assert.equal(x.kind,'CODE');assert.equal(x.executed,false);});
test('rejects traversal and absolute paths',()=>{assert.equal(classifyLegacyFile({root:'rooms',relativePath:'../.env'}).status,'REJECTED');assert.equal(classifyLegacyFile({root:'rooms',relativePath:'/etc/passwd'}).status,'REJECTED');});
test('excludes sensitive names',()=>{assert.equal(classifyLegacyFile({root:'command-agents',relativePath:'.env.local'}).status,'EXCLUDED');assert.equal(classifyLegacyFile({root:'ai-army',relativePath:'private-key.json'}).status,'EXCLUDED');});
test('unknown roots are denied',()=>assert.equal(classifyLegacyFile({root:'secrets',relativePath:'agent.js'}).status,'REJECTED'));
