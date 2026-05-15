"use client";
import { useState } from "react";
import { createVendor } from "@/services/vendorService";

interface AddVendorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  onSuccess?: () => void;
}

const statusOptions = [
  { id: "active",      label: "Aktif",       desc: "Vendor aktif dan dapat digunakan dalam transaksi", color: "var(--em)",  bg: "var(--em-subtle)",       border: "rgba(16,185,129,0.20)" },
  { id: "inactive",    label: "Nonaktif",    desc: "Vendor tidak aktif sementara, belum dapat digunakan", color: "#d97706",  bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.20)" },
  { id: "blacklisted", label: "Blacklisted", desc: "Vendor diblokir dan tidak boleh digunakan",         color: "#dc2626",  bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.20)" },
];

export default function AddVendorDrawer({ isOpen, onClose, isMobile, onSuccess }: AddVendorDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vendorName: "",
    status: "active" as "active" | "inactive" | "blacklisted",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStatusSelect = (statusId: "active" | "inactive" | "blacklisted") => {
    setFormData(prev => ({ ...prev, status: statusId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createVendor({ vendorName: formData.vendorName, status: formData.status });
      if (onSuccess) onSuccess();
      onClose();
      setFormData({ vendorName: "", status: "active" });
    } catch (error) {
      console.error("Gagal menambah vendor:", error);
      alert("Gagal menambahkan vendor. Pastikan nama vendor belum terdaftar.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: "1px solid var(--border)", background: "var(--surface-2)",
    fontSize: "13px", outline: "none", color: "var(--tp)",
    fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "11px", fontWeight: 600, color: "var(--tm)",
    marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.8px",
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease" }}
      />
      <style>{`
        @keyframes fadeIn        { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp       { from { opacity: 0; transform: translateY(20px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes slideInBottom { from { transform: translateY(100%) } to { transform: translateY(0) } }
        .vendor-input:focus { border-color: var(--em) !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.12); }
      `}</style>

      <div style={{
        position: "fixed", zIndex: 201, display: "flex", flexDirection: "column",
        ...(isMobile
          ? { left: 0, right: 0, bottom: 0, background: "var(--bg)", borderRadius: "20px 20px 0 0", maxHeight: "90vh", animation: "slideInBottom 0.28s cubic-bezier(0.32,0.72,0,1)" }
          : { top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", maxWidth: "520px", maxHeight: "calc(100vh - 48px)", background: "var(--bg)", borderRadius: "20px", animation: "slideUp 0.24s cubic-bezier(0.22,1,0.36,1)" }
        ),
        boxShadow: isMobile ? "0 -16px 48px rgba(0,0,0,0.2)" : "0 32px 80px rgba(0,0,0,0.22)",
        overflow: "hidden",
      }}>
        {/* Mobile handle */}
        {isMobile && (
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
            <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "var(--border)" }} />
          </div>
        )}

        {/* Header */}
        <div style={{ padding: isMobile ? "12px 20px 14px" : "20px 28px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--em)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "3px" }}>
              Manajemen Vendor
            </div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "15px" : "18px", fontWeight: 700, color: "var(--tp)", margin: 0 }}>
              Tambah Vendor Baru
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ width: isMobile ? "32px" : "36px", height: isMobile ? "32px" : "36px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 16px" : "24px 28px" }}>
          <form id="add-vendor-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Nama Vendor */}
            <div>
              <label style={labelStyle}>Nama Vendor</label>
              <input
                required
                className="vendor-input"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Contoh: PT. Maju Bersama"
              />
            </div>

            {/* Status Selection Cards */}
            <div>
              <label style={labelStyle}>Status Awal</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {statusOptions.map(s => {
                  const isSelected = formData.status === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => handleStatusSelect(s.id as any)}
                      style={{
                        padding: "12px 14px", borderRadius: "10px", cursor: "pointer",
                        border: `1px solid ${isSelected ? s.border : "var(--border)"}`,
                        background: isSelected ? s.bg : "var(--surface-2)",
                        display: "flex", alignItems: "center", gap: "12px", transition: "all 0.15s",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: isSelected ? s.color : "var(--tp)", marginBottom: "2px" }}>
                          {s.label}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--tm)", lineHeight: 1.4 }}>
                          {s.desc}
                        </div>
                      </div>
                      {isSelected && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ padding: "10px 14px", borderRadius: "10px", background: "var(--em-subtle)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: "11px", color: "var(--ts)", lineHeight: 1.5, margin: 0 }}>
                💡 Vendor yang ditambahkan dapat langsung digunakan dalam transaksi sesuai status yang dipilih.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div style={{ padding: isMobile ? "16px" : "20px 28px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", justifyContent: "flex-end", gap: "10px", flexShrink: 0 }}>
          <button
            type="button"
            onClick={onClose}
            style={{ flex: isMobile ? 1 : "none", padding: "10px 18px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
          >
            Batal
          </button>
          <button
            type="submit"
            form="add-vendor-form"
            disabled={loading}
            style={{ flex: isMobile ? 1 : "none", padding: "10px 22px", borderRadius: "10px", border: "none", background: loading ? "var(--surface-2)" : "linear-gradient(135deg, var(--em), var(--em2))", color: loading ? "var(--tm)" : "#fff", fontSize: "13px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: loading ? "none" : "0 4px 16px rgba(16,185,129,0.25)" }}
          >
            {loading ? "Menyimpan..." : "Tambah Vendor"}
          </button>
        </div>
      </div>
    </>
  );
}