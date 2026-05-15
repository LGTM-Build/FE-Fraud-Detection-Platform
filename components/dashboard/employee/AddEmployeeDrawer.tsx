import { useState } from "react";
import { createEmployee } from "@/services/employeeService";

interface AddDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  onSuccess?: () => void;
}

export function AddEmployeeDrawer({ isOpen, onClose, isMobile, onSuccess }: AddDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    department: "",
    position: "",
    externalRef: "",
    avgMonthlyExpense: ""
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Parse avgMonthlyExpense jadi Number untuk memenuhi validasi Zod Backend
      const payload = {
        ...formData,
        avgMonthlyExpense: formData.avgMonthlyExpense ? Number(formData.avgMonthlyExpense) : undefined
      };

      await createEmployee(payload);
      if (onSuccess) onSuccess();
      onClose();
      setFormData({ fullName: "", phoneNumber: "", department: "", position: "", externalRef: "", avgMonthlyExpense: "" });
    } catch (error) {
      console.error("Gagal menyimpan karyawan:", error);
      alert("Gagal menyimpan data karyawan. Cek console untuk detailnya.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", fontSize: "13px", outline: "none", color: "var(--tp)", fontFamily: "'DM Sans', sans-serif" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "11px", fontWeight: 600, color: "var(--tm)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.8px" };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease" }} />
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes slideInBottom { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>
      <div style={{ position: "fixed", zIndex: 201, display: "flex", flexDirection: "column", ...(isMobile ? { left: 0, right: 0, bottom: 0, background: "var(--bg)", borderRadius: "20px 20px 0 0", maxHeight: "90vh", animation: "slideInBottom 0.28s cubic-bezier(0.32,0.72,0,1)" } : { top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", maxWidth: "520px", maxHeight: "calc(100vh - 48px)", background: "var(--bg)", borderRadius: "20px", animation: "slideUp 0.24s cubic-bezier(0.22,1,0.36,1)" }), boxShadow: isMobile ? "0 -16px 48px rgba(0,0,0,0.2)" : "0 32px 80px rgba(0,0,0,0.22)", overflow: "hidden" }}>
        {isMobile && <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}><div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "var(--border)" }} /></div>}
        <div style={{ padding: isMobile ? "12px 20px 14px" : "20px 28px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--em)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "3px" }}>Basis Data</div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "15px" : "18px", fontWeight: 700, color: "var(--tp)", margin: 0 }}>Tambah Karyawan</h3>
          </div>
          <button onClick={onClose} style={{ width: isMobile ? "32px" : "36px", height: isMobile ? "32px" : "36px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 16px" : "24px 28px" }}>
          <form id="employee-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div><label style={labelStyle}>Nama Lengkap</label><input required name="fullName" value={formData.fullName} onChange={handleChange} style={inputStyle} placeholder="Budi Santoso" /></div>
            <div><label style={labelStyle}>Nomor Telepon</label><input required name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} style={inputStyle} placeholder="08123456789" /></div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div><label style={labelStyle}>Posisi / Jabatan</label><input name="position" value={formData.position} onChange={handleChange} style={inputStyle} placeholder="Staff" /></div>
              <div><label style={labelStyle}>Departemen</label><input name="department" value={formData.department} onChange={handleChange} style={inputStyle} placeholder="IT" /></div>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div><label style={labelStyle}>Ref ID (Sistem Eksternal)</label><input name="externalRef" value={formData.externalRef} onChange={handleChange} style={inputStyle} placeholder="EMP-001" /></div>
              <div><label style={labelStyle}>Limit Pengeluaran (Rp)</label><input type="number" name="avgMonthlyExpense" value={formData.avgMonthlyExpense} onChange={handleChange} style={inputStyle} placeholder="Contoh: 5000000" min="0" /></div>
            </div>
          </form>
        </div>
        <div style={{ padding: "16px 28px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button type="button" onClick={onClose} style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Batal</button>
          <button type="submit" form="employee-form" disabled={loading} style={{ padding: "10px 22px", borderRadius: "10px", border: "none", background: loading ? "var(--surface-2)" : "linear-gradient(135deg, var(--em), var(--em2))", color: loading ? "var(--tm)" : "#fff", fontSize: "13px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: loading ? "none" : "0 4px 16px rgba(16,185,129,0.25)" }}>{loading ? "Menyimpan..." : "Simpan Data"}</button>
        </div>
      </div>
    </>
  );
}