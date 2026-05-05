import { useState } from "react";
import { updateEmployee } from "@/services/employeeService";
import type { Employee } from "@/data/employees";

export function DetailEmployeeModal({ emp, onClose, isMobile, onSuccess }: { emp: Employee, onClose: () => void, isMobile: boolean, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: emp.fullName, phoneNumber: emp.phoneNumber,
    department: emp.department || "", position: emp.position || "", externalRef: emp.externalRef || ""
  });

  const handleChange = (e: any) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateEmployee(emp.id, formData);
      onSuccess();
      onClose();
    } catch (error) {
      alert("Gagal mengupdate karyawan.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", fontSize: "13px", outline: "none", color: "var(--tp)" };
  const labelStyle = { display: "block", fontSize: "11px", fontWeight: 600, color: "var(--tm)", marginBottom: "6px", textTransform: "uppercase" as any };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 201, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", pointerEvents: "none" }}>
        <div onClick={e => e.stopPropagation()} style={{ pointerEvents: "auto", width: "100%", maxWidth: "500px", background: "var(--bg)", borderRadius: "20px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.22)" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Edit Karyawan</h3>
            <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ flex: 1, padding: "24px" }}>
            <form id="edit-emp-form" onSubmit={handleEdit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div><label style={labelStyle}>Nama Lengkap</label><input required name="fullName" value={formData.fullName} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>Nomor Telepon</label><input required name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>Posisi / Jabatan</label><input required name="position" value={formData.position} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>Departemen</label><input required name="department" value={formData.department} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>Ref ID (Opsional)</label><input name="externalRef" value={formData.externalRef} onChange={handleChange} style={inputStyle} /></div>
            </form>
          </div>
          <div style={{ padding: "20px 24px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" onClick={onClose} style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", cursor: "pointer" }}>Batal</button>
            <button type="submit" form="edit-emp-form" disabled={loading} style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", cursor: "pointer" }}>{loading ? "Menyimpan..." : "Simpan Perubahan"}</button>
          </div>
        </div>
      </div>
    </>
  );
}