import TeamManagementPage from "@/components/dashboard/settings/TeamManagementPage";
import { usePageTitle } from "@/contexts/TopBarContext";

export default function Page() {

  usePageTitle({
    title: "Team Management",
  });

  return <TeamManagementPage />;
}