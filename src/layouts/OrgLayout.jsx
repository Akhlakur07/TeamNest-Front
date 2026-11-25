import { Outlet } from "react-router";
import {
  CreditCard,
  LayoutDashboard,
  Receipt,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import PanelShell from "../components/PanelShell";

const orgNavItems = [
  { label: "Dashboard", to: "/org", icon: LayoutDashboard },
  { label: "Profile", to: "/org/profile", icon: Settings },
  { label: "Members", to: "/org/members", icon: Users },
  { label: "Subscription", to: "/org/subscription", icon: CreditCard },
  { label: "Billing", to: "/org/billing", icon: Wallet },
  { label: "Transactions", to: "/org/transactions", icon: Receipt },
];

const OrgLayout = () => {
  return (
    <PanelShell
      title="Organization Admin"
      subtitle="Manage your workspace profile, team members, subscription, and billing."
      navItems={orgNavItems}
    >
      <Outlet />
    </PanelShell>
  );
};

export default OrgLayout;
