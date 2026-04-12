import { ReactNode } from "react";

export type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
};

export type NavGroup = {
  group: string;
  items: NavItem[];
};

export interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export const navItems: NavGroup[] = [
  {
    group: "Monitor",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        ),
      },
      {
        label: "Expense",
        href: "/dashboard/expense",
        badge: 12,
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        ),
      },
      {
        label: "Procurement",
        href: "/dashboard/procurement",
        badge: 5,
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        ),
      },
      {
        label: "Vendor Intelligence",
        href: "/dashboard/vendor",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="3"/>
            <circle cx="4" cy="6" r="2"/>
            <circle cx="20" cy="6" r="2"/>
            <circle cx="4" cy="18" r="2"/>
            <circle cx="20" cy="18" r="2"/>
            <path d="M6 6l4 4M14 14l4 4M18 6l-4 4M10 14l-4 4"/>
          </svg>
        ),
      },
    ],
  },
  {
    group: "Operasional",
    items: [
      {
        label: "Import Center",
        href: "/dashboard/import",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        ),
      },
      {
        label: "Report Generator",
        href: "/dashboard/report",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        ),
      },
    ],
  },
  {
    group: "Sistem",
    items: [
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
          </svg>
        ),
      },
    ],
  },
];