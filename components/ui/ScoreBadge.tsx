export default function ScoreBadge({ score }: { score: number }) {
  const color = score >= 70 ? "#ef4444" : score >= 30 ? "#f59e0b" : "#10b981";
  const bg    = score >= 70 ? "rgba(239,68,68,0.10)" : score >= 30 ? "rgba(245,158,11,0.10)" : "rgba(16,185,129,0.10)";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{
        width: "48px", height: "4px", borderRadius: "2px",
        background: "var(--border)", overflow: "hidden", flexShrink: 0,
      }}>
        <div style={{
          width: `${score}%`, height: "100%",
          background: color, borderRadius: "2px",
          transition: "width 0.3s ease",
        }} />
      </div>
      <span style={{ fontSize: "12px", fontWeight: 600, color, minWidth: "28px" }}>
        {score}
      </span>
    </div>
  );
}