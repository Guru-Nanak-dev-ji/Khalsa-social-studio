#!/usr/bin/env python3
"""Fail if any internal href/src in *.html (or any pages.json href) points to a missing file."""
import glob,os,re,json,sys
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))));bad=[]
for f in glob.glob('*.html'):
    for u in re.findall(r'(?:href|src)="([^"]+)"',open(f,encoding='utf-8').read()):
        if re.match(r'^(https?:|mailto:|tel:|#|data:|javascript:|blob:|//)',u) or '${' in u:continue
        p=u.split('#')[0].split('?')[0]
        if p and not os.path.exists(os.path.normpath(p.lstrip('/'))):bad.append((f,u))
for p in json.load(open('assets/pages.json',encoding='utf-8'))['pages']:
    if not os.path.exists(p['href'].lstrip('./')):bad.append(('pages.json',p['href']))
for b in bad:print('BROKEN',*b)
print(len(bad),'broken links');sys.exit(1 if bad else 0)
