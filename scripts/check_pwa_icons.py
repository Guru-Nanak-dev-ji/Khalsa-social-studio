"""Check committed artwork without generating or overwriting any icons."""
import hashlib
import json
import struct
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]

def check():
    manifest = json.loads((ROOT / 'manifest.webmanifest').read_text())
    assert manifest['id'] == './'
    assert manifest['start_url'] == './' and manifest['scope'] == './'
    assert manifest['name'] == 'KDN Social Studio'
    assert manifest['short_name'] == 'KDN Studio'
    assert manifest['display'] == 'standalone'
    expected = {'any': {'192x192', '512x512'}, 'maskable': {'512x512'}}
    actual = {}
    for icon in manifest['icons']:
        assert icon['type'] == 'image/png'
        assert icon['src'].startswith('./icons/khalsa-v1-')
        path = (ROOT / urlsplit(icon['src']).path).resolve()
        assert path.is_relative_to(ROOT)
        png = path.read_bytes()
        assert png[:8] == b'\x89PNG\r\n\x1a\n'
        width, height = struct.unpack('>II', png[16:24])
        assert f'{width}x{height}' == icon['sizes']
        actual.setdefault(icon['purpose'], set()).add(icon['sizes'])
    assert actual == expected
    for size, old in [('192', 'icon-192.png'), ('512', 'icon-512.png'), ('maskable-512', 'icon-maskable-512.png')]:
        assert (ROOT / old).read_bytes() == (ROOT / f'icons/khalsa-v1-{size}.png').read_bytes()
    for name, digest in json.loads((ROOT / 'assets/branding/icon-sha256.json').read_text()).items():
        assert hashlib.sha256((ROOT / name).read_bytes()).hexdigest() == digest, name
    print('PASS: KHALSA icon dimensions, identity, aliases and artwork hashes')

if __name__ == '__main__':
    check()
