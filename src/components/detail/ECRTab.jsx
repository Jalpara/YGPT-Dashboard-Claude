import { useState } from "react";
import { fmt } from "../../utils/helpers.js";
import { useMobile } from "../../hooks/useMobile.js";
import Button from "../ui/Button.jsx";

export default function ECRTab({ e, role, adm }) {
  const [ecrStep, setEcrStep] = useState(0);
  const isMobile = useMobile();

  const canECR       = (adm || role === "Events Team")          && e.stage === "ECR Submitted";
  const canVC        = (adm || role === "Finance & Accounts")   && e.stage === "ECR Reviewed";
  const canECRSubmit = (adm || role === "Regional Coordinator") && e.stage === "Funds Released";
  const hasECR       = ["ECR Submitted", "ECR Reviewed", "Closed"].includes(e.stage);
  const invA         = e.invoices.filter(x => x.doc).length;

  if (canECRSubmit && !hasECR) {
    const steps = ["Upload Photos", "Attach Invoices", "Cost Breakdown", "Review & Submit"];
    return (
      <div style={{ padding: isMobile ? "14px 16px" : "18px 24px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 16 }}>Submit Event Completion Report</div>
        {/* Stepper */}
        <div style={{ display: "flex", gap: isMobile ? 4 : 6, marginBottom: 20 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", margin: "0 auto 6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: ecrStep >= i ? "#4f46e5" : "#e2e8f0", color: ecrStep >= i ? "#fff" : "#94a3b8" }}>{i + 1}</div>
              {!isMobile && <div style={{ fontSize: 10, fontWeight: 600, color: ecrStep === i ? "#4f46e5" : "#94a3b8" }}>{s}</div>}
            </div>
          ))}
        </div>
        {ecrStep === 0 && <div style={{ padding: 24, border: "2px dashed #e2e8f0", borderRadius: 10, textAlign: "center" }}><div style={{ fontSize: 32, marginBottom: 8 }}>📸</div><div style={{ fontSize: 14, fontWeight: 600, color: "#334155", marginBottom: 4 }}>Upload Event Photos</div><div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>Drop photos here or click to browse. JPG, PNG accepted.</div><Button v="pri">Choose Files</Button></div>}
        {ecrStep === 1 && <div style={{ padding: 24, border: "2px dashed #e2e8f0", borderRadius: 10, textAlign: "center" }}><div style={{ fontSize: 32, marginBottom: 8 }}>🧾</div><div style={{ fontSize: 14, fontWeight: 600, color: "#334155", marginBottom: 4 }}>Attach Invoices & Receipts</div><div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>Upload scanned invoices for each expense. PDF or image.</div><Button v="pri">Upload</Button></div>}
        {ecrStep === 2 && (
          <div style={{ overflowX: "auto" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Fill Cost Breakdown</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 320 }}>
              <thead><tr style={{ borderBottom: "2px solid #e2e8f0" }}>{["Category", "Proposed (₹)", "Actual (₹)"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px", fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>{h}</th>)}</tr></thead>
              <tbody>{["Venue", "Catering", "Materials", "Speakers", "Transport", "Misc"].map(c => (
                <tr key={c} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "8px", fontSize: 13 }}>{c}</td>
                  <td style={{ padding: "8px" }}><input style={{ width: "100%", maxWidth: 90, padding: "5px 8px", border: "1px solid #e2e8f0", borderRadius: 4, fontSize: 13, fontFamily: "var(--m)" }} placeholder="0" /></td>
                  <td style={{ padding: "8px" }}><input style={{ width: "100%", maxWidth: 90, padding: "5px 8px", border: "1px solid #e2e8f0", borderRadius: 4, fontSize: 13, fontFamily: "var(--m)" }} placeholder="0" /></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        {ecrStep === 3 && <div style={{ textAlign: "center", padding: 20 }}><div style={{ fontSize: 36, marginBottom: 8 }}>✅</div><div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Ready to Submit</div><div style={{ fontSize: 13, color: "#64748b", marginBottom: 14 }}>Review uploads and cost data, then submit.</div><Button v="pri">Submit ECR</Button></div>}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <Button v="sec" onClick={() => setEcrStep(Math.max(0, ecrStep - 1))}>← Back</Button>
          {ecrStep < 3 && <Button v="pri" onClick={() => setEcrStep(ecrStep + 1)}>Next →</Button>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? "14px 16px" : "18px 24px" }}>
      {e.photos.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 10 }}>Photos ({e.photos.length})</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(80px,1fr))", gap: 8 }}>
            {e.photos.map((p, i) => (
              <div key={i} style={{ background: "#f1f5f9", borderRadius: 8, padding: 12, textAlign: "center", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{p.e}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#475569" }}>{p.n}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {e.costs.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 10 }}>Cost Breakdown</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 300 }}>
              <thead><tr style={{ borderBottom: "2px solid #e2e8f0" }}>{["Category", "Proposed", "Actual", "Variance"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px", fontSize: 11, fontWeight: 700, color: "#94a3b8", whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
              <tbody>{e.costs.map((c, i) => { const v = c.p - c.a; return <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}><td style={{ padding: "8px", fontWeight: 600 }}>{c.c}</td><td style={{ padding: "8px", fontFamily: "var(--m)", whiteSpace: "nowrap" }}>{fmt(c.p)}</td><td style={{ padding: "8px", fontFamily: "var(--m)", whiteSpace: "nowrap" }}>{fmt(c.a)}</td><td style={{ padding: "8px", fontFamily: "var(--m)", fontWeight: 700, color: v >= 0 ? "#10b981" : "#ef4444", whiteSpace: "nowrap" }}>{v >= 0 ? "↓" : "↑"} {fmt(Math.abs(v))}</td></tr>; })}</tbody>
            </table>
          </div>
        </div>
      )}
      {e.invoices.length > 0 && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 10 }}>
            Invoices — <span style={{ color: invA === e.invoices.length ? "#059669" : "#f59e0b" }}>{invA}/{e.invoices.length} docs attached</span>
          </div>
          {e.invoices.map((inv, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 5, background: inv.doc ? "#fff" : "#fffbeb", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <span style={{ width: 26, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, background: inv.doc ? "#ecfdf5" : "#fef3c7", color: inv.doc ? "#059669" : "#b45309", flexShrink: 0 }}>{inv.doc ? "✓" : "!"}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inv.n}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>{inv.ref} · {inv.doc ? <span style={{ color: "#059669" }}>Attached</span> : <span style={{ color: "#b45309", fontWeight: 700 }}>Pending</span>}</div>
                </div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--m)", flexShrink: 0 }}>{fmt(inv.amt)}</span>
            </div>
          ))}
        </div>
      )}
      {(canECR || canVC) && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #f1f5f9", display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {canECR && <><Button v="tea">Approve ECR</Button><Button v="dan">Corrections</Button></>}
          {canVC  && <><Button v="drk">Verify & Close</Button><Button v="dan">Corrections</Button></>}
          {invA < e.invoices.length && <span style={{ fontSize: 11, color: "#b45309" }}>⚠ {e.invoices.length - invA} invoice docs pending</span>}
        </div>
      )}
    </div>
  );
}
