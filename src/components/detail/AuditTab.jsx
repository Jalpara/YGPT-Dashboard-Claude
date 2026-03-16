import { SC } from "../../data/constants.js";
import { useMobile } from "../../hooks/useMobile.js";
import Badge from "../ui/Badge.jsx";

export default function AuditTab({ e }) {
  const isMobile = useMobile();
  const px = isMobile ? "14px 16px" : "18px 24px";

  return (
    <div style={{ padding: px }}>
      <div style={{ position: "relative", paddingLeft: 24 }}>
        <div style={{ position: "absolute", left: 8, top: 4, bottom: 4, width: 2, background: "#e2e8f0" }} />
        {e.audit.map((a, i) => (
          <div key={i} style={{ position: "relative", marginBottom: 18 }}>
            <div style={{ position: "absolute", left: -19, top: 2, width: 14, height: 14, borderRadius: "50%", background: a.r === "System" ? "#e2e8f0" : (SC[a.a] || "#6366f1"), border: "2px solid #fff" }} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{a.a}</span>
                <Badge stage={a.a} sm />
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}><b>{a.by}</b> · {a.r} · <span style={{ fontFamily: "var(--m)", fontSize: 10 }}>{a.at}</span></div>
              {a.n && <div style={{ marginTop: 4, padding: "6px 10px", background: "#f8fafc", borderRadius: 6, border: "1px solid #f1f5f9", fontSize: 12, color: "#475569", lineHeight: 1.4 }}>{a.n}</div>}
              {a.emails && a.emails.length > 0 && (
                <div style={{ marginTop: 4, fontSize: 11, color: "#0ea5e9", display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                  📧 Notified: {a.emails.join(", ")}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
