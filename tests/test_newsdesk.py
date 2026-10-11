from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "docs" / "newsdesk.html"
HOME = ROOT / "docs" / "index.html"

class NewsDeskSmokeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.page = PAGE.read_text(encoding="utf-8")
        cls.home = HOME.read_text(encoding="utf-8")

    def test_pages_exist(self):
        self.assertTrue(PAGE.is_file())
        self.assertTrue(HOME.is_file())

    def test_form_and_storage_present(self):
        for marker in ('id="form"', 'id="title"', 'id="body"', 'id="stories"', 'localStorage.setItem', 'localStorage.getItem'):
            with self.subTest(marker=marker):
                self.assertIn(marker, self.page)

    def test_review_flow_present(self):
        for marker in ("Submit for review", "In Review", "Approve locally", "Return to draft", "Approved"):
            with self.subTest(marker=marker):
                self.assertIn(marker, self.page)

    def test_backup_present(self):
        self.assertIn('id="backup"', self.page)
        self.assertIn('kdn-newsdesk-backup.json', self.page)

    def test_main_page_links_newsdesk(self):
        self.assertIn('newsdesk.html', self.home)

    def test_no_live_publish_claim(self):
        self.assertIn('ऑनलाइन प्रकाशित होना नहीं है', self.page)

if __name__ == "__main__":
    unittest.main()
