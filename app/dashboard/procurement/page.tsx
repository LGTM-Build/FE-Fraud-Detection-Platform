"use client";
import { useState, useEffect, useCallback } from "react";

import {
  REVIEW_STATUSES,
  PENDING_STATUSES,
  HISTORY_STATUSES,
  type ViewTab,
  type ReviewFilter,
  type HistoryFilter,
  type ProcurementTransaction,
} from "@/data/procurement";

import ProcurementSummaryCards from "@/components/dashboard/procurement/ProcurementSummaryCard";
import ProcurementViewTabs     from "@/components/dashboard/procurement/ProcurementViewTabs";
import ProcurementFilterBar    from "@/components/dashboard/procurement/ProcurementFilterBar";
import ProcurementTable        from "@/components/dashboard/procurement/ProcurementTable";
import ProcurementEmptyState   from "@/components/dashboard/procurement/ProcurementEmptyState";
import { DetailModal }         from "@/components/dashboard/procurement/DetailDrawer";
import { AddProcurementDrawer } from "@/components/dashboard/procurement/AddProcurementDrawer";

import { usePageTitle } from "@/contexts/TopBarContext";
import { getTransactions, updateTransactionStatus } from "@/services/procurementService";

export default function ProcurementPage() {
  usePageTitle({ title: "Pengadaan" });

  const [isMobile, setIsMobile]           = useState(false);
  const [isTablet, setIsTablet]           = useState(false);
  const [activeTab, setActiveTab]         = useState<ViewTab>("review");
  const [reviewFilter, setReviewFilter]   = useState<ReviewFilter>("all");
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all");
  const [filterBU, setFilterBU]           = useState("all");
  const [selectedTx, setSelectedTx]       = useState<ProcurementTransaction | null>(null);

  // ── State untuk Integrasi Database ───────────────────────────────────────────
  const [transactions, setTransactions]   = useState<ProcurementTransaction[]>([]);
  const [isLoading, setIsLoading]         = useState(true);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  // Fungsi fetch data langsung via Server Action
 // Fungsi fetch data langsung via Server Action
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getTransactions();
      
      // 1. KITA CEK ISI ASLINYA DI CONSOLE BROWSER
      console.log("Data dari backend:", data); 

      // 2. KITA PASTIKAN FORMATNYA ARRAY
      // Kalau backend bungkus pakai { data: [...] }, kita ambil data-nya
      let validArray = [];
      if (Array.isArray(data)) {
        validArray = data;
      } else if (data && Array.isArray((data as any).data)) {
        validArray = (data as any).data; // Mengambil array dari dalam object
      } else if (data && Array.isArray((data as any).items)) {
        validArray = (data as any).items; 
      }

      setTransactions(validArray as unknown as ProcurementTransaction[]);
    } catch (error) {
      console.error("Gagal mengambil data transaksi:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handler Approve
  const handleApprove = async (id: string) => {
    try {
      // enum di database menggunakan "approved"
      await updateTransactionStatus(id, "approved" as any);
      await fetchTransactions(); // Refresh tabel
      setSelectedTx(null);
    } catch (error) {
      alert("Gagal memproses persetujuan.");
      throw error;
    }
  };

  // Handler Reject
  const handleReject = async (id: string) => {
    try {
      // enum di database menggunakan "rejected"
      await updateTransactionStatus(id, "rejected" as any);
      await fetchTransactions(); // Refresh tabel
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
    
    // Tarik data saat pertama kali render
    fetchTransactions();

    return () => window.removeEventListener("resize", check);
  }, [fetchTransactions]);

  // ── Pemisahan Data Berdasarkan Status ─────────────────────────────────────────
  const reviewData  = transactions.filter(t => REVIEW_STATUSES.includes(t.status as any));
  const pendingData = transactions.filter(t => PENDING_STATUSES.includes(t.status as any));
  const historyData = transactions.filter(t => HISTORY_STATUSES.includes(t.status as any));
  
  const businessUnits = [
    "all",
    ...Array.from(
      new Set(
        transactions
          .map((t) => (t as any).businessUnit || (t as any).department)
          .filter(Boolean) as string[]
      )
    ),
  ];

  // ── Logika Filter ─────────────────────────────────────────────────────────────
  const applyBU = (data: ProcurementTransaction[]) =>
    filterBU === "all"
      ? data
      : data.filter((t) => ((t as any).businessUnit || (t as any).department) === filterBU);

  const filteredReview  = applyBU(
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

        {/* ── Page Header ───────────────────────────────────────────────────────── */}
        <div style={{
          display: "flex", flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "flex-end",
          justifyContent: "space-between", gap: "16px",
        }}>
          <p style={{
            fontSize: "13px", color: "var(--tm)", fontWeight: 400,
            lineHeight: 1.65, maxWidth: "480px", margin: 0,
          }}>
            Monitor dan review transaksi pengadaan vendor secara real-time.{" "}
            Tindak lanjuti transaksi yang membutuhkan perhatian sebelum jatuh tempo.
          </p>

          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <button 
              onClick={() => setIsAddDrawerOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: isMobile ? "8px 12px" : "9px 16px",
                borderRadius: "10px", background: "var(--surface-2)",
                color: "var(--ts)", fontSize: "13px", border: "1px solid var(--border)",
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {!isMobile && "Tambah Manual"}
            </button>
            <button style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: isMobile ? "8px 12px" : "9px 16px",
              borderRadius: "10px", background: "linear-gradient(135deg, var(--em), var(--em2))",
              color: "#fff", fontSize: "13px", fontWeight: 500, border: "none",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Import CSV
            </button>
          </div>
        </div>

        {/* ── Komponen Data ─────────────────────────────────────────────────────── */}
        {hasData && !isLoading && (
          <ProcurementSummaryCards data={transactions} isMobile={isMobile} isTablet={isTablet} />
        )}

        <ProcurementViewTabs
          activeTab={activeTab}
          reviewCount={reviewData.length}
          pendingCount={pendingData.length}
          historyCount={historyData.length}
          onTabChange={setActiveTab} />

        {hasData && !isLoading && activeTab !== "pending" && (
          <ProcurementFilterBar
            activeTab={activeTab}
            reviewFilter={reviewFilter}
            historyFilter={historyFilter}
            filterBU={filterBU}
            reviewData={reviewData}
            historyData={historyData}
            businessUnits={businessUnits}
            isMobile={isMobile}
            onReviewFilterChange={setReviewFilter}
            onHistoryFilterChange={setHistoryFilter}
            onBUChange={setFilterBU}
          />
        )}

        <div style={{
          background: "var(--card-bg)", border: "1px solid var(--card-b)",
          borderRadius: "16px", overflow: "hidden", minHeight: "300px",
          display: "flex", flexDirection: "column"
        }}>
          {isLoading ? (
            <div style={{ padding: "48px", textAlign: "center", color: "var(--tm)", fontSize: "14px", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flex: 1 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 1s linear infinite", marginRight: "10px" }}>
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              Memuat data pengadaan...
            </div>
          ) : !hasData || activeData.length === 0 ? (
            <ProcurementEmptyState 
              tab={activeTab} 
              onAddManual={() => setIsAddDrawerOpen(true)} 
              onImportCSV={() => console.log("Import CSV diklik")} 
            />
          ) : (
            <ProcurementTable
              data={activeData}
              onSelect={setSelectedTx}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>

      {/* ── Modals & Drawers ──────────────────────────────────────────────────── */}
      {selectedTx && (
        <DetailModal
          tx={selectedTx}
          onClose={() => setSelectedTx(null)}
          isMobile={isMobile}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      <AddProcurementDrawer 
        isOpen={isAddDrawerOpen} 
        onClose={() => setIsAddDrawerOpen(false)} 
        isMobile={isMobile}
        onSuccess={fetchTransactions}
      />
    </>
  );
}