from pathlib import Path
import re
import unittest
from test_creator import Page

ROOT = Path(__file__).resolve().parents[1]

class CommunityMarkupTests(unittest.TestCase):
    def test_targets_links_and_translations_exist(self):
        page = Page((ROOT / 'community.html').read_text())
        script = (ROOT / 'assets/community.js').read_text()
        self.assertEqual(len(page.ids), len(set(page.ids)))
        self.assertTrue(set(page.labels).issubset(page.ids))
        self.assertTrue(set(re.findall(r"\$\('([^']+)'\)", script)).issubset(page.ids))
        for key in page.i18n:
            self.assertRegex(script, rf'\b{key}:\[')
        for link in page.links:
            if link.startswith('./'):
                self.assertTrue((ROOT / link).is_file(), link)
        for marker in ['innerHTML', 'insertAdjacentHTML', 'fetch(', 'XMLHttpRequest']:
            self.assertNotIn(marker, script)

if __name__ == '__main__':
    unittest.main()
