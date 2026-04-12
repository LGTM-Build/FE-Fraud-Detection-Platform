"use client";
import { useState } from "react";

import { mockData, FilterStatus, ProcurementTransaction } from "@/data/procurement";
import { PageHeader } from "@/components/dashboard/procurement/PageHeader";
import { StatusFilterTabs } from "@/components/dashboard/procurement/StatusFilterTabs";
import { ProcurementTable } from "@/components/dashboard/procurement/ProcurementTable";
import { DetailDrawer } from "@/components/dashboard/procurement/DetailDrawer";

export default function ProcurementMonitorPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterBU, setFilterBU] = useState("all");
  const [selectedTx, setSelectedTx] = useState<ProcurementTransaction | null>(null);

  const businessUnits = ["all", ...Array.from(new Set(mockData.map((t) => t.businessUnit)))];

  const filtered = mockData.filter((t) => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterBU !== "all" && t.businessUnit !== filterBU) return false;
    return true;
  });

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <PageHeader />

        <StatusFilterTabs
          filterStatus={filterStatus}
          filterBU={filterBU}
          businessUnits={businessUnits}
          data={mockData}
          onStatusChange={setFilterStatus}
          onBUChange={setFilterBU}
        />

        <ProcurementTable
          transactions={filtered}
          total={mockData.length}
          onSelectTx={setSelectedTx}
        />
      </div>

      {selectedTx && (
        <DetailDrawer tx={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
    </>
  );
}