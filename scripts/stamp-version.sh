#!/usr/bin/env bash
# Stamp version/commit/date into assets/version.js, sw.js cache name and static labels.
# Rule: never go backward. New version = max(VERSION.0, sw.js CACHE, assets/version.js, last git tag-like stamp) with patch+1.
# If VERSION names a newer series than all of those, the series restarts at VERSION.0.
set -euo pipefail
SHA=${1:?sha}; DATE=$(date -u +%Y-%m-%d)
V=$(python3 - <<'PY'
import re,subprocess
def p(s):
    m=re.search(r'(\d+)\.(\d+)(?:\.(\d+))?',s or '');return (int(m[1]),int(m[2]),int(m[3] or 0)) if m else (0,0,0)
base=p(open('VERSION').read().strip()+'.0')
sw=p(re.search(r"const CACHE=PREFIX\+'v([\d.]+)'",open('sw.js').read())[1])
vj=p(re.search(r"version:'([\d.]+)'",open('assets/version.js').read())[1])
try: log=subprocess.run(['git','log','-50','--format=%s'],capture_output=True,text=True).stdout
except Exception: log=''
last=max([p(x) for x in re.findall(r'stamp v([\d.]+)',log)]+[(0,0,0)])
cur=max(sw,vj,last)
new=base if base[:2]>cur[:2] else (cur[0],cur[1],cur[2]+1)
print('%d.%d.%d'%new)
PY
)
sed -i "s|^window.KDN_VERSION=.*|window.KDN_VERSION={version:'$V',commit:'${SHA:0:7}',date:'$DATE'};|" assets/version.js
sed -i "s|^const CACHE=PREFIX+'v[0-9.]*';|const CACHE=PREFIX+'v$V';|" sw.js
for f in *.html; do sed -i -E "s|(id=\"app-update-status\"[^>]*>[^<]*)v[0-9]+\.[0-9]+\.[0-9]+|\1v$V|" "$f"; done
echo "$V"
