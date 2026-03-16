import { useState } from "react";
import { useMobile } from "../../hooks/useMobile.js";
import Button from "../ui/Button.jsx";

export default function CommentsTab({ e }) {
  const [nc, setNc] = useState("");
  const isMobile = useMobile();
  const px = isMobile ? "14px 16px" : "18px 24px";

  return (
    <div style={{ padding: px }}>
      {e.comments.length === 0 && (
        <div style={{ textAlign: "center", padding: 24, color: "#94a3b8", fontSize: 13 }}>No comments yet.</div>
      )}
      {e.comments.map((c, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#6366f1", flexShrink: 0 }}>
            {c.by.split(" ").map(w => w[0]).join("")}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12 }}><b style={{ color: "#0f172a" }}>{c.by}</b> <span style={{ color: "#94a3b8", fontSize: 11 }}>{c.role} · {c.at}</span></div>
            <p style={{ fontSize: 13, color: "#334155", margin: "4px 0 0", background: "#f8fafc", padding: "8px 12px", borderRadius: "0 8px 8px 8px", border: "1px solid #f1f5f9", lineHeight: 1.5, wordBreak: "break-word" }}>{c.t}</p>
          </div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <textarea value={nc} onChange={x => setNc(x.target.value)} placeholder="Add comment…" rows={2} style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none" }} />
        <Button v="pri" onClick={() => setNc("")}>Send</Button>
      </div>
    </div>
  );
}
