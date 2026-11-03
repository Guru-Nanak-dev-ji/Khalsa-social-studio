import { validateFeed, freshness } from "./feed-contract.mjs";

const $ = (selector) => document.querySelector(selector);
let snapshot = null;
let activeFilter = "all";
let busy = false;
const formatter = new Intl.DateTimeFormat("hi-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Toronto" });
const dateLabel = value => `${formatter.format(new Date(value))} · Toronto`;
const stageLabels = { COORDINATION: "समन्वय", DESIGN: "Design / review", MOCK_REVIEW: "स्थानीय mock review", NOT_RECHECKED: "नई जाँच बाकी" };
const stateLabels = { POSTED: "दर्ज", RECEIVED: "पढ़ा गया", ACKED: "स्वयं स्वीकार", MOCK_PASS: "8 mock PASS", NOT_RUN: "नहीं चला", NOT_IMPLEMENTED: "लागू नहीं", UNKNOWN: "अज्ञात" };

function element(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = value;
  return node;
}

function renderRoom(room) {
  const card = element("article", "room-card");
  card.id = `status-${room.id.toLowerCase()}`;
  const top = element("div", "room-top");
  top.append(element("span", "room-id", room.id), element("span", `pill ${room.stage === "NOT_RECHECKED" ? "neutral" : "amber"}`, stageLabels[room.stage]));
  const title = element("h3", null, room.name);
  card.setAttribute("aria-labelledby", `${card.id}-title`);
  title.id = `${card.id}-title`;
  card.append(top, title, element("p", "room-role", room.role), element("p", "room-summary", room.summary));
  const statuses = element("dl", "room-statuses");
  for (const key of ["posted", "received", "acked", "tested", "deployed"]) {
    const value = room[key];
    const row = element("div");
    const css = ["POSTED", "RECEIVED", "ACKED", "MOCK_PASS"].includes(value) ? "status-yes" : value === "UNKNOWN" ? "status-unknown" : "status-pending";
    row.append(element("dt", null, key.toUpperCase()), element("dd", css, stateLabels[value]));
    statuses.append(row);
  }
  card.append(statuses, element("p", "room-source", `${room.evidence.sourceLabel} · ${room.evidence.scope}`));
  return card;
}

function render() {
  if (!snapshot) return;
  const visible = snapshot.rooms.filter(room => activeFilter === "all" || (activeFilter === "received" && room.received === "RECEIVED") || (activeFilter === "acked" && room.acked === "ACKED") || (activeFilter === "unknown" && room.stage === "NOT_RECHECKED"));
  $("#room-grid").replaceChildren(...visible.map(renderRoom));
  $("#result-count").textContent = `${visible.length} / 11 rooms · snapshot ${snapshot.revision}`;
  $("#observed-at").textContent = dateLabel(snapshot.observedAt);
  $("#publication").textContent = snapshot.publication === "DEPLOYED" ? "प्रकाशित receipt दर्ज" : "Release receipt की पुष्टि बाकी";
  const age = freshness(snapshot.observedAt);
  $("#freshness").textContent = age.label;
  $("#freshness").className = `pill ${age.state === "DATED" ? "neutral" : "amber"}`;
  $("#domain-list").replaceChildren(...snapshot.domains.map(domain => {
    const li = element("li");
    const a = element("a", null, domain);
    a.href = `https://${domain}/`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("aria-label", `${domain} · registry-listed domain, नई window`);
    a.append(element("span", null, "↗"));
    li.append(a);
    return li;
  }));
}

async function refresh() {
  if (busy) return;
  busy = true;
  $("#refresh").disabled = true;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch("./status.json", { cache: "no-store", credentials: "omit", signal: controller.signal });
    if (!response.ok) throw new Error("feed response unavailable");
    const raw = await response.text();
    if (raw.length > 40000) throw new Error("feed too large");
    const next = validateFeed(JSON.parse(raw));
    snapshot = next;
    render();
    $("#checked-at").textContent = dateLabel(new Date().toISOString());
    $("#feed-message").className = "feed-message";
    $("#feed-message").textContent = "सार्वजनिक feed पढ़ी गई। नीचे की स्थितियाँ दर्ज प्रमाण के समय की हैं; यह live room attendance नहीं है।";
  } catch {
    $("#feed-message").className = "feed-message error";
    $("#feed-message").textContent = snapshot ? "नई feed उपलब्ध या मान्य नहीं है। पिछला समय सहित snapshot दिख रहा है; नई गतिविधि की पुष्टि नहीं हुई।" : "Public feed अभी उपलब्ध या मान्य नहीं है। Rooms की स्थिति अज्ञात है; दोबारा कोशिश करें।";
    if (snapshot) render();
  } finally {
    clearTimeout(timeout);
    busy = false;
    $("#refresh").disabled = false;
  }
}

$("#refresh").addEventListener("click", refresh);
document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter").forEach(item => {
    const selected = item === button;
    item.classList.toggle("active", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  render();
}));
setInterval(() => { if (document.visibilityState === "visible") refresh(); }, 60000);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") refresh(); });
refresh();
