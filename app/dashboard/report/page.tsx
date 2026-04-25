"use client";
import { useState, useEffect } from "react";
import { ReportScope, ReportType, ReportFormat, GenerateState } from "@/data/reports";
import { PageHeader } from "@/components/dashboard/report/PageHeader";
import { ReportTypeSelector } from "@/components/dashboard/report/ReportTypeSelector";
import { ReportConfig } from "@/components/dashboard/report/ReportConfig";
import { ReportPreview } from "@/components/dashboard/report/ReportPreview";
import { ReportHistory } from "@/components/dashboard/report/ReportHistory";
import { usePageTitle } from "@/contexts/TopBarContext";

export default function ReportGeneratorPage() {
  usePageTitle({ title: "Report" });

  const [scope, setScope] = useState<ReportScope>("all");
  const [reportType, setReportType] = useState<ReportType>("summary");
  const [format, setFormat] = useState<ReportFormat>("pdf");
  const [periodStart, setPeriodStart] = useState("2026-01-01");
  const [periodEnd, setPeriodEnd] = useState("2026-03-31");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRaw, setIncludeRaw] = useState(false);
  const [generateState, setGenerateState] = useState<GenerateState>("idle");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleGenerate = () => {
    setGenerateState("generating");
    setTimeout(() => setGenerateState("done"), 2500);
  };

  const isNarrow = isMobile || isTablet;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "16px" : "24px" }}>
      <PageHeader isMobile={isMobile} />

      <div style={{
        display: "grid",
        gridTemplateColumns: isNarrow ? "1fr" : "1fr 320px",
        gap: isMobile ? "16px" : "20px",
        alignItems: "start",
      }}>
        {/* Left — config */}
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "12px" : "16px" }}>
          <ReportTypeSelector value={reportType} onChange={setReportType} isMobile={isMobile} />
          <ReportConfig
            scope={scope}
            periodStart={periodStart}
            periodEnd={periodEnd}
            format={format}
            includeCharts={includeCharts}
            includeRaw={includeRaw}
            onScopeChange={setScope}
            onPeriodStartChange={setPeriodStart}
            onPeriodEndChange={setPeriodEnd}
            onFormatChange={setFormat}
            onIncludeChartsChange={setIncludeCharts}
            onIncludeRawChange={setIncludeRaw}
            isMobile={isMobile}
          />
        </div>

        {/* Right — preview + generate (stacks below on narrow) */}
        <ReportPreview
          reportType={reportType}
          scope={scope}
          periodStart={periodStart}
          periodEnd={periodEnd}
          format={format}
          includeCharts={includeCharts}
          includeRaw={includeRaw}
          generateState={generateState}
          onGenerate={handleGenerate}
          onReset={() => setGenerateState("idle")}
          isNarrow={isNarrow}
        />
      </div>

      <ReportHistory isMobile={isMobile} />
    </div>
  );
}