"use client";
import { useState } from "react";

import {
  mockExpenses,
  FilterStatus,
  ExpenseTransaction,
} from "@/data/expenses";
import { StatusFilterTabs } from "@/components/dashboard/expense/StatusFilterTabs";
import { ExpenseTable } from "@/components/dashboard/expense/ExpenseTable";
import { DetailDrawer } from "@/components/dashboard/expense/DetailDrawer";
import { PageHeader } from "@/components/dashboard/expense/PageHeader";

export default function ExpenseMonitorPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterDept, setFilterDept] = useState("all");
  const [selectedTx, setSelectedTx] = useState<ExpenseTransaction | null>(null);
 
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
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Page header */}
        <PageHeader />
 
        {/* Status & dept filters */}
        <StatusFilterTabs
          filterStatus={filterStatus}
          filterDept={filterDept}
          departments={departments}
          expenses={mockExpenses}
          onStatusChange={setFilterStatus}
          onDeptChange={setFilterDept}
        />
 
        {/* Table */}
        <ExpenseTable
          transactions={filtered}
          total={mockExpenses.length}
          onSelectTx={setSelectedTx}
        />
      </div>
 
      {/* Detail drawer */}
      {selectedTx && (
        <DetailDrawer tx={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
    </>
  );
}