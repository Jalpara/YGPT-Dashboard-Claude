import { ROLES } from "../data/constants.js";

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 5h14M3 10h14M3 15h14" />
    </svg>
  );
}

export default function TopBar({ role, adm, onRoleChange, loading, onRefetch, isMobile, drawerOpen, onMenuToggle }) {
  return (
    <div style={{
      background: "#fff",
      borderBottom: "1px solid #e2e8f0",
      padding: "0 16px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 56, position: "sticky", top: 0, zIndex: 50, flexShrink: 0,
    }}>
      {/* Left: logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 7, background: "linear-gradient(135deg,#6366f1,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: "var(--m)" }}>Y</span>
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>YGPT Events</span>
        {adm && !isMobile && (
          <span style={{ fontSize: 10, fontWeight: 700, color: "#b45309", background: "#fef3c7", padding: "2px 7px", borderRadius: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Admin
          </span>
        )}
        {loading && <span style={{ fontSize: 11, color: "#94a3b8" }}>Syncing…</span>}
      </div>

      {/* Right: role switcher (desktop) or hamburger (mobile) */}
      {isMobile ? (
        <button
          onClick={onMenuToggle}
          aria-label="Toggle menu"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 8, border: "1px solid #e2e8f0", background: drawerOpen ? "#eef2ff" : "#fff", color: drawerOpen ? "#4f46e5" : "#64748b", cursor: "pointer" }}
        >
          <MenuIcon />
        </button>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          {ROLES.map(r => {
            const active = role === r;
            const isAdmin = r === "Super Admin";
            return (
              <button
                key={r}
                onClick={() => onRoleChange(r)}
                style={{
                  padding: "5px 12px", borderRadius: 5, border: "none",
                  fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  background: active ? (isAdmin ? "#fef3c7" : "#eef2ff") : "transparent",
                  color: active ? (isAdmin ? "#b45309" : "#4f46e5") : "#94a3b8",
                  transition: "background 0.1s, color 0.1s",
                }}
              >
                {isAdmin ? "⚡ Admin" : r}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
