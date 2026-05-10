"use client";

import { useState, useRef } from "react";
import { importExpenses } from "@/services/importService";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  onSuccess: () => void;
}

type ImportResult = {
  totalRows: number;
  successRows: number;
  failedRows: number;
  errors: Array<{
    rowNumber: number;
    expenseId?: string;
    message: string;
  }>;
};

export function ImportExpenseModal({ isOpen, onClose, isMobile, onSuccess }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dispatchMl, setDispatchMl] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null); // reset result kalau ganti file
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Pilih file CSV/Excel terlebih dahulu!");

    setLoading(true);
    setResult(null);
    try {
      const res: any = await importExpenses(file, dispatchMl);
      const data = res?.data ?? res;

      setResult({
        totalRows: data.totalRows,
        successRows: data.successRows,
        failedRows: data.failedRows,
        errors: data.errors ?? [],
      });

      if (data.successRows > 0) {
        onSuccess();
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    onClose();
  };

  const handleDownloadSample = () => {
    const headers = "expenseId,expenseDate,department,description,employeeExternalRef,amountTotal,category,merchant\n";
    const sampleData1 = "EXP-001,2026-05-15,Marketing,Iklan Facebook Ads,EMP-001,2500000,others,Facebook\n";
    const sampleData2 = "EXP-002,2026-05-16,IT,Pembelian Mousepad,EMP-002,150000,office_supply,Tokopedia\n";

    const csvContent = headers + sampleData1 + sampleData2;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Template_Import_Pengeluaran.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allSuccess = result && result.failedRows === 0;
  const partialSuccess = result && result.successRows > 0 && result.failedRows > 0;
  const allFailed = result && result.successRows === 0 && result.failedRows > 0;

  return (
    <>
      <div onClick={handleClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease" }} />
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes slideInBottom { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>

      <div style={{ position: "fixed", zIndex: 201, display: "flex", flexDirection: "column", ...(isMobile ? { left: 0, right: 0, bottom: 0, background: "var(--bg)", borderRadius: "20px 20px 0 0", maxHeight: "90vh", animation: "slideInBottom 0.28s cubic-bezier(0.32,0.72,0,1)" } : { top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", maxWidth: "480px", background: "var(--bg)", borderRadius: "20px", animation: "slideUp 0.24s cubic-bezier(0.22,1,0.36,1)" }), boxShadow: "0 32px 80px rgba(0,0,0,0.22)", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--tp)", margin: 0 }}>Import Data Pengeluaran</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
              <p style={{ fontSize: "12px", color: "var(--tm)", margin: 0 }}>Format: .csv, .xls, .xlsx</p>
              <span style={{ color: "var(--border)" }}>|</span>
              <button onClick={handleDownloadSample} type="button" style={{ background: "transparent", border: "none", color: "var(--em)", fontSize: "12px", fontWeight: 600, cursor: "pointer", padding: 0, textDecoration: "underline", fontFamily: "'DM Sans', sans-serif" }}>
                Unduh template CSV
              </button>
            </div>
          </div>
          <button onClick={handleClose} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px", overflowY: "auto", maxHeight: isMobile ? "60vh" : "420px" }}>

          {/* Kalau belum ada result, tampilkan form */}
          {!result ? (
            <form id="import-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{ padding: "32px", borderRadius: "14px", border: "2px dashed var(--border)", background: "var(--surface-2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "border 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--em)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: "12px" }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--tp)", marginBottom: "4px" }}>
                  {file ? file.name : "Klik untuk memilih file CSV/Excel"}
                </div>
                <div style={{ fontSize: "11px", color: "var(--tm)" }}>
                  {file ? `Ukuran: ${(file.size / 1024).toFixed(1)} KB` : "Pastikan header kolom sesuai template"}
                </div>
                <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
              </div>

              <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", padding: "12px", borderRadius: "10px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <input type="checkbox" checked={dispatchMl} onChange={(e) => setDispatchMl(e.target.checked)} style={{ marginTop: "2px", accentColor: "var(--em)", width: "16px", height: "16px" }} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--tp)", marginBottom: "2px" }}>Gunakan AI Fraud Detection</div>
                  <div style={{ fontSize: "11px", color: "var(--tm)", lineHeight: 1.5 }}>
                    Data yang di-import akan langsung dikirim ke sistem Python AI untuk dianalisis skor kecurangannya. (Proses mungkin memakan waktu sedikit lebih lama).
                  </div>
                </div>
              </label>
            </form>

          ) : (
            /* Tampilan Result */
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Summary bar */}
              <div style={{ padding: "16px", borderRadius: "12px", background: allSuccess ? "rgba(16,185,129,0.08)" : allFailed ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.08)", border: `1px solid ${allSuccess ? "rgba(16,185,129,0.25)" : allFailed ? "rgba(239,68,68,0.25)" : "rgba(245,158,11,0.25)"}`, display: "flex", alignItems: "center", gap: "12px" }}>
                {allSuccess && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                )}
                {allFailed && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                )}
                {partialSuccess && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                )}
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--tp)" }}>
                    {allSuccess && "Semua data berhasil diimport!"}
                    {allFailed && "Semua data gagal diimport."}
                    {partialSuccess && "Import selesai dengan sebagian error."}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--tm)", marginTop: "2px" }}>
                    Total {result.totalRows} baris — <span style={{ color: "#10b981", fontWeight: 600 }}>{result.successRows} berhasil</span>{result.failedRows > 0 && <>, <span style={{ color: "#ef4444", fontWeight: 600 }}>{result.failedRows} gagal</span></>}
                  </div>
                </div>
              </div>

              {/* Error list */}
              {result.errors.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Detail Error</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "200px", overflowY: "auto" }}>
                    {result.errors.map((err, i) => (
                      <div key={i} style={{ padding: "10px 12px", borderRadius: "8px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#ef4444", minWidth: "fit-content", marginTop: "1px" }}>Baris {err.rowNumber}</div>
                        <div style={{ flex: 1 }}>
                          {err.expenseId && (
                            <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "2px" }}>ID: {err.expenseId}</div>
                          )}
                          <div style={{ fontSize: "12px", color: "var(--tp)" }}>{err.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tombol import ulang */}
              <button
                onClick={() => { setResult(null); setFile(null); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px", borderRadius: "10px", border: "1px dashed var(--border)", background: "transparent", color: "var(--tm)", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.5" /></svg>
                Import file lain
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button type="button" onClick={handleClose} style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            {result ? "Tutup" : "Batal"}
          </button>
          {!result && (
            <button type="submit" form="import-form" disabled={loading} style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: loading ? "var(--surface-2)" : "linear-gradient(135deg, var(--em), var(--em2))", color: loading ? "var(--tm)" : "#fff", fontSize: "13px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: loading ? "none" : "0 4px 16px rgba(16,185,129,0.25)" }}>
              {loading ? "Mengunggah..." : "Mulai Import"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}