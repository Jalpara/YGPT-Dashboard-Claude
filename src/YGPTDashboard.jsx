import { useState, useMemo } from "react";
import { useEvents } from "./hooks/useEvents.js";
import { useMobile } from "./hooks/useMobile.js";
import { daysDiff, slaLeft, pendingFor } from "./utils/helpers.js";
import TopBar from "./components/TopBar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Detail from "./components/detail/Detail.jsx";
import QueueView from "./components/views/QueueView.jsx";
import PipelineView from "./components/views/PipelineView.jsx";
import OverviewView from "./components/views/OverviewView.jsx";
import AnalyticsView from "./components/views/AnalyticsView.jsx";
import MyEventsView from "./components/views/MyEventsView.jsx";

export default function YGPTDashboard() {
  const { events, loading, error, refetch } = useEvents();
  const [role, setRole] = useState("Super Admin");
  const [sel, setSel] = useState(null);
  const [nav, setNav] = useState("pending");
  const [rgn, setRgn] = useState("All");
  const [q, setQ] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMobile();

  const adm = role === "Super Admin";

  const evts = useMemo(() => {
    let x = events;
    if (rgn !== "All") x = x.filter(e => e.region === rgn);
    if (q.trim()) {
      const s = q.toLowerCase();
      x = x.filter(e =>
        e.name.toLowerCase().includes(s) ||
        e.id.toLowerCase().includes(s) ||
        e.coord.toLowerCase().includes(s)
      );
    }
    return x;
  }, [events, rgn, q]);

  const pend = useMemo(() => pendingFor(role, adm, evts), [role, adm, evts]);

  const nt = useMemo(() => ({
    pend:        pend.length,
    ecr:         evts.filter(e => e.stage === "ECR Submitted").length,
    ecrF:        evts.filter(e => e.stage === "ECR Reviewed").length,
    overdue:     evts.filter(e => { const l = slaLeft(e); return l !== null && l < 0; }).length,
    surplusPend: evts.filter(e => e.surplusStatus === "Pending Return").length,
  }), [pend, evts]);

  const stats = useMemo(() => ({
    total:       evts.length,
    budgetTotal: evts.reduce((s, x) => s + x.curBudget, 0),
    spent:       evts.filter(x => x.actual).reduce((s, x) => s + x.actual, 0),
  }), [evts]);

  const cycleTime = useMemo(() => {
    const done = evts.filter(e => e.audit.find(a => a.a === "Funds Released"));
    const times = done.map(e => {
      const f = e.audit[0].at;
      const fu = e.audit.find(a => a.a === "Funds Released");
      return fu ? daysDiff(f.split(" ")[0], fu.at.split(" ")[0]) : null;
    }).filter(Boolean);
    return times.length ? Math.round(times.reduce((a, b) => a + b) / times.length) : null;
  }, [evts]);

  const budgetAcc = useMemo(() => {
    const d = evts.filter(e => e.actual != null);
    if (!d.length) return null;
    return (100 - d.map(e => Math.abs(e.actual - e.curBudget) / e.curBudget * 100).reduce((a, b) => a + b) / d.length).toFixed(1);
  }, [evts]);

  const getNavItems = () => {
    if (role === "Regional Coordinator") {
      return [
        { k: "myevents", l: "My Events",  n: pend.length },
        { k: "overview", l: "Overview" },
        { k: "pipeline", l: "Pipeline" },
      ];
    }
    const items = [{ k: "pending", l: "Pending on Me", n: nt.pend }];
    if (role === "Events Team" || adm)          items.push({ k: "ecr",     l: "ECR Review",       n: nt.ecr });
    if (role === "Finance & Accounts" || adm)   items.push({ k: "close",   l: "Verify & Close",   n: nt.ecrF });
    if ((role === "Finance & Accounts" || adm) && nt.surplusPend > 0)
                                                items.push({ k: "surplus", l: "Surplus Pending",  n: nt.surplusPend });
    items.push({ k: "pipeline", l: "Pipeline" }, { k: "overview", l: "Overview" }, { k: "analytics", l: "Analytics" });
    return items;
  };

  const handleRoleChange = (r) => {
    setRole(r);
    setSel(null);
    setQ("");
    setNav(r === "Regional Coordinator" ? "myevents" : "pending");
    setDrawerOpen(false);
  };

  const handleNav = (k) => {
    setNav(k);
    setSel(null);
    setDrawerOpen(false);
  };

  const renderContent = () => {
    if (sel) return <Detail e={sel} role={role} adm={adm} />;
    switch (nav) {
      case "pending":   return <QueueView items={pend} title="Pending on Me" sub={pend.length + " items need your action"} overdueCount={nt.overdue} onOpen={setSel} />;
      case "ecr":       return <QueueView items={evts.filter(e => e.stage === "ECR Submitted")} title="ECR Review" sub="Completion reports awaiting review" overdueCount={0} onOpen={setSel} />;
      case "close":     return <QueueView items={evts.filter(e => e.stage === "ECR Reviewed")} title="Verify & Close" sub="Awaiting invoice verification" overdueCount={0} onOpen={setSel} />;
      case "surplus":   return <QueueView items={evts.filter(e => e.surplusStatus === "Pending Return")} title="Surplus Pending Return" sub="Events with unaccounted surplus funds" overdueCount={0} onOpen={setSel} />;
      case "pipeline":  return <PipelineView evts={evts} onOpen={setSel} />;
      case "overview":  return <OverviewView evts={evts} stats={stats} onOpen={setSel} />;
      case "analytics": return <AnalyticsView evts={evts} cycleTime={cycleTime} budgetAcc={budgetAcc} overdueCount={nt.overdue} onOpen={setSel} />;
      case "myevents":  return <MyEventsView evts={evts} onOpen={setSel} />;
      default:          return <OverviewView evts={evts} stats={stats} onOpen={setSel} />;
    }
  };

  return (
    <div style={{ "--m": "'JetBrains Mono',monospace", minHeight: "100vh", background: "#f7f8fa", fontFamily: "'Outfit',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700;800&display=swap" rel="stylesheet" />
      <TopBar
        role={role} adm={adm} onRoleChange={handleRoleChange}
        loading={loading} onRefetch={refetch}
        isMobile={isMobile} drawerOpen={drawerOpen} onMenuToggle={() => setDrawerOpen(o => !o)}
      />
      {error && (
        <div style={{ background: "#fef2f2", borderBottom: "1px solid #fecaca", padding: "8px 20px", fontSize: 13, color: "#dc2626", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>⚠ Could not load from Google Sheets: {error}</span>
          <button onClick={refetch} style={{ fontSize: 12, fontWeight: 600, color: "#dc2626", background: "none", border: "1px solid #fecaca", borderRadius: 4, padding: "2px 10px", cursor: "pointer", fontFamily: "inherit" }}>Retry</button>
        </div>
      )}
      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)", position: "relative" }}>
        {/* Mobile backdrop */}
        {isMobile && drawerOpen && (
          <div
            onClick={() => setDrawerOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 40 }}
          />
        )}
        <Sidebar
          role={role} nav={nav} setNav={handleNav} setSel={setSel}
          rgn={rgn} setRgn={(r) => { setRgn(r); setSel(null); setDrawerOpen(false); }}
          q={q} setQ={setQ} sel={sel} navItems={getNavItems()}
          isMobile={isMobile} drawerOpen={drawerOpen}
          onRoleChange={handleRoleChange}
        />
        <div style={{ flex: 1, padding: isMobile ? "16px" : "24px 28px", overflowY: "auto", minWidth: 0 }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
