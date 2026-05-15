import { useState, useEffect } from "react";
import { createTransaction } from "@/services/procurementService";
import { getEmployees } from "@/services/employeeService";

interface AddDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  onSuccess?: () => void;
}

export function AddProcurementDrawer({ isOpen, onClose, isMobile, onSuccess }: AddDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    employeeId: "",
    vendorName: "",
    itemDescription: "",
    department: "",
    amountTotal: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    procurementMethod: "pengadaan_langsung",
  });

  useEffect(() => {
    if (isOpen) {
      getEmployees()
        .then((data) => setEmployees(data))
        .catch((err) => console.error("Gagal memuat list karyawan:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | any) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("ISI DATA YANG MAU DIKIRIM:", formData);
    setLoading(true);
    try {
      const isoDate = new Date(formData.purchaseDate).toISOString();
      
      const payload: any = {
        ...formData,
        amountTotal: Number(formData.amountTotal),
        purchaseDate: isoDate,
      };

      if (!payload.employeeId || payload.employeeId === "") {
        payload.employeeId = null; 
      }

      await createTransaction(payload);
      
      if (onSuccess) onSuccess();
      onClose();
      setFormData({
        employeeId: "", vendorName: "", itemDescription: "", department: "",
        amountTotal: "", purchaseDate: new Date().toISOString().split("T")[0],
        procurementMethod: "pengadaan_langsung",
      });
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      alert("Gagal menyimpan data pengadaan. Cek console/network untuk detailnya.");
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
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--tp)", letterSpacing: "-0.4px", margin: 0 }}>Tambah Pengadaan</h3>
              </div>
              <button className="close-btn" onClick={onClose} style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)", flexShrink: 0, transition: "all 0.15s" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
              <form id="procurement-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <label style={labelStyle}>Karyawan Pengaju (Opsional)</label>
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
                        label: `${emp.fullName} (${emp.department ?? "No Dept"})`,
                      })),
                    ]}
                  />
                </div>
                <div><label style={labelStyle}>Nama Vendor</label><input required className="add-input" name="vendorName" value={formData.vendorName} onChange={handleChange} style={inputStyle} placeholder="Contoh: PT Teknologi Terdepan" /></div>
                <div><label style={labelStyle}>Deskripsi Item</label><textarea required className="add-input" name="itemDescription" value={formData.itemDescription} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: "none" }} placeholder="Contoh: Pengadaan 10 unit laptop..." /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div><label style={labelStyle}>Departemen</label><input required className="add-input" name="department" value={formData.department} onChange={handleChange} style={inputStyle} placeholder="IT" /></div>
                  <div><label style={labelStyle}>Tanggal Pembelian</label><input required type="date" className="add-input" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} style={inputStyle} /></div>
                </div>
                <div><label style={labelStyle}>Metode Pengadaan</label>
                  <CustomSelect
                    name="procurementMethod"
                    value={formData.procurementMethod}
                    onChange={handleChange}
                    placeholder="-- Pilih Metode --"
                    style={inputStyle}
                    options={[
                      { value: "pengadaan_langsung", label: "Pengadaan Langsung" },
                      { value: "tender_terbuka", label: "Tender Terbuka" },
                      { value: "tender_tertutup", label: "Tender Tertutup" },
                      { value: "e_purchasing", label: "E-Purchasing" },
                      { value: "rfp", label: "RFP" },
                      { value: "lainnya", label: "Lainnya" },
                    ]}
                  />
                </div>
                <div><label style={labelStyle}>Total Nilai (Rp)</label><input required type="number" className="add-input" name="amountTotal" value={formData.amountTotal} onChange={handleChange} style={inputStyle} placeholder="Contoh: 150000000" /></div>
              </form>
            </div>

            <div style={{ padding: "20px 28px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", justifyContent: "flex-end", gap: "10px", flexShrink: 0 }}>
              <button type="button" onClick={onClose} style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>Batal</button>
              <button type="submit" form="procurement-form" disabled={loading} style={{ padding: "10px 22px", borderRadius: "10px", border: "none", background: loading ? "var(--surface-2)" : "linear-gradient(135deg, var(--em), var(--em2))", color: loading ? "var(--tm)" : "#fff", fontSize: "13px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: loading ? "none" : "0 4px 16px rgba(16,185,129,0.25)", transition: "all 0.15s" }}>
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
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700, color: "var(--tp)", letterSpacing: "-0.3px", margin: 0 }}>Tambah Pengadaan</h3>
        </div>
        <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
        <form id="procurement-form-mobile" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div><label style={labelStyle}>Karyawan Pengaju</label>
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
          <div><label style={labelStyle}>Nama Vendor</label><input required name="vendorName" value={formData.vendorName} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={labelStyle}>Deskripsi Item</label><textarea required name="itemDescription" value={formData.itemDescription} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: "none" }} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={labelStyle}>Departemen</label><input required name="department" value={formData.department} onChange={handleChange} style={inputStyle} /></div>
            <div><label style={labelStyle}>Tanggal</label><input required type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} style={inputStyle} /></div>
          </div>
          <div><label style={labelStyle}>Total Nilai (Rp)</label><input required type="number" name="amountTotal" value={formData.amountTotal} onChange={handleChange} style={inputStyle} /></div>
        </form>
      </div>

      <div style={{ padding: "16px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", gap: "8px" }}>
        <button type="button" onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>Batal</button>
        <button type="submit" form="procurement-form-mobile" disabled={loading} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: loading ? "var(--surface-2)" : "linear-gradient(135deg, var(--em), var(--em2))", color: loading ? "var(--tm)" : "#fff", fontSize: "13px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 16px rgba(16,185,129,0.25)" }}>{loading ? "Menyimpan..." : "Simpan"}</button>
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