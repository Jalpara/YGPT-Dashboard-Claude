import { SC, DSTAGES } from "../../data/constants.js";
import { fmt, dUntil, ago, sidx } from "../../utils/helpers.js";
import { useMobile } from "../../hooks/useMobile.js";
import { SlaChip, CDChip } from "../ui/Chips.jsx";
import Badge from "../ui/Badge.jsx";

export default function MyEventsView({ evts, onOpen }) {
  const isMobile = useMobile();
  const COORD_NAME = "Arjun Mehta";
  const COORD_REGION = "North";

  const my = evts.filter(e => e.coord === COORD_NAME);
  const regionEvts = evts.filter(e => e.region === COORD_REGION);

  const nudges = [];
  my.forEach(e => {
    const du = dUntil(e.eDate);
    if (e.stage === "Changes Requested")                       nudges.push({ e, c: "#f97316", t: e.name + ": Changes requested — respond soon" });
    if (e.stage === "Flagged by Finance")                      nudges.push({ e, c: "#ef4444", t: e.name + ": Flagged by Finance" });
    if (e.stage === "Funds Released" && du <= 7 && du > 0)    nudges.push({ e, c: "#06b6d4", t: e.name + ": Event in " + du + "d — prepare" });
    if (e.stage === "Funds Released" && du <= 0)               nudges.push({ e, c: "#f59e0b", t: e.name + ": Event passed — submit ECR" });
    if (e.stage === "Rejected")                                nudges.push({ e, c: "#dc2626", t: e.name + ": Rejected — revise & resubmit" });
  });

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>My Events</h3>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "3px 0 0" }}>{COORD_NAME} · {COORD_REGION} Region</p>
      </div>

      {/* Stats: 4 col desktop → 2 col mobile */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 10, marginBottom: 18, padding: "16px 18px", background: "#f8fafc", borderRadius: 9, border: "1px solid #e2e8f0" }}>
        <div><div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{COORD_REGION} Events</div><div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--m)", color: "#6366f1" }}>{regionEvts.length}</div></div>
        <div><div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Total Budget</div><div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 800, fontFamily: "var(--m)" }}>{fmt(regionEvts.reduce((s, x) => s + x.curBudget, 0))}</div></div>
        <div><div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Completed</div><div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--m)", color: "#22c55e" }}>{regionEvts.filter(x => ["ECR Submitted", "ECR Reviewed", "Closed"].includes(x.stage)).length}</div></div>
        <div><div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Active</div><div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--m)", color: "#06b6d4" }}>{regionEvts.filter(x => x.stage === "Funds Released").length}</div></div>
      </div>

      {nudges.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {nudges.map((nd, i) => (
            <div key={i} onClick={() => onOpen(nd.e)} style={{ padding: "9px 14px", borderRadius: 7, background: nd.c + "08", border: "1px solid " + nd.c + "22", fontSize: 13, color: nd.c, fontWeight: 600, cursor: "pointer", marginBottom: 5 }}>
              ⚡ {nd.t}
            </div>
          ))}
        </div>
      )}

      {my.length === 0
        ? <div style={{ textAlign: "center", padding: 32, color: "#94a3b8", fontSize: 14, background: "#fff", borderRadius: 9, border: "1px solid #e2e8f0" }}>No events found for {COORD_NAME} in the current filter.</div>
        : my.map(e => (
          <div
            key={e.id}
            onClick={() => onOpen(e)}
            style={{ background: "#fff", borderRadius: 9, padding: 16, border: "1px solid #e2e8f0", cursor: "pointer", marginBottom: 7 }}
            onMouseEnter={ev => { ev.currentTarget.style.borderColor = "#6366f1"; }}
            onMouseLeave={ev => { ev.currentTarget.style.borderColor = "#e2e8f0"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{e.name}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{e.eDate} · {ago(e.pDate)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <SlaChip e={e} /><CDChip e={e} /><Badge stage={e.stage} sm />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 12 }}>
              {DSTAGES.slice(0, 7).map((s, i) => {
                const x = sidx(e.stage);
                const done = x >= i;
                return (
                  <div key={s} style={{ display: "flex", alignItems: "center", flex: i < 6 ? 1 : "none" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: done ? SC[s] : "#e2e8f0", flexShrink: 0 }} />
                    {i < 6 && <div style={{ flex: 1, height: 2, background: done && x > i ? SC[s] : "#e2e8f0", minWidth: 4 }} />}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      }
    </div>
  );
}
