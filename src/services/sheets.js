import { APPS_SCRIPT_URL } from "../config.js";

/**
 * Maps a flat row object (from Google Sheets) into our event schema.
 *
 * Expected sheet columns (one row per event):
 *   id, name, region, coord, stage, budget, curBudget, actual,
 *   pDate, eDate, priority, surplus, surplusStatus
 *
 * Related data lives in sibling sheets joined by eventId:
 *   Comments  : eventId, by, role, at, t
 *   Audit     : eventId, action, by, role, at, note, emails (comma-separated)
 *   Disb      : eventId, amt, pct, type, date, ref, by, pending (TRUE/FALSE)
 *   Costs     : eventId, category, proposed, actual
 *   Invoices  : eventId, name, amt, ref, date, docAttached (TRUE/FALSE)
 *   Amendments: eventId, orig, revised, reason, reqBy, reqDate, appBy, appDate, status
 *   Revisions : eventId, version, budget, date, changes, status, newDate
 *   Photos    : eventId, name, emoji
 *
 * The Apps Script assembles these into the JSON structure below.
 * See /apps-script/Code.gs for the full server-side implementation.
 */

function parseNum(v) { const n = parseFloat(v); return isNaN(n) ? null : n; }
function parseBool(v) { return String(v).toLowerCase() === "true"; }

export function mapSheetRow(row, related = {}) {
  return {
    id: row.id,
    name: row.name,
    region: row.region,
    coord: row.coord,
    stage: row.stage,
    budget: parseNum(row.budget),
    curBudget: parseNum(row.curBudget ?? row.budget),
    actual: row.actual !== "" && row.actual != null ? parseNum(row.actual) : null,
    pDate: row.pDate,
    eDate: row.eDate,
    priority: row.priority || "medium",
    surplus: row.surplus !== "" && row.surplus != null ? parseNum(row.surplus) : null,
    surplusStatus: row.surplusStatus || null,
    photos:    (related.photos    || []).map(p => ({ n: p.name, e: p.emoji })),
    invoices:  (related.invoices  || []).map(i => ({ n: i.name, amt: parseNum(i.amt), ref: i.ref, d: i.date, doc: parseBool(i.docAttached) })),
    costs:     (related.costs     || []).map(c => ({ c: c.category, p: parseNum(c.proposed), a: parseNum(c.actual) })),
    disb:      (related.disb      || []).map(d => ({ amt: parseNum(d.amt), pct: parseNum(d.pct), type: d.type, date: d.date || null, ref: d.ref || null, by: d.by || null, pending: parseBool(d.pending) })),
    amend:     (related.amendments|| []).map(a => ({ orig: parseNum(a.orig), revised: parseNum(a.revised), reason: a.reason, reqBy: a.reqBy, reqDate: a.reqDate, appBy: a.appBy, appDate: a.appDate, status: a.status })),
    revisions: (related.revisions || []).map(r => ({ ver: parseNum(r.version), budget: parseNum(r.budget), date: r.date, changes: r.changes, status: r.status, newDate: r.newDate })),
    comments:  (related.comments  || []).map(c => ({ by: c.by, role: c.role, at: c.at, t: c.t })),
    audit:     (related.audit     || []).map(a => ({ a: a.action, by: a.by, r: a.role, at: a.at, n: a.note || "", emails: a.emails ? a.emails.split(",").map(e => e.trim()).filter(Boolean) : [] })),
  };
}

/**
 * Fetches all events from the Apps Script web app.
 * The Apps Script should return: { events: EventRow[], related: { [eventId]: RelatedData } }
 */
export async function fetchEvents() {
  if (!APPS_SCRIPT_URL) throw new Error("APPS_SCRIPT_URL not configured");

  const res = await fetch(APPS_SCRIPT_URL, { redirect: "follow" });
  if (!res.ok) throw new Error(`Sheets fetch failed: ${res.status}`);

  const json = await res.json();

  // Support two response shapes:
  // 1. { events: [...], related: { eventId: { comments, audit, ... } } }
  // 2. Already-assembled array of full event objects
  if (Array.isArray(json)) return json;

  return json.events.map(row => mapSheetRow(row, json.related?.[row.id] ?? {}));
}
