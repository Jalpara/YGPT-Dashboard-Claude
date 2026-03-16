import { slaLeft } from "../../utils/helpers.js";
import EventCard from "../EventCard.jsx";

export default function QueueView({ items, title, sub, overdueCount, onOpen }) {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>{title}</h3>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "3px 0 0" }}>{sub}</p>
      </div>
      {overdueCount > 0 && title.includes("Pending") && (
        <div style={{ padding: "11px 16px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", marginBottom: 14, fontSize: 13, color: "#dc2626", fontWeight: 600 }}>
          ⚠ {overdueCount} event{overdueCount > 1 ? "s" : ""} overdue on SLA
        </div>
      )}
      {items.length === 0
        ? <div style={{ padding: 44, textAlign: "center", color: "#94a3b8", fontSize: 14, background: "#fff", borderRadius: 9, border: "1px solid #e2e8f0" }}>All caught up ✓</div>
        : [...items].sort((a, b) => (slaLeft(a) ?? 99) - (slaLeft(b) ?? 99)).map(e => <EventCard key={e.id} e={e} onClick={() => onOpen(e)} />)
      }
    </div>
  );
}
