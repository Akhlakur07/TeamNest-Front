import { Link } from "react-router";
import PanelShell from "../../components/PanelShell";
import UserCard from "../../components/UserCard";
import LogoutButton from "../../components/LogoutButton";
import { cardClass, btnSecondary } from "../../utils/ui";

const PlatformDashboard = () => {
  return (
    <PanelShell
      title="Platform Admin"
      subtitle="Manage organizations, plans, and platform-wide transactions."
      navItems={[{ label: "Organizations", to: "/admin/organizations" }, { label: "Plans", to: "/admin/plans" }, { label: "Revenue", to: "/admin/revenue" }, "Transactions", "Stats & overview"]}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/organizations" className={btnSecondary}>
            Organizations
          </Link>
          <Link to="/admin/plans" className={btnSecondary}>
            Manage plans
          </Link>
          <Link to="/admin/revenue" className={btnSecondary}>
            View revenue
          </Link>
        </div>
        <LogoutButton />
      </div>
      <UserCard />
      <div className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900 mb-3">This panel will include</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li>Organizations list with search and filtering is ready — open the Organizations tab above</li>
          <li>Organization detail (profile, members, subscription, payments) with suspend/reactivate</li>
          <li>Plans management is ready — open the Plans tab above</li>
          <li>Revenue overview is ready — open the Revenue tab above</li>
        </ul>
      </div>
    </PanelShell>
  );
};

export default PlatformDashboard;