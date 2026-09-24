import PanelShell from "../../components/PanelShell";
import UserCard from "../../components/UserCard";
import LogoutButton from "../../components/LogoutButton";
import { cardClass } from "../../utils/ui";

const MemberDashboard = () => {
  return (
    <PanelShell
      title="Organization Member"
      subtitle="Your profile and a read-only view of your organization."
      navItems={["Profile", "Organization info"]}
    >
      <div className="flex items-center justify-end">
        <LogoutButton />
      </div>
      <UserCard />
      <div className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900 mb-3">This panel will include</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li>View and edit your own account details</li>
          <li>Change your password</li>
          <li>Read-only organization info (name and plan — no billing details)</li>
        </ul>
      </div>
    </PanelShell>
  );
};

export default MemberDashboard;