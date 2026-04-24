"use client";
import { useState, useEffect } from "react";
import { mockExpenses, FilterStatus, ExpenseTransaction } from "@/data/expenses";
import { StatusFilterTabs } from "@/components/dashboard/expense/StatusFilterTabs";
import { ExpenseTable } from "@/components/dashboard/expense/ExpenseTable";
import { DetailModal } from "@/components/dashboard/expense/DetailDrawer";
import { PageHeader } from "@/components/dashboard/expense/PageHeader";

export default function ExpenseMonitorPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterDept, setFilterDept] = useState("all");
  const [selectedTx, setSelectedTx] = useState<ExpenseTransaction | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const departments = [
    "all",
    ...Array.from(new Set(mockExpenses.map((t) => t.department))),
  ];

  const filtered = mockExpenses.filter((t) => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterDept !== "all" && t.department !== filterDept) return false;
    return true;
  });

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "16px" : "24px" }}>
        <PageHeader isMobile={isMobile} />

        <StatusFilterTabs
          filterStatus={filterStatus}
          filterDept={filterDept}
          departments={departments}
          expenses={mockExpenses}
          onStatusChange={setFilterStatus}
          onDeptChange={setFilterDept}
          isMobile={isMobile}
        />

        <ExpenseTable
          transactions={filtered}
          total={mockExpenses.length}
          onSelectTx={setSelectedTx}
          isMobile={isMobile}
        />
      </div>

      {selectedTx && (
        <DetailModal
          tx={selectedTx}
          onClose={() => setSelectedTx(null)}
          isMobile={isMobile}
        />
      )}
    </>
  );
}