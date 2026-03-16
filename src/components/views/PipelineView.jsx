import { PHASES } from "../../data/constants.js";
import EventCard from "../EventCard.jsx";

export default function PipelineView({ evts, onOpen }) {
  return (
    <div>
      <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 16px" }}>Pipeline</h3>
      {PHASES.map(ph => {
        const items = evts.filter(e => ph.stages.includes(e.stage));
        return (
          <div key={ph.name} style={{ background: "#fff", borderRadius: 9, border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: 12 }}>
            <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: items.length ? "1px solid #f1f5f9" : "none", background: ph.bg }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 11, height: 11, borderRadius: 3, background: ph.c }} />
                <span style={{ fontSize: 15, fontWeight: 700 }}>{ph.name}</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--m)", color: ph.c, background: "#fff", padding: "2px 10px", borderRadius: 5 }}>{items.length}</span>
            </div>
            {items.length > 0 && (
              <div style={{ padding: 12, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 9 }}>
                {items.map(e => <EventCard key={e.id} e={e} onClick={() => onOpen(e)} />)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
