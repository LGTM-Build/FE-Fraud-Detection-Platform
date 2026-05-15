"use client"

import { useEffect, useState, useCallback } from "react";
import SummaryCards from "@/components/dashboard/SummaryCards";
import FraudTrendChart from "@/components/dashboard/FraudTrendChart";
import RecentTransactionsTable from "@/components/dashboard/RecentTransactionsTable";
import QuickActions from "@/components/dashboard/QuickActions";
import HighAlertList from "@/components/dashboard/HighAlertList";
import { ImportDashboardModal } from "@/components/dashboard/ImportDashboardModal";
import { usePageTitle } from "@/contexts/TopBarContext";

import {
  getDashboardSummary,
  getDashboardHighAlerts,
  getDashboardLatest,
  getDashboardFraudTrend,
} from "@/services/dashboardService";

export default function DashboardPage() {
  usePageTitle({ title: "Beranda" });

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [highAlerts, setHighAlerts] = useState<any[]>([]);
  const [latestTx, setLatestTx] = useState<any[]>([]);
  const [fraudTrend, setFraudTrend] = useState<any>(null);

  const [showImportModal, setShowImportModal] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sum, alerts, latest, trend] = await Promise.all([
        getDashboardSummary(),
        getDashboardHighAlerts(),
        getDashboardLatest(),
        getDashboardFraudTrend(),
      ]);

      setSummaryData(sum?.data || sum);
      setHighAlerts(Array.isArray(alerts) ? alerts : alerts?.data || []);
      setLatestTx(Array.isArray(latest) ? latest : latest?.data || []);
      setFraudTrend(trend?.data || trend || null);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
    };
    check();
    window.addEventListener("resize", check);
    fetchDashboardData();
    return () => window.removeEventListener("resize", check);
  }, [fetchDashboardData]);

  const hasData = latestTx.length > 0 || (summaryData && summaryData.totalTransactions > 0);

  if (isLoading) {
    return (
      <div style={{ padding: "64px", textAlign: "center", color: "var(--tm)", fontSize: "14px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 1s linear infinite", marginRight: "10px" }}>
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        Memuat data beranda...
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "16px" : "24px" }}>
        {!hasData ? (
          <>
            <EmptyOnboardingBanner onImportClick={() => setShowImportModal(true)} />
            <EmptySummaryCards />
            <EmptyChartAndAlert isMobile={isMobile} isTablet={isTablet} />
          </>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <QuickActions isMobile={isMobile} onImportClick={() => setShowImportModal(true)} />
            </div>
            <SummaryCards data={summaryData} isMobile={isMobile} isTablet={isTablet} />

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1fr 320px",
              gap: isMobile ? "16px" : "20px",
            }}>
              <FraudTrendChart trendData={fraudTrend} />
              <HighAlertList data={highAlerts} />
            </div>

            <RecentTransactionsTable data={latestTx} />
          </>
        )}
      </div>

      {/* Modal render di luar flow utama biar tidak kena stacking context */}
      <ImportDashboardModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        isMobile={isMobile}
        onSuccess={fetchDashboardData}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Empty state components
// ---------------------------------------------------------------------------
function EmptyOnboardingBanner({ onImportClick }: { onImportClick: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{
        background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)",
        borderRadius: "16px", padding: "20px 24px", display: "flex",
        alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ background: "rgba(16,185,129,0.15)", color: "var(--em)", padding: "12px", borderRadius: "12px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--ts)", lineHeight: 1.5, maxWidth: "500px" }}>
            <strong style={{ color: "var(--tp)" }}>Upload transaksi pertamamu</strong> untuk mulai deteksi fraud otomatis dengan AI. Sistem siap, tinggal datanya.
          </p>
        </div>
        <button
          onClick={onImportClick}
          style={{
            padding: "10px 20px", background: "var(--surface-2)", border: "1px solid var(--border)",
            borderRadius: "10px", color: "var(--tp)", fontSize: "13px", fontWeight: 500,
            whiteSpace: "nowrap", cursor: "pointer",
          }}
        >
          Import Data
        </button>
      </div>

      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "var(--tp)" }}>Setup awal</h3>
          <span style={{ fontSize: "12px", color: "var(--em)", fontWeight: 500 }}>1 dari 3 selesai</span>
        </div>
        <div style={{ background: "var(--surface-2)", height: "4px", borderRadius: "2px", marginBottom: "24px", overflow: "hidden" }}>
          <div style={{ background: "var(--em)", width: "33%", height: "100%" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", background: "var(--surface-2)", borderRadius: "10px", opacity: 0.7 }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "var(--em)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span style={{ fontSize: "13px", color: "var(--tp)", fontWeight: 500 }}>Akun perusahaan dibuat</span>
          </div>
          <div
            onClick={onImportClick}
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", background: "var(--surface-2)", borderRadius: "10px", border: "1px solid var(--border)", cursor: "pointer" }}
          >
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", border: "2px solid var(--tm)", color: "var(--tm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>2</div>
            <span style={{ fontSize: "13px", color: "var(--tp)", fontWeight: 600 }}>Upload data transaksi (CSV/Excel)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", background: "var(--surface-2)", borderRadius: "10px", opacity: 0.5 }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", border: "2px solid var(--tm)", color: "var(--tm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>3</div>
            <span style={{ fontSize: "13px", color: "var(--tp)", fontWeight: 500 }}>AI mulai analisis & deteksi fraud</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptySummaryCards() {
  const emptyCards = ["Total Transaksi", "Perlu Review", "High Alert", "Nilai Berisiko"];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
      {emptyCards.map(c => (
        <div key={c} style={{ background: "var(--surface-2)", border: "1px solid var(--card-b)", borderRadius: "16px", padding: "20px 22px", opacity: 0.8 }}>
          <div style={{ fontSize: "12px", color: "var(--ts)", marginBottom: "14px" }}>{c}</div>
          <div style={{ fontSize: "28px", color: "var(--tm)", fontWeight: 800 }}>—</div>
          <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "4px" }}>belum ada data</div>
        </div>
      ))}
    </div>
  );
}

function EmptyChartAndAlert({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1fr 320px", gap: "20px" }}>
      <div style={{ background: "var(--surface-2)", border: "1px solid var(--card-b)", borderRadius: "16px", padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: 0.8 }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: "16px" }}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--tp)", marginBottom: "6px" }}>Belum ada tren fraud</div>
        <div style={{ fontSize: "13px", color: "var(--tm)" }}>Chart akan muncul setelah transaksi diproses AI</div>
      </div>
      <div style={{ background: "var(--surface-2)", border: "1px solid var(--card-b)", borderRadius: "16px", padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: 0.8 }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: "16px" }}>
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--tp)", marginBottom: "6px" }}>Tidak ada High Alert</div>
        <div style={{ fontSize: "13px", color: "var(--tm)" }}>Ini kabar baik! Atau belum ada data masuk</div>
      </div>
    </div>
  );
}