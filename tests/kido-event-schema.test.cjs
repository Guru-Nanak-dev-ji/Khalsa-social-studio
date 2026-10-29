'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const schema=require('../kido-one/autonomy/event.schema.json');
test('event envelope schema is closed, requires identity, evidence and policy',()=>{
 assert.equal(schema.$schema,'https://json-schema.org/draft/2020-12/schema');
 assert.equal(schema.additionalProperties,false);
 for(const key of ['event_id','event_type','project_id','actor_id','actor_kind','source_uri','occurred_at','idempotency_key','payload','policy_version'])
  assert.ok(schema.required.includes(key),key);
 assert.ok(schema.properties.event_type.enum.includes('CONFLICT_RAISED'));
 assert.ok(schema.properties.event_type.enum.includes('AUTOMATION_PAUSED'));
 assert.ok(schema.properties.actor_kind.enum.includes('AI'));
});
