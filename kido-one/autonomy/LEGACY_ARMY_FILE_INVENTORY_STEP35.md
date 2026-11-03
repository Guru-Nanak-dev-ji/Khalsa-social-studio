# KIDO ONE — Legacy Army File Inventory (Step 35)
Date: 2026-10-29. Source: user-provided Termux read-only filenames. Contents and operational status NOT YET VERIFIED.

## Verified filenames
### ~/KIDO-PUBLIC-LAUNCH/ai-network/ai-army
logs/commander.log; logs/recovery.log; reports/commander-state.json; agents.json; commander.js; start.sh; commander.pid.

### ~/KIDO-AI-COMMAND-CENTER/agents
team.csv.

### ~/KIDO-AI-COMMAND-CENTER/KIDO-AUTO-AGENTS
main.cjs; providers.cjs; research.cjs; autonomy.cjs; dashboard.html; README-HINDI.txt; KIDO-AUTO-AGENTS-MANIFEST.json; state/server.log; state/server.lock; state/ollama.log; state/narad-state.json; state/runtime.json; state/lock-recovery.guard; state/narad-memory.json; state/reboot-recovery.plan.json.

### ~/KIDO-AI-COMMAND-CENTER/kido-world/agents
verify-world.js; ai-message-protocol.js; approval-gateway.js; rule-engine.js.

### ~/KIDO-AI-COMMAND-CENTER/rooms
KIDO-001/task-report.txt; KIDO-001/ai-analysis.txt; KIDO-001/ai-analysis.html;
KIDO-002/instructions.txt; KIDO-002/ai-plan.txt; KIDO-002/ai-plan.html; KIDO-002/request.txt;
KIDO-003/instructions.txt; KIDO-003/ai-plan.txt; KIDO-003/ai-plan.html; KIDO-003/request.txt; KIDO-003/gemini-response.txt; KIDO-003/gemini-response.html; KIDO-003/gemini-response.html.backup.

## Candidate roles — NOT VERIFIED
- commander.js / agents.json: possible agent orchestration and roster.
- main.cjs / providers.cjs / research.cjs / autonomy.cjs: possible provider routing, research and automation.
- approval-gateway.js / rule-engine.js: possible approval and policy enforcement.
- ai-message-protocol.js: possible agent communications.
- narad-memory.json / reboot-recovery.plan.json: possible memory and restart recovery.
- team.csv / rooms: possible team roster and historical outputs.

## Safe next verification
1. Obtain SHA256 and size of selected files, then inspect only non-secret source modules and README/manifest, redacting credentials and private identifiers.
2. Compare legacy approval rules with KIDO ONE Article 9 and DEC-003; do not auto-authorize outbound actions.
3. Never execute old start.sh, change process state, upload sensitive state logs, or delete anything.
4. Do not infer a live service from commander.pid or server.lock; previous ps output had no matching processes.
5. Maintain separate evidence status: VERIFIED_NAME, CONTENT_REVIEWED, TESTED_DRY_RUN, APPROVED_INTEGRATION.

## Integration mapping
Commander -> queue/worker; providers -> AI router; research -> offline worker; approval gateway -> approval gate; rule engine -> policy engine; message protocol -> event schema; Narad memory -> append-only event store. Every mapping remains a hypothesis until code review.
