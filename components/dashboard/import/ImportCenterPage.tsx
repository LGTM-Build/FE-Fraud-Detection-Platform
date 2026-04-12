"use client";
import { useState, useRef } from "react";

type ImportStatus = "success" | "processing" | "error" | "partial";
type ImportModule = "expense" | "procurement";

interface ImportBatch {
  id: string;
  filename: string;
  module: ImportModule;
  uploadedAt: string;
  uploadedBy: string;
  totalRows: number;
  mappedRows: number;
  errorRows: number;
  status: ImportStatus;
  duration: string;
}

const importHistory: ImportBatch[] = [
  { id: "IMP-0041", filename: "expense_april_2026.csv", module: "expense", uploadedAt: "12 Apr 2026, 09:14", uploadedBy: "Dewi Rahayu", totalRows: 342, mappedRows: 342, errorRows: 0, status: "success", duration: "18 dtk" },
  { id: "IMP-0040", filename: "po_q1_procurement.csv", module: "procurement", uploadedAt: "10 Apr 2026, 14:32", uploadedBy: "Rina Kusuma", totalRows: 128, mappedRows: 121, errorRows: 7, status: "partial", duration: "24 dtk" },
  { id: "IMP-0039", filename: "sap_export_mar26.csv", module: "expense", uploadedAt: "5 Apr 2026, 11:05", uploadedBy: "Dewi Rahayu", totalRows: 891, mappedRows: 891, errorRows: 0, status: "success", duration: "41 dtk" },
  { id: "IMP-0038", filename: "vendor_invoice_q1.csv", module: "procurement", uploadedAt: "1 Apr 2026, 08:47", uploadedBy: "Anton Susilo", totalRows: 256, mappedRows: 0, errorRows: 256, status: "error", duration: "3 dtk" },
  { id: "IMP-0037", filename: "expense_mar_2026.csv", module: "expense", uploadedAt: "28 Mar 2026, 16:20", uploadedBy: "Dewi Rahayu", totalRows: 410, mappedRows: 410, errorRows: 0, status: "success", duration: "22 dtk" },
  { id: "IMP-0036", filename: "odoo_export_feb26.csv", module: "procurement", uploadedAt: "3 Mar 2026, 10:11", uploadedBy: "Fajar Nugroho", totalRows: 183, mappedRows: 179, errorRows: 4, status: "partial", duration: "19 dtk" },
];

const statusConfig: Record<ImportStatus, { label: string; bg: string; color: string; border: string; dot: string }> = {
  success:    { label: "Berhasil",   bg: "rgba(16,185,129,0.10)", color: "var(--em)", border: "rgba(16,185,129,0.20)", dot: "#10b981" },
  processing: { label: "Memproses", bg: "rgba(245,158,11,0.10)", color: "#d97706",    border: "rgba(245,158,11,0.20)", dot: "#f59e0b" },
  partial:    { label: "Parsial",   bg: "rgba(245,158,11,0.10)", color: "#d97706",    border: "rgba(245,158,11,0.20)", dot: "#f59e0b" },
  error:      { label: "Gagal",     bg: "rgba(239,68,68,0.10)",  color: "#dc2626",    border: "rgba(239,68,68,0.20)", dot: "#ef4444" },
};

// Simulated CSV column mapping result
const mockMappingResult = {
  filename: "expense_april_2026.csv",
  totalRows: 342,
  detectedSource: "SAP Concur Export",
  mappings: [
    { sourceCol: "POSTING_DATE",     targetField: "transaction_date", confidence: 99, status: "mapped" },
    { sourceCol: "CLAIM_AMOUNT",     targetField: "amount",           confidence: 97, status: "mapped" },
    { sourceCol: "EXPENSE_TYPE",     targetField: "expense_category", confidence: 94, status: "mapped" },
    { sourceCol: "VENDOR_NAME",      targetField: "merchant_name",    confidence: 91, status: "mapped" },
    { sourceCol: "EMPLOYEE_ID",      targetField: "employee_id",      confidence: 99, status: "mapped" },
    { sourceCol: "TXN_REF",          targetField: "transaction_id",   confidence: 98, status: "mapped" },
    { sourceCol: "NOTES",            targetField: "description",      confidence: 86, status: "mapped" },
    { sourceCol: "RECEIPT_URL",      targetField: "receipt_attachment",confidence: 88, status: "mapped" },
    { sourceCol: "DEPT_CODE",        targetField: "department",       confidence: 72, status: "review" },
    { sourceCol: "EMP_GRADE_LEVEL",  targetField: "employee_grade",   confidence: 65, status: "review" },
    { sourceCol: "ATTENDEES_LIST",   targetField: "attendee_list",    confidence: 55, status: "review" },
    { sourceCol: "INTERNAL_CODE",    targetField: null,               confidence: 0,  status: "unmapped" },
  ],
};

