import { REGIONS } from "../../data/constants.js";
import { fmt } from "../../utils/helpers.js";
import { useMobile } from "../../hooks/useMobile.js";

export default function AnalyticsView({ evts, cycleTime, budgetAcc, overdueCount, onOpen }) {
  const isMobile = useMobile();
  const brg = REGIONS.map(r => ({
    l: r.slice(0, 4),
    v: Math.round(evts.filter(e => e.region === r).reduce((s, e) => s + e.curBudget, 0) / 1000),
  }));
  const monthly = [
    { m: "Jan", v: evts.filter(e => e.pDate.startsWith("2026-01")).length },
    { m: "Feb", v: evts.filter(e => e.pDate.startsWith("2026-02")).length },
    { m: "Mar", v: evts.filter(e => e.pDate.startsWith("2026-03")).length },
  ];
  const maxBrg = Math.max(...brg.map(x => x.v), 1);
  const maxMo  = Math.max(...monthly.map(x => x.v), 1);

  const kpiCards = [
    { l: "Avg Cycle Time",   v: cycleTime ? cycleTime + " days" : "—", sub: "proposal → funds",      c: "#6366f1" },
    { l: "Budget Accuracy",  v: budgetAcc ? budgetAcc + "%" : "—",     sub: "avg, completed events",  c: "#22c55e" },
    { l: "SLA Overdue",      v: overdueCount,                           sub: "events past deadline",   c: overdueCount > 0 ? "#dc2626" : "#22c55e" },
  ];

  return (
    <div>
      <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 18px" }}>Analytics</h3>

      {/* KPI cards: 3 col desktop → 1 col mobile */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 12, marginBottom: 18 }}>
        {kpiCards.map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 9, padding: 18, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: isMobile ? 16 : 0, flexDirection: isMobile ? "row" : "column", textAlign: isMobile ? "left" : "center" }}>
            <div style={{ fontSize: isMobile ? 28 : 30, fontWeight: 800, fontFamily: "var(--m)", color: s.c, lineHeight: 1, flexShrink: 0 }}>{s.v}</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: isMobile ? 2 : 6, order: isMobile ? -1 : 0 }}>{s.l}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts: 2 col desktop → 1 col mobile */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 18 }}>
        <div style={{ background: "#fff", borderRadius: 9, padding: 18, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Budget by Region (₹K)</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
            {brg.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "var(--m)", color: "#64748b" }}>{d.v}</span>
                <div style={{ width: "100%", maxWidth: 28, borderRadius: 3, background: "#8b5cf6" + (i % 2 === 0 ? "cc" : "88"), height: Math.max(d.v / maxBrg * 60, d.v > 0 ? 4 : 0) + "px" }} />
                <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600 }}>{d.l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 9, padding: 18, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Monthly Proposals</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 90 }}>
            {monthly.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>{d.v}</span>
                <div style={{ width: "100%", maxWidth: 36, borderRadius: 3, background: "#06b6d4" + (i % 2 === 0 ? "cc" : "88"), height: Math.max(d.v / maxMo * 60, d.v > 0 ? 4 : 0) + "px" }} />
                <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{d.m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Variance table: scrollable on mobile */}
      <div style={{ background: "#fff", borderRadius: 9, padding: 18, border: "1px solid #e2e8f0" }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Budget Variance — Completed Events</div>
        {evts.filter(e => e.actual != null).length === 0
          ? <div style={{ textAlign: "center", padding: 24, color: "#94a3b8", fontSize: 13 }}>No completed events in this filter.</div>
          : (
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 480 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                    {["Event", "Region", "Budget", "Actual", "Variance", "Status"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "9px 8px", fontSize: 11, fontWeight: 700, color: "#94a3b8", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {evts.filter(e => e.actual != null).map(e => {
                    const v = e.curBudget - e.actual;
                    return (
                      <tr key={e.id} style={{ borderBottom: "1px solid #f1f5f9", cursor: "pointer" }} onClick={() => onOpen(e)}>
                        <td style={{ padding: "9px 8px", fontWeight: 600 }}>{e.name}</td>
                        <td style={{ padding: "9px 8px", color: "#64748b", whiteSpace: "nowrap" }}>{e.region}</td>
                        <td style={{ padding: "9px 8px", fontFamily: "var(--m)", whiteSpace: "nowrap" }}>{fmt(e.curBudget)}</td>
                        <td style={{ padding: "9px 8px", fontFamily: "var(--m)", whiteSpace: "nowrap" }}>{fmt(e.actual)}</td>
                        <td style={{ padding: "9px 8px", fontFamily: "var(--m)", fontWeight: 700, color: v >= 0 ? "#10b981" : "#ef4444", whiteSpace: "nowrap" }}>{v >= 0 ? "↓ " : "↑ "}{fmt(Math.abs(v))}</td>
                        <td style={{ padding: "9px 8px", whiteSpace: "nowrap" }}>
                          {e.surplusStatus
                            ? <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: e.surplusStatus === "Returned" ? "#ecfdf5" : e.surplusStatus === "Pending Return" ? "#fffbeb" : "#fef2f2", color: e.surplusStatus === "Returned" ? "#059669" : e.surplusStatus === "Pending Return" ? "#b45309" : "#dc2626" }}>{e.surplusStatus}</span>
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  );
}
