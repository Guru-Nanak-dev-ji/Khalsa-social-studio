# KIDO ONE — Step 36 Legacy AI Army Integrity Baseline
Source: user-provided Termux wc -lc and sha256sum output. Date: 2026-10-29.
These are metadata fingerprints, NOT content review, security validation or proof that any agent is running.

| Relative path (Termux) | Lines | Bytes | SHA-256 |
|---|---:|---:|---|
| KIDO-PUBLIC-LAUNCH/ai-network/ai-army/commander.js | 306 | 6325 | c126b929be4dc02ded08124faed64b5fea507452a26b8be09777aff532a4b48d |
| KIDO-AI-COMMAND-CENTER/KIDO-AUTO-AGENTS/main.cjs | 504 | 35351 | 98419da6fa552cbf8dca1bd5c0ec645dde79d2758d72a0deebd2d721f3104cc2 |
| KIDO-AI-COMMAND-CENTER/KIDO-AUTO-AGENTS/providers.cjs | 386 | 22352 | 185517e9105db0128ebb19bbf5db5ce4c77ed75d4ebb0f11b1008ad29a6bf94e |
| KIDO-AI-COMMAND-CENTER/KIDO-AUTO-AGENTS/autonomy.cjs | 282 | 23219 | a9dcdcc41331207e6f1ae2ff749995b031e85c0a9a935deb8a51b329d77125a6 |
| KIDO-AI-COMMAND-CENTER/kido-world/agents/approval-gateway.js | 74 | 1486 | af26d8ef6bedb329f0d6982ddc61cca28a4032c0a37f697a26aaa15e8acc8b5f |
| KIDO-AI-COMMAND-CENTER/kido-world/agents/rule-engine.js | 75 | 2304 | 4e830eb6fca81f7a27758c8b41819e72e5f6f55fefae4b9cff7622213340c572 |

TOTAL: 1627 lines; 91037 bytes across six files.

## Integration priorities
1. Review approval-gateway.js and rule-engine.js for conflicts with Constitution Article 9, human approval, default-deny.
2. Review providers.cjs and autonomy.cjs for outbound calls, spending, secrets, schedules and unintended execution.
3. Review commander.js for process spawning, restart loops, unsafe privilege boundaries and log redaction.
4. Review main.cjs after mapping imports, server endpoints and side effects.

## Safe handoff
- Do not publish raw source or private configs automatically.
- First collect redacted structural evidence: exported symbols, imports and calls to child_process, network, fs writes, process.env; omit matching source lines containing credentials.
- Preserve hashes, backups and prior commands; no merge or restart without code review and authorization.
- All role/function conclusions remain provisional until source inspected.
