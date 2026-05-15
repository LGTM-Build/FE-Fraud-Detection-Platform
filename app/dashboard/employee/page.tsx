"use client";
import { useState, useEffect, useCallback } from "react";
import type { Employee } from "@/data/employees";

import EmployeeSummaryCards from "@/components/dashboard/employee/EmployeeSummaryCards";
import EmployeeFilterBar from "@/components/dashboard/employee/EmployeeFilterBar";
import EmployeeTable from "@/components/dashboard/employee/EmployeeTable";
import { AddEmployeeDrawer } from "@/components/dashboard/employee/AddEmployeeDrawer";
import { DetailEmployeeModal } from "@/components/dashboard/employee/DetailEmployeeModal";

import { usePageTitle } from "@/contexts/TopBarContext";
import { getEmployees } from "@/services/employeeService";

export default function EmployeePage() {
  usePageTitle({ title: "Karyawan" });

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [filterDept, setFilterDept] = useState("all");
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getEmployees();
      setEmployees(data as unknown as Employee[]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    check();
    window.addEventListener("resize", check);
    fetchEmployees();
    return () => window.removeEventListener("resize", check);
  }, [fetchEmployees]);

  const departments = ["all", ...Array.from(new Set(employees.map(e => e.department).filter(Boolean) as string[]))];
  const activeData = filterDept === "all" ? employees : employees.filter(e => e.department === filterDept);
  const hasData = employees.length > 0;

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "16px" : "24px" }}>
        {/* Header */}
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "flex-end", justifyContent: "space-between", gap: "16px" }}>
          <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 400, lineHeight: 1.65, maxWidth: "480px", margin: 0 }}>
            Kelola data master karyawan. Data ini digunakan sebagai referensi untuk transaksi pengadaan dan pengeluaran.
          </p>
          <button onClick={() => setIsAddDrawerOpen(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: isMobile ? "8px 12px" : "9px 16px", borderRadius: "10px", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "13px", fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tambah Karyawan
          </button>
        </div>

        {/* Summary & Filter */}
        {hasData && !isLoading && <EmployeeSummaryCards data={employees} isMobile={isMobile} isTablet={isTablet} />}
        {hasData && !isLoading && <EmployeeFilterBar filterDept={filterDept} departments={departments} isMobile={isMobile} onDeptChange={setFilterDept} />}

        {/* Table */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden", minHeight: "300px", display: "flex", flexDirection: "column" }}>
          {isLoading ? (
            <div style={{ padding: "48px", textAlign: "center", color: "var(--tm)", fontSize: "14px", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flex: 1 }}>Memuat data karyawan...</div>
          ) : !hasData ? (
            <div style={{ padding: "64px 24px", textAlign: "center", color: "var(--tm)" }}>Belum ada data karyawan. Tambahkan data pertama!</div>
          ) : (
            <EmployeeTable data={activeData} onSelect={setSelectedEmp} isMobile={isMobile} />
          )}
        </div>
      </div>

      {selectedEmp && <DetailEmployeeModal emp={selectedEmp} onClose={() => setSelectedEmp(null)} isMobile={isMobile} onSuccess={fetchEmployees} />}
      <AddEmployeeDrawer isOpen={isAddDrawerOpen} onClose={() => setIsAddDrawerOpen(false)} isMobile={isMobile} onSuccess={fetchEmployees} />
    </>
  );
}