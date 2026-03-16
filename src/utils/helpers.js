import { NOW, SLA, DSTAGES } from "../data/constants.js";
import { EVENTS as ALL_EVENTS } from "../data/events.js";

export const daysDiff = (a, b) => Math.floor((new Date(b) - new Date(a)) / 86400000);
export const dFromNow = (d) => daysDiff(d.split(" ")[0], NOW.toISOString().split("T")[0]);
export const dUntil = (d) => daysDiff(NOW.toISOString().split("T")[0], d);
export const ago = (d) => { const x = dFromNow(d); return x <= 0 ? "Today" : x === 1 ? "Yesterday" : x + "d ago"; };
export const fmt = (n) => n != null ? "₹" + n.toLocaleString("en-IN") : "—";
export const sidx = (s) => DSTAGES.indexOf(s);

export const tis = (e) => { const l = e.audit[e.audit.length - 1]; return l ? dFromNow(l.at) : 0; };
export const slaLeft = (e) => { const s = SLA[e.stage]; return s != null ? s - tis(e) : null; };

export const evtCD = (e) => {
  const d = dUntil(e.eDate);
  return d > 7 ? null
    : d > 0 ? { t: "Event in " + d + "d", c: d <= 3 ? "#dc2626" : "#f59e0b" }
    : d === 0 ? { t: "Event today!", c: "#dc2626" }
    : { t: "Event was " + Math.abs(d) + "d ago", c: "#6b7280" };
};

export const pendingFor = (role, adm, events = ALL_EVENTS) => {
  if (adm) return events.filter(e => ["Proposal Submitted", "Under Review", "Approved by Events", "Leadership Review", "Budget Review", "ECR Submitted", "ECR Reviewed"].includes(e.stage));
  if (role === "Events Team") return events.filter(e => ["Proposal Submitted", "Under Review", "ECR Submitted"].includes(e.stage));
  if (role === "Leadership") return events.filter(e => ["Approved by Events", "Leadership Review"].includes(e.stage));
  if (role === "Finance & Accounts") return events.filter(e => ["Budget Review", "ECR Reviewed"].includes(e.stage));
  if (role === "Regional Coordinator") return events.filter(e => e.coord === "Arjun Mehta" && ["Changes Requested", "Flagged by Finance"].includes(e.stage));
  return [];
};
