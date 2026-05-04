"use client";
import { useState, useEffect } from "react";

import {
  MOCK_DATA,
  HAS_DATA,
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

import { usePageTitle } from "@/contexts/TopBarContext";

export default function ProcurementPage() {
  usePageTitle({ title: "Procurement" });

  const [isMobile, setIsMobile]           = useState(false);
  const [isTablet, setIsTablet]           = useState(false);
  const [activeTab, setActiveTab]         = useState<ViewTab>("review");
  const [reviewFilter, setReviewFilter]   = useState<ReviewFilter>("all");
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all");
  const [filterBU, setFilterBU]           = useState("all");
  const [selectedTx, setSelectedTx]       = useState<ProcurementTransaction | null>(null);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Data split ────────────────────────────────────────────────────────────────
  const reviewData  = MOCK_DATA.filter(t => REVIEW_STATUSES.includes(t.status));
  const pendingData = MOCK_DATA.filter(t => PENDING_STATUSES.includes(t.status));
  const historyData = MOCK_DATA.filter(t => HISTORY_STATUSES.includes(t.status));
  const businessUnits = [
    "all",
    ...Array.from(
      new Set(
        MOCK_DATA
          .map((t) => (t as { businessUnit?: string }).businessUnit)
          .filter(Boolean) as string[]
      )
    ),
  ];

  // ── Filtered ──────────────────────────────────────────────────────────────────
  const applyBU = (data: ProcurementTransaction[]) =>
    filterBU === "all"
      ? data
      : data.filter(
          (t) =>
            (t as { businessUnit?: string }).businessUnit === filterBU
        );

  const filteredReview  = applyBU(
    reviewFilter === "all" ? reviewData : reviewData.filter(t => t.status === reviewFilter)
  );
  const filteredPending = applyBU(pendingData);
  const filteredHistory = applyBU(
    historyFilter === "all" ? historyData : historyData.filter(t => t.status === historyFilter)
  );
  const activeData = activeTab === "review" ? filteredReview : activeTab === "history" ? filteredHistory : filteredPending;

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "16px" : "24px" }}>

        {/* ── Page Header: desc + action buttons ─────────────────────────────── */}
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "flex-end",
          justifyContent: "space-between",
          gap: "16px",
        }}>
          <p style={{
            fontSize: "13px",
            color: "var(--tm)",
            fontWeight: 400,
            lineHeight: 1.65,
            maxWidth: "480px",
            margin: 0,
          }}>
            Monitor dan review transaksi pengadaan vendor secara real-time.{" "}
            Tindak lanjuti transaksi yang membutuhkan perhatian sebelum jatuh tempo.
          </p>

          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <button style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: isMobile ? "8px 12px" : "9px 16px",
              borderRadius: "10px",
              background: "var(--surface-2)",
              color: "var(--ts)",
              fontSize: "13px",
              border: "1px solid var(--border)",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
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
              borderRadius: "10px",
              background: "linear-gradient(135deg, var(--em), var(--em2))",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
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

        {/* ── Summary Cards ───────────────────────────────────────────────────── */}
        {HAS_DATA && (
          <ProcurementSummaryCards data={MOCK_DATA} isMobile={isMobile} isTablet={isTablet} />
        )}

        {/* ── View Tabs ───────────────────────────────────────────────────────── */}
        <ProcurementViewTabs
          activeTab={activeTab}
          reviewCount={reviewData.length}
          pendingCount={pendingData.length}
          historyCount={historyData.length}
          onTabChange={setActiveTab} />

        {/* ── Filter Bar ──────────────────────────────────────────────────────── */}
        {HAS_DATA && activeTab !== "pending" && (
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

        {/* ── Table / Empty State ─────────────────────────────────────────────── */}
        <div style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-b)",
          borderRadius: "16px",
          overflow: "hidden",
        }}>
          {!HAS_DATA || activeData.length === 0 ? (
            <ProcurementEmptyState 
              tab={activeTab} 
              onAddManual={() => console.log("Tambah Manual diklik")} 
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

      {/* ── Detail Modal ─────────────────────────────────────────────────────── */}
      {selectedTx && (
        <DetailModal
          tx={selectedTx}
          onClose={() => setSelectedTx(null)}
          isMobile={isMobile}
          onApprove={async (id) => {
            console.log("approve", id);
            setSelectedTx(null);
          }}
          onReject={async (id) => {
            console.log("reject", id);
            setSelectedTx(null);
          }}
          onEscalate={async (id) => {
            console.log("escalate", id);
            setSelectedTx(null);
          }}
        />
      )}
    </>
  );
}