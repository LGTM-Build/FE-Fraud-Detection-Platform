import { ReportScope, ReportFormat, scopeLabels, PERIOD_SHORTCUTS } from "@/data/reports";

interface ReportConfigProps {
  scope: ReportScope;
  periodStart: string;
  periodEnd: string;
  format: ReportFormat;
  includeCharts: boolean;
  includeRaw: boolean;
  onScopeChange: (s: ReportScope) => void;
  onPeriodStartChange: (v: string) => void;
  onPeriodEndChange: (v: string) => void;
  onFormatChange: (f: ReportFormat) => void;
  onIncludeChartsChange: (v: boolean) => void;
  onIncludeRawChange: (v: boolean) => void;
}

const SCOPES: ReportScope[] = ["all", "expense", "procurement"];

const FORMATS: { key: ReportFormat; icon: string; label: string; desc: string }[] = [
  { key: "pdf",   icon: "📄", label: "PDF",   desc: "Siap presentasi" },
  { key: "excel", icon: "📊", label: "Excel", desc: "Siap analisis lanjutan" },
];

export function ReportConfig({
  scope, periodStart, periodEnd, format,
  includeCharts, includeRaw,
  onScopeChange, onPeriodStartChange, onPeriodEndChange,
  onFormatChange, onIncludeChartsChange, onIncludeRawChange,
}: ReportConfigProps) {
  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Scope */}
      <div>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>Cakupan Data</div>
        <div style={{ display: "flex", gap: "4px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "3px" }}>
          {SCOPES.map((s) => (
            <button
              key={s}
              onClick={() => onScopeChange(s)}
              style={{
                flex: 1, padding: "7px 12px", borderRadius: "8px", border: "none",
                fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                fontWeight: scope === s ? 500 : 400, transition: "all 0.15s",
                background: scope === s ? "var(--em-subtle-2)" : "transparent",
                color: scope === s ? "var(--em)" : "var(--tm)",
              }}
            >
              {scopeLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Period */}
      <div>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>Periode</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[
            { label: "Dari",   value: periodStart, onChange: onPeriodStartChange },
            { label: "Sampai", value: periodEnd,   onChange: onPeriodEndChange },
          ].map((f) => (
            <div key={f.label}>
              <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "6px" }}>{f.label}</div>
              <input
                type="date"
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--tp)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }}
              />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
          {PERIOD_SHORTCUTS.map((p) => (
            <button
              key={p.label}
              onClick={() => { onPeriodStartChange(p.start); onPeriodEndChange(p.end); }}
              style={{ padding: "4px 12px", borderRadius: "100px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--ts)", fontSize: "11px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--em)"; e.currentTarget.style.color = "var(--em)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ts)"; }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Format */}
      <div>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>Format Ekspor</div>
        <div style={{ display: "flex", gap: "10px" }}>
          {FORMATS.map((f) => (
            <div
              key={f.key}
              onClick={() => onFormatChange(f.key)}
              style={{
                flex: 1, padding: "12px 16px", borderRadius: "12px", cursor: "pointer",
                border: `1px solid ${format === f.key ? "rgba(16,185,129,0.35)" : "var(--border)"}`,
                background: format === f.key ? "var(--em-subtle-2)" : "var(--surface-2)",
                display: "flex", alignItems: "center", gap: "10px", transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: "20px" }}>{f.icon}</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 500, color: format === f.key ? "var(--em)" : "var(--tp)" }}>{f.label}</div>
                <div style={{ fontSize: "11px", color: "var(--tm)" }}>{f.desc}</div>
              </div>
              {format === f.key && (
                <div style={{ marginLeft: "auto" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Options */}
      <div>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>Opsi Tambahan</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { label: "Sertakan grafik & visualisasi", desc: "Chart tren, pie chart kategori fraud", value: includeCharts, onChange: onIncludeChartsChange },
            { label: "Sertakan data mentah",          desc: "Raw transaksi dalam lampiran",         value: includeRaw,    onChange: onIncludeRawChange },
          ].map((opt) => (
            <div key={opt.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "13px", color: "var(--tp)", fontWeight: 400 }}>{opt.label}</div>
                <div style={{ fontSize: "11px", color: "var(--tm)" }}>{opt.desc}</div>
              </div>
              <div
                onClick={() => opt.onChange(!opt.value)}
                style={{ width: "40px", height: "22px", borderRadius: "100px", flexShrink: 0, background: opt.value ? "var(--em)" : "var(--border)", position: "relative", cursor: "pointer", transition: "background 0.2s" }}
              >
                <div style={{ position: "absolute", top: "3px", left: opt.value ? "21px" : "3px", width: "16px", height: "16px", borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}