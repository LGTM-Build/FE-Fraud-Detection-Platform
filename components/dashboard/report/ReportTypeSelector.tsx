import { ReportType, typeLabels, typeDescs } from "@/data/reports";

const REPORT_TYPES: ReportType[] = ["summary", "detail", "vendor", "employee"];

interface ReportTypeSelectorProps {
  value: ReportType;
  onChange: (t: ReportType) => void;
}

export function ReportTypeSelector({ value, onChange }: ReportTypeSelectorProps) {
  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", padding: "20px 24px" }}>
      <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "14px" }}>
        Jenis Laporan
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {REPORT_TYPES.map((t) => (
          <div
            key={t}
            onClick={() => onChange(t)}
            style={{
              padding: "14px 16px", borderRadius: "12px", cursor: "pointer",
              border: `1px solid ${value === t ? "rgba(16,185,129,0.35)" : "var(--border)"}`,
              background: value === t ? "var(--em-subtle-2)" : "var(--surface-2)",
              transition: "all 0.15s",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: 500, color: value === t ? "var(--em)" : "var(--tp)", marginBottom: "4px" }}>
              {typeLabels[t]}
            </div>
            <div style={{ fontSize: "11px", color: "var(--tm)", lineHeight: 1.5, fontWeight: 300 }}>
              {typeDescs[t]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}