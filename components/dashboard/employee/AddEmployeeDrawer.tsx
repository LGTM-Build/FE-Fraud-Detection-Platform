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
    externalRef: ""
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createEmployee(formData);
      if (onSuccess) onSuccess();
      onClose();
      setFormData({ fullName: "", phoneNumber: "", department: "", position: "", externalRef: "" });
    } catch (error) {
      console.error("Gagal menyimpan karyawan:", error);
      alert("Gagal menyimpan data karyawan. Cek console untuk detailnya.");
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
      {/* Overlay Background */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease" }} />

      <style>{`
        @keyframes fadeIn        { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp       { from { opacity: 0; transform: translateY(20px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes slideInBottom { from { transform: translateY(100%) } to { transform: translateY(0) } }
        .add-input:focus { border-color: var(--em) !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.12); }
        .close-btn:hover { border-color: var(--em) !important; color: var(--em) !important; }
      `}</style>

      {isMobile ? (
        /* ── Mobile: Bottom Sheet ── */
        <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 201, background: "var(--bg)", borderRadius: "20px 20px 0 0", borderTop: "1px solid var(--border)", boxShadow: "0 -16px 48px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", maxHeight: "90vh", animation: "slideInBottom 0.28s cubic-bezier(0.32,0.72,0,1)" }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
            <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "var(--border)" }} />
          </div>
          <MobileContent formData={formData} loading={loading} labelStyle={labelStyle} inputStyle={inputStyle} handleChange={handleChange} handleSubmit={handleSubmit} onClose={onClose} />
        </div>
      ) : (
        /* ── Desktop: Centered Modal ── */
        <div style={{ position: "fixed", inset: 0, zIndex: 201, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", pointerEvents: "none" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ pointerEvents: "auto", width: "100%", maxWidth: "560px", maxHeight: "calc(100vh - 48px)", background: "var(--bg)", borderRadius: "20px", border: "1px solid var(--border)", boxShadow: "0 32px 80px rgba(0,0,0,0.22)", display: "flex", flexDirection: "column", overflow: "hidden", animation: "slideUp 0.24s cubic-bezier(0.22,1,0.36,1)" }}>
            
            {/* Header */}
            <div style={{ padding: "20px 28px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--em)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "3px" }}>Master Data</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--tp)", letterSpacing: "-0.4px", margin: 0 }}>Tambah Karyawan</h3>
              </div>
              <button className="close-btn" onClick={onClose} style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)", flexShrink: 0, transition: "all 0.15s" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
              <form id="employee-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <label style={labelStyle}>Nama Lengkap</label>
                  <input required className="add-input" name="fullName" value={formData.fullName} onChange={handleChange} style={inputStyle} placeholder="Contoh: Budi Santoso" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={labelStyle}>Nomor Telepon</label>
                    <input required className="add-input" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} style={inputStyle} placeholder="0812xxxxxx" />
                  </div>
                  <div>
                    <label style={labelStyle}>Posisi / Jabatan</label>
                    <input required className="add-input" name="position" value={formData.position} onChange={handleChange} style={inputStyle} placeholder="Contoh: Staff" />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={labelStyle}>Departemen</label>
                    <input required className="add-input" name="department" value={formData.department} onChange={handleChange} style={inputStyle} placeholder="Contoh: IT" />
                  </div>
                  <div>
                    <label style={labelStyle}>Ref ID (Opsional)</label>
                    <input className="add-input" name="externalRef" value={formData.externalRef} onChange={handleChange} style={inputStyle} placeholder="NIP Karyawan" />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div style={{ padding: "20px 28px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", justifyContent: "flex-end", gap: "10px", flexShrink: 0 }}>
              <button type="button" onClick={onClose} style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>Batal</button>
              <button type="submit" form="employee-form" disabled={loading} style={{ padding: "10px 22px", borderRadius: "10px", border: "none", background: loading ? "var(--surface-2)" : "linear-gradient(135deg, var(--em), var(--em2))", color: loading ? "var(--tm)" : "#fff", fontSize: "13px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: loading ? "none" : "0 4px 16px rgba(16,185,129,0.25)", transition: "all 0.15s" }}>
                {loading ? "Menyimpan..." : "Simpan Karyawan"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

/* ── Helper: Mobile content (bottom sheet) ── */
function MobileContent({ formData, loading, labelStyle, inputStyle, handleChange, handleSubmit, onClose }: any) {
  return (
    <>
      <div style={{ padding: "12px 20px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--em)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "3px" }}>Master Data</div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700, color: "var(--tp)", letterSpacing: "-0.3px", margin: 0 }}>Tambah Karyawan</h3>
        </div>
        <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
        <form id="employee-form-mobile" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div><label style={labelStyle}>Nama Lengkap</label><input required name="fullName" value={formData.fullName} onChange={handleChange} style={inputStyle} placeholder="Contoh: Budi Santoso" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={labelStyle}>Nomor Telepon</label><input required name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} style={inputStyle} placeholder="0812xxxx" /></div>
            <div><label style={labelStyle}>Jabatan</label><input required name="position" value={formData.position} onChange={handleChange} style={inputStyle} placeholder="Staff" /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={labelStyle}>Departemen</label><input required name="department" value={formData.department} onChange={handleChange} style={inputStyle} placeholder="IT" /></div>
            <div><label style={labelStyle}>Ref ID</label><input name="externalRef" value={formData.externalRef} onChange={handleChange} style={inputStyle} placeholder="NIP" /></div>
          </div>
        </form>
      </div>

      <div style={{ padding: "16px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", gap: "8px" }}>
        <button type="button" onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>Batal</button>
        <button type="submit" form="employee-form-mobile" disabled={loading} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: loading ? "var(--surface-2)" : "linear-gradient(135deg, var(--em), var(--em2))", color: loading ? "var(--tm)" : "#fff", fontSize: "13px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 16px rgba(16,185,129,0.25)" }}>
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </>
  );
}