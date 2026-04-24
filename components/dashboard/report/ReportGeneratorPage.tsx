"use client";
import { useState } from "react";

type ReportFormat = "pdf" | "excel";
type ReportScope = "all" | "expense" | "procurement";
type ReportType = "summary" | "detail" | "vendor" | "employee";
type GenerateState = "idle" | "generating" | "done";

interface ReportHistory {
  id: string;
  name: string;
  type: ReportType;
  scope: ReportScope;
  period: string;
  format: ReportFormat;
  generatedAt: string;
  generatedBy: string;
  pages: number;
  size: string;
}

const reportHistory: ReportHistory[] = [
  { id: "RPT-012", name: "Laporan Audit Q1 2026", type: "detail", scope: "all", period: "Jan – Mar 2026", format: "pdf", generatedAt: "1 Apr 2026, 09:00", generatedBy: "Dewi Rahayu", pages: 84, size: "3.2 MB" },
  { id: "RPT-011", name: "Ringkasan Fraud Maret 2026", type: "summary", scope: "expense", period: "Mar 2026", format: "pdf", generatedAt: "31 Mar 2026, 17:45", generatedBy: "Rina Kusuma", pages: 12, size: "0.8 MB" },
  { id: "RPT-010", name: "Detail Transaksi Vendor Feb", type: "vendor", scope: "procurement", period: "Feb 2026", format: "excel", generatedAt: "3 Mar 2026, 11:20", generatedBy: "Dewi Rahayu", pages: 210, size: "5.1 MB" },
  { id: "RPT-009", name: "Laporan Karyawan Berisiko", type: "employee", scope: "expense", period: "Jan – Feb 2026", format: "excel", generatedAt: "1 Mar 2026, 08:30", generatedBy: "Anton Susilo", pages: 45, size: "1.7 MB" },
  { id: "RPT-008", name: "Laporan Audit Q4 2025", type: "detail", scope: "all", period: "Okt – Des 2025", format: "pdf", generatedAt: "5 Jan 2026, 10:00", generatedBy: "Rina Kusuma", pages: 112, size: "4.6 MB" },
];

const scopeLabels: Record<ReportScope, string> = { all: "Semua", expense: "Expense", procurement: "Procurement" };
const typeLabels: Record<ReportType, string> = { summary: "Ringkasan Eksekutif", detail: "Detail Lengkap", vendor: "Profil Vendor", employee: "Analisis Karyawan" };
const typeDescs: Record<ReportType, string> = {
  summary: "Ringkasan high-level untuk CFO/Direksi. Grafik tren, total exposure, top fraud flags.",
  detail: "Laporan audit lengkap dengan seluruh transaksi, AI explanation, dan audit trail.",
  vendor: "Profil risiko per vendor, riwayat transaksi, dan relasi karyawan.",
  employee: "Analisis pola klaim per karyawan, outlier, dan perbandingan antar departemen.",
};

