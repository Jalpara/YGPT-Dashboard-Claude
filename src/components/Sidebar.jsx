import { REGIONS, ROLES } from "../data/constants.js";
import { NotificationBadge } from "./ui/Chips.jsx";

export default function Sidebar({ role, nav, setNav, setSel, rgn, setRgn, q, setQ, sel, navItems, isMobile, drawerOpen, onRoleChange }) {
  const adm = role === "Super Admin";

  const sidebarStyle = isMobile ? {
    position: "fixed",
    top: 56,
    left: 0,
    bottom: 0,
    width: 260,
    zIndex: 45,
    transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.22s ease",
    overflowY: "auto",
    background: "#fff",
    borderRight: "1px solid #e2e8f0",
    padding: "14px 10px 20px",
    display: "flex",
    flexDirection: "column",
  } : {
    width: 240,
    background: "#fff",
    borderRight: "1px solid #e2e8f0",
    padding: "16px 10px",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div style={sidebarStyle}>
      {/* Role switcher (mobile only) */}
      {isMobile && (
        <div style={{ marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8, paddingLeft: 4 }}>
            Role
            {adm && <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, color: "#b45309", background: "#fef3c7", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase" }}>Admin</span>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {ROLES.map(r => {
              const active = role === r;
              const isAdmin = r === "Super Admin";
              return (
                <button
                  key={r}
                  onClick={() => onRoleChange(r)}
                  style={{
                    padding: "8px 12px", borderRadius: 7, border: "none",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    textAlign: "left", fontFamily: "inherit",
                    background: active ? (isAdmin ? "#fef3c7" : "#eef2ff") : "transparent",
                    color: active ? (isAdmin ? "#b45309" : "#4f46e5") : "#64748b",
                  }}
                >
                  {isAdmin ? "⚡ " : ""}{r}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 12, padding: "0 4px" }}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search events…"
          style={{ width: "100%", padding: "8px 10px 8px 32px", borderRadius: 7, border: "1px solid #e2e8f0", fontSize: 13, fontFamily: "inherit", outline: "none", background: "#f8fafc", boxSizing: "border-box" }}
        />
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#94a3b8", pointerEvents: "none" }}>🔍</span>
      </div>

      {/* Navigation */}
      {navItems.map(x => (
        <button
          key={x.k}
          onClick={() => setNav(x.k)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 12px", borderRadius: 7, marginBottom: 2,
            border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
            textAlign: "left", width: "100%", fontFamily: "inherit",
            background: nav === x.k ? "#eef2ff" : "transparent",
            color: nav === x.k ? "#4f46e5" : "#64748b",
          }}
        >
          <span style={{ flex: 1 }}>{x.l}</span>
          {x.n > 0 && <NotificationBadge n={x.n} />}
        </button>
      ))}

      {/* Region filter */}
      {role !== "Regional Coordinator" && (
        <div style={{ marginTop: 20, padding: "0 12px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>Region</div>
          {["All", ...REGIONS].map(r => (
            <button
              key={r}
              onClick={() => setRgn(r)}
              style={{
                display: "block", width: "100%", padding: "5px 8px", borderRadius: 5,
                border: "none", fontSize: 12, fontWeight: rgn === r ? 700 : 500,
                cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                background: rgn === r ? "#eef2ff" : "transparent",
                color: rgn === r ? "#4f46e5" : "#94a3b8",
                marginBottom: 1,
              }}
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* Back button */}
      {sel && (
        <button
          onClick={() => { setSel(null); }}
          style={{ marginTop: "auto", padding: "9px 12px", borderRadius: 7, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", width: "calc(100% - 8px)", marginLeft: 4 }}
        >
          ← Back to list
        </button>
      )}
    </div>
  );
}