type Step = "upload" | "mapping" | "processing" | "done";

export default function ImportCenterPage() {
  const [step, setStep] = useState<Step>("upload");
  const [dragOver, setDragOver] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ImportModule>("expense");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) simulateUpload(file.name);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) simulateUpload(file.name);
  };

  const simulateUpload = (name: string) => {
    setUploadedFile(name);
    setTimeout(() => setStep("mapping"), 800);
  };

  const handleConfirmMapping = () => {
    setStep("processing");
    setTimeout(() => setStep("done"), 2000);
  };

  const handleReset = () => {
    setStep("upload");
    setUploadedFile(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 800, color: "var(--tp)", letterSpacing: "-0.8px", marginBottom: "4px" }}>
          Import Center
        </h1>
        <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 300 }}>
          Upload CSV dari sistem ERP manapun — AI akan mapping kolom secara otomatis
        </p>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
        {(["upload", "mapping", "processing", "done"] as Step[]).map((s, i, arr) => {
          const labels: Record<Step, string> = { upload: "Upload File", mapping: "Konfirmasi Mapping", processing: "Proses AI", done: "Selesai" };
          const isDone = ["upload", "mapping", "processing", "done"].indexOf(step) > i;
          const isCurrent = step === s;
          return (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < arr.length - 1 ? 1 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: isDone || isCurrent ? "var(--em)" : "var(--surface-2)",
                  border: `2px solid ${isDone || isCurrent ? "var(--em)" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.3s",
                }}>
                  {isDone
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : <span style={{ fontSize: "11px", fontWeight: 700, color: isCurrent ? "#fff" : "var(--tm)" }}>{i + 1}</span>
                  }
                </div>
                <span style={{ fontSize: "12px", fontWeight: isCurrent ? 500 : 400, color: isCurrent ? "var(--em)" : isDone ? "var(--ts)" : "var(--tm)", whiteSpace: "nowrap" }}>
                  {labels[s]}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div style={{ flex: 1, height: "2px", margin: "0 12px", background: isDone ? "var(--em)" : "var(--border)", borderRadius: "1px", transition: "background 0.3s" }} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Step: Upload ── */}
      {step === "upload" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px" }}>

          {/* Upload area */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Module selector */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "14px", padding: "16px 20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--tm)", marginBottom: "10px" }}>Pilih Modul</div>
              <div style={{ display: "flex", gap: "8px" }}>
                {(["expense", "procurement"] as ImportModule[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setSelectedModule(m)}
                    style={{
                      flex: 1, padding: "10px 16px", borderRadius: "10px", border: "none",
                      fontSize: "13px", fontWeight: selectedModule === m ? 500 : 400,
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                      transition: "all 0.15s",
                      background: selectedModule === m ? "var(--em-subtle-2)" : "var(--surface-2)",
                      color: selectedModule === m ? "var(--em)" : "var(--ts)",
                      outline: selectedModule === m ? "1px solid rgba(16,185,129,0.30)" : "1px solid var(--border)",
                    }}
                  >
                    {m === "expense" ? "📄 Expense" : "📦 Procurement"}
                  </button>
                ))}
              </div>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? "var(--em)" : "var(--border)"}`,
                borderRadius: "16px",
                padding: "52px 32px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                background: dragOver ? "var(--em-subtle)" : "var(--surface-2)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
              }}
            >
              <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: "none" }} onChange={handleFileChange} />
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "var(--em-subtle-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 500, color: "var(--tp)", marginBottom: "6px" }}>
                  Drag & drop file CSV di sini
                </div>
                <div style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 300 }}>
                  atau <span style={{ color: "var(--em)", fontWeight: 500 }}>klik untuk browse</span>
                </div>
              </div>
              <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "4px" }}>
                Mendukung .csv, .xlsx, .xls — maks. 50MB
              </div>
            </div>
          </div>

          {/* Tips panel */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)" }}>Format yang Didukung</div>
            {[
              { src: "SAP / SAP Concur", icon: "🏢" },
              { src: "Odoo Export", icon: "🟣" },
              { src: "Accurate Online", icon: "🔵" },
              { src: "Jurnal.id", icon: "📊" },
              { src: "Talenta / Gadjian", icon: "👥" },
              { src: "Excel Manual", icon: "📋" },
            ].map(f => (
              <div key={f.src} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "16px" }}>{f.icon}</span>
                <span style={{ fontSize: "13px", color: "var(--ts)" }}>{f.src}</span>
                <svg style={{ marginLeft: "auto" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            ))}
            <div style={{ height: "1px", background: "var(--border)" }} />
            <div style={{ padding: "12px", borderRadius: "10px", background: "var(--em-subtle)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "11px", color: "var(--em)", fontWeight: 600, marginBottom: "4px" }}>💡 Tips</div>
              <p style={{ fontSize: "12px", color: "var(--ts)", lineHeight: 1.6, fontWeight: 300 }}>
                Format apapun akan dikenali otomatis oleh Smart CSV Mapper. Tidak perlu ubah nama kolom sebelum upload.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Step: Mapping ── */}
      {step === "mapping" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Info bar */}
          <div style={{ background: "var(--em-subtle)", border: "1px solid rgba(16,185,129,0.20)", borderRadius: "12px", padding: "14px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            <div>
              <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--em)" }}>File terdeteksi: {mockMappingResult.detectedSource}</span>
              <span style={{ fontSize: "12px", color: "var(--ts)", marginLeft: "12px" }}>{uploadedFile} · {mockMappingResult.totalRows} baris</span>
            </div>
          </div>

          {/* Mapping table */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)", marginBottom: "3px" }}>Hasil Auto-Mapping AI</h3>
              <p style={{ fontSize: "12px", color: "var(--tm)" }}>Periksa dan konfirmasi mapping kolom sebelum proses dilanjutkan</p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Kolom CSV Asli", "→ Field Fradara", "Confidence", "Status"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", background: "var(--surface-2)", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockMappingResult.mappings.map((m, i) => {
                    const isLast = i === mockMappingResult.mappings.length - 1;
                    const confColor = m.confidence >= 80 ? "var(--em)" : m.confidence >= 50 ? "#d97706" : "var(--tm)";
                    const statusStyle = m.status === "mapped"
                      ? { bg: "rgba(16,185,129,0.10)", color: "var(--em)", border: "rgba(16,185,129,0.20)", label: "Mapped" }
                      : m.status === "review"
                      ? { bg: "rgba(245,158,11,0.10)", color: "#d97706", border: "rgba(245,158,11,0.20)", label: "Perlu Review" }
                      : { bg: "var(--surface-2)", color: "var(--tm)", border: "var(--border)", label: "Tidak Dipetakan" };
                    return (
                      <tr key={m.sourceCol} style={{ borderBottom: isLast ? "none" : "1px solid var(--border)" }}>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontSize: "13px", fontFamily: "monospace", color: "var(--tp)", fontWeight: 500 }}>{m.sourceCol}</span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          {m.targetField
                            ? <span style={{ fontSize: "13px", color: "var(--em)", fontFamily: "monospace" }}>{m.targetField}</span>
                            : <span style={{ fontSize: "12px", color: "var(--tm)", fontStyle: "italic" }}>— tidak dipetakan</span>
                          }
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          {m.confidence > 0 && (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ width: "48px", height: "4px", borderRadius: "2px", background: "var(--border)", overflow: "hidden" }}>
                                <div style={{ width: `${m.confidence}%`, height: "100%", background: confColor, borderRadius: "2px" }} />
                              </div>
                              <span style={{ fontSize: "12px", fontWeight: 600, color: confColor }}>{m.confidence}%</span>
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 500, background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
                            {statusStyle.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "16px", fontSize: "12px" }}>
                <span style={{ color: "var(--em)" }}>✓ {mockMappingResult.mappings.filter(m => m.status === "mapped").length} mapped</span>
                <span style={{ color: "#d97706" }}>⚠ {mockMappingResult.mappings.filter(m => m.status === "review").length} perlu review</span>
                <span style={{ color: "var(--tm)" }}>— {mockMappingResult.mappings.filter(m => m.status === "unmapped").length} tidak dipetakan</span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={handleReset} style={{ padding: "9px 18px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Batal
                </button>
                <button onClick={handleConfirmMapping} style={{ padding: "9px 20px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}>
                  Konfirmasi & Proses →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Step: Processing ── */}
      {step === "processing" && (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", padding: "64px 32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .spin { animation: spin 1s linear infinite; }
          `}</style>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", border: "3px solid var(--border)", borderTop: "3px solid var(--em)", display: "inline-block" }} className="spin" />
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--tp)", marginBottom: "8px" }}>AI sedang menganalisis...</div>
            <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 300 }}>Isolation Forest dan LLM sedang memproses {mockMappingResult.totalRows} transaksi</p>
          </div>
          <div style={{ display: "flex", gap: "24px", marginTop: "8px" }}>
            {["Mapping kolom", "Deteksi anomali", "Generate fraud score"].map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--tm)" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: i === 1 ? "var(--em)" : "var(--border)" }} />
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Step: Done ── */}
      {step === "done" && (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", padding: "48px 32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--em-subtle-2)", border: "1px solid rgba(16,185,129,0.30)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--tp)", marginBottom: "8px" }}>Import Selesai!</div>
            <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 300 }}>342 transaksi berhasil diproses — 43 di-flag untuk review</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", width: "100%", maxWidth: "400px" }}>
            {[{ label: "Total Diproses", val: "342", color: "var(--tp)" }, { label: "Auto Approved", val: "287", color: "var(--em)" }, { label: "Perlu Review", val: "43", color: "#f59e0b" }].map(s => (
              <div key={s.label} style={{ padding: "12px", borderRadius: "10px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: "10px", color: "var(--tm)", marginTop: "3px" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <a href="/dashboard/expense" style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "13px", fontWeight: 500, textDecoration: "none", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}>
              Lihat Hasil Review →
            </a>
            <button onClick={handleReset} style={{ padding: "10px 20px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Import File Lain
            </button>
          </div>
        </div>
      )}

      {/* Import History */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)", marginBottom: "3px" }}>Riwayat Import</h3>
          <p style={{ fontSize: "12px", color: "var(--tm)" }}>Semua batch import sebelumnya</p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["ID", "File", "Modul", "Diupload oleh", "Waktu", "Baris", "Error", "Durasi", "Status"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", background: "var(--surface-2)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {importHistory.map((b, i) => {
                const sc = statusConfig[b.status];
                const isLast = i === importHistory.length - 1;
                return (
                  <tr key={b.id} style={{ borderBottom: isLast ? "none" : "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--em)" }}>{b.id}</span>
                    </td>
                    <td style={{ padding: "12px 16px", maxWidth: "180px" }}>
                      <div style={{ fontSize: "13px", color: "var(--tp)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        📄 {b.filename}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", background: "var(--em-subtle)", border: "1px solid var(--border)", color: "var(--ts)" }}>
                        {b.module === "expense" ? "Expense" : "Procurement"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "12px", color: "var(--ts)" }}>{b.uploadedBy}</span>
                    </td>
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: "12px", color: "var(--tm)" }}>{b.uploadedAt}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "12px", color: "var(--tp)", fontWeight: 500 }}>{b.totalRows.toLocaleString()}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "12px", color: b.errorRows > 0 ? "#dc2626" : "var(--tm)", fontWeight: b.errorRows > 0 ? 600 : 400 }}>{b.errorRows}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "12px", color: "var(--tm)" }}>{b.duration}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot }} />
                        <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 500, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                          {sc.label}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}