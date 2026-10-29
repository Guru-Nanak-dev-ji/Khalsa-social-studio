# KIDO ONE — Termux Army Recovery Evidence (Step 33)
Date: 2026-10-29. Source: user-provided read-only Termux command output.

## CONFIRMED DIRECTORIES (existence only)
- ~/KIDO-PUBLIC-LAUNCH/ai-network/ai-army
- ~/KIDO-AI-COMMAND-CENTER/agents
- ~/KIDO-AI-COMMAND-CENTER/public/agents
- ~/KIDO-AI-COMMAND-CENTER/public.backup/agents
- ~/KIDO-AI-COMMAND-CENTER/kido-world/agents
- ~/KIDO-AI-COMMAND-CENTER/KIDO-AUTO-AGENTS
- ~/KIDO-AI-COMMAND-CENTER/rooms/KIDO-001, KIDO-002, KIDO-003
- ~/KIDO-RECOVERY-SAFE and ~/KIDO-PUBLIC-LAUNCH/backups
- ~/.termux/boot/kido-backup-20261021
Other paths exist; see user-supplied Termux inventory in chat.

## PROCESS STATUS
The read-only ps -ef filter returned zero matching lines for kido, brahma, node, cloudflared, n8n at observation time. This does not prove absence of all services, alternative process names, or future availability.

## GIT ROOTS CONFIRMED
~/KIDO-AI-COMMAND-CENTER, ~/KIDO-PUBLIC-LAUNCH, ~/KIDO-RECOVERY-SAFE/KIDO-PUBLIC-LAUNCH, ~/KIDO-DEPLOY, ~/KIDO-REVIEW-NEW (plus unrelated repos).

## SAFE NEXT ACTION
Inspect filenames and metadata only in the six agent/room roots, then identify exact entrypoints, manifests, versions and git remotes. Do NOT cat .env, tokens, ~/.kido-secrets, or cloudflared credentials; do not execute discovered scripts or restart daemons. No deletions, merges or overwrites.

## STATUS
Agent directory existence VERIFIED. Agent source contents, counts, functionality and online connectivity NOT YET VERIFIED. GitHub KIDO ONE draft remains independent until review.
