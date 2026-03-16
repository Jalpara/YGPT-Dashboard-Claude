import { SC, DSTAGES } from "../../data/constants.js";
import { sidx, fmt } from "../../utils/helpers.js";
import { useMobile } from "../../hooks/useMobile.js";
import { Dot, SlaChip, CDChip, SurplusBadge } from "../ui/Chips.jsx";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";

export default function OverviewTab({ e, role, adm, setTab }) {
  const isMobile = useMobile();
  const idx = sidx(e.stage);
  const rej = e.stage === "Rejected";

  const released = e.disb.filter(d => !d.pending).reduce((s, d) => s + d.amt, 0);
  const hasSurplus = e.actual != null && e.actual < released;
  const surplusAmt = hasSurplus ? released - e.actual : 0;

  const canER        = (adm || role === "Events Team")        && ["Proposal Submitted", "Under Review"].includes(e.stage);
  const canLA        = (adm || role === "Leadership")         && ["Approved by Events", "Leadership Review"].includes(e.stage);
  const canFA        = (adm || role === "Finance & Accounts") && e.stage === "Budget Review";
  const canECR       = (adm || role === "Events Team")        && e.stage === "ECR Submitted";
  const canVC        = (adm || role === "Finance & Accounts") && e.stage === "ECR Reviewed";
  const canRS        = (adm || role === "Regional Coordinator") && ["Changes Requested", "Flagged by Finance"].includes(e.stage);
  const canRev       = (adm || role === "Regional Coordinator") && e.stage === "Rejected";
  const canAmend     = (adm || role === "Regional Coordinator") && e.stage === "Funds Released";
  const canECRSubmit = (adm || role === "Regional Coordinator") && e.stage === "Funds Released";
  const hasActions = canER || canLA || canFA || canECR || canVC || canRS || canRev || canAmend || canECRSubmit;

  return (
    <div>
      {/* Lifecycle */}
      <div style={{ padding: isMobile ? "14px 16px" : "16px 24px", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Lifecycle</div>
        <div style={{ display: "flex", alignItems: "center", overflowX: "auto", paddingBottom: 4 }}>
          {DSTAGES.map((s, i) => {
            const done = !rej && idx >= i;
            const cur = e.stage === s;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", flex: i < DSTAGES.length - 1 ? 1 : "none" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 20 }}>
                  <div style={{ width: cur ? 20 : 13, height: cur ? 20 : 13, borderRadius: "50%", background: done ? SC[s] : "#e2e8f0", border: cur ? "2px solid " + SC[s] + "30" : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {done && !cur && <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span style={{ fontSize: 7, color: done ? "#334155" : "#cbd5e1", marginTop: 3, textAlign: "center", maxWidth: 44, lineHeight: 1.1, fontWeight: cur ? 700 : 500 }}>{s}</span>
                </div>
                {i < DSTAGES.length - 1 && <div style={{ flex: 1, height: 2, background: done && idx > i ? SC[s] : "#e2e8f0", margin: "0 1px", marginBottom: 14, minWidth: 4 }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget + Notes: 2 col desktop → 1 col mobile */}
      <div style={{ padding: isMobile ? "14px 16px" : "16px 24px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : 20 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Budget</div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div><div style={{ fontSize: 11, color: "#94a3b8" }}>Proposed</div><div style={{ fontSize: isMobile ? 17 : 20, fontWeight: 800, fontFamily: "var(--m)" }}>{fmt(e.budget)}</div></div>
            {e.curBudget !== e.budget && <div><div style={{ fontSize: 11, color: "#94a3b8" }}>Current</div><div style={{ fontSize: isMobile ? 17 : 20, fontWeight: 800, fontFamily: "var(--m)", color: "#0ea5e9" }}>{fmt(e.curBudget)}</div></div>}
            {e.actual != null && <div><div style={{ fontSize: 11, color: "#94a3b8" }}>Actual</div><div style={{ fontSize: isMobile ? 17 : 20, fontWeight: 800, fontFamily: "var(--m)", color: e.actual > e.curBudget ? "#ef4444" : "#10b981" }}>{fmt(e.actual)}</div></div>}
          </div>
          {e.actual != null && (
            <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: e.actual <= e.curBudget ? "#10b981" : "#ef4444" }}>
              {e.actual <= e.curBudget ? "↓ " + fmt(e.curBudget - e.actual) + " under budget" : "↑ " + fmt(e.actual - e.curBudget) + " over budget"}
            </div>
          )}
          {hasSurplus && (
            <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 6, background: "#ecfdf5", border: "1px solid #bbf7d0", fontSize: 12 }}>
              <div style={{ fontWeight: 700, color: "#059669", marginBottom: 2 }}>Fund Reconciliation</div>
              <div style={{ color: "#334155" }}>Released: {fmt(released)} · Spent: {fmt(e.actual)} · <b style={{ color: "#059669" }}>Surplus: {fmt(surplusAmt)}</b></div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Status: <b style={{ color: e.surplusStatus === "Returned" ? "#059669" : e.surplusStatus === "Pending Return" ? "#f59e0b" : "#dc2626" }}>{e.surplusStatus || "Pending"}</b></div>
            </div>
          )}
          {e.actual != null && e.actual > e.curBudget && (
            <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 6, background: "#fef2f2", border: "1px solid #fecaca", fontSize: 12 }}>
              <div style={{ fontWeight: 700, color: "#dc2626", marginBottom: 2 }}>Over Budget</div>
              <div style={{ color: "#334155" }}>Budget: {fmt(e.curBudget)} · Actual: {fmt(e.actual)} · <b style={{ color: "#dc2626" }}>Excess: {fmt(e.actual - e.curBudget)}</b></div>
            </div>
          )}
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Notes</div>
          <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0 }}>{e.name} — {e.region} Region</p>
        </div>
      </div>

      {/* Actions */}
      {hasActions && (
        <div style={{ padding: isMobile ? "12px 16px" : "12px 24px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {canER  && <><Button v="pri">Approve → Leadership</Button><Button v="sec">Request Changes</Button><Button v="dan">Reject</Button></>}
          {canLA  && <><Button v="pur">Approve → Finance</Button><Button v="sec">Request Changes</Button><Button v="dan">Reject</Button></>}
          {canFA  && <><Button v="blu">Release Funds</Button><Button v="dan">Flag</Button></>}
          {canECR && <><Button v="tea">Approve ECR</Button><Button v="dan">Request Corrections</Button></>}
          {canVC  && <><Button v="drk">Verify & Close</Button><Button v="dan">Corrections</Button></>}
          {canRS  && <Button v="pri">Resubmit</Button>}
          {canRev && <Button v="amb">Revise & Resubmit</Button>}
          {canAmend     && <Button v="amb">Budget Amendment</Button>}
          {canECRSubmit && <Button v="tea" onClick={() => setTab("ecr")}>Submit ECR</Button>}
          {adm && <span style={{ fontSize: 10, color: "#94a3b8" }}>⚡ Admin</span>}
        </div>
      )}
    </div>
  );
}
