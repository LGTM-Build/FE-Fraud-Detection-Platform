"use client";
import { useState, useEffect } from "react";
import { vendors, FilterStatus, Vendor } from "@/data/vendors";
import { PageHeader } from "@/components/dashboard/vendor/PageHeader";
import { SummaryStrip } from "@/components/dashboard/vendor/SummaryStrip";
import { VendorFilters } from "@/components/dashboard/vendor/VendorFilters";
import { VendorCard } from "@/components/dashboard/vendor/VendorCard";
import { VendorDetail } from "@/components/dashboard/vendor/VendorDetail";

export default function VendorIntelligencePage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const filtered = vendors.filter((v) => {
    if (filterStatus !== "all" && v.status !== filterStatus) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.taxId.includes(search)) return false;
    return true;
  });

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "16px" : "24px" }}>
        <PageHeader isMobile={isMobile} />
        <SummaryStrip vendors={vendors} isMobile={isMobile} />
        <VendorFilters
          filterStatus={filterStatus}
          search={search}
          vendors={vendors}
          onStatusChange={setFilterStatus}
          onSearchChange={setSearch}
          isMobile={isMobile}
        />
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))",
          gap: isMobile ? "12px" : "16px",
        }}>
          {filtered.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} onClick={() => setSelectedVendor(vendor)} />
          ))}
        </div>
      </div>

      {selectedVendor && (
        <VendorDetail vendor={selectedVendor} onClose={() => setSelectedVendor(null)} isMobile={isMobile} />
      )}
    </>
  );
}