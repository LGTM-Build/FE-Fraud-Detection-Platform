import { getFraudRiskConfig } from "@/data/expenses";

interface ScoreBarProps {
  score: number;
}

export function ScoreBar({ score }: ScoreBarProps) {
  const risk = getFraudRiskConfig(score);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "48px",
          height: "4px",
          borderRadius: "2px",
          background: "var(--border)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            background: risk.color,
            borderRadius: "2px",
          }}
        />
      </div>
      <span
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: risk.color,
          minWidth: "24px",
        }}
      >
        {score}
      </span>
    </div>
  );
}