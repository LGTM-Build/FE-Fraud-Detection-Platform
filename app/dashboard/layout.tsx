"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkBreakpoint = () => {
      const w = window.innerWidth;
      const mobile = w < 768;
      setIsMobile(mobile);
      if (w >= 768 && w < 1024) setCollapsed(true);
      if (w >= 1024) setCollapsed(false);
      if (!mobile) setMobileMenuOpen(false);
    };
    checkBreakpoint();
    setMounted(true);
    window.addEventListener("resize", checkBreakpoint);
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, []);

  const sidebarW = !mounted || isMobile ? "0px" : collapsed ? "64px" : "220px";

  return (
    <>
      {/* Global style: force aside inside mobile drawer to not be sticky */}
      <style>{`
        .mobile-drawer aside {
          position: relative !important;
          height: 100% !important;
          width: 100% !important;
        }
      `}</style>

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "var(--bg)",
          ["--sidebar-w" as string]: sidebarW,
        }}
      >
        {/* Desktop / Tablet sidebar — in normal flow */}
        {mounted && !isMobile && (
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        )}

        {/* Mobile drawer — always in DOM after mount so transition works,
            but slid off-screen. The .mobile-drawer class overrides aside sticky. */}
        {mounted && isMobile && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: "fixed", inset: 0, zIndex: 100,
                background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)",
                opacity: mobileMenuOpen ? 1 : 0,
                pointerEvents: mobileMenuOpen ? "auto" : "none",
                transition: "opacity 0.22s ease",
              }}
            />
            {/* Drawer wrapper — position:fixed, clips the aside inside */}
            <div
              className="mobile-drawer"
              style={{
                position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 101,
                width: "260px",
                overflow: "hidden",           // clips anything inside
                transform: mobileMenuOpen ? "translateX(0)" : "translateX(-260px)",
                transition: "transform 0.25s ease",
                willChange: "transform",
              }}
            >
              <Sidebar collapsed={false} setCollapsed={() => setMobileMenuOpen(false)} />
            </div>
          </>
        )}

        {/* Main content */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
        }}>
          <TopBar
            title="Dashboard"
            subtitle="Ringkasan aktivitas fraud hari ini"
            onMenuClick={(mounted && isMobile) ? () => setMobileMenuOpen(p => !p) : undefined}
            showMenuButton={mounted && isMobile}
          />

          <main style={{
            flex: 1,
            padding: (mounted && isMobile) ? "16px" : "28px",
            overflowY: "auto",
            overflowX: "hidden",
          }}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}