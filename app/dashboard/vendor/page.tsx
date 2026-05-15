"use client";
import { useState, useEffect, useCallback } from "react";
import { getVendors } from "@/services/vendorService";
import { PageHeader } from "@/components/dashboard/vendor/PageHeader";
import { SummaryStrip } from "@/components/dashboard/vendor/SummaryStrip";
import { VendorFilters, FilterStatus } from "@/components/dashboard/vendor/VendorFilters";
import { VendorCard } from "@/components/dashboard/vendor/VendorCard";
import { VendorDetail } from "@/components/dashboard/vendor/VendorDetail";
import AddVendorDrawer from "@/components/dashboard/vendor/AddVendorDrawer";
import { usePageTitle } from "@/contexts/TopBarContext";

export default function VendorIntelligencePage() {
  usePageTitle({ title: "Info Vendor" });

  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const fetchVendors = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getVendors();
      setVendors(data);
    } catch (error) {
      console.error("Gagal load vendors:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [fetchVendors]);

  const filtered = vendors.filter(v => {
    if (filterStatus !== "all" && v.status !== filterStatus) return false;
    if (search && !v.vendorName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div style={{ padding: "64px", textAlign: "center", color: "var(--tm)", fontSize: "14px" }}>
        Memuat data vendor...
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "16px" : "24px" }}>
        <PageHeader isMobile={isMobile} onAddVendor={() => setIsAddOpen(true)} />
        <SummaryStrip vendors={vendors} isMobile={isMobile} />
        <VendorFilters
          filterStatus={filterStatus}
          search={search}
          vendors={vendors}
          onStatusChange={setFilterStatus}
          onSearchChange={setSearch}
          isMobile={isMobile}
        />

        {filtered.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--tm)", fontSize: "13px" }}>
            {search ? `Tidak ada vendor dengan nama "${search}".` : "Belum ada vendor."}
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))",
            gap: isMobile ? "12px" : "16px",
          }}>
            {filtered.map(vendor => (
              <VendorCard key={vendor.id} vendor={vendor} onClick={() => setSelectedVendor(vendor)} />
            ))}
          </div>
        )}
      </div>

      {selectedVendor && (
        <VendorDetail
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onStatusUpdated={fetchVendors}
          isMobile={isMobile}
        />
      )}

      <AddVendorDrawer
        isOpen={isAddOpen}
        isMobile={isMobile}
        onClose={() => setIsAddOpen(false)}
        onSuccess={fetchVendors}
      />
    </>
  );
}