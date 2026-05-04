"use client";
import { useState, useEffect } from "react";
import { Tab } from "@/components/dashboard/settings/types";
import { SettingsHeader } from "@/components/dashboard/settings/SettingsHeader";
import { SettingsTabs } from "@/components/dashboard/settings/SettingsTabs";
import { UsersTab } from "@/components/dashboard/settings/UsersTab";
import { PolicyTab } from "@/components/dashboard/settings/PolicyTab";
import { NotificationsTab } from "@/components/dashboard/settings/NotificationsTab";
import { IntegrationsTab } from "@/components/dashboard/settings/IntegrationsTab";
import { usePageTitle } from "@/contexts/TopBarContext";

export default function SettingsPage() {

   usePageTitle({
    title: "Settings",
  });

  const [tab, setTab] = useState<Tab>("users");
  const [emailAlert, setEmailAlert]       = useState(true);
  const [waAlert, setWaAlert]             = useState(false);
  const [dailyDigest, setDailyDigest]     = useState(true);
  const [highAlertOnly, setHighAlertOnly] = useState(false);
  const [isMobile, setIsMobile]           = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "16px" : "24px" }}>
      <SettingsHeader isMobile={isMobile} />
      <SettingsTabs tab={tab} onChange={setTab} isMobile={isMobile} />

      {tab === "users"         && <UsersTab isMobile={isMobile} />}
      {tab === "policy"        && <PolicyTab isMobile={isMobile} />}
      {tab === "notifications" && (
        <NotificationsTab
          emailAlert={emailAlert}     setEmailAlert={setEmailAlert}
          waAlert={waAlert}           setWaAlert={setWaAlert}
          dailyDigest={dailyDigest}   setDailyDigest={setDailyDigest}
          highAlertOnly={highAlertOnly} setHighAlertOnly={setHighAlertOnly}
        />
      )}
      {tab === "integrations"  && <IntegrationsTab isMobile={isMobile} />}
    </div>
  );
}