import { useState } from "react";
import { useMobile } from "../../hooks/useMobile.js";
import Badge from "../ui/Badge.jsx";
import { Dot, SlaChip, CDChip, SurplusBadge } from "../ui/Chips.jsx";
import OverviewTab from "./OverviewTab.jsx";
import CommentsTab from "./CommentsTab.jsx";
import AuditTab from "./AuditTab.jsx";
import ECRTab from "./ECRTab.jsx";
import FundsTab from "./FundsTab.jsx";
import AmendmentsTab from "./AmendmentsTab.jsx";
import RevisionsTab from "./RevisionsTab.jsx";

export default function Detail({ e, role, adm }) {
  const [tab, setTab] = useState("overview");
  const isMobile = useMobile();
  const rej = e.stage === "Rejected";
  const chg = e.stage === "Changes Requested";
  const flg = e.stage === "Flagged by Finance";
  const hasECR = ["ECR Submitted", "ECR Reviewed", "Closed"].includes(e.stage);
  const canECRSubmit = (adm || role === "Regional Coordinator") && e.stage === "Funds Released";
  const invA = e.invoices.filter(x => x.doc).length;

  const tabs = [
    { k: "overview",  l: "Overview" },
    { k: "comments",  l: `Comments (${e.comments.length})` },
    { k: "audit",     l: `Audit (${e.audit.length})` },
  ];
  if (hasECR || canECRSubmit) tabs.push({ k: "ecr", l: hasECR ? "ECR" + (e.invoices.length ? ` · ${invA}/${e.invoices.length}` : "") : "Submit ECR" });
  if (e.disb.length)      tabs.push({ k: "funds",     l: "Funds" });
  if (e.amend.length)     tabs.push({ k: "amend",     l: "Amendments" });
  if (e.revisions.length) tabs.push({ k: "revisions", l: "Revisions" });

  const px = isMobile ? "16px" : "28px";

  return (
    <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: `${isMobile ? 16 : 22}px ${px}`, borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", fontFamily: "var(--m)" }}>{e.id}</span>
              <Dot p={e.priority} /><SlaChip e={e} /><CDChip e={e} /><SurplusBadge e={e} />
            </div>
            <h3 style={{ fontSize: isMobile ? 17 : 20, fontWeight: 700, color: "#0f172a", margin: 0, lineHeight: 1.3 }}>{e.name}</h3>
            <div style={{ display: "flex", gap: 12, marginTop: 7, fontSize: 13, color: "#64748b", flexWrap: "wrap" }}>
              <span>👤 {e.coord}</span><span>📍 {e.region}</span><span>📅 {e.eDate}</span>
            </div>
          </div>
          <div style={{ flexShrink: 0 }}><Badge stage={e.stage} /></div>
        </div>
        {(chg || flg || rej) && (
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, fontSize: 13, display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.5, background: rej || flg ? "#fef2f2" : "#fff7ed", border: "1px solid " + (rej || flg ? "#fecaca" : "#fed7aa"), color: rej || flg ? "#dc2626" : "#c2410c" }}>
            ⚠ <div><b>{rej ? "Rejected" : flg ? "Flagged by Finance" : "Changes Requested"}:</b> {e.audit.filter(a => a.a === (rej ? "Rejected" : flg ? "Flagged by Finance" : "Changes Requested")).pop()?.n}</div>
          </div>
        )}
      </div>

      {/* Tab bar — always horizontally scrollable */}
      <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9", padding: `0 ${isMobile ? 8 : 16}px`, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        {tabs.map(t => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            style={{ padding: isMobile ? "10px 12px" : "12px 18px", fontSize: 13, fontWeight: 600, border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", color: tab === t.k ? "#4f46e5" : "#94a3b8", borderBottom: tab === t.k ? "2px solid #4f46e5" : "2px solid transparent", whiteSpace: "nowrap" }}
          >
            {t.l}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview"  && <OverviewTab e={e} role={role} adm={adm} setTab={setTab} />}
      {tab === "comments"  && <CommentsTab e={e} />}
      {tab === "audit"     && <AuditTab e={e} />}
      {tab === "ecr"       && <ECRTab e={e} role={role} adm={adm} />}
      {tab === "funds"     && <FundsTab e={e} />}
      {tab === "amend"     && <AmendmentsTab e={e} />}
      {tab === "revisions" && <RevisionsTab e={e} />}
    </div>
  );
}
