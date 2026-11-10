import json
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
DATA = json.loads((HERE / "v41_myworld_contracts.json").read_text(encoding="utf-8"))
EXPECTED = {"MyWorld", "MyTube", "MyBook", "MyInsta", "MyCity", "MyDistrict", "MyTehsil", "MyCourt", "MyLake", "MySeva", "MyAI", "MyAssembly", "MyVote", "MyPoints"}

class MyWorldContractTests(unittest.TestCase):
    def test_schema_and_mode(self):
        self.assertEqual(DATA["schema_version"], "v41.1")
        self.assertEqual(DATA["mode"], "DESIGN_CONTRACT_NO_LIVE_AUTHORITY")

    def test_exact_module_set(self):
        self.assertEqual(set(DATA["modules"]), EXPECTED)

    def test_shared_languages(self):
        self.assertEqual(DATA["shared_requirements"]["languages"], ["en", "hi", "pa"])

    def test_mobile_first(self):
        self.assertTrue(DATA["shared_requirements"]["mobile_first"])

    def test_accessibility_baseline(self):
        required = {"keyboard", "focus_visible", "screen_reader_labels", "semantic_landmarks"}
        self.assertTrue(required.issubset(DATA["shared_requirements"]["accessibility"]))

    def test_every_route_is_unique_and_relative(self):
        routes = [m["route"] for m in DATA["modules"].values()]
        self.assertEqual(len(routes), len(set(routes)))
        self.assertTrue(all(r.startswith("/") and "://" not in r for r in routes))

    def test_each_module_declares_dependencies(self):
        self.assertTrue(all(isinstance(m["dependencies"], list) and m["dependencies"] for m in DATA["modules"].values()))

    def test_vote_is_explicitly_non_governmental(self):
        vote = DATA["modules"]["MyVote"]
        self.assertTrue(vote["non_governmental"])
        self.assertEqual(vote["kind"], "non_government_civic_vote")

    def test_vote_separates_ai_and_human(self):
        self.assertTrue(DATA["modules"]["MyVote"]["human_votes_separate_from_ai_opinion"])

    def test_vote_safety_gates(self):
        vote = DATA["modules"]["MyVote"]
        for gate in ["IdentityVerification", "DuplicateVoteGuard", "PrivacyGate", "ModerationAppeals", "PublicAudit"]:
            self.assertIn(gate, vote["dependencies"])
        self.assertTrue(vote["duplicate_vote_prevention"])
        self.assertTrue(vote["appeals_required"])
        self.assertTrue(vote["public_audit_required"])

    def test_ai_registry_required_fields(self):
        req = set(DATA["public_ai_registry"]["required_public_fields"])
        self.assertTrue({"public_ai_id", "model", "capabilities", "version", "owner_operator", "permission_scope", "safety_status", "activity_receipt_url"}.issubset(req))

    def test_ai_registry_forbids_credentials(self):
        forbidden = set(DATA["public_ai_registry"]["forbidden_public_fields"])
        self.assertTrue({"password", "token", "secret", "api_key", "credential", "private_key"}.issubset(forbidden))

    def test_provider_neutral_and_local_first(self):
        reg = DATA["public_ai_registry"]
        self.assertTrue(reg["provider_neutral"])
        self.assertTrue(reg["local_first_option_required"])

    def test_mylake_bathinda_pilot_gates(self):
        lake = DATA["modules"]["MyLake"]
        self.assertEqual(lake["pilot"], "Bathinda")
        self.assertTrue(lake["requires_local_permission"])
        self.assertTrue(lake["requires_environmental_review"])
        self.assertTrue(lake["requires_cost_plan"])
        for gate in ["MyLakePermission", "MyLakeEnvironmentalSafety", "MyLakeCostPlan"]:
            self.assertIn(gate, lake["dependencies"])

    def test_mycourt_is_information_only(self):
        self.assertEqual(DATA["modules"]["MyCourt"]["kind"], "legal_information_not_legal_representation")

    def test_mypoints_has_no_cash_value(self):
        self.assertFalse(DATA["modules"]["MyPoints"]["cash_value"])

    def test_assembly_has_moderation_appeal_audit(self):
        features = set(DATA["modules"]["MyAssembly"]["features"])
        self.assertTrue({"proposal", "discussion", "amendment", "moderation", "appeal", "public_audit"}.issubset(features))

if __name__ == "__main__":
    unittest.main(verbosity=2)
