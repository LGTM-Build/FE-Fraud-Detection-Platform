import styles from "@/app/(auth)/register/register.module.css";

const INDUSTRIES = [
  "Software House",
  "Manufaktur",
  "Retail & FMCG",
  "Perbankan & Keuangan",
  "Konstruksi",
  "Logistik & Transportasi",
  "Kesehatan",
  "Pendidikan",
  "Pemerintahan",
  "Lainnya",
];

export interface CompanyFormData {
  companyName: string;
  industry: string;
  employeeCount: string;
}

type CompanyFormProps = {
  data: CompanyFormData;
  onChange: (data: CompanyFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  industryOpen: boolean;
  setIndustryOpen: (open: boolean) => void;
};

export default function CompanyForm({
  data,
  onChange,
  onSubmit,
  industryOpen,
  setIndustryOpen,
}: CompanyFormProps) {
  return (
    <form
      key="step1"
      className={styles.stepEnter}
      onSubmit={onSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "14px" }}
    >
      {/* Nama Perusahaan */}
      <div>
        <label className={styles.fieldLabel}>Nama Perusahaan</label>
        <input
          type="text"
          className={styles.regInput}
          placeholder="PT Maju Bersama"
          value={data.companyName}
          onChange={(e) => onChange({ ...data, companyName: e.target.value })}
          required
        />
      </div>

      {/* Industri — custom dropdown */}
      <div>
        <label className={styles.fieldLabel}>Industri</label>
        <div className={styles.customSelectWrapper}>
          <div
            className={`${styles.customSelectTrigger} ${industryOpen ? styles.open : ""} ${
              !data.industry ? styles.placeholder : ""
            }`}
            onClick={() => setIndustryOpen(!industryOpen)}
            onBlur={() => setTimeout(() => setIndustryOpen(false), 150)}
            tabIndex={0}
          >
            <span>{data.industry || "Pilih industri..."}</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              style={{
                transition: "transform 0.2s",
                transform: industryOpen ? "rotate(180deg)" : "rotate(0deg)",
                flexShrink: 0,
              }}
            >
              <path
                d="M2 4l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>

          {industryOpen && (
            <div className={styles.customSelectDropdown}>
              {INDUSTRIES.map((ind) => (
                <div
                  key={ind}
                  className={`${styles.customSelectOption} ${
                    data.industry === ind ? styles.selected : ""
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange({ ...data, industry: ind });
                    setIndustryOpen(false);
                  }}
                >
                  {ind}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Hidden input for native form validation */}
        <input
          type="text"
          value={data.industry}
          required
          readOnly
          style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
        />
      </div>

      {/* Jumlah Karyawan */}
      <div>
        <label className={styles.fieldLabel}>Jumlah Karyawan</label>
        <input
          type="number"
          className={styles.regInput}
          placeholder="50"
          min={1}
          value={data.employeeCount}
          onChange={(e) => onChange({ ...data, employeeCount: e.target.value })}
          required
        />
        <p style={{ fontSize: "11px", color: "var(--tm)", marginTop: "5px", lineHeight: 1.4 }}>
          Digunakan untuk konfigurasi awal platform.
        </p>
      </div>

      <button type="submit" className={styles.regSubmit} style={{ marginTop: "6px" }}>
        Lanjut — Buat Akun Admin
        <svg
          style={{ marginLeft: "8px", display: "inline", verticalAlign: "middle" }}
          width="14"
          height="14"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2 6h8M7 3l3 3-3 3"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}