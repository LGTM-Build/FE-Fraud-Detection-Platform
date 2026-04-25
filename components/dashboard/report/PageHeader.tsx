interface PageHeaderProps { isMobile?: boolean; }
export function PageHeader({ isMobile }: PageHeaderProps) {
  return (
    <div>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "18px" : "22px", fontWeight: 800, color: "var(--tp)", letterSpacing: "-0.8px", marginBottom: "4px" }}>
        Report Generator
      </h1>
      <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 300 }}>
        Generate laporan audit siap pakai dalam format PDF atau Excel
      </p>
    </div>
  );
}