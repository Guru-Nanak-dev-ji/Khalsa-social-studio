export const ROOMS = Object.freeze([
  ["GPT-01", "इंद्र", "Federation Lead"],
  ["GPT-02", "विश्वकर्मा", "Product Architect"],
  ["GPT-03", "ब्रह्मा", "AI Systems Creator"],
  ["GPT-04", "धर्मराज", "Governance Strategist"],
  ["GPT-05", "बृहस्पति", "Strategic Advisor"],
  ["GPT-06", "नारद", "Research & Recovery"],
  ["GPT-07", "सरस्वती", "Content & Localization"],
  ["GPT-08", "कुबेर", "Economic Strategist"],
  ["GPT-09", "चित्रगुप्त", "QA & Test"],
  ["GPT-10", "मयदानव", "Software Engineering"],
  ["GPT-11", "हनुमान", "Security & Infra"]
]);

export const DOMAINS = Object.freeze([
  "not4you.world", "khalsa.homes", "sikh.website", "khalsa.website",
  "khalsa.buzz", "khalsa.church", "khalsa-legal.world", "khalsa-news.world",
  "khalsa-konnect.shop", "khalsa.lol", "kido-g.net"
]);

const BAD_TEXT = /(?:https?:\/\/|www\.|drive\.google|docs\.google|chatgpt\.com\/|appgprj_|Automation_|libfile_|\b1[A-Za-z0-9_-]{24,}\b|\bsk-[A-Za-z0-9_-]{16,}\b|(?:api[_ -]?key|bearer|password|access[_ -]?token)\s*[:=]|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|<\/?[a-z][^>]*>)/i;

