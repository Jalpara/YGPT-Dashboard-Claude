import { fmt } from "../../utils/helpers.js";

export default function AmendmentsTab({ e }) {
  return (
    <div style={{ padding: "18px 24px" }}>
      {e.amend.map((a, i) => (
        <div key={i} style={{ padding: 14, borderRadius: 8, border: "1px solid #e2e8f0", background: "#fafbfc" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Amendment #{i + 1}</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "#ecfdf5", color: "#059669" }}>{a.status}</span>
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
            <div><div style={{ fontSize: 11, color: "#94a3b8" }}>Original</div><div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--m)", textDecoration: "line-through", color: "#94a3b8" }}>{fmt(a.orig)}</div></div>
            <span style={{ color: "#94a3b8", alignSelf: "center", fontSize: 14 }}>→</span>
            <div><div style={{ fontSize: 11, color: "#94a3b8" }}>Revised</div><div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--m)" }}>{fmt(a.revised)}</div></div>
          </div>
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>{a.reason}</div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>By {a.reqBy} · Approved by {a.appBy} on {a.appDate}</div>
        </div>
      ))}
    </div>
  );
}
