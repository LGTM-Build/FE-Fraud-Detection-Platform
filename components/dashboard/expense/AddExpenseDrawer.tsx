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
    employeeId: "", 
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
        // Ambil dari response service yang sudah di-unwrap
        .then((data) => setEmployees(Array.isArray(data) ? data : data.data || []))
        .catch((err) => console.error("Gagal memuat list karyawan:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | any) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // PENYESUAIAN FORMAT BACKEND
      const payload = {
        ...formData,
        amountTotal: Number(formData.amountTotal),
        expenseDate: new Date(formData.expenseDate).toISOString(), // Jadikan format datetime ISO
      };

      await createExpense(payload);
      if (onSuccess) onSuccess();
      onClose();
      // Reset
      setFormData({ employeeId: "", merchant: "", description: "", department: "", amountTotal: "", expenseDate: new Date().toISOString().split("T")[0], category: "others" });
    } catch (error) {
      console.error("Gagal menyimpan pengeluaran:", error);
      alert("Gagal menyimpan data. Pastikan semua kolom terisi dengan benar.");
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
        .add-input:focus { border-color: var(--em) !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.12); }
      `}</style>

      <div style={{ position: "fixed", zIndex: 201, display: "flex", flexDirection: "column", ...(isMobile ? { left: 0, right: 0, bottom: 0, background: "var(--bg)", borderRadius: "20px 20px 0 0", maxHeight: "90vh", animation: "slideInBottom 0.28s cubic-bezier(0.32,0.72,0,1)" } : { top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", maxWidth: "520px", maxHeight: "calc(100vh - 48px)", background: "var(--bg)", borderRadius: "20px", animation: "slideUp 0.24s cubic-bezier(0.22,1,0.36,1)" }), boxShadow: isMobile ? "0 -16px 48px rgba(0,0,0,0.2)" : "0 32px 80px rgba(0,0,0,0.22)", overflow: "hidden" }}>
        
        {isMobile && <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}><div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "var(--border)" }} /></div>}
        
        <div style={{ padding: isMobile ? "12px 20px 14px" : "20px 28px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--em)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "3px" }}>Input Form</div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "15px" : "18px", fontWeight: 700, color: "var(--tp)", margin: 0 }}>Tambah Pengeluaran</h3>
          </div>
          <button onClick={onClose} style={{ width: isMobile ? "32px" : "36px", height: isMobile ? "32px" : "36px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 16px" : "24px 28px" }}>
          <form id="expense-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div>
              <label style={labelStyle}>Karyawan Pengaju</label>
              <CustomSelect
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="-- Pilih Karyawan --"
                style={inputStyle}
                options={[
                  { value: "", label: "-- Pilih Karyawan --" },
                  ...employees.map((emp: any) => ({
                    value: emp.id,
                    label: emp.fullName,
                  })),
                ]}
              />
            </div>

            <div><label style={labelStyle}>Deskripsi Pengeluaran</label><input required className="add-input" name="description" value={formData.description} onChange={handleChange} style={inputStyle} placeholder="Cth: Pembelian Tiket Pesawat" /></div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div><label style={labelStyle}>Merchant / Toko</label><input className="add-input" name="merchant" value={formData.merchant} onChange={handleChange} style={inputStyle} placeholder="Cth: Traveloka" /></div>
              
              <div>
                <label style={labelStyle}>Kategori</label>
                <CustomSelect
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="-- Pilih Kategori --"
                  style={inputStyle}
                  options={[
                    { value: "entertainment", label: "Entertainment" },
                    { value: "transport", label: "Transport" },
                    { value: "office_supply", label: "Office Supply" },
                    { value: "meals", label: "Meals" },
                    { value: "vehicle", label: "Vehicle" },
                    { value: "training", label: "Training" },
                    { value: "others", label: "Lainnya (Others)" },
                  ]}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div><label style={labelStyle}>Departemen</label><input className="add-input" name="department" value={formData.department} onChange={handleChange} style={inputStyle} placeholder="Cth: Marketing" /></div>
              <div><label style={labelStyle}>Tanggal Transaksi</label><input required className="add-input" type="date" name="expenseDate" value={formData.expenseDate} onChange={handleChange} style={inputStyle} /></div>
            </div>

            <div><label style={labelStyle}>Total Nilai (Rp)</label><input required className="add-input" type="number" name="amountTotal" value={formData.amountTotal} onChange={handleChange} style={inputStyle} placeholder="Cth: 1500000" min="0" /></div>
          </form>
        </div>

        <div style={{ padding: "16px 28px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button type="button" onClick={onClose} style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Batal</button>
          <button type="submit" form="expense-form" disabled={loading} style={{ padding: "10px 22px", borderRadius: "10px", border: "none", background: loading ? "var(--surface-2)" : "linear-gradient(135deg, var(--em), var(--em2))", color: loading ? "var(--tm)" : "#fff", fontSize: "13px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: loading ? "none" : "0 4px 16px rgba(16,185,129,0.25)" }}>{loading ? "Menyimpan..." : "Simpan Data"}</button>
        </div>
      </div>
    </>
  );
}

function CustomSelect({ name, value, options, onChange, placeholder, style }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const selectedOption = options.find((o: any) => o.value === value);

  return (
    <div 
      style={{ position: "relative", width: "100%", outline: "none" }}
      tabIndex={0}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <div
        className="add-input"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...style,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: value ? "var(--tp)" : "var(--tm)" }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            zIndex: 100,
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            maxHeight: "220px",
            overflowY: "auto",
          }}
        >
          {options.map((opt: any) => {
            const isSelected = value === opt.value;
            const isHovered = hoveredOption === opt.value;

            return (
              <div
                key={opt.value}
                style={{
                  padding: "10px 14px",
                  fontSize: "13px",
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: isSelected ? 500 : 300,
                  color: isSelected || isHovered ? "var(--em)" : "var(--tp)",
                  background: isSelected || isHovered ? "var(--em-subtle)" : "transparent",
                  cursor: "pointer",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={() => setHoveredOption(opt.value)}
                onMouseLeave={() => setHoveredOption(null)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange({ target: { name, value: opt.value } });
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}