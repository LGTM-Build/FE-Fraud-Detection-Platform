"use client";
import { useState } from "react";
import { updateVendorStatus } from "@/services/vendorService";
import { statusConfig } from "./VendorCard";

interface VendorDetailProps {
  vendor: any;
  onClose: () => void;
  onStatusUpdated: () => void;
  isMobile?: boolean;
}

export function VendorDetail({ vendor, onClose, onStatusUpdated, isMobile }: VendorDetailProps) {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const sc = statusConfig[vendor.status] ?? statusConfig.inactive;
  const createdAt = vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—";
  const updatedAt = vendor.updatedAt ? new Date(vendor.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—";

  const handleStatusChange = async (status: "active" | "inactive" | "blacklisted") => {
    if (status === vendor.status) return;
    if (!confirm(`Yakin ubah status vendor ke "${status}"?`)) return;
    setUpdatingStatus(true);
    try {
      await updateVendorStatus(vendor.id, status);
      onStatusUpdated();
      onClose();
    } catch {
      alert("Gagal mengubah status vendor.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const Body = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Info rows */}
      <div>
        <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>Info Vendor</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[
            { label: "ID",           value: vendor.id },
            { label: "Nama Vendor",  value: vendor.vendorName },
            { label: "Status",       value: sc.label },
            { label: "Terdaftar",    value: createdAt },
            { label: "Diperbarui",   value: updatedAt },
          ].map((row, i, arr) => (
            <div key={row.label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              padding: "10px 0",
              borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
              gap: "16px",
            }}>
              <span style={{ fontSize: "12px", color: "var(--tm)", flexShrink: 0 }}>{row.label}</span>
              <span style={{ fontSize: "12px", color: row.label === "Status" ? sc.color : "var(--ts)", textAlign: "right", fontWeight: row.label === "Status" ? 500 : 400 }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata */}
      {vendor.metadata && Object.keys(vendor.metadata).length > 0 && (
        <div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>Metadata</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {Object.entries(vendor.metadata).map(([key, val], i, arr) => (
              <div key={key} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                padding: "10px 0",
                borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                gap: "16px",
              }}>
                <span style={{ fontSize: "12px", color: "var(--tm)", flexShrink: 0, textTransform: "capitalize" }}>{key}</span>
                <span style={{ fontSize: "12px", color: "var(--ts)", textAlign: "right" }}>{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const Actions = () => (
    <div style={{
      padding: isMobile ? "16px" : "18px 28px",
      borderTop: "1px solid var(--border)",
      display: "flex", flexDirection: "column", gap: "8px",
      background: "var(--surface-2)", flexShrink: 0,
    }}>
      <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "2px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.6px" }}>
        Ubah Status Vendor
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        {[
          { status: "active" as const,      label: "✓ Aktif",       color: "var(--em)", border: "rgba(16,185,129,0.30)", bg: "rgba(16,185,129,0.06)" },
          { status: "inactive" as const,    label: "⊘ Nonaktif",    color: "#d97706",   border: "rgba(245,158,11,0.30)", bg: "rgba(245,158,11,0.06)" },
          { status: "blacklisted" as const, label: "✕ Blacklist",   color: "#dc2626",   border: "rgba(239,68,68,0.30)",  bg: "rgba(239,68,68,0.06)" },
        ].map(btn => (
          <button
            key={btn.status}
            onClick={() => handleStatusChange(btn.status)}
            disabled={updatingStatus || vendor.status === btn.status}
            style={{
              flex: 1, padding: isMobile ? "9px" : "10px", borderRadius: "10px",
              border: `1px solid ${btn.border}`, background: vendor.status === btn.status ? btn.bg : "transparent",
              color: btn.color, fontSize: "12px", fontWeight: vendor.status === btn.status ? 600 : 500,
              cursor: vendor.status === btn.status || updatingStatus ? "default" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              opacity: updatingStatus ? 0.6 : 1,
              transition: "all 0.15s",
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease" }} />
      <style>{`
        @keyframes fadeIn        { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp       { from { opacity: 0; transform: translateY(20px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes slideInBottom { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>

      {isMobile ? (
        <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 201, background: "var(--bg)", borderRadius: "20px 20px 0 0", borderTop: "1px solid var(--border)", boxShadow: "0 -16px 48px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", maxHeight: "92vh", animation: "slideInBottom 0.28s cubic-bezier(0.32,0.72,0,1)" }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
            <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "var(--border)" }} />
          </div>
          <div style={{ padding: "12px 20px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700, color: "var(--tp)", letterSpacing: "-0.3px", marginBottom: "5px", lineHeight: 1.2 }}>{vendor.vendorName}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: sc.dot }} />
                <span style={{ padding: "2px 8px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "10px", fontWeight: 500 }}>{sc.label}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}><Body /></div>
          <Actions />
        </div>
      ) : (
        <div style={{ position: "fixed", inset: 0, zIndex: 201, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", pointerEvents: "none" }}>
          <div onClick={e => e.stopPropagation()} style={{ pointerEvents: "auto", width: "100%", maxWidth: "560px", maxHeight: "calc(100vh - 48px)", background: "var(--bg)", borderRadius: "20px", border: "1px solid var(--border)", boxShadow: "0 32px 80px rgba(0,0,0,0.22)", display: "flex", flexDirection: "column", overflow: "hidden", animation: "slideUp 0.24s cubic-bezier(0.22,1,0.36,1)" }}>
            <div style={{ padding: "20px 28px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", background: "var(--surface-2)", flexShrink: 0 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--tp)", letterSpacing: "-0.4px", marginBottom: "6px", lineHeight: 1.2 }}>{vendor.vendorName}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: sc.dot }} />
                  <span style={{ padding: "3px 12px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "12px", fontWeight: 500 }}>{sc.label}</span>
                </div>
              </div>
              <button onClick={onClose} style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)", flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--em)"; e.currentTarget.style.color = "var(--em)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ts)"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}><Body /></div>
            <Actions />
          </div>
        </div>
      )}
    </>
  );
}