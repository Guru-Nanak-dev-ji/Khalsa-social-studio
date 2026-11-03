# Step 44 - NARAD automatic research and publication call chain

Evidence: user-provided excerpts from legacy KIDO-AUTO-AGENTS/autonomy.cjs and main.cjs on 2026-10-29.

Confirmed: local HTTP server binds 127.0.0.1 and checks host, remote address, origin and bearer token for API routes. POST /api/narad/run calls autonomy.run(true). When autonomy enabled, app.onTaskComplete is assigned to autonomy.record(task) and autonomy.start() is called. record(task) persists research and, if notion.autoPublish is enabled, task DONE, quality passed and final not truncated, invokes publishNotion(entry). That method can issue an external Notion PATCH write.

Automatic research: scheduler and provider-backed research task creation exist. The code shows a configured, conditional automation mechanism; it does not prove it is currently running.

Security finding: visible record/publish path has no independently verified founder approval grant at the external write boundary. Local bearer authentication does not substitute for per-action authorization. Treat autoPublish as legacy behavior requiring isolation; do not start it or publish.

Safe integration: retain automated research and local draft journaling as a design reference, but separate outbound publication behind verified approval grant with scope, destination, content binding, expiration and replay protection. Use durable queue leases and idempotency for hosted operation. No code changes to Termux, no publication.
