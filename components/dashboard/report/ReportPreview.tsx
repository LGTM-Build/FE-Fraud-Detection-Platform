import { ReportType, ReportScope, ReportFormat, GenerateState, typeLabels, scopeLabels } from "@/data/reports";

interface ReportPreviewProps {
  reportType: ReportType;
  scope: ReportScope;
  periodStart: string;
  periodEnd: string;
  format: ReportFormat;
  includeCharts: boolean;
  includeRaw: boolean;
  generateState: GenerateState;
  onGenerate: () => void;
  onReset: () => void;
}

export function ReportPreview({
  reportType, scope, periodStart, periodEnd, format,
  includeCharts, includeRaw,
  generateState, onGenerate, onReset,
}: ReportPreviewProps) {
  const contents = [
    "Ringkasan eksekutif",
    "Statistik fraud score",
    ...(includeCharts ? ["Grafik tren & visualisasi"] : []),
    reportType === "detail"   ? "Detail per transaksi + AI explanation" : null,
    reportType === "vendor"   ? "Profil risiko vendor" : null,
    reportType === "employee" ? "Analisis per karyawan" : null,
    "Audit trail & log aktivitas",
    ...(includeRaw ? ["Lampiran data mentah"] : []),
  ].filter(Boolean) as string[];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "88px" }}>

      {/* Preview card */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Preview Laporan</div>

        {/* Mock cover */}
        <div style={{ borderRadius: "12px", background: "var(--footer-cta-bg)", border: "1px solid var(--border)", padding: "20px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, var(--em), transparent)", opacity: 0.4 }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: "linear-gradient(135deg, var(--em), var(--em2))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="11" height="11" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.4" opacity="0.4"/>
                  <path d="M6 10.5l3 3L14.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "13px", fontWeight: 800, color: "#e8f5ee" }}>Fradara</span>
            </div>
            <div style={{ fontSize: "10px", color: "rgba(232,245,238,0.45)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Laporan Audit</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700, color: "#e8f5ee", marginBottom: "12px", lineHeight: 1.2 }}>
              {typeLabels[reportType]}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {[
                { label: "Cakupan", value: scopeLabels[scope] },
                { label: "Periode", value: `${periodStart} – ${periodEnd}` },
                { label: "Format",  value: format.toUpperCase() },
              ].map((r) => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "10px", color: "rgba(232,245,238,0.40)" }}>{r.label}</span>
                  <span style={{ fontSize: "10px", color: "rgba(232,245,238,0.75)", fontWeight: 500 }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contents list */}
        <div>
          <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "8px" }}>Akan disertakan:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {contents.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "var(--ts)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate / state buttons */}
      <GenerateButton state={generateState} format={format} onGenerate={onGenerate} onReset={onReset} />
    </div>
  );
}

// ─── Sub-component ───────────────────────────────────────────

function GenerateButton({ state, format, onGenerate, onReset }: {
  state: GenerateState;
  format: ReportFormat;
  onGenerate: () => void;
  onReset: () => void;
}) {
  if (state === "idle") return (
    <button
      onClick={onGenerate}
      style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 20px rgba(16,185,129,0.30)", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(16,185,129,0.40)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(16,185,129,0.30)"; }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
      Generate Laporan
    </button>
  );

  if (state === "generating") return (
    <div style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.spin{animation:spin 0.9s linear infinite}`}</style>
      <div className="spin" style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid var(--border)", borderTop: "2px solid var(--em)" }} />
      <span style={{ fontSize: "13px", color: "var(--ts)" }}>AI sedang menyusun laporan...</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ padding: "14px 16px", borderRadius: "12px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.20)", display: "flex", alignItems: "center", gap: "10px" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span style={{ fontSize: "13px", color: "var(--em)", fontWeight: 500 }}>Laporan siap diunduh!</span>
      </div>
      <button style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 20px rgba(16,185,129,0.30)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Unduh {format.toUpperCase()}
      </button>
      <button onClick={onReset} style={{ width: "100%", padding: "10px", borderRadius: "12px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
        Generate Ulang
      </button>
    </div>
  );
}