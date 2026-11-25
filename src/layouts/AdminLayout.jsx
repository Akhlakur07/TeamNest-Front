import { Outlet } from "react-router";
import {
  BarChart3,
  Building2,
  Layers,
  LayoutDashboard,
  Receipt,
  TrendingUp,
} from "lucide-react";
import PanelShell from "../components/PanelShell";

const adminNavItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Organizations", to: "/admin/organizations", icon: Building2 },
  { label: "Plans", to: "/admin/plans", icon: Layers },
  { label: "Revenue", to: "/admin/revenue", icon: TrendingUp },
  { label: "Transactions", to: "/admin/transactions", icon: Receipt },
  { label: "Stats & overview", to: "/admin/stats", icon: BarChart3 },
];

const AdminLayout = () => {
  return (
    <PanelShell
      title="Platform Admin"
      subtitle="Manage organizations, plans, revenue analytics, and platform-wide transactions."
      navItems={adminNavItems}
    >
      <Outlet />
    </PanelShell>
  );
};

export default AdminLayout;
