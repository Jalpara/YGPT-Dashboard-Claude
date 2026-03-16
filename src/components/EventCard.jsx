import { SC } from "../data/constants.js";
import { slaLeft, fmt } from "../utils/helpers.js";
import Badge from "./ui/Badge.jsx";
import { Dot, SlaChip, CDChip, SurplusBadge } from "./ui/Chips.jsx";

export default function EventCard({ e, onClick }) {
  const overdue = slaLeft(e) !== null && slaLeft(e) < 0;
  return (
    <div
      onClick={onClick}
      style={{
        background: overdue ? "#fef2f2" : "#fff",
        borderRadius: 9, border: "1px solid #e2e8f0",
        padding: "14px 18px", cursor: "pointer",
        borderLeft: "3px solid " + (SC[e.stage] || "#6b7280"),
        marginBottom: 7, transition: "box-shadow 0.12s",
      }}
      onMouseEnter={ev => { ev.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)"; }}
      onMouseLeave={ev => { ev.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5, flexWrap: "wrap" }}>
            <Dot p={e.priority} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", fontFamily: "var(--m)" }}>{e.id}</span>
            <SlaChip e={e} /><CDChip e={e} /><SurplusBadge e={e} />
            {e.comments.length > 0 && <span style={{ fontSize: 11, color: "#94a3b8" }}>💬 {e.comments.length}</span>}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>{e.name}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{e.coord} · {e.region} · {e.eDate}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
          <Badge stage={e.stage} sm />
          <div style={{ fontSize: 15, fontWeight: 800, fontFamily: "var(--m)", marginTop: 5 }}>{fmt(e.budget)}</div>
        </div>
      </div>
    </div>
  );
}
