# Step 38 — Legacy Policy Source Review (2026-10-29)

Status: CONTENT_REVIEWED based on user-supplied Termux source text. Not runtime-tested, not approved for integration.

## approval-gateway.js
- Exports evaluate(action,context={}); context unused.
- Sensitive actions return REQUIRES_HUMAN_APPROVAL, but executionAuthorized is always false.
- Safe proposals return PROPOSAL_ALLOWED, also executionAuthorized false.
- Unknown actions default DENY. Good fail-closed baseline.
- No grant verification, actor authentication, scope, expiry, replay protection or audit persistence. The status label is advisory, not authorization.
- Action names include SEND_MONEY, PUBLISH_CONTENT, CREATE_TOKEN, DEPLOY_CONTRACT, SIGN_CONTRACT, ACCESS_PRIVATE_DATA, CHANGE_SECURITY_POLICY, DELETE_USER_DATA. Other outbound actions not explicitly listed still default DENY.

## rule-engine.js
- Requires local JSON config, ai-message-protocol and filesystem.
- Checks 7 registry systems, default deny, automaticExecution=false, human confirmation for barter, payment and token issuance disabled, and public dashboard existence.
- Produces a local report and writes reports/world-v0.2-report.json; process.exitCode=1 on failed checks.
- Calls runChecks() unconditionally at module load. Do not import it into the hosted worker; importing triggers file I/O and can fail if files missing.
- Its checks are snapshots of configuration, not transactional enforcement of outgoing operations.
- Actual config values and message protocol source were not provided, so successful checks cannot be independently confirmed.

## Integration decision
- Keep legacy modules immutable. Prefer a new adapter with explicit mapping into KIDO ONE policy-engine and approval-gate.
- Default deny unknown actions. Never equate REQUIRES_HUMAN_APPROVAL with a granted approval.
- Require verified human approval grant before sensitive action, and enforce execution gate at side-effect boundary.
- Include emails, social posts, DNS changes, deployments and paid calls in action taxonomy.
- Add isolated tests for side effects, missing configs, unknown actions, forged grants and replay before any merge.

No code executed in Termux. No live deployment or financial actions.
