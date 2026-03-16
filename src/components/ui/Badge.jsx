import { SC } from "../../data/constants.js";

export default function Badge({ stage, sm }) {
  const color = SC[stage] || "#6b7280";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: sm ? "2px 8px" : "3px 10px", borderRadius: 14,
      fontSize: sm ? 10 : 11, fontWeight: 600, whiteSpace: "nowrap",
      background: color + "12", color, border: "1px solid " + color + "25",
    }}>
      <span style={{ width: sm ? 4 : 5, height: sm ? 4 : 5, borderRadius: "50%", background: color }} />
      {stage}
    </span>
  );
}
