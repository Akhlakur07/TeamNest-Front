import PanelShell from "../../components/PanelShell";
import UserCard from "../../components/UserCard";
import LogoutButton from "../../components/LogoutButton";
import { cardClass } from "../../utils/ui";

const PlatformDashboard = () => {
  return (
    <PanelShell
      title="Platform Admin"
      subtitle="Manage organizations, plans, and platform-wide transactions."
      navItems={["Organizations", "Plans", "Transactions", "Stats & overview"]}
    >
      <div className="flex items-center justify-end">
        <LogoutButton />
      </div>
      <UserCard />
      <div className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900 mb-3">This panel will include</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li>Organizations list with search and filtering</li>
          <li>Organization detail (profile, members, subscription, payments)</li>
          <li>Plans management</li>
          <li>Platform-wide transactions and statistics</li>
          <li>Suspend / reactivate organizations</li>
        </ul>
      </div>
    </PanelShell>
  );
};

export default PlatformDashboard;