from pathlib import Path
import re
import unittest
from test_creator import Page
ROOT = Path(__file__).resolve().parents[1]

class DualityTests(unittest.TestCase):
    def test_new_entry_matches_opening_and_bypasses_the_old_route(self):
        self.assertEqual((ROOT/'enter.html').read_bytes(), (ROOT/'index.html').read_bytes())
        self.assertIn('assets/app-update.js', (ROOT/'enter.html').read_text())

    def test_all_controller_targets_and_local_links_exist(self):
        markup = (ROOT/'index.html').read_text()
        page = Page(markup)
        script = (ROOT/'assets/duality.js').read_text()
        self.assertEqual(len(page.ids), len(set(page.ids)))
        self.assertTrue(set(re.findall(r"\$\('([^']+)'\)", script)).issubset(page.ids))
        self.assertTrue(set(page.labels).issubset(page.ids))
        for link in page.links:
            if link.startswith('./'):
                self.assertTrue((ROOT/link).is_file(), link)
        self.assertIn('<noscript>', markup)
        self.assertNotRegex(markup, r'href="https?://(?:not)?4you.world')

    def test_reflections_never_write_drafts_or_send_responses(self):
        script = (ROOT/'assets/duality.js').read_text()
        for marker in ['fetch(', 'localStorage', 'sessionStorage', 'sendBeacon', 'XMLHttpRequest', 'innerHTML', '.setItem(']:
            self.assertNotIn(marker, script)
        self.assertIn("'pagehide'", script)
        self.assertIn('prefers-reduced-motion', script)
        self.assertIn('visibilitychange', script)

    def test_control_room_preserves_previous_tools(self):
        studio = (ROOT/'studio.html').read_text()
        for marker in ['id="issues"','id="refresh"','id="install"','creator.html','poster.html','gyan.html','community.html','loadIssues()']:
            self.assertIn(marker, studio)
        for name in ['creator.html','community.html']:
            self.assertIn('href="./studio.html" data-i18n="home"', (ROOT/name).read_text())

if __name__ == '__main__':
    unittest.main()
