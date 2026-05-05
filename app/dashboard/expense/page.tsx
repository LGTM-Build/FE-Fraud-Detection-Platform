"use client";
import { useState, useEffect, useCallback } from "react";

import {
  REVIEW_STATUSES, PENDING_STATUSES, HISTORY_STATUSES,
  type ViewTab, type ReviewFilter, type HistoryFilter, type ExpenseTransaction,
} from "@/data/expenses";

import ExpenseSummaryCards from "@/components/dashboard/expense/ExpenseSummaryCards";
import ExpenseViewTabs from "@/components/dashboard/expense/ExpenseViewTabs";
import ExpenseFilterBar from "@/components/dashboard/expense/ExpenseFilterBar";
import ExpenseTable from "@/components/dashboard/expense/ExpenseTable";
import ExpenseEmptyState from "@/components/dashboard/expense/ExpenseEmptyState";
import { DetailModal } from "@/components/dashboard/expense/DetailDrawer";
import { AddExpenseDrawer } from "@/components/dashboard/expense/AddExpenseDrawer";

import { usePageTitle } from "@/contexts/TopBarContext";
import { getExpenses, updateExpenseStatus } from "@/services/expenseService";

export default function ExpensePage() {
  usePageTitle({ title: "Pengeluaran" });

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewTab>("review");
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all");
  const [filterBU, setFilterBU] = useState("all");
  const [selectedTx, setSelectedTx] = useState<ExpenseTransaction | null>(null);

  // ── State untuk Integrasi API ──────────────────────────────────────────────
  const [transactions, setTransactions] = useState<ExpenseTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getExpenses();
      setTransactions(data as unknown as ExpenseTransaction[]);
    } catch (error) {
      console.error("Gagal mengambil data transaksi:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await updateExpenseStatus(id, "approved");
      await fetchExpenses();
      setSelectedTx(null);
    } catch (error) {
      alert("Gagal memproses persetujuan.");
      throw error;
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateExpenseStatus(id, "rejected");
      await fetchExpenses();
      setSelectedTx(null);
    } catch (error) {
      alert("Gagal memproses penolakan.");
      throw error;
    }
  };

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    check();
    window.addEventListener("resize", check);
    
    fetchExpenses();

    return () => window.removeEventListener("resize", check);
  }, [fetchExpenses]);

  // ── Data split ───────────────────────────────────────────────────────────────
  const reviewData = transactions.filter(t => REVIEW_STATUSES.includes(t.status as any));
  const pendingData = transactions.filter(t => PENDING_STATUSES.includes(t.status as any));
  const historyData = transactions.filter(t => HISTORY_STATUSES.includes(t.status as any));
  
  const businessUnits = [
    "all",
    ...Array.from(
      new Set(transactions.map((t) => t.department).filter(Boolean) as string[])
    ),
  ];

  // ── Filtered ─────────────────────────────────────────────────────────────────
  const applyBU = (data: ExpenseTransaction[]) =>
    filterBU === "all" ? data : data.filter((t) => t.department === filterBU);

  const filteredReview = applyBU(
    reviewFilter === "all" ? reviewData : reviewData.filter(t => t.status === reviewFilter)
  );
  const filteredPending = applyBU(pendingData);
  const filteredHistory = applyBU(
    historyFilter === "all" ? historyData : historyData.filter(t => t.status === historyFilter)
  );
  
  const activeData = activeTab === "review" ? filteredReview : activeTab === "history" ? filteredHistory : filteredPending;
  const hasData = transactions.length > 0;

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "16px" : "24px" }}>
        {/* ── Page Header ─────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "flex-end", justifyContent: "space-between", gap: "16px" }}>
          <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 400, lineHeight: 1.65, maxWidth: "480px", margin: 0 }}>
            Monitor dan review pengeluaran karyawan secara real-time.{" "}
            Tindak lanjuti pengeluaran berisiko sebelum jatuh tempo.
          </p>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <button onClick={() => setIsAddDrawerOpen(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: isMobile ? "8px 12px" : "9px 16px", borderRadius: "10px", background: "var(--surface-2)", color: "var(--ts)", fontSize: "13px", border: "1px solid var(--border)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {!isMobile && "Tambah Manual"}
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: isMobile ? "8px 12px" : "9px 16px", borderRadius: "10px", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "13px", fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Import CSV
            </button>
          </div>
        </div>

        {/* ── Summary & Tabs ──────────────────────────────────────────────────── */}
        {hasData && !isLoading && <ExpenseSummaryCards data={transactions} isMobile={isMobile} isTablet={isTablet} />}
        
        <ExpenseViewTabs activeTab={activeTab} reviewCount={reviewData.length} pendingCount={pendingData.length} historyCount={historyData.length} onTabChange={setActiveTab} />

        {hasData && !isLoading && activeTab !== "pending" && (
          <ExpenseFilterBar activeTab={activeTab} reviewFilter={reviewFilter} historyFilter={historyFilter} filterBU={filterBU} reviewData={reviewData} historyData={historyData} businessUnits={businessUnits} isMobile={isMobile} onReviewFilterChange={setReviewFilter} onHistoryFilterChange={setHistoryFilter} onBUChange={setFilterBU} />
        )}

        {/* ── Table / Empty State ─────────────────────────────────────────────── */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden", minHeight: "300px", display: "flex", flexDirection: "column" }}>
          {isLoading ? (
            <div style={{ padding: "48px", textAlign: "center", color: "var(--tm)", fontSize: "14px", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flex: 1 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 1s linear infinite", marginRight: "10px" }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style> Memuat data pengeluaran...
            </div>
          ) : !hasData || activeData.length === 0 ? (
            <ExpenseEmptyState tab={activeTab} onAddManual={() => setIsAddDrawerOpen(true)} onImportCSV={() => console.log("Import CSV diklik")} />
          ) : (
            <ExpenseTable data={activeData} onSelect={setSelectedTx} isMobile={isMobile} />
          )}
        </div>
      </div>

      {/* ── Modals & Drawers ─────────────────────────────────────────────────── */}
      {selectedTx && (
        <DetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} isMobile={isMobile} onApprove={handleApprove} onReject={handleReject} />
      )}

      <AddExpenseDrawer isOpen={isAddDrawerOpen} onClose={() => setIsAddDrawerOpen(false)} isMobile={isMobile} onSuccess={fetchExpenses} />
    </>
  );
}