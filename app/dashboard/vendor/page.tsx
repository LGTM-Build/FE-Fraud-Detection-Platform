"use client";
import { useState } from "react";

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

  const filtered = vendors.filter((v) => {
    if (filterStatus !== "all" && v.status !== filterStatus) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.taxId.includes(search)) return false;
    return true;
  });

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <PageHeader />

        <SummaryStrip vendors={vendors} />

        <VendorFilters
          filterStatus={filterStatus}
          search={search}
          vendors={vendors}
          onStatusChange={setFilterStatus}
          onSearchChange={setSearch}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
          {filtered.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onClick={() => setSelectedVendor(vendor)}
            />
          ))}
        </div>
      </div>

      {selectedVendor && (
        <VendorDetail vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />
      )}
    </>
  );
}