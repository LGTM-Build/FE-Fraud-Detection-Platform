"use client";
import { useState, useEffect } from "react";
import { updateUser } from "@/services/userService";
import { getEmployees } from "@/services/employeeService";

interface EditMemberDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  onSuccess?: () => void;
  memberData: any | null;
}

const roleDescriptions = [
  { id: "operator", label: "Operator", desc: "Upload CSV & manage import transaksi", color: "#d97706", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.20)" },
  { id: "auditor", label: "Auditor", desc: "Review & approve/reject transaksi fraud", color: "var(--em)", bg: "var(--em-subtle)", border: "rgba(16,185,129,0.20)" },
  { id: "department_head", label: "Dept Head", desc: "Lihat data & generate laporan departemen", color: "#6366f1", bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.20)" },
  { id: "super_admin", label: "Super Admin", desc: "Akses penuh sistem & manajemen tim", color: "#dc2626", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.20)" },
];

function CustomSelect({ name, value, options, onChange, placeholder, style, disabled }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const selectedOption = options.find((o: any) => o.value === value);

  return (
    <div
      style={{ position: "relative", width: "100%", outline: "none" }}
      tabIndex={0}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsOpen(false); }}
    >
      <div
        className="add-input"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{ ...style, cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", opacity: disabled ? 0.6 : 1 }}
      >
        <span style={{ color: value ? "var(--tp)" : "var(--tm)" }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0, color: "var(--tm)" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {isOpen && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "10px", zIndex: 100, boxShadow: "0 8px 32px rgba(0,0,0,0.25)", maxHeight: "220px", overflowY: "auto" }}>
          {options.map((opt: any) => {
            const isSelected = value === opt.value;
            const isHovered = hoveredOption === opt.value;
            return (
              <div
                key={opt.value}
                style={{ padding: "10px 14px", fontSize: "13px", fontFamily: '"DM Sans", sans-serif', fontWeight: isSelected ? 500 : 300, color: isSelected || isHovered ? "var(--em)" : "var(--tp)", background: isSelected || isHovered ? "var(--em-subtle)" : "transparent", cursor: "pointer", transition: "background 0.15s, color 0.15s" }}
                onMouseEnter={() => setHoveredOption(opt.value)}
                onMouseLeave={() => setHoveredOption(null)}
                onMouseDown={(e) => { e.preventDefault(); onChange({ target: { name, value: opt.value } }); setIsOpen(false); }}
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

export default function EditMemberDrawer({ isOpen, onClose, isMobile, onSuccess, memberData }: EditMemberDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", email: "", role: "", employeeId: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    setEmployeesLoading(true);
    getEmployees()
      .then((data) => setEmployees(Array.isArray(data) ? data : []))
      .catch(() => setEmployees([]))
      .finally(() => setEmployeesLoading(false));
  }, [isOpen]);

  useEffect(() => {
    if (memberData && isOpen) {
      setFormData({
        fullName: memberData.fullName ?? "",
        email: memberData.email ?? "",
        role: memberData.role ?? "",
        employeeId: memberData.employeeId ?? "",
      });
    }
  }, [memberData, isOpen]);

  if (!isOpen || !memberData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | any) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleSelect = (roleId: string) => {
    setFormData((prev) => ({ ...prev, role: roleId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = {
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        employeeId: formData.employeeId || null,
      };
      await updateUser(memberData.id, payload);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Gagal update member:", error);
      alert("Gagal menyimpan perubahan.");
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
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes slideInBottom { from { transform: translateY(100%) } to { transform: translateY(0) } }
        .add-input:focus { border-color: var(--em) !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.12); }
      `}</style>

      <div style={{
        position: "fixed", zIndex: 201, display: "flex", flexDirection: "column",
        ...(isMobile
          ? { left: 0, right: 0, bottom: 0, background: "var(--bg)", borderRadius: "20px 20px 0 0", maxHeight: "90vh", animation: "slideInBottom 0.28s cubic-bezier(0.32,0.72,0,1)" }
          : { top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", maxWidth: "560px", maxHeight: "calc(100vh - 48px)", background: "var(--bg)", borderRadius: "20px", animation: "slideUp 0.24s cubic-bezier(0.22,1,0.36,1)" }
        ),
        boxShadow: isMobile ? "0 -16px 48px rgba(0,0,0,0.2)" : "0 32px 80px rgba(0,0,0,0.22)",
        overflow: "hidden"
      }}>
        {isMobile && <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}><div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "var(--border)" }} /></div>}

        <div style={{ padding: isMobile ? "12px 20px 14px" : "20px 28px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--em)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "3px" }}>Akses Sistem</div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "15px" : "18px", fontWeight: 700, color: "var(--tp)", margin: 0 }}>Edit Member</h3>
          </div>
          <button onClick={onClose} style={{ width: isMobile ? "32px" : "36px", height: isMobile ? "32px" : "36px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 16px" : "24px 28px" }}>
          <form id="edit-member-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "14px" }}>
              <div><label style={labelStyle}>Nama Lengkap</label><input required className="add-input" name="fullName" value={formData.fullName} onChange={handleChange} style={inputStyle} /></div>
              <div><label style={labelStyle}>Email</label><input required type="email" className="add-input" name="email" value={formData.email} onChange={handleChange} style={inputStyle} /></div>
            </div>

            <div>
              <label style={labelStyle}>
                Tautkan ke Karyawan
                <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--ts)", marginLeft: "6px" }}>(opsional)</span>
              </label>
              <CustomSelect
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder={employeesLoading ? "Memuat daftar karyawan..." : "— Tidak ditautkan —"}
                style={inputStyle}
                disabled={employeesLoading}
                options={[
                  { value: "", label: "— Tidak ditautkan —" },
                  ...employees.map((emp) => ({
                    value: emp.id,
                    label: `${emp.fullName}${emp.department ? ` · ${emp.department}` : ""}${emp.position ? ` (${emp.position})` : ""}`,
                  })),
                ]}
              />
              {formData.employeeId && !employeesLoading && (() => {
                const linked = employees.find(e => e.id === formData.employeeId);
                return linked ? (
                  <p style={{ fontSize: "11px", color: "var(--em)", marginTop: "6px", marginBottom: 0 }}>
                    ✓ Tertaut ke: {linked.fullName}{linked.department ? ` — ${linked.department}` : ""}
                  </p>
                ) : null;
              })()}
            </div>

            <div style={{ marginTop: "4px" }}>
              <label style={labelStyle}>Ubah Role & Hak Akses</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {roleDescriptions.map((r) => {
                  const isSelected = formData.role === r.id;
                  return (
                    <div key={r.id} onClick={() => handleRoleSelect(r.id)} style={{ padding: "12px 14px", borderRadius: "10px", cursor: "pointer", border: `1px solid ${isSelected ? r.border : "var(--border)"}`, background: isSelected ? r.bg : "var(--surface-2)", display: "flex", alignItems: "center", gap: "12px", transition: "all 0.15s" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: isSelected ? r.color : "var(--tp)", marginBottom: "2px" }}>{r.label}</div>
                        <div style={{ fontSize: "11px", color: "var(--tm)", lineHeight: 1.4 }}>{r.desc}</div>
                      </div>
                      {isSelected && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={r.color} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        <div style={{ padding: isMobile ? "16px" : "20px 28px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", justifyContent: "flex-end", gap: "10px", flexShrink: 0 }}>
          <button type="button" onClick={onClose} style={{ flex: isMobile ? 1 : "none", padding: "10px 18px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Batal</button>
          <button type="submit" form="edit-member-form" disabled={loading} style={{ flex: isMobile ? 1 : "none", padding: "10px 22px", borderRadius: "10px", border: "none", background: loading ? "var(--surface-2)" : "linear-gradient(135deg, var(--em), var(--em2))", color: loading ? "var(--tm)" : "var(--btn-pri-c)", fontSize: "13px", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: loading ? "none" : "var(--em-glow-btn)" }}>
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </>
  );
}