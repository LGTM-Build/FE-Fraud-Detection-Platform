"use client";
import { useState, useEffect } from "react";
import { updateEmployee } from "@/services/employeeService";

interface DetailProps {
  emp: any;
  onClose: () => void;
  isMobile: boolean;
  onSuccess: () => void;
}

export function DetailEmployeeModal({ emp, onClose, isMobile, onSuccess }: DetailProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "edit">("info");
  
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    department: "",
    position: "",
    externalRef: "",
    avgMonthlyExpense: ""
  });

  useEffect(() => {
    if (emp) {
      setFormData({
        fullName: emp.fullName || "",
        phoneNumber: emp.phoneNumber || "",
        department: emp.department || "",
        position: emp.position || "",
        externalRef: emp.externalRef || "",
        avgMonthlyExpense: emp.avgMonthlyExpense || ""
      });
    }
  }, [emp]);

  if (!emp) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        avgMonthlyExpense: formData.avgMonthlyExpense ? Number(formData.avgMonthlyExpense) : null
      };
      await updateEmployee(emp.id, payload);
      onSuccess();
      onClose();
    } catch (error) {
      alert("Gagal memperbarui data karyawan.");
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (angka: any) => {
    if (!angka) return "Rp 0";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(angka));
  };

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", fontSize: "13px", outline: "none", color: "var(--tp)", fontFamily: "'DM Sans', sans-serif" };
  const labelStyle = { display: "block", fontSize: "11px", fontWeight: 600, color: "var(--tm)", marginBottom: "6px", textTransform: "uppercase" as const, letterSpacing: "0.8px" };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease" }} />
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes slideInBottom { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>

      <div style={{
        position: "fixed", zIndex: 201, display: "flex", flexDirection: "column",
        ...(isMobile
          ? { left: 0, right: 0, bottom: 0, background: "var(--bg)", borderRadius: "20px 20px 0 0", maxHeight: "90vh", animation: "slideInBottom 0.28s cubic-bezier(0.32,0.72,0,1)" }
          : { top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", maxWidth: "520px", maxHeight: "calc(100vh - 48px)", background: "var(--bg)", borderRadius: "20px", animation: "slideUp 0.24s cubic-bezier(0.22,1,0.36,1)" }
        ),
        boxShadow: "0 32px 80px rgba(0,0,0,0.22)", overflow: "hidden"
      }}>
        
        <div style={{ padding: isMobile ? "16px 20px 0" : "24px 28px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--em)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Profil Karyawan</span>
                <span style={{ padding: "2px 8px", borderRadius: "100px", background: "var(--em-subtle)", color: "var(--em)", border: "1px solid rgba(16,185,129,0.2)", fontSize: "10px", fontWeight: 600 }}>AKTIF</span>
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "18px" : "22px", fontWeight: 700, color: "var(--tp)", margin: 0 }}>
                {emp.fullName}
              </h3>
            </div>
            <button onClick={onClose} style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>

          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: "24px" }}>
            <button onClick={() => setActiveTab("info")} style={{ padding: "0 0 12px", background: "transparent", border: "none", borderBottom: activeTab === "info" ? "2px solid var(--em)" : "2px solid transparent", color: activeTab === "info" ? "var(--em)" : "var(--tm)", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Informasi Umum
            </button>
            <button onClick={() => setActiveTab("edit")} style={{ padding: "0 0 12px", background: "transparent", border: "none", borderBottom: activeTab === "edit" ? "2px solid var(--em)" : "2px solid transparent", color: activeTab === "edit" ? "var(--em)" : "var(--tm)", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Edit Data
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px" : "24px 28px" }}>
          
          {activeTab === "info" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ padding: "16px", borderRadius: "12px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "12px", color: "var(--tm)", marginBottom: "4px" }}>Limit Expense</div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--tp)", fontFamily: "'Syne', sans-serif" }}>
                  {formatRupiah(emp.avgMonthlyExpense)}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <div style={labelStyle}>ID Referensi</div>
                  <div style={{ fontSize: "13px", color: "var(--tp)", fontWeight: 500 }}>{emp.externalRef || "—"}</div>
                </div>
                <div>
                  <div style={labelStyle}>No. Telepon</div>
                  <div style={{ fontSize: "13px", color: "var(--tp)", fontWeight: 500 }}>{emp.phoneNumber || "—"}</div>
                </div>
                <div>
                  <div style={labelStyle}>Departemen</div>
                  <div style={{ fontSize: "13px", color: "var(--tp)", fontWeight: 500 }}>{emp.department || "—"}</div>
                </div>
                <div>
                  <div style={labelStyle}>Posisi</div>
                  <div style={{ fontSize: "13px", color: "var(--tp)", fontWeight: 500 }}>{emp.position || "—"}</div>
                </div>
              </div>
            </div>
          ) : (
            <form id="edit-emp-form" onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div><label style={labelStyle}>Nama Lengkap</label><input required name="fullName" value={formData.fullName} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>Nomor Telepon</label><input required name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} style={inputStyle} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div><label style={labelStyle}>Posisi</label><input name="position" value={formData.position} onChange={handleChange} style={inputStyle} /></div>
                <div><label style={labelStyle}>Departemen</label><input name="department" value={formData.department} onChange={handleChange} style={inputStyle} /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div><label style={labelStyle}>Ref ID</label><input name="externalRef" value={formData.externalRef} onChange={handleChange} style={inputStyle} /></div>
                <div><label style={labelStyle}>Limit Expense (Rp)</label><input type="number" name="avgMonthlyExpense" value={formData.avgMonthlyExpense} onChange={handleChange} style={inputStyle} /></div>
              </div>
            </form>
          )}
        </div>

        <div style={{ padding: isMobile ? "16px" : "20px 28px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", justifyContent: "flex-end", gap: "12px", flexShrink: 0 }}>
          <button type="button" onClick={onClose} style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Tutup</button>
          {activeTab === "edit" && (
            <button type="submit" form="edit-emp-form" disabled={loading} style={{ padding: "10px 22px", borderRadius: "10px", border: "none", background: loading ? "var(--surface-2)" : "linear-gradient(135deg, var(--em), var(--em2))", color: loading ? "var(--tm)" : "#fff", fontSize: "13px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}