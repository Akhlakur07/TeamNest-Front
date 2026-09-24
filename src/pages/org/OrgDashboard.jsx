import PanelShell from "../../components/PanelShell";
import UserCard from "../../components/UserCard";
import LogoutButton from "../../components/LogoutButton";
import { cardClass } from "../../utils/ui";

const OrgDashboard = () => {
  return (
    <PanelShell
      title="Organization Admin"
      subtitle="Manage your organization profile, members, subscription, and billing."
      navItems={["Profile", "Members", "Subscription", "Billing", "Transactions"]}
    >
      <div className="flex items-center justify-end">
        <LogoutButton />
      </div>
      <UserCard />
      <div className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900 mb-3">This panel will include</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li>Org profile (edit name, contact info, billing email)</li>
          <li>Members: invite, remove, change role</li>
          <li>Subscription: plan, renewal date, upgrade / downgrade / cancel</li>
          <li>Billing and payment history</li>
          <li>Organization transactions with status filter</li>
        </ul>
      </div>
    </PanelShell>
  );
};

export default OrgDashboard;