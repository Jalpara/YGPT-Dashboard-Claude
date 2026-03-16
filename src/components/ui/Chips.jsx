import { slaLeft, evtCD, fmt } from "../../utils/helpers.js";

export function Dot({ p }) {
  const bg = p === "high" ? "#ef4444" : p === "medium" ? "#eab308" : "#94a3b8";
  return <span style={{ width: 7, height: 7, borderRadius: "50%", background: bg, display: "inline-block" }} />;
}

export function SlaChip({ e }) {
  const l = slaLeft(e);
  if (l === null) return null;
  const c = l < 0 ? "#dc2626" : l <= 1 ? "#b45309" : "#059669";
  const bg = l < 0 ? "#fef2f2" : l <= 1 ? "#fffbeb" : "#ecfdf5";
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: bg, color: c }}>
      {l < 0 ? Math.abs(l) + "d overdue" : l === 0 ? "Due today" : l + "d left"}
    </span>
  );
}

export function CDChip({ e }) {
  const cd = evtCD(e);
  if (!cd) return null;
  const bg = cd.c === "#dc2626" ? "#fef2f2" : cd.c === "#f59e0b" ? "#fffbeb" : "#f1f5f9";
  return <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: bg, color: cd.c }}>{cd.t}</span>;
}

export function NotificationBadge({ n }) {
  if (n <= 0) return null;
  return (
    <span style={{ minWidth: 16, height: 16, borderRadius: 8, background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 4px", marginLeft: 4 }}>
      {n}
    </span>
  );
}

export function SurplusBadge({ e }) {
  if (e.actual == null || !["ECR Submitted", "ECR Reviewed", "Closed"].includes(e.stage)) return null;
  const released = e.disb.filter(d => !d.pending).reduce((s, d) => s + d.amt, 0);
  const diff = released - e.actual;
  if (diff <= 0 && e.actual <= e.curBudget) return null;
  if (e.actual > e.curBudget) {
    return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "#fef2f2", color: "#dc2626" }}>↑ {fmt(e.actual - e.curBudget)} over budget</span>;
  }
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: diff > 0 ? "#ecfdf5" : "#f1f5f9", color: diff > 0 ? "#059669" : "#64748b" }}>
      ↓ {fmt(e.curBudget - e.actual)} under budget{e.surplusStatus ? " · " + e.surplusStatus : ""}
    </span>
  );
}
