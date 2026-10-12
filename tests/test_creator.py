from html.parser import HTMLParser
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids, self.labels, self.links, self.i18n = [], [], [], []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.append(a['id'])
        if tag == 'label':
            self.labels.append(a.get('for'))
        if tag in ('a', 'link', 'script', 'img'):
            self.links.append(a.get('href') or a.get('src', ''))
        if 'data-i18n' in a:
            self.i18n.append(a['data-i18n'])

class CreatorMarkupTests(unittest.TestCase):
    def test_links_labels_and_controller_targets(self):
        page = Page((ROOT / 'creator.html').read_text())
        script = (ROOT / 'assets/creator.js').read_text()
        self.assertEqual(len(page.ids), len(set(page.ids)))
        self.assertTrue(set(page.labels).issubset(set(page.ids)))
        self.assertTrue(set(re.findall(r"\$\('([^']+)'\)", script)).issubset(set(page.ids)))
        for link in page.links:
            if link.startswith('./'):
                self.assertTrue((ROOT / link).is_file(), link)
        for key in page.i18n:
            self.assertRegex(script, rf'\b{key}:\[')

    def test_input_is_rendered_as_text_and_preview_links_are_validated(self):
        script = (ROOT / 'assets/creator.js').read_text()
        self.assertNotIn('innerHTML', script)
        self.assertNotIn('insertAdjacentHTML', script)
        self.assertIn('C.safeUrl(d.source)', script)
        self.assertIn("setCustomValidity", script)

    def test_root_and_previous_tools_link_creator(self):
        for name in ['index.html', 'docs/index.html', 'docs/newsdesk.html', 'docs/post-studio.html']:
            self.assertIn('creator.html', (ROOT / name).read_text())

if __name__ == '__main__':
    unittest.main()
