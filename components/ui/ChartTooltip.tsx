export type TooltipPayload = {
  name: string;
  value: number;
  color: string;
};

export default function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--footer-cta-bg)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "12px 16px",
      fontSize: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    }}>
      <p style={{ color: "var(--tm)", marginBottom: "8px", fontWeight: 500 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.color, flexShrink: 0 }} />
          <span style={{ color: "var(--ts)" }}>{p.name === "expense" ? "Expense" : "Procurement"}</span>
          <span style={{ color: "var(--tp)", fontWeight: 600, marginLeft: "auto", paddingLeft: "12px" }}>
            {p.value} kasus
          </span>
        </div>
      ))}
    </div>
  );
}