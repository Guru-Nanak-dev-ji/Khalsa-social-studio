#!/usr/bin/env python3
"""Keep assets/pages.json in sync with every *.html in the repo root.
- adds new pages (name from <title>, sub from meta description), drops entries whose file is gone
- assigns a Hindi 'topic' (गुरु, इतिहास, स्वाद ...) to every page for the सारे द्वार index
Hand-edited fields (icon, name, sub, cat) of existing entries are kept.
Usage: python3 scripts/build-pages.py [--check]   (--check: exit 1 if the file would change)"""
import json,glob,os,re,sys,html
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));os.chdir(ROOT)
SKIP={'404.html','Begampura_FAQ_542_Offline_Reader.html'} & set()  # nothing skipped today
RULES=[(r'^guru',"गुरु"),(r'^itihas',"इतिहास"),(r'^bhagat',"भगत"),(r'^(takht|panj-takht)',"तख़्त"),(r'^swad',"स्वाद"),
 (r'^kirat',"किरत"),(r'^neta',"शासन"),(r'^sehat',"सेहत"),(r'^kshetra|^naksha',"नक्शा"),
 (r'^(news|newsroom|goldtv|aaj-bhav|reels|promo)',"समाचार"),(r'^(kyon|audiobook|kahani|funnybook|granth|sakhi|virsa|Begampura)',"किताब"),
 (r'^(index|enter|world|kingdom|khalsa|palace|maze|dwar|mandal|sab|scroll-dwar|takht3d)$',"नगर")]
CATTOPIC={'g':"खेल",'n':"समाचार",'k':"किताब",'m':"संगीत",'c':"कॉमेडी",'s':"सेवा",'j':"ज्ञान",'t':"साधन"}
def topic(p):
    for rx,t in RULES:
        if re.search(rx,p['id']):return t
    return CATTOPIC.get(p.get('cat'),"अन्य")
def meta(f):
    s=open(f,encoding='utf-8').read(20000)
    t=re.search(r'<title>(.*?)</title>',s,re.S);d=re.search(r'<meta name="description" content="([^"]*)"',s)
    name=html.unescape(t[1]).split('·')[0].split('|')[0].strip() if t else f[:-5]
    return name,(html.unescape(d[1])[:60] if d else 'नया द्वार')
def main():
    path='assets/pages.json';old=open(path,encoding='utf-8').read();d=json.loads(old)
    files=sorted(os.path.basename(f) for f in glob.glob('*.html') if os.path.basename(f) not in SKIP)
    have={p['href'].lstrip('./'):p for p in d['pages']}
    d['pages']=[p for p in d['pages'] if p['href'].lstrip('./') in files]
    for f in files:
        if f in have:continue
        name,sub=meta(f);d['pages'].append({'id':f[:-5],'icon':'🚪','name':name,'sub':sub,'cat':'t','href':'./'+f,'group':'auto','status':'published'})
    for p in d['pages']:p['topic']=topic(p)
    new=json.dumps(d,ensure_ascii=False,indent=0)+'\n'
    if '--check' in sys.argv:
        if new!=old:print('pages.json is stale: run python3 scripts/build-pages.py');sys.exit(1)
        print('pages.json ok:',len(d['pages']),'pages');return
    open(path,'w',encoding='utf-8').write(new);print(len(d['pages']),'pages')
main()
