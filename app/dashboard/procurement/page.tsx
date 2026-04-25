"use client";
import { useState, useEffect } from "react";
import { mockData, FilterStatus, ProcurementTransaction } from "@/data/procurement";
import { PageHeader } from "@/components/dashboard/procurement/PageHeader";
import { StatusFilterTabs } from "@/components/dashboard/procurement/StatusFilterTabs";
import { ProcurementTable } from "@/components/dashboard/procurement/ProcurementTable";
import { DetailModal } from "@/components/dashboard/procurement/DetailDrawer";
import { usePageTitle } from "@/contexts/TopBarContext";

export default function ProcurementMonitorPage() {

  usePageTitle({
    title: "Procurement",
  });

  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterBU, setFilterBU] = useState("all");
  const [selectedTx, setSelectedTx] = useState<ProcurementTransaction | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const businessUnits = ["all", ...Array.from(new Set(mockData.map((t) => t.businessUnit)))];

  const filtered = mockData.filter((t) => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterBU !== "all" && t.businessUnit !== filterBU) return false;
    return true;
  });

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "16px" : "24px" }}>
        <PageHeader isMobile={isMobile} />
        <StatusFilterTabs
          filterStatus={filterStatus}
          filterBU={filterBU}
          businessUnits={businessUnits}
          data={mockData}
          onStatusChange={setFilterStatus}
          onBUChange={setFilterBU}
          isMobile={isMobile}
        />
        <ProcurementTable
          transactions={filtered}
          total={mockData.length}
          onSelectTx={setSelectedTx}
          isMobile={isMobile}
        />
      </div>

      {selectedTx && (
        <DetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} isMobile={isMobile} />
      )}
    </>
  );
}