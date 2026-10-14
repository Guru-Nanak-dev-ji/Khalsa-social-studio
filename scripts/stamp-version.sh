#!/usr/bin/env bash
# Stamp version/commit/date into assets/version.js, sw.js cache name and static labels.
set -euo pipefail
BASE=$(tr -d ' \n' < VERSION); N=${1:?build number}; SHA=${2:?sha}; DATE=$(date -u +%Y-%m-%d)
V="$BASE.$N"
sed -i "s|^window.KDN_VERSION=.*|window.KDN_VERSION={version:'$V',commit:'${SHA:0:7}',date:'$DATE'};|" assets/version.js
sed -i "s|^const CACHE=PREFIX+'v[0-9.]*';|const CACHE=PREFIX+'v$V';|" sw.js
for f in *.html; do sed -i -E "s|(id=\"app-update-status\"[^>]*>[^<]*)v[0-9]+\.[0-9]+\.[0-9]+|\1v$V|" "$f"; done
echo "$V"