function exactKeys(value, keys, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label}: expected object`);
  if (![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new Error(`${label}: custom prototype rejected`);
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (actual.length !== expected.length || actual.some((key, i) => key !== expected[i])) throw new Error(`${label}: unknown or missing field`);
}

function text(value, max, label) {
  if (typeof value !== "string" || !value.trim() || value.length > max || BAD_TEXT.test(value)) throw new Error(`${label}: unsafe or invalid public text`);
}

function oneOf(value, choices, label) {
  if (!choices.includes(value)) throw new Error(`${label}: invalid state`);
}

function iso(value, label) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().replace(".000Z", "Z") !== value) throw new Error(`${label}: invalid UTC timestamp`);
}

/** Checks public schema and evidence consistency. It cannot authenticate an author's claims. */
export function validateFeed(feed) {
  exactKeys(feed, ["schema", "observedAt", "revision", "publication", "releaseReceipt", "rooms", "domains"], "feed");
  if (feed.schema !== "kdn.public-progress/1") throw new Error("feed: unsupported schema");
  iso(feed.observedAt, "observedAt");
  text(feed.revision, 40, "revision");
  oneOf(feed.publication, ["NOT_DEPLOYED", "DEPLOYED"], "publication");
  if (feed.publication === "DEPLOYED") {
    exactKeys(feed.releaseReceipt, ["publicUrl", "sourceCommit", "verifiedAt"], "releaseReceipt");
    if (feed.releaseReceipt.publicUrl !== "https://not4you.world/federation/" || !/^[0-9a-f]{40}$/.test(feed.releaseReceipt.sourceCommit)) throw new Error("releaseReceipt: exact public target and commit required");
    iso(feed.releaseReceipt.verifiedAt, "release verifiedAt");
  } else if (feed.releaseReceipt !== null) throw new Error("pending publication cannot claim a verified release receipt");
  if (!Array.isArray(feed.domains) || JSON.stringify(feed.domains) !== JSON.stringify(DOMAINS)) throw new Error("domains: exact registered set required");
  if (!Array.isArray(feed.rooms) || feed.rooms.length !== 11) throw new Error("rooms: eleven identities required");
  const seen = new Set();
  for (const room of feed.rooms) {
    exactKeys(room, ["id", "name", "role", "stage", "posted", "received", "acked", "tested", "deployed", "summary", "evidence", "testEvidence"], "room");
    const identity = ROOMS.find(([id]) => id === room.id);
    if (!identity || identity[1] !== room.name || identity[2] !== room.role || seen.has(room.id)) throw new Error("room: unknown, changed or duplicate identity");
    seen.add(room.id);
    oneOf(room.stage, ["COORDINATION", "DESIGN", "MOCK_REVIEW", "NOT_RECHECKED"], room.id);
    oneOf(room.posted, ["POSTED", "UNKNOWN"], "posted");
    oneOf(room.received, ["RECEIVED", "UNKNOWN"], "received");
    oneOf(room.acked, ["ACKED", "UNKNOWN"], "acked");
    oneOf(room.tested, ["MOCK_PASS", "NOT_RUN", "UNKNOWN"], "tested");
    oneOf(room.deployed, ["NOT_IMPLEMENTED", "UNKNOWN"], "deployed");
    text(room.summary, 550, "summary");
    exactKeys(room.evidence, ["sourceLabel", "kind", "observedAt", "scope"], "evidence");
    text(room.evidence.sourceLabel, 110, "sourceLabel");
    text(room.evidence.scope, 200, "scope");
    oneOf(room.evidence.kind, ["COORDINATOR_RECORD", "AUTHOR_ACK", "REVIEW_REPORT", "LOCAL_TEST_RECEIPT", "NOT_RECHECKED"], "evidence kind");
    if (room.evidence.kind === "NOT_RECHECKED") {
      if (room.evidence.observedAt !== null || room.stage !== "NOT_RECHECKED" || [room.posted, room.received, room.acked, room.tested, room.deployed].some(v => v !== "UNKNOWN")) throw new Error("unknown evidence cannot imply received, ACK, test or release");
    } else {
      iso(room.evidence.observedAt, "evidence observedAt");
      if (Date.parse(room.evidence.observedAt) > Date.parse(feed.observedAt)) throw new Error("room evidence cannot be newer than snapshot");
      if (room.posted !== "POSTED" || room.received !== "RECEIVED") throw new Error("reviewed evidence requires posted and received");
    }
    if (room.acked === "ACKED" && (room.evidence.kind !== "AUTHOR_ACK" || room.received !== "RECEIVED")) throw new Error("ACK requires an actual author ACK receipt");
    if (room.evidence.kind === "AUTHOR_ACK" && room.acked !== "ACKED") throw new Error("author ACK receipt must be labelled ACKED");
    if (room.tested === "MOCK_PASS") {
      if (room.id !== "GPT-05") throw new Error("mock result belongs to the reviewed GPT-05 receipt");
      if (room.evidence.kind !== "LOCAL_TEST_RECEIPT" || room.stage !== "MOCK_REVIEW") throw new Error("mock result requires the exact mock receipt scope");
      exactKeys(room.testEvidence, ["suite", "passed", "failed", "scope"], "testEvidence");
      if (room.testEvidence.suite !== "SEPARATE_FOUR_FILE_MOCK" || room.testEvidence.passed !== 8 || room.testEvidence.failed !== 0 || room.testEvidence.scope !== "LOCAL_PURE_FUNCTIONS") throw new Error("test receipt is not the reviewed eight-case local mock");
    } else if (room.testEvidence !== null) throw new Error("unrun tests cannot have a PASS receipt");
    if (room.evidence.kind === "LOCAL_TEST_RECEIPT" && room.tested !== "MOCK_PASS") throw new Error("local test receipt requires explicit mock scope");
  }
  return feed;
}

export function freshness(observedAt, now = Date.now()) {
  iso(observedAt, "observedAt");
  const elapsed = now - Date.parse(observedAt);
  if (!Number.isFinite(elapsed) || elapsed < -300000) return { state: "UNKNOWN", label: "समय की जाँच बाकी" };
  if (elapsed > 86400000) return { state: "STALE", label: "24 घंटे से पुराना snapshot" };
  return { state: "DATED", label: "समय सहित snapshot" };
}
