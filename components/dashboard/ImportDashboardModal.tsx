"use client";

import { useState, useRef } from "react";
import { importExpenses, importProcurements } from "@/services/importService";

interface ImportDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  onSuccess: () => void;
}

type TabType = "expense" | "procurement";

type ImportResult = {
  totalRows: number;
  successRows: number;
  failedRows: number;
  errors: Array<{
    rowNumber: number;
    purchaseId?: string;
    expenseId?: string;
    message: string;
  }>;
};

const TABS: { key: TabType; label: string; icon: React.ReactNode }[] = [
  {
    key: "expense",
    label: "Pengeluaran",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    key: "procurement",
    label: "Pengadaan",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
];

const TEMPLATES = {
  expense: {
    headers: "expenseId,expenseDate,description,category,amountTotal,employeeExternalRef\n",
    rows: [
      "EXP-001,2026-05-15,Makan siang meeting klien,meal,350000,EMP-001\n",
      "EXP-002,2026-05-16,Transportasi ke kantor cabang,transport,120000,EMP-002\n",
    ],
    filename: "Template_Import_Expense.csv",
  },
  procurement: {
    headers: "purchaseId,purchaseDate,vendorName,itemDescription,department,amountTotal,procurementMethod,employeeExternalRef\n",
    rows: [
      "PO-001,2026-05-15,PT Teknologi Terdepan,Pengadaan 10 unit laptop,IT,150000000,pengadaan_langsung,EMP-001\n",
      "PO-002,2026-05-16,CV Maju Bersama,Pembelian ATK Kantor,Finance,5000000,e_purchasing,EMP-002\n",
    ],
    filename: "Template_Import_Pengadaan.csv",
  },
};

export function ImportDashboardModal({ isOpen, onClose, isMobile, onSuccess }: ImportDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("expense");
  const [file, setFile] = useState<File | null>(null);
  const [dispatchMl, setDispatchMl] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setFile(null);
    setResult(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Pilih file CSV/Excel terlebih dahulu!");

    setLoading(true);
    setResult(null);
    try {
      const importFn = activeTab === "expense" ? importExpenses : importProcurements;
      const res: any = await importFn(file, dispatchMl);
      const data = res?.data ?? res;

      const importResult: ImportResult = {
        totalRows: data.totalRows,
        successRows: data.successRows,
        failedRows: data.failedRows,
        errors: data.errors ?? [],
      };

      setResult(importResult);
      if (data.successRows > 0) onSuccess();
    } catch (error: any) {
      alert(error.message ?? "Terjadi kesalahan saat mengimport.");
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
    const tpl = TEMPLATES[activeTab];
    const csvContent = tpl.headers + tpl.rows.join("");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", tpl.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const allSuccess = result && result.failedRows === 0;
  const partialSuccess = result && result.successRows > 0 && result.failedRows > 0;
  const allFailed = result && result.successRows === 0 && result.failedRows > 0;

  const tabLabel = activeTab === "expense" ? "Pengeluaran" : "Pengadaan";

  return (
    <>
      <style>{`
        @keyframes dmFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes dmSlideUp { from { opacity: 0; transform: translateY(20px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes dmSlideInBottom { from { transform: translateY(100%) } to { transform: translateY(0) } }
        .dm-dropzone:hover { border-color: var(--em) !important; background: var(--em-subtle) !important; }
        .dm-tab-btn:hover { background: var(--surface-2) !important; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", animation: "dmFadeIn 0.2s ease" }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed", zIndex: 201, display: "flex", flexDirection: "column",
        ...(isMobile
          ? { left: 0, right: 0, bottom: 0, background: "var(--bg)", borderRadius: "20px 20px 0 0", maxHeight: "90vh", animation: "dmSlideInBottom 0.28s cubic-bezier(0.32,0.72,0,1)" }
          : { top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", maxWidth: "480px", background: "var(--bg)", borderRadius: "20px", animation: "dmSlideUp 0.24s cubic-bezier(0.22,1,0.36,1)" }
        ),
        boxShadow: "0 32px 80px rgba(0,0,0,0.22)", overflow: "hidden",
      }}>

        {/* Header */}
        <div style={{ padding: "20px 24px 0", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--tp)", margin: 0 }}>
                Import Transaksi
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                <p style={{ fontSize: "12px", color: "var(--tm)", margin: 0 }}>Format: .csv, .xls, .xlsx</p>
                <span style={{ color: "var(--border)" }}>|</span>
                <button
                  onClick={handleDownloadSample}
                  type="button"
                  style={{ background: "transparent", border: "none", color: "var(--em)", fontSize: "12px", fontWeight: 600, cursor: "pointer", padding: 0, textDecoration: "underline", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Unduh template {tabLabel}
                </button>
              </div>
            </div>
            <button
              onClick={handleClose}
              style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)", flexShrink: 0 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "2px" }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  className="dm-tab-btn"
                  onClick={() => handleTabChange(tab.key)}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "8px 16px", borderRadius: "10px 10px 0 0",
                    border: "none", cursor: "pointer", fontSize: "13px", fontWeight: isActive ? 600 : 400,
                    fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                    color: isActive ? "var(--em)" : "var(--tm)",
                    background: isActive ? "var(--em-subtle-2)" : "transparent",
                    borderBottom: isActive ? "2px solid var(--em)" : "2px solid transparent",
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px", overflowY: "auto", maxHeight: isMobile ? "60vh" : "400px" }}>
          {!result ? (
            <form id="import-dashboard-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Drop zone */}
              <div
                className="dm-dropzone"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  padding: "32px 24px", borderRadius: "14px",
                  border: "2px dashed var(--border)", background: "var(--surface-2)",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", transition: "border 0.2s, background 0.2s",
                  textAlign: "center",
                }}
              >
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "var(--em-subtle)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--tp)", marginBottom: "4px" }}>
                  {file ? file.name : "Klik atau drop file di sini"}
                </div>
                <div style={{ fontSize: "11px", color: "var(--tm)" }}>
                  {file
                    ? `${(file.size / 1024).toFixed(1)} KB · Siap diimport`
                    : `Data ${tabLabel} · .csv, .xls, .xlsx`}
                </div>
                {file && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    style={{ marginTop: "10px", fontSize: "11px", color: "var(--tm)", background: "none", border: "1px solid var(--border)", borderRadius: "6px", padding: "3px 10px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Ganti file
                  </button>
                )}
                <input
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>

              {/* AI toggle */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", padding: "12px", borderRadius: "10px", background: "var(--surface-2)", border: `1px solid ${dispatchMl ? "rgba(16,185,129,0.3)" : "var(--border)"}`, transition: "border 0.2s" }}>
                <input
                  type="checkbox"
                  checked={dispatchMl}
                  onChange={(e) => setDispatchMl(e.target.checked)}
                  style={{ marginTop: "2px", accentColor: "var(--em)", width: "16px", height: "16px", flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--tp)", marginBottom: "2px", display: "flex", alignItems: "center", gap: "6px" }}>
                    Gunakan AI Fraud Detection
                    <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 7px", borderRadius: "100px", background: "var(--em-subtle)", color: "var(--em)", letterSpacing: "0.03em" }}>Direkomendasikan</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--tm)", lineHeight: 1.5 }}>
                    Data dikirim ke sistem AI untuk dianalisis skor kecurangannya secara otomatis.
                  </div>
                </div>
              </label>
            </form>
          ) : (
            /* Result view */
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Summary banner */}
              <div style={{
                padding: "16px", borderRadius: "12px",
                background: allSuccess ? "rgba(16,185,129,0.08)" : allFailed ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.08)",
                border: `1px solid ${allSuccess ? "rgba(16,185,129,0.25)" : allFailed ? "rgba(239,68,68,0.25)" : "rgba(245,158,11,0.25)"}`,
                display: "flex", alignItems: "flex-start", gap: "12px",
              }}>
                {allSuccess && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: "1px" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {(allFailed || partialSuccess) && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={allFailed ? "#ef4444" : "#f59e0b"} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: "1px" }}>
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                )}
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--tp)" }}>
                    {allSuccess && "Semua data berhasil diimport!"}
                    {allFailed && "Semua data gagal diimport."}
                    {partialSuccess && "Import selesai dengan sebagian error."}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--tm)", marginTop: "3px" }}>
                    Total {result.totalRows} baris ·{" "}
                    <span style={{ color: "#10b981", fontWeight: 600 }}>{result.successRows} berhasil</span>
                    {result.failedRows > 0 && (
                      <>, <span style={{ color: "#ef4444", fontWeight: 600 }}>{result.failedRows} gagal</span></>
                    )}
                  </div>
                </div>
              </div>

              {/* Error list */}
              {result.errors.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Detail Error ({result.errors.length})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "180px", overflowY: "auto" }}>
                    {result.errors.map((err, i) => (
                      <div key={i} style={{ padding: "10px 12px", borderRadius: "8px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#ef4444", minWidth: "fit-content", marginTop: "1px" }}>
                          Baris {err.rowNumber}
                        </div>
                        <div style={{ flex: 1 }}>
                          {(err.purchaseId || err.expenseId) && (
                            <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "2px" }}>
                              ID: {err.purchaseId ?? err.expenseId}
                            </div>
                          )}
                          <div style={{ fontSize: "12px", color: "var(--tp)" }}>{err.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Import lagi */}
              <button
                onClick={() => { setResult(null); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px", borderRadius: "10px", border: "1px dashed var(--border)", background: "transparent", color: "var(--tm)", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.5" />
                </svg>
                Import file lain
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            type="button"
            onClick={handleClose}
            style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
          >
            {result ? "Tutup" : "Batal"}
          </button>
          {!result && (
            <button
              type="submit"
              form="import-dashboard-form"
              disabled={loading || !file}
              style={{
                padding: "10px 20px", borderRadius: "10px", border: "none",
                background: loading || !file ? "var(--surface-2)" : "linear-gradient(135deg, var(--em), var(--em2))",
                color: loading || !file ? "var(--tm)" : "#fff",
                fontSize: "13px", fontWeight: 600,
                cursor: loading || !file ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: loading || !file ? "none" : "0 4px 16px rgba(16,185,129,0.25)",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Mengunggah..." : `Import ${tabLabel}`}
            </button>
          )}
        </div>
      </div>
    </>
  );
}