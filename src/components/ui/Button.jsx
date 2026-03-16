const VARIANTS = {
  pri: { background: "#22c55e", color: "#fff" },
  dan: { border: "1px solid #fecaca", background: "#fff", color: "#ef4444" },
  sec: { border: "1px solid #e2e8f0", background: "#fff", color: "#64748b" },
  pur: { background: "#7c3aed", color: "#fff" },
  blu: { background: "#0ea5e9", color: "#fff" },
  tea: { background: "#14b8a6", color: "#fff" },
  drk: { background: "#1e293b", color: "#fff" },
  amb: { background: "#f59e0b", color: "#fff" },
};

export default function Button({ children, v = "sec", onClick }) {
  const base = { padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none", fontFamily: "inherit" };
  return <button onClick={onClick} style={{ ...base, ...VARIANTS[v] }}>{children}</button>;
}