export default function ReportGeneratorPage() {
  const [scope, setScope] = useState<ReportScope>("all");
  const [reportType, setReportType] = useState<ReportType>("summary");
  const [format, setFormat] = useState<ReportFormat>("pdf");
  const [periodStart, setPeriodStart] = useState("2026-01-01");
  const [periodEnd, setPeriodEnd] = useState("2026-03-31");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRaw, setIncludeRaw] = useState(false);
  const [generateState, setGenerateState] = useState<GenerateState>("idle");

  const handleGenerate = () => {
    setGenerateState("generating");
    setTimeout(() => setGenerateState("done"), 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 800, color: "var(--tp)", letterSpacing: "-0.8px", marginBottom: "4px" }}>
          Report Generator
        </h1>
        <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 300 }}>
          Generate laporan audit siap pakai dalam format PDF atau Excel
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" }}>

        {/* Left — config */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Report type */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", padding: "20px 24px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "14px" }}>Jenis Laporan</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {(["summary", "detail", "vendor", "employee"] as ReportType[]).map(t => (
                <div
                  key={t}
                  onClick={() => setReportType(t)}
                  style={{
                    padding: "14px 16px", borderRadius: "12px", cursor: "pointer",
                    border: `1px solid ${reportType === t ? "rgba(16,185,129,0.35)" : "var(--border)"}`,
                    background: reportType === t ? "var(--em-subtle-2)" : "var(--surface-2)",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontSize: "13px", fontWeight: 500, color: reportType === t ? "var(--em)" : "var(--tp)", marginBottom: "4px" }}>
                    {typeLabels[t]}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--tm)", lineHeight: 1.5, fontWeight: 300 }}>
                    {typeDescs[t]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scope + Period */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Scope */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>Cakupan Data</div>
              <div style={{ display: "flex", gap: "4px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "3px" }}>
                {(["all", "expense", "procurement"] as ReportScope[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setScope(s)}
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
                  { label: "Dari", value: periodStart, onChange: setPeriodStart },
                  { label: "Sampai", value: periodEnd, onChange: setPeriodEnd },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "6px" }}>{f.label}</div>
                    <input
                      type="date"
                      value={f.value}
                      onChange={e => f.onChange(e.target.value)}
                      style={{
                        width: "100%", padding: "9px 12px", borderRadius: "10px",
                        border: "1px solid var(--border)", background: "var(--surface-2)",
                        color: "var(--tp)", fontSize: "13px",
                        fontFamily: "'DM Sans', sans-serif", outline: "none",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Quick period shortcuts */}
              <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
                {[
                  { label: "Bulan ini", start: "2026-04-01", end: "2026-04-30" },
                  { label: "Q1 2026",   start: "2026-01-01", end: "2026-03-31" },
                  { label: "Q4 2025",   start: "2025-10-01", end: "2025-12-31" },
                  { label: "2025",      start: "2025-01-01", end: "2025-12-31" },
                ].map(p => (
                  <button
                    key={p.label}
                    onClick={() => { setPeriodStart(p.start); setPeriodEnd(p.end); }}
                    style={{
                      padding: "4px 12px", borderRadius: "100px", border: "1px solid var(--border)",
                      background: "var(--surface-2)", color: "var(--ts)", fontSize: "11px",
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { (e.currentTarget).style.borderColor = "var(--em)"; (e.currentTarget).style.color = "var(--em)"; }}
                    onMouseLeave={e => { (e.currentTarget).style.borderColor = "var(--border)"; (e.currentTarget).style.color = "var(--ts)"; }}
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
                {([
                  { key: "pdf",   icon: "📄", label: "PDF",   desc: "Siap presentasi" },
                  { key: "excel", icon: "📊", label: "Excel", desc: "Siap analisis lanjutan" },
                ] as { key: ReportFormat; icon: string; label: string; desc: string }[]).map(f => (
                  <div
                    key={f.key}
                    onClick={() => setFormat(f.key)}
                    style={{
                      flex: 1, padding: "12px 16px", borderRadius: "12px", cursor: "pointer",
                      border: `1px solid ${format === f.key ? "rgba(16,185,129,0.35)" : "var(--border)"}`,
                      background: format === f.key ? "var(--em-subtle-2)" : "var(--surface-2)",
                      display: "flex", alignItems: "center", gap: "10px",
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{f.icon}</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: format === f.key ? "var(--em)" : "var(--tp)" }}>{f.label}</div>
                      <div style={{ fontSize: "11px", color: "var(--tm)" }}>{f.desc}</div>
                    </div>
                    {format === f.key && (
                      <div style={{ marginLeft: "auto" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
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
                  { label: "Sertakan grafik & visualisasi", desc: "Chart tren, pie chart kategori fraud", value: includeCharts, onChange: setIncludeCharts },
                  { label: "Sertakan data mentah", desc: "Raw transaksi dalam lampiran", value: includeRaw, onChange: setIncludeRaw },
                ].map(opt => (
                  <div key={opt.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                    <div>
                      <div style={{ fontSize: "13px", color: "var(--tp)", fontWeight: 400 }}>{opt.label}</div>
                      <div style={{ fontSize: "11px", color: "var(--tm)" }}>{opt.desc}</div>
                    </div>
                    <div
                      onClick={() => opt.onChange(!opt.value)}
                      style={{
                        width: "40px", height: "22px", borderRadius: "100px", flexShrink: 0,
                        background: opt.value ? "var(--em)" : "var(--border)",
                        position: "relative", cursor: "pointer", transition: "background 0.2s",
                      }}
                    >
                      <div style={{
                        position: "absolute", top: "3px",
                        left: opt.value ? "21px" : "3px",
                        width: "16px", height: "16px", borderRadius: "50%",
                        background: "#fff", transition: "left 0.2s",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right — preview + generate */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "88px" }}>

          {/* Preview card */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Preview Laporan</div>

            {/* Report mock cover */}
            <div style={{ borderRadius: "12px", background: "var(--footer-cta-bg)", border: "1px solid var(--border)", padding: "20px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, var(--em), transparent)", opacity: 0.4 }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: "linear-gradient(135deg, var(--em), var(--em2))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="11" height="11" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.4" opacity="0.4"/><path d="M6 10.5l3 3L14.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
                    { label: "Format", value: format.toUpperCase() },
                  ].map(r => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "10px", color: "rgba(232,245,238,0.40)" }}>{r.label}</span>
                      <span style={{ fontSize: "10px", color: "rgba(232,245,238,0.75)", fontWeight: 500 }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Estimated contents */}
            <div>
              <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "8px" }}>Akan disertakan:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[
                  "Ringkasan eksekutif",
                  "Statistik fraud score",
                  ...(includeCharts ? ["Grafik tren & visualisasi"] : []),
                  reportType === "detail" ? "Detail per transaksi + AI explanation" : null,
                  reportType === "vendor" ? "Profil risiko vendor" : null,
                  reportType === "employee" ? "Analisis per karyawan" : null,
                  "Audit trail & log aktivitas",
                  ...(includeRaw ? ["Lampiran data mentah"] : []),
                ].filter(Boolean).map(item => (
                  <div key={item as string} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "var(--ts)" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generate button */}
          {generateState === "idle" && (
            <button
              onClick={handleGenerate}
              style={{
                width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                background: "linear-gradient(135deg, var(--em), var(--em2))",
                color: "#fff", fontSize: "14px", fontWeight: 500,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 4px 20px rgba(16,185,129,0.30)",
                transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
              onMouseEnter={e => { (e.currentTarget).style.transform = "translateY(-1px)"; (e.currentTarget).style.boxShadow = "0 8px 28px rgba(16,185,129,0.40)"; }}
              onMouseLeave={e => { (e.currentTarget).style.transform = "translateY(0)"; (e.currentTarget).style.boxShadow = "0 4px 20px rgba(16,185,129,0.30)"; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Generate Laporan
            </button>
          )}

          {generateState === "generating" && (
            <div style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} } .spin{animation:spin 0.9s linear infinite}`}</style>
              <div className="spin" style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid var(--border)", borderTop: "2px solid var(--em)" }} />
              <span style={{ fontSize: "13px", color: "var(--ts)" }}>AI sedang menyusun laporan...</span>
            </div>
          )}

          {generateState === "done" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ padding: "14px 16px", borderRadius: "12px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.20)", display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ fontSize: "13px", color: "var(--em)", fontWeight: 500 }}>Laporan siap diunduh!</span>
              </div>
              <button style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 20px rgba(16,185,129,0.30)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Unduh {format.toUpperCase()}
              </button>
              <button onClick={() => setGenerateState("idle")} style={{ width: "100%", padding: "10px", borderRadius: "12px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Generate Ulang
              </button>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)", marginBottom: "3px" }}>Riwayat Laporan</h3>
          <p style={{ fontSize: "12px", color: "var(--tm)" }}>Laporan yang pernah digenerate</p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["ID", "Nama Laporan", "Jenis", "Periode", "Format", "Dibuat oleh", "Waktu", "Ukuran", ""].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", background: "var(--surface-2)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportHistory.map((r, i) => (
                <tr key={r.id}
                  style={{ borderBottom: i < reportHistory.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px" }}><span style={{ fontSize: "12px", fontWeight: 600, color: "var(--em)" }}>{r.id}</span></td>
                  <td style={{ padding: "12px 16px", maxWidth: "200px" }}>
                    <div style={{ fontSize: "13px", color: "var(--tp)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", background: "var(--em-subtle)", border: "1px solid var(--border)", color: "var(--ts)" }}>{typeLabels[r.type]}</span>
                  </td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: "12px", color: "var(--tm)" }}>{r.period}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", background: r.format === "pdf" ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)", border: `1px solid ${r.format === "pdf" ? "rgba(239,68,68,0.18)" : "rgba(16,185,129,0.18)"}`, color: r.format === "pdf" ? "#dc2626" : "var(--em)", fontWeight: 500 }}>
                      {r.format.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}><span style={{ fontSize: "12px", color: "var(--ts)" }}>{r.generatedBy}</span></td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}><span style={{ fontSize: "12px", color: "var(--tm)" }}>{r.generatedAt}</span></td>
                  <td style={{ padding: "12px 16px" }}><span style={{ fontSize: "12px", color: "var(--tm)" }}>{r.size}</span></td>
                  <td style={{ padding: "12px 16px" }}>
                    <button style={{ padding: "5px 14px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", fontSize: "12px", color: "var(--ts)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "5px", transition: "all 0.15s" }}
                      onMouseEnter={e => { (e.currentTarget).style.borderColor = "var(--em)"; (e.currentTarget).style.color = "var(--em)"; }}
                      onMouseLeave={e => { (e.currentTarget).style.borderColor = "var(--border)"; (e.currentTarget).style.color = "var(--ts)"; }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Unduh
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}