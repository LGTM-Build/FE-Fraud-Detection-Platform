"use client";
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

interface TopBarMeta {
  title: string;
  subtitle?: string;
}

interface TopBarContextValue {
  meta: TopBarMeta;
  setMeta: (meta: TopBarMeta) => void;
}

const TopBarContext = createContext<TopBarContextValue>({
  meta: { title: "Dashboard" },
  setMeta: () => {},
});

/** Taruh di root layout — provides title state ke seluruh tree */
export function TopBarProvider({ children }: { children: ReactNode }) {
  const [meta, setMetaState] = useState<TopBarMeta>({ title: "Dashboard" });
  const setMeta = useCallback((m: TopBarMeta) => setMetaState(m), []);

  return (
    <TopBarContext.Provider value={{ meta, setMeta }}>
      {children}
    </TopBarContext.Provider>
  );
}

/** Dipakai oleh TopBar untuk membaca title yang aktif */
export function useTopBarMeta() {
  return useContext(TopBarContext).meta;
}

/**
 * Dipakai oleh setiap PAGE untuk set judul TopBar.
 *
 * @example
 * // Di page.tsx mana saja:
 * usePageTitle({ title: "Procurement Monitor", subtitle: "Review transaksi pengadaan" });
 */
export function usePageTitle(meta: TopBarMeta) {
  const { setMeta } = useContext(TopBarContext);
  useEffect(() => {
    setMeta(meta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.title, meta.subtitle]);
}