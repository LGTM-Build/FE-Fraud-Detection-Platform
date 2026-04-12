interface RiskMeterProps {
  score: number;
}

export function RiskMeter({ score }: RiskMeterProps) {
  const color = score >= 70 ? "#ef4444" : score >= 40 ? "#f59e0b" : "#10b981";
  const label = score >= 70 ? "High Risk" : score >= 40 ? "Medium Risk" : "Low Risk";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
        <span style={{ fontSize: "11px", color: "var(--tm)" }}>Risk Score</span>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
      </div>
      <div style={{ height: "6px", borderRadius: "3px", background: "var(--border)", overflow: "hidden", marginBottom: "4px" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: "3px", transition: "width 0.4s ease" }} />
      </div>
      <div style={{ fontSize: "10px", color, fontWeight: 500 }}>{label}</div>
    </div>
  );
}