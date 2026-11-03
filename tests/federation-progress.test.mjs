import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { validateFeed, freshness, ROOMS } from "../federation/feed-contract.mjs";

const baseline = JSON.parse(await readFile(new URL("../federation/status.json", import.meta.url), "utf8"));
const copy = () => structuredClone(baseline);

test("reviewed public snapshot preserves all eleven official identities", () => {
  const candidate = copy();
  const before = JSON.stringify(candidate);
  assert.equal(validateFeed(candidate), candidate);
  assert.deepEqual(candidate.rooms.map(r => [r.id, r.name, r.role]), ROOMS);
  assert.equal(JSON.stringify(candidate), before);
  assert.equal(candidate.rooms.filter(r => r.acked === "ACKED").length, 1);
});

test("unknown fields cannot carry private data through any nested record", () => {
  const mutations = [
    feed => { feed.privateReport = "hidden"; },
    feed => { feed.rooms[0].rawConversation = "hidden"; },
    feed => { feed.rooms[0].evidence.accountId = "hidden"; },
    feed => { feed.rooms[4].testEvidence.rawOutput = "hidden"; }
  ];
  for (const mutate of mutations) {
    const candidate = copy(); mutate(candidate);
    assert.throws(() => validateFeed(candidate), /unknown or missing field/);
  }
});

test("free text rejects private URLs, contact addresses, credentials, UUIDs and markup", () => {
  const forbidden = [
    "https://docs.google.com/document/d/private",
    "https://example.org/arbitrary",
    "someone@example.org",
    "api_key=secret",
    "Bearer: secret",
    "11111111-2222-4333-8444-555555555555",
    "1examplePrivateDocumentIdentifierForTestingOnly",
    "<img src=x onerror=alert(1)>"
  ];
  for (const text of forbidden) {
    const candidate = copy(); candidate.rooms[0].summary = text;
    assert.throws(() => validateFeed(candidate), /unsafe or invalid public text/);
  }
});

test("duplicate or renamed room identities fail closed", () => {
  const duplicate = copy(); duplicate.rooms[1] = structuredClone(duplicate.rooms[0]);
  assert.throws(() => validateFeed(duplicate), /duplicate identity/);
  const renamed = copy(); renamed.rooms[0].name = "New room";
  assert.throws(() => validateFeed(renamed), /changed or duplicate identity/);
});

test("a posted or reviewed report is not enough to claim an author ACK", () => {
  const candidate = copy(); candidate.rooms[6].acked = "ACKED";
  assert.throws(() => validateFeed(candidate), /actual author ACK/);
  const unknown = copy(); unknown.rooms[1].received = "RECEIVED";
  assert.throws(() => validateFeed(unknown), /unknown evidence cannot imply/);
});

test("the old eight-case mock result cannot become an H1 test or release PASS", () => {
  const reassigned = copy(); reassigned.rooms[8].tested = "MOCK_PASS";
  assert.throws(() => validateFeed(reassigned), /reviewed GPT-05 receipt/);
  const count = copy(); count.rooms[4].testEvidence.passed = 18;
  assert.throws(() => validateFeed(count), /reviewed eight-case local mock/);
  const deployment = copy(); deployment.rooms[9].deployed = "DEPLOYED";
  assert.throws(() => validateFeed(deployment), /invalid state/);
});

test("direct updater objects cannot hide private fields on a custom prototype", () => {
  const candidate = copy();
  Object.setPrototypeOf(candidate.rooms[0].evidence, { rawPrivateBody: "synthetic rejected fixture" });
  assert.throws(() => validateFeed(candidate), /custom prototype rejected/);
});

test("public release needs an exact target, commit and separate verification timestamp", () => {
  const candidate = copy(); candidate.publication = "DEPLOYED";
  assert.throws(() => validateFeed(candidate), /releaseReceipt/);
  candidate.releaseReceipt = { publicUrl: "https://not4you.world/federation/", sourceCommit: "a".repeat(40), verifiedAt: "2026-11-03T17:00:00Z" };
  assert.equal(validateFeed(candidate), candidate);
  candidate.releaseReceipt.publicUrl = "https://docs.google.com/document/d/private";
  assert.throws(() => validateFeed(candidate), /exact public target/);
});

test("refreshing an old snapshot does not make its observation time fresh", () => {
  const candidate = copy();
  const original = candidate.observedAt;
  const later = Date.parse(original) + 2 * 86400000;
  validateFeed(candidate);
  assert.equal(freshness(candidate.observedAt, later).state, "STALE");
  assert.equal(candidate.observedAt, original);
  assert.equal(freshness(candidate.observedAt, Date.parse(original) - 600000).state, "UNKNOWN");
});

test("invalid timestamp and arbitrary domain injection are rejected", () => {
  const time = copy(); time.observedAt = "2026-02-31T16:16:56Z";
  assert.throws(() => validateFeed(time), /invalid UTC timestamp/);
  const domain = copy(); domain.domains[0] = "attacker.invalid";
  assert.throws(() => validateFeed(domain), /exact registered set/);
});
