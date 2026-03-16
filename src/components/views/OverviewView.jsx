import { REGIONS } from "../../data/constants.js";
import { fmt } from "../../utils/helpers.js";
import { useMobile } from "../../hooks/useMobile.js";
import EventCard from "../EventCard.jsx";

export default function OverviewView({ evts, stats, onOpen }) {
  const isMobile = useMobile();
  const byRgn = REGIONS.map(r => ({ l: r.slice(0, 3), v: evts.filter(e => e.region === r).length }));
  const maxRgn = Math.max(...byRgn.map(x => x.v), 1);
  const statCards = [
    { l: "Total",    v: stats.total,                                                                                                                                                          c: "#6366f1" },
    { l: "Pending",  v: evts.filter(x => ["Proposal Submitted", "Under Review", "Changes Requested"].includes(x.stage)).length,                                                               c: "#eab308" },
    { l: "Approval", v: evts.filter(x => ["Approved by Events", "Leadership Review", "Leadership Approved", "Budget Review", "Flagged by Finance"].includes(x.stage)).length,                 c: "#8b5cf6" },
    { l: "Active",   v: evts.filter(x => x.stage === "Funds Released").length,                                                                                                                c: "#06b6d4" },
    { l: "Done",     v: evts.filter(x => ["ECR Submitted", "ECR Reviewed", "Closed"].includes(x.stage)).length,                                                                               c: "#059669" },
  ];

  return (
    <div>
      {/* Stat cards: 5 col desktop → 3+2 → 2 col mobile */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(5,1fr)", gap: 10, marginBottom: 18 }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 9, padding: "16px 18px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{s.l}</div>
            <div style={{ fontSize: isMobile ? 26 : 32, fontWeight: 800, color: s.c, fontFamily: "var(--m)", lineHeight: 1 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Budget + Region: 2 col desktop → 1 col mobile */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 18 }}>
        <div style={{ background: "#fff", borderRadius: 9, padding: 18, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Budget</div>
          <div style={{ display: "flex", gap: 24 }}>
            <div><div style={{ fontSize: 12, color: "#94a3b8" }}>Total</div><div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, fontFamily: "var(--m)" }}>{fmt(stats.budgetTotal)}</div></div>
            <div><div style={{ fontSize: 12, color: "#94a3b8" }}>Spent</div><div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, fontFamily: "var(--m)", color: "#10b981" }}>{fmt(stats.spent)}</div></div>
          </div>
          <div style={{ marginTop: 12, height: 7, background: "#f1f5f9", borderRadius: 4 }}>
            <div style={{ height: "100%", width: (stats.budgetTotal ? stats.spent / stats.budgetTotal * 100 : 0) + "%", background: "linear-gradient(90deg,#10b981,#06b6d4)", borderRadius: 4 }} />
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 9, padding: 18, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>By Region</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
            {byRgn.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>{d.v}</span>
                <div style={{ width: "100%", maxWidth: 26, borderRadius: 3, background: "#6366f1" + (i % 2 === 0 ? "cc" : "88"), height: Math.max(d.v / maxRgn * 50, d.v > 0 ? 4 : 0) + "px" }} />
                <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600 }}>{d.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 9, padding: 18, border: "1px solid #e2e8f0" }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>All Events</div>
        {evts.length === 0
          ? <div style={{ textAlign: "center", padding: 32, color: "#94a3b8", fontSize: 14 }}>No events match the current filter.</div>
          : evts.map(e => <EventCard key={e.id} e={e} onClick={() => onOpen(e)} />)
        }
      </div>
    </div>
  );
}
