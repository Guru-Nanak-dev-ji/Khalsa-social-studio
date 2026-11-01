# Step 43 - NARAD caller locations

Source: user-supplied Termux grep line-number output, 2026-10-29.

Observed in autonomy.cjs: 153, 155, 160, 228, 245.
Observed in main.cjs: 115, 178, 214, 229, 411, 424, 442.
These are regex matches for publishNotion, record, run, approval terms and workerPaused; they are not yet identified as individual call sites.

Step 42 commit 2a3fa499f60d019d1e1ae8e0087bd62d4984aad5: static and PostgreSQL CI completed successfully.

Next: inspect narrow redacted code windows around autonomy 210-235 and main 105-125, 165-185, 205-235, 400-450. Verify endpoint authentication, action scope, explicit founder grant and whether outbound publication is triggered indirectly. Never execute scripts, print secrets, or send network requests.

Current security posture: publication remains unapproved; old services remain unstarted. No claim of confirmed caller behavior until source is reviewed.
