from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Iterable, List, Mapping, Sequence, Set

ALLOWED_STATUS = {"PROPOSED", "READY", "CLAIMED", "RUNNING", "BLOCKED", "VERIFIED", "DONE"}
BLOCKING_SUCCESSOR_STATES = {"CLAIMED", "RUNNING"}

MYWORLD_MODULES = (
    "MyWorld", "MyTube", "MyBook", "MyInsta", "MyCity", "MyDistrict",
    "MyTehsil", "MyCourt", "MyLake", "MySeva", "MyAI", "MyAssembly",
    "MyVote", "MyPoints",
)

DEFAULT_DAG: Dict[str, List[str]] = {
    "WorkspaceV4": [],
    "I18N_HI_PA_EN": ["WorkspaceV4"],
    "AccessibilityGate": ["WorkspaceV4"],
    "PrivacyGate": ["WorkspaceV4"],
    "SecurityGate": ["WorkspaceV4"],
    "AIRegistry": ["WorkspaceV4", "PrivacyGate", "SecurityGate"],
    "IdentityVerification": ["PrivacyGate", "SecurityGate"],
    "DuplicateVoteGuard": ["IdentityVerification"],
    "ModerationAppeals": ["PrivacyGate"],
    "PublicAudit": ["SecurityGate"],
    "MyAssembly": ["WorkspaceV4", "I18N_HI_PA_EN", "AccessibilityGate", "PrivacyGate", "ModerationAppeals", "PublicAudit"],
    "MyVote": ["MyAssembly", "IdentityVerification", "DuplicateVoteGuard", "ModerationAppeals", "PublicAudit"],
    "MyAI": ["AIRegistry", "I18N_HI_PA_EN", "AccessibilityGate"],
    "MyLakePermission": [],
    "MyLakeEnvironmentalSafety": [],
    "MyLakeCostPlan": [],
    "MyLake": ["WorkspaceV4", "MyLakePermission", "MyLakeEnvironmentalSafety", "MyLakeCostPlan"],
    "MyWorld": ["WorkspaceV4", "I18N_HI_PA_EN", "AccessibilityGate", "PrivacyGate", "SecurityGate"],
    "MyTube": ["MyWorld", "PrivacyGate"],
    "MyBook": ["MyWorld", "PrivacyGate"],
    "MyInsta": ["MyWorld", "PrivacyGate"],
    "MyCity": ["MyWorld", "PublicAudit"],
    "MyDistrict": ["MyCity"],
    "MyTehsil": ["MyDistrict"],
    "MyCourt": ["MyWorld", "PrivacyGate", "ModerationAppeals"],
    "MySeva": ["MyWorld", "PublicAudit"],
    "MyPoints": ["MyWorld", "PrivacyGate", "PublicAudit"],
}

@dataclass(frozen=True)
class Predecessor:
    room_id: str
    role: str
    report_url: str
    next_task: str
    substantive_units: int
    strict_loops_verified: int

@dataclass(frozen=True)
class SuccessorCandidate:
    room_id: str
    role: str
    report_url: str
    identity_verified: bool
    current_task_state: str
    attributable_ack: bool


def validate_dag(dag: Mapping[str, Sequence[str]]) -> None:
    nodes = set(dag)
    for node, deps in dag.items():
        if len(deps) != len(set(deps)):
            raise ValueError(f"duplicate dependency for {node}")
        missing = set(deps) - nodes
        if missing:
            raise ValueError(f"unknown dependencies for {node}: {sorted(missing)}")

    visiting: Set[str] = set()
    visited: Set[str] = set()

    def visit(node: str) -> None:
        if node in visiting:
            raise ValueError(f"cycle detected at {node}")
        if node in visited:
            return
        visiting.add(node)
        for dep in dag[node]:
            visit(dep)
        visiting.remove(node)
        visited.add(node)

    for node in sorted(nodes):
        visit(node)


def ready_tasks(dag: Mapping[str, Sequence[str]], verified: Iterable[str]) -> List[str]:
    validate_dag(dag)
    verified_set = set(verified)
    return sorted(
        node for node, deps in dag.items()
        if node not in verified_set and all(dep in verified_set for dep in deps)
    )


def evaluate_successor(predecessor: Predecessor, candidate: SuccessorCandidate) -> Dict[str, object]:
    if not candidate.room_id.startswith("S2-"):
        return {"status": "REJECT", "reason": "successor must be a verified Seat 2 room"}
    if not candidate.identity_verified:
        return {"status": "PENDING", "reason": "room identity not verified"}
    if candidate.current_task_state not in ALLOWED_STATUS:
        return {"status": "REJECT", "reason": "invalid current task state"}
    if candidate.current_task_state in BLOCKING_SUCCESSOR_STATES:
        return {"status": "PENDING", "reason": "candidate currently owns active work"}
    if not candidate.attributable_ack:
        return {"status": "PENDING", "reason": "successor ACK not observed"}
    return {
        "status": "READY_FOR_HANDOVER",
        "reason": "identity and attributable ACK verified; cutover still needs task claim",
        "next_task": predecessor.next_task,
    }


def continuity_snapshot(predecessor: Predecessor, candidate: SuccessorCandidate) -> Dict[str, object]:
    decision = evaluate_successor(predecessor, candidate)
    return {
        "schema_version": "v41.1",
        "mode": "DRY_RUN_CONTINUITY",
        "predecessor": {
            "room_id": predecessor.room_id,
            "role": predecessor.role,
            "report_url": predecessor.report_url,
            "next_task": predecessor.next_task,
            "substantive_units": predecessor.substantive_units,
            "strict_loops_verified": predecessor.strict_loops_verified,
        },
        "successor_candidate": {
            "room_id": candidate.room_id,
            "role": candidate.role,
            "report_url": candidate.report_url,
            "identity_verified": candidate.identity_verified,
            "current_task_state": candidate.current_task_state,
            "attributable_ack": candidate.attributable_ack,
        },
        "handover_decision": decision,
        "count_policy": "predecessor and successor counts remain separate",
        "runtime_authority": False,
    }


def public_ai_record(record: Mapping[str, object]) -> Dict[str, object]:
    allowed = {
        "public_ai_id", "model", "capabilities", "version", "owner_operator",
        "permission_scope", "safety_status", "activity_receipt_url"
    }
    return {k: record[k] for k in allowed if k in record}


def assert_public_ai_record_safe(record: Mapping[str, object]) -> None:
    banned = {"password", "token", "secret", "api_key", "credential", "private_key"}
    lowered = {k.lower() for k in record}
    overlap = lowered & banned
    if overlap:
        raise ValueError(f"sensitive public fields: {sorted(overlap)}")
    if not record.get("public_ai_id"):
        raise ValueError("public_ai_id required")


def myvote_is_government_election() -> bool:
    return False
