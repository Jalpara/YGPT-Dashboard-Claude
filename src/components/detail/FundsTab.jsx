import { fmt } from "../../utils/helpers.js";
import { useMobile } from "../../hooks/useMobile.js";

export default function FundsTab({ e }) {
  const isMobile = useMobile();
  const released = e.disb.filter(d => !d.pending).reduce((s, d) => s + d.amt, 0);
  const hasSurplus = e.actual != null && e.actual < released;
  const surplusAmt = hasSurplus ? released - e.actual : 0;
  const pending = e.disb.filter(d => d.pending).reduce((s, d) => s + d.amt, 0);

  return (
    <div style={{ padding: isMobile ? "14px 16px" : "18px 24px" }}>
      <div style={{ display: "flex", gap: 18, marginBottom: 16, flexWrap: "wrap" }}>
        <div><div style={{ fontSize: 11, color: "#94a3b8" }}>Approved</div><div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, fontFamily: "var(--m)" }}>{fmt(e.curBudget)}</div></div>
        <div><div style={{ fontSize: 11, color: "#94a3b8" }}>Released</div><div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, fontFamily: "var(--m)", color: "#22c55e" }}>{fmt(released)}</div></div>
        <div><div style={{ fontSize: 11, color: "#94a3b8" }}>Pending</div><div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, fontFamily: "var(--m)", color: "#f59e0b" }}>{fmt(pending)}</div></div>
        {hasSurplus && <div><div style={{ fontSize: 11, color: "#94a3b8" }}>Surplus</div><div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, fontFamily: "var(--m)", color: "#059669" }}>{fmt(surplusAmt)}</div></div>}
      </div>
      <div style={{ height: 7, background: "#f1f5f9", borderRadius: 4, marginBottom: 16 }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg,#22c55e,#06b6d4)", borderRadius: 4, width: (released / e.curBudget * 100) + "%" }} />
      </div>
      {hasSurplus && (
        <div style={{ padding: "10px 14px", borderRadius: 8, background: "#ecfdf5", border: "1px solid #bbf7d0", marginBottom: 14, fontSize: 13, color: "#059669", fontWeight: 600 }}>
          💰 Surplus of {fmt(surplusAmt)} — Status: <b>{e.surplusStatus || "Pending"}</b>
        </div>
      )}
      {e.disb.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 6, background: d.pending ? "#fffbeb" : "#fff", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <span style={{ width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: d.pending ? "#fef3c7" : "#ecfdf5", color: d.pending ? "#b45309" : "#059669", flexShrink: 0 }}>{d.pct}%</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{d.type}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.pending ? "Pending release" : `${d.ref} · ${d.date} · ${d.by}`}</div>
            </div>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--m)", color: d.pending ? "#b45309" : "#0f172a", flexShrink: 0 }}>{fmt(d.amt)}</span>
        </div>
      ))}
    </div>
  );
}
