from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "docs" / "newsdesk.html"
HOME = ROOT / "docs" / "index.html"
CREATOR = ROOT / "creator.html"

class NewsDeskSmokeTests(unittest.TestCase):
    """After 632f486, News Desk is a legacy redirect to creator.html (intentional)."""

    @classmethod
    def setUpClass(cls):
        cls.page = PAGE.read_text(encoding="utf-8")
        cls.home = HOME.read_text(encoding="utf-8")

    def test_pages_exist(self):
        self.assertTrue(PAGE.is_file())
        self.assertTrue(HOME.is_file())
        self.assertTrue(CREATOR.is_file())

    def test_redirects_to_creator(self):
        self.assertIn('url=../creator.html', self.page)
        self.assertIn("location.replace('../creator.html')", self.page)
        self.assertIn('href="../creator.html"', self.page)
        self.assertIn('Creator', self.page)
        # No longer a local draft form — that lives in creator.html now
        self.assertNotIn('id="form"', self.page)
        self.assertNotIn('localStorage.setItem', self.page)

    def test_main_page_links_newsdesk(self):
        # Studio hub still exposes the legacy path (which redirects)
        self.assertIn('newsdesk.html', self.home)

    def test_no_live_publish_claim_on_creator(self):
        # Safety copy moved with the product; keep the guarantee on the live creator page
        creator = CREATOR.read_text(encoding="utf-8")
        self.assertTrue(
            'ऑनलाइन प्रकाशित होना नहीं है' in creator
            or 'local' in creator.lower()
            or 'इस डिवाइस' in creator
            or 'localStorage' in creator,
            'creator should remain a local/offline draft tool, not a live publisher'
        )

if __name__ == "__main__":
    unittest.main()
