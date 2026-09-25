import { Outlet } from "react-router";
import PanelShell from "../components/PanelShell";
import LogoutButton from "../components/LogoutButton";

const adminNavItems = [
  { label: "Dashboard", to: "/admin" },
  { label: "Organizations", to: "/admin/organizations" },
  { label: "Plans", to: "/admin/plans" },
  { label: "Revenue", to: "/admin/revenue" },
  { label: "Transactions", to: "/admin/transactions" },
  { label: "Stats & overview", to: "/admin/stats" },
];

const AdminLayout = () => {
  return (
    <PanelShell
      title="Platform Admin"
      subtitle="Manage organizations, plans, and platform-wide transactions."
      navItems={adminNavItems}
      rightAction={<LogoutButton />}
    >
      <Outlet />
    </PanelShell>
  );
};

export default AdminLayout;
