export type ImportStatus = "success" | "processing" | "error" | "partial";
export type ImportModule = "expense" | "procurement";
export type Step = "upload" | "mapping" | "processing" | "done";

export interface ImportBatch {
  id: string;
  filename: string;
  module: ImportModule;
  uploadedAt: string;
  uploadedBy: string;
  totalRows: number;
  mappedRows: number;
  errorRows: number;
  status: ImportStatus;
  duration: string;
}

export interface MappingRow {
  sourceCol: string;
  targetField: string | null;
  confidence: number;
  status: "mapped" | "review" | "unmapped";
}

export interface MappingResult {
  filename: string;
  totalRows: number;
  detectedSource: string;
  mappings: MappingRow[];
}

export const importHistory: ImportBatch[] = [
  { id: "IMP-0041", filename: "expense_april_2026.csv",   module: "expense",      uploadedAt: "12 Apr 2026, 09:14", uploadedBy: "Dewi Rahayu",  totalRows: 342, mappedRows: 342, errorRows: 0, status: "success",  duration: "18 dtk" },
  { id: "IMP-0040", filename: "po_q1_procurement.csv",    module: "procurement",  uploadedAt: "10 Apr 2026, 14:32", uploadedBy: "Rina Kusuma",  totalRows: 128, mappedRows: 121, errorRows: 7, status: "partial",  duration: "24 dtk" },
  { id: "IMP-0039", filename: "sap_export_mar26.csv",     module: "expense",      uploadedAt: "5 Apr 2026, 11:05",  uploadedBy: "Dewi Rahayu",  totalRows: 891, mappedRows: 891, errorRows: 0, status: "success",  duration: "41 dtk" },
  { id: "IMP-0038", filename: "vendor_invoice_q1.csv",    module: "procurement",  uploadedAt: "1 Apr 2026, 08:47",  uploadedBy: "Anton Susilo", totalRows: 256, mappedRows: 0,   errorRows: 256, status: "error", duration: "3 dtk"  },
  { id: "IMP-0037", filename: "expense_mar_2026.csv",     module: "expense",      uploadedAt: "28 Mar 2026, 16:20", uploadedBy: "Dewi Rahayu",  totalRows: 410, mappedRows: 410, errorRows: 0, status: "success",  duration: "22 dtk" },
  { id: "IMP-0036", filename: "odoo_export_feb26.csv",    module: "procurement",  uploadedAt: "3 Mar 2026, 10:11",  uploadedBy: "Fajar Nugroho",totalRows: 183, mappedRows: 179, errorRows: 4, status: "partial",  duration: "19 dtk" },
];

export const mockMappingResult: MappingResult = {
  filename: "expense_april_2026.csv",
  totalRows: 342,
  detectedSource: "SAP Concur Export",
  mappings: [
    { sourceCol: "POSTING_DATE",    targetField: "transaction_date",    confidence: 99, status: "mapped" },
    { sourceCol: "CLAIM_AMOUNT",    targetField: "amount",              confidence: 97, status: "mapped" },
    { sourceCol: "EXPENSE_TYPE",    targetField: "expense_category",    confidence: 94, status: "mapped" },
    { sourceCol: "VENDOR_NAME",     targetField: "merchant_name",       confidence: 91, status: "mapped" },
    { sourceCol: "EMPLOYEE_ID",     targetField: "employee_id",         confidence: 99, status: "mapped" },
    { sourceCol: "TXN_REF",         targetField: "transaction_id",      confidence: 98, status: "mapped" },
    { sourceCol: "NOTES",           targetField: "description",         confidence: 86, status: "mapped" },
    { sourceCol: "RECEIPT_URL",     targetField: "receipt_attachment",  confidence: 88, status: "mapped" },
    { sourceCol: "DEPT_CODE",       targetField: "department",          confidence: 72, status: "review" },
    { sourceCol: "EMP_GRADE_LEVEL", targetField: "employee_grade",      confidence: 65, status: "review" },
    { sourceCol: "ATTENDEES_LIST",  targetField: "attendee_list",       confidence: 55, status: "review" },
    { sourceCol: "INTERNAL_CODE",   targetField: null,                  confidence: 0,  status: "unmapped" },
  ],
};

export type StatusConfig = {
  label: string;
  bg: string;
  color: string;
  border: string;
  dot: string;
};

export const statusConfig: Record<ImportStatus, StatusConfig> = {
  success:    { label: "Berhasil",   bg: "rgba(16,185,129,0.10)", color: "var(--em)", border: "rgba(16,185,129,0.20)", dot: "#10b981" },
  processing: { label: "Memproses", bg: "rgba(245,158,11,0.10)",  color: "#d97706",   border: "rgba(245,158,11,0.20)", dot: "#f59e0b" },
  partial:    { label: "Parsial",   bg: "rgba(245,158,11,0.10)",  color: "#d97706",   border: "rgba(245,158,11,0.20)", dot: "#f59e0b" },
  error:      { label: "Gagal",     bg: "rgba(239,68,68,0.10)",   color: "#dc2626",   border: "rgba(239,68,68,0.20)", dot: "#ef4444" },
};

export const STEP_LABELS: Record<Step, string> = {
  upload:     "Upload File",
  mapping:    "Konfirmasi Mapping",
  processing: "Proses AI",
  done:       "Selesai",
};

export const STEP_ORDER: Step[] = ["upload", "mapping", "processing", "done"];