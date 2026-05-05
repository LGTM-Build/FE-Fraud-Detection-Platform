import { useState, useEffect } from "react";
import { createExpense } from "@/services/expenseService";
import { getEmployees } from "@/services/employeeService";

interface AddDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  onSuccess?: () => void;
}

export function AddExpenseDrawer({ isOpen, onClose, isMobile, onSuccess }: AddDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    employeeId: "", // Tambahan state
    merchant: "",
    description: "",
    department: "",
    amountTotal: "",
    expenseDate: new Date().toISOString().split("T")[0],
    category: "others",
  });

  useEffect(() => {
    if (isOpen) {
      getEmployees()
        .then((data) => setEmployees(data))
        .catch((err) => console.error("Gagal memuat list karyawan:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isoDate = new Date(formData.expenseDate).toISOString();
      await createExpense({
        ...formData,
        amountTotal: Number(formData.amountTotal),
        expenseDate: isoDate,
      });
      if (onSuccess) onSuccess();
      onClose();
      setFormData({
        employeeId: "", merchant: "", description: "", department: "",
        amountTotal: "", expenseDate: new Date().toISOString().split("T")[0],
        category: "others",
      });
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      alert("Gagal menyimpan data pengeluaran. Cek console/network untuk detailnya.");
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
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease" }} />

      <style>{`
        @keyframes fadeIn        { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp       { from { opacity: 0; transform: translateY(20px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes slideInBottom { from { transform: translateY(100%) } to { transform: translateY(0) } }
        .add-input:focus { border-color: var(--em) !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.12); }
        .close-btn:hover { border-color: var(--em) !important; color: var(--em) !important; }
      `}</style>

      {isMobile ? (
        <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 201, background: "var(--bg)", borderRadius: "20px 20px 0 0", borderTop: "1px solid var(--border)", boxShadow: "0 -16px 48px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", maxHeight: "90vh", animation: "slideInBottom 0.28s cubic-bezier(0.32,0.72,0,1)" }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}><div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "var(--border)" }} /></div>
          <MobileContent formData={formData} loading={loading} employees={employees} labelStyle={labelStyle} inputStyle={inputStyle} handleChange={handleChange} handleSubmit={handleSubmit} onClose={onClose} />
        </div>
      ) : (
        <div style={{ position: "fixed", inset: 0, zIndex: 201, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", pointerEvents: "none" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ pointerEvents: "auto", width: "100%", maxWidth: "560px", maxHeight: "calc(100vh - 48px)", background: "var(--bg)", borderRadius: "20px", border: "1px solid var(--border)", boxShadow: "0 32px 80px rgba(0,0,0,0.22)", display: "flex", flexDirection: "column", overflow: "hidden", animation: "slideUp 0.24s cubic-bezier(0.22,1,0.36,1)" }}>
            
            <div style={{ padding: "20px 28px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--em)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "3px" }}>Formulir Baru</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--tp)", letterSpacing: "-0.4px", margin: 0 }}>Tambah Pengeluaran</h3>
              </div>
              <button className="close-btn" onClick={onClose} style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)", flexShrink: 0, transition: "all 0.15s" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
              <form id="expense-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <label style={labelStyle}>Karyawan Pengaju</label>
                  <select required name="employeeId" className="add-input" value={formData.employeeId} onChange={handleChange} style={inputStyle}>
                    <option value="">-- Pilih Karyawan --</option>
                    {employees.map((emp: any) => (
                      <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.department ?? "No Dept"})</option>
                    ))}
                  </select>
                </div>
                <div><label style={labelStyle}>Nama Mitra / Toko</label><input required className="add-input" name="merchant" value={formData.merchant} onChange={handleChange} style={inputStyle} placeholder="Contoh: Tokopedia, Restoran XYZ" /></div>
                <div><label style={labelStyle}>Deskripsi Pengeluaran</label><textarea required className="add-input" name="description" value={formData.description} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: "none" }} placeholder="Contoh: Makan siang klien PT ABC" /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div><label style={labelStyle}>Departemen</label><input required className="add-input" name="department" value={formData.department} onChange={handleChange} style={inputStyle} placeholder="Contoh: Sales" /></div>
                  <div><label style={labelStyle}>Tanggal Transaksi</label><input required type="date" className="add-input" name="expenseDate" value={formData.expenseDate} onChange={handleChange} style={inputStyle} /></div>
                </div>
                <div><label style={labelStyle}>Kategori</label>
                  <select name="category" className="add-input" value={formData.category} onChange={handleChange} style={inputStyle}>
                    <option value="entertainment">Entertainment</option>
                    <option value="transport">Transport</option>
                    <option value="office_supply">Office Supply</option>
                    <option value="meals">Meals</option>
                    <option value="vehicle">Vehicle</option>
                    <option value="training">Training</option>
                    <option value="others">Others</option>
                  </select>
                </div>
                <div><label style={labelStyle}>Total Nilai (Rp)</label><input required type="number" className="add-input" name="amountTotal" value={formData.amountTotal} onChange={handleChange} style={inputStyle} placeholder="Contoh: 500000" /></div>
              </form>
            </div>

            <div style={{ padding: "20px 28px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", justifyContent: "flex-end", gap: "10px", flexShrink: 0 }}>
              <button type="button" onClick={onClose} style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>Batal</button>
              <button type="submit" form="expense-form" disabled={loading} style={{ padding: "10px 22px", borderRadius: "10px", border: "none", background: loading ? "var(--surface-2)" : "linear-gradient(135deg, var(--em), var(--em2))", color: loading ? "var(--tm)" : "#fff", fontSize: "13px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: loading ? "none" : "0 4px 16px rgba(16,185,129,0.25)", transition: "all 0.15s" }}>
                {loading ? "Menyimpan..." : "Simpan Transaksi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MobileContent({ formData, loading, employees, labelStyle, inputStyle, handleChange, handleSubmit, onClose }: any) {
  return (
    <>
      <div style={{ padding: "12px 20px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--em)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "3px" }}>Formulir Baru</div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700, color: "var(--tp)", letterSpacing: "-0.3px", margin: 0 }}>Tambah Pengeluaran</h3>
        </div>
        <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
        <form id="expense-form-mobile" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div><label style={labelStyle}>Karyawan Pengaju</label>
            <select required name="employeeId" value={formData.employeeId} onChange={handleChange} style={inputStyle}>
              <option value="">-- Pilih Karyawan --</option>
              {employees.map((emp: any) => <option key={emp.id} value={emp.id}>{emp.fullName}</option>)}
            </select>
          </div>
          <div><label style={labelStyle}>Nama Mitra / Toko</label><input required name="merchant" value={formData.merchant} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={labelStyle}>Deskripsi</label><textarea required name="description" value={formData.description} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: "none" }} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={labelStyle}>Departemen</label><input required name="department" value={formData.department} onChange={handleChange} style={inputStyle} /></div>
            <div><label style={labelStyle}>Tanggal</label><input required type="date" name="expenseDate" value={formData.expenseDate} onChange={handleChange} style={inputStyle} /></div>
          </div>
          <div><label style={labelStyle}>Total Nilai (Rp)</label><input required type="number" name="amountTotal" value={formData.amountTotal} onChange={handleChange} style={inputStyle} /></div>
        </form>
      </div>
      <div style={{ padding: "16px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", gap: "8px" }}>
        <button type="button" onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>Batal</button>
        <button type="submit" form="expense-form-mobile" disabled={loading} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: loading ? "var(--surface-2)" : "linear-gradient(135deg, var(--em), var(--em2))", color: loading ? "var(--tm)" : "#fff", fontSize: "13px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 16px rgba(16,185,129,0.25)" }}>{loading ? "Menyimpan..." : "Simpan"}</button>
      </div>
    </>
  );
}