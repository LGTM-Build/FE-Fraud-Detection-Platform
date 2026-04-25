"use client";
import { useState } from "react";

import { ReportScope, ReportType, ReportFormat, GenerateState } from "@/data/reports";
import { PageHeader } from "@/components/dashboard/report/PageHeader";
import { ReportTypeSelector } from "@/components/dashboard/report/ReportTypeSelector";
import { ReportConfig } from "@/components/dashboard/report/ReportConfig";
import { ReportPreview } from "@/components/dashboard/report/ReportPreview";
import { ReportHistory } from "@/components/dashboard/report/ReportHistory";
import { usePageTitle } from "@/contexts/TopBarContext";

export default function ReportGeneratorPage() {

  usePageTitle({
    title: "Report",
  });

  const [scope, setScope] = useState<ReportScope>("all");
  const [reportType, setReportType] = useState<ReportType>("summary");
  const [format, setFormat] = useState<ReportFormat>("pdf");
  const [periodStart, setPeriodStart] = useState("2026-01-01");
  const [periodEnd, setPeriodEnd] = useState("2026-03-31");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRaw, setIncludeRaw] = useState(false);
  const [generateState, setGenerateState] = useState<GenerateState>("idle");

  const handleGenerate = () => {
    setGenerateState("generating");
    setTimeout(() => setGenerateState("done"), 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <PageHeader />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" }}>

        {/* Left — config */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <ReportTypeSelector value={reportType} onChange={setReportType} />

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
          />
        </div>

        {/* Right — preview + generate */}
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
        />
      </div>

      <ReportHistory />
    </div>
  );
}