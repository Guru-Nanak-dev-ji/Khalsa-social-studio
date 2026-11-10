import unittest

from v41_continuity import (
    DEFAULT_DAG, MYWORLD_MODULES, Predecessor, SuccessorCandidate,
    assert_public_ai_record_safe, continuity_snapshot, evaluate_successor,
    myvote_is_government_election, public_ai_record, ready_tasks, validate_dag,
)

PRED = Predecessor(
    room_id="S1-GPT05",
    role="Brihaspati / Critical Path",
    report_url="https://docs.google.com/document/d/1EaLoMJPovNTKkS37hW0Cnu0dYT-Cz9-cbqPzZdZSSko/edit",
    next_task="V27-G05-N07-CANONICAL-OWNER-ADOPTION-AND-REAL-HANDOFF-ADMISSION",
    substantive_units=6,
    strict_loops_verified=0,
)


def cand(**kw):
    base = dict(
        room_id="S2-05",
        role="Lakshmi / Evidence Custody",
        report_url="https://docs.google.com/document/d/18J1eiz0sopBw6l_kq8TrG4cXg9vz_rOvRluIUM5mxhs/edit",
        identity_verified=True,
        current_task_state="BLOCKED",
        attributable_ack=False,
    )
    base.update(kw)
    return SuccessorCandidate(**base)


class ContinuityTests(unittest.TestCase):
    def test_default_dag_valid(self):
        validate_dag(DEFAULT_DAG)

    def test_cycle_rejected(self):
        with self.assertRaises(ValueError):
            validate_dag({"A": ["B"], "B": ["A"]})

    def test_unknown_dependency_rejected(self):
        with self.assertRaises(ValueError):
            validate_dag({"A": ["B"]})

    def test_duplicate_dependency_rejected(self):
        with self.assertRaises(ValueError):
            validate_dag({"A": [], "B": ["A", "A"]})

    def test_no_ack_blocks_cutover(self):
        self.assertEqual(evaluate_successor(PRED, cand())["status"], "PENDING")

    def test_verified_ack_allows_handover(self):
        self.assertEqual(evaluate_successor(PRED, cand(attributable_ack=True))["status"], "READY_FOR_HANDOVER")

    def test_wrong_seat_rejected(self):
        self.assertEqual(evaluate_successor(PRED, cand(room_id="S1-02"))["status"], "REJECT")

    def test_unverified_identity_blocks(self):
        self.assertEqual(evaluate_successor(PRED, cand(identity_verified=False))["status"], "PENDING")

    def test_running_candidate_blocks(self):
        self.assertEqual(evaluate_successor(PRED, cand(current_task_state="RUNNING", attributable_ack=True))["status"], "PENDING")

    def test_bad_state_rejected(self):
        self.assertEqual(evaluate_successor(PRED, cand(current_task_state="MAYBE"))["status"], "REJECT")

    def test_counts_not_merged(self):
        snap = continuity_snapshot(PRED, cand())
        self.assertEqual(snap["predecessor"]["substantive_units"], 6)
        self.assertEqual(snap["predecessor"]["strict_loops_verified"], 0)
        self.assertIn("remain separate", snap["count_policy"])

    def test_runtime_authority_false(self):
        self.assertFalse(continuity_snapshot(PRED, cand(attributable_ack=True))["runtime_authority"])

    def test_root_ready_tasks(self):
        roots = ready_tasks(DEFAULT_DAG, [])
        self.assertIn("WorkspaceV4", roots)
        self.assertIn("MyLakePermission", roots)

    def test_unverified_prereq_does_not_unlock(self):
        ready = ready_tasks(DEFAULT_DAG, ["WorkspaceV4"])
        self.assertNotIn("MyVote", ready)

    def test_vote_unlocks_only_after_guards(self):
        verified = {
            "WorkspaceV4", "I18N_HI_PA_EN", "AccessibilityGate", "PrivacyGate", "SecurityGate",
            "IdentityVerification", "DuplicateVoteGuard", "ModerationAppeals", "PublicAudit", "MyAssembly"
        }
        self.assertIn("MyVote", ready_tasks(DEFAULT_DAG, verified))

    def test_mylake_requires_permission_environment_cost(self):
        verified = {"WorkspaceV4", "MyLakePermission", "MyLakeEnvironmentalSafety"}
        self.assertNotIn("MyLake", ready_tasks(DEFAULT_DAG, verified))
        verified.add("MyLakeCostPlan")
        self.assertIn("MyLake", ready_tasks(DEFAULT_DAG, verified))

    def test_all_named_myworld_modules_covered(self):
        self.assertTrue(set(MYWORLD_MODULES).issubset(DEFAULT_DAG.keys()))

    def test_public_ai_record_redacts_unknown_sensitive_fields(self):
        src = {
            "public_ai_id": "KIDO-AI-S1-03",
            "model": "provider-neutral",
            "capabilities": ["research"],
            "version": "v1",
            "owner_operator": "KDN",
            "permission_scope": "public-read",
            "safety_status": "reviewed",
            "activity_receipt_url": "https://example.invalid/receipt",
            "token": "DO_NOT_EXPOSE",
        }
        out = public_ai_record(src)
        self.assertNotIn("token", out)
        self.assertEqual(out["public_ai_id"], "KIDO-AI-S1-03")

    def test_public_ai_record_rejects_sensitive_schema(self):
        with self.assertRaises(ValueError):
            assert_public_ai_record_safe({"public_ai_id": "A", "api_key": "x"})

    def test_public_ai_id_required(self):
        with self.assertRaises(ValueError):
            assert_public_ai_record_safe({"model": "x"})

    def test_myvote_is_not_government_election(self):
        self.assertFalse(myvote_is_government_election())

    def test_ready_order_deterministic(self):
        self.assertEqual(ready_tasks(DEFAULT_DAG, []), sorted(ready_tasks(DEFAULT_DAG, [])))


if __name__ == "__main__":
    unittest.main(verbosity=2)
