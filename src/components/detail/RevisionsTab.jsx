import { fmt } from "../../utils/helpers.js";
import Badge from "../ui/Badge.jsx";

export default function RevisionsTab({ e }) {
  return (
    <div style={{ padding: "18px 24px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 12 }}>Revision History</div>
      <div style={{ padding: 14, borderRadius: 8, border: "1px solid #fecaca", background: "#fef2f2", marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>v1 — Original</span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "#fef2f2", color: "#dc2626" }}>Rejected</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--m)", marginBottom: 2 }}>{fmt(e.budget)}</div>
        <div style={{ fontSize: 11, color: "#94a3b8" }}>Event date: {e.eDate}</div>
      </div>
      {e.revisions.map((rv, i) => (
        <div key={i} style={{ padding: 14, borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>v{rv.ver} — Revised</span>
            <Badge stage={rv.status} sm />
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--m)", marginBottom: 4 }}>{fmt(rv.budget)}</div>
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>{rv.changes}</div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>New date: {rv.newDate} · Submitted {rv.date}</div>
        </div>
      ))}
    </div>
  );
}
