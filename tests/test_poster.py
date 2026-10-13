from pathlib import Path
import re
import unittest
from test_creator import Page

ROOT = Path(__file__).resolve().parents[1]

class PosterTests(unittest.TestCase):
    def test_page_labels_targets_and_translations(self):
        page = Page((ROOT / 'poster.html').read_text())
        script = (ROOT / 'assets/poster.js').read_text()
        self.assertEqual(len(page.ids), len(set(page.ids)))
        self.assertTrue(set(page.labels).issubset(page.ids))
        self.assertTrue(set(re.findall(r"\$\('([^']+)'\)", script)).issubset(page.ids))
        for key in page.i18n:
            self.assertRegex(script, rf'\b{key}:\[')
        for link in page.links:
            if link.startswith('./'):
                self.assertTrue((ROOT / link).is_file(), link)

    def test_every_screen_has_a_mehrab_style_and_real_stylesheet(self):
        pages = list(ROOT.glob('*.html')) + list((ROOT / 'docs').glob('*.html'))
        self.assertEqual(len(pages), 18)
        for path in pages:
            text = path.read_text()
            self.assertIn('data-heritage=', text, path.name)
            self.assertIn('aria-hidden="true"', text, path.name)
            self.assertIn('assets/heritage.css', text, path.name)
            self.assertEqual(text.count('class="heritage-banner"'), 1)

    def test_no_poster_upload_or_draft_writes(self):
        script = (ROOT / 'assets/poster.js').read_text()
        for marker in ['fetch(', 'XMLHttpRequest', '.setItem(', '.save(', '.commit(', 'innerHTML', 'insertAdjacentHTML']:
            self.assertNotIn(marker, script)
        self.assertIn('navigator.canShare', script)
        self.assertIn('beforeunload', script)

if __name__ == '__main__':
    unittest.main()
