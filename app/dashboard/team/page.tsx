"use client";
import { useState, useEffect, useCallback } from "react";
import { getUsers, toggleUserStatus } from "@/services/userService";
import TeamTable from "@/components/dashboard/teams/TeamTable";
import AddMemberDrawer from "@/components/dashboard/teams/AddMemberDrawer";
import EditMemberDrawer from "@/components/dashboard/teams/EditMemberDrawer";
import RoleCards from "@/components/dashboard/teams/RoleCards"; // <--- Import ini
import { usePageTitle } from "@/contexts/TopBarContext";

export default function TeamManagementPage() {
  usePageTitle({ title: "Manajemen Tim" });

  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  const fetchTeam = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setMembers(data);
    } catch (error) {
      console.error("Gagal load team:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeam();
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [fetchTeam]);

  const handleEditClick = (member: any) => {
    setSelectedMember(member);
    setIsEditOpen(true);
  };

  const handleToggleStatus = async (id: string) => {
    if (!confirm("Yakin ingin mengubah status akun ini?")) return;
    try {
      await toggleUserStatus(id);
      await fetchTeam(); 
    } catch (error) {
      alert("Gagal mengubah status member.");
    }
  };

  if (isLoading) {
    return <div style={{ padding: "64px", textAlign: "center", color: "var(--tm)", fontSize: "14px" }}>Memuat data tim...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 400, margin: 0 }}>
          Kelola anggota tim dan hak akses mereka
        </p>
        
        <button
          onClick={() => setIsAddOpen(true)}
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "9px 18px", borderRadius: "10px", border: "none",
            background: "linear-gradient(135deg, var(--em), var(--em2))",
            color: "#fff", fontSize: "13px", fontWeight: 500,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
            flexShrink: 0
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Undang Member
        </button>
      </div>

      {/* Komponen Penjelasan Role (BARU) */}
      <RoleCards members={members} />

      {/* Tabel */}
      <TeamTable members={members} onEdit={handleEditClick} onToggleStatus={handleToggleStatus} />

      {/* Drawers */}
      <AddMemberDrawer 
        isOpen={isAddOpen} 
        isMobile={isMobile} 
        onClose={() => setIsAddOpen(false)} 
        onSuccess={fetchTeam} 
      />
      
      <EditMemberDrawer 
        isOpen={isEditOpen} 
        isMobile={isMobile} 
        onClose={() => { setIsEditOpen(false); setSelectedMember(null); }} 
        memberData={selectedMember} 
        onSuccess={fetchTeam} 
      />
    </div>
  );
}