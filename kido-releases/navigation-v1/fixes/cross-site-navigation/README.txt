KIDO — Cross-site navigation repair
==================================

Purpose
-------
Opening the local dashboard from another app or website could return
CROSS_SITE_DENIED or ORIGIN_DENIED. The request guard ran before route
handling and rejected an external, top-level browser navigation.

This fix permits top-level document navigation to GET / and GET /news.
It requires Sec-Fetch-Mode: navigate and Sec-Fetch-Dest: document.
Loopback/Host checks and the existing API bearer-token, Origin and
cross-site protections remain in place. This does not make KIDO public.

Which file to use
-----------------
Existing installations: use KIDO-FIX-CROSS-SITE.cjs.

The fixed KIDO-AUTONOMOUS-SETUP.cjs full installer is for new installations
or already-repaired installations whose existing files match its payload.
Use the repair for an existing installation with the old guard.

Run in Termux with Node.js 20 or newer. If the repair file is already in
your current directory:

    node ./KIDO-FIX-CROSS-SITE.cjs

Default installation:
    $HOME/KIDO-AI-COMMAND-CENTER/KIDO-AUTO-AGENTS

Custom paths can be supplied through KIDO_AGENT_HOME and KIDO_PROJECT.
The repair accepts no positional arguments and needs no ZIP or npm install.

What the repair does
--------------------
1. Recognizes the exact old guard block and validates the existing
   main.cjs manifest entry when a manifest is present.
2. Creates five same-device backup sets, each containing main.cjs and
   the existing manifest if present. They are stored under:
       KIDO-AUTO-AGENTS/state/repairs/cross-site-<timestamp>-<suffix>/
       copy-1/ through copy-5/
3. Checks the candidate's JavaScript syntax, pauses an idle worker,
   stops the existing service, and updates the guard and manifest.
4. Starts the service, verifies both document routes, verifies that
   cross-site API access is still rejected, and restores the worker's
   previous pause setting.

If an AI task or research fetch is running, let it finish and rerun the
same repair. The script refuses unknown or ambiguous guard layouts and
manifest mismatches rather than guessing at a replacement.

Results and repeat runs
-----------------------
KIDO_NAVIGATION_FIXED means the restarted service passed the repair's
navigation checks. The output includes the backup location and dashboard
URL. It is not a claim that AI providers or Android background operation
have been tested.

The recognized fixed block is not patched twice. A running, verified
instance reports KIDO_NAVIGATION_ALREADY_FIXED. An already-fixed file with
a stopped or outdated running service can still require a restart.

On failure, retain the printed error and any backup/recovery location.
