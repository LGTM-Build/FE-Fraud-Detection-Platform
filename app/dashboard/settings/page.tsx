import SettingsPage from "@/components/dashboard/settings/SettingsPage";
import { usePageTitle } from "@/contexts/TopBarContext";

export default function Page() {

  usePageTitle({
    title: "Settings",
  });

  return <SettingsPage />;
}