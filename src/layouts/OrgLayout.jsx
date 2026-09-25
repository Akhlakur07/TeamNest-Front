import { Outlet } from "react-router";
import PanelShell from "../components/PanelShell";
import LogoutButton from "../components/LogoutButton";

const orgNavItems = [
  { label: "Dashboard", to: "/org" },
  { label: "Profile", to: "/org/profile" },
  { label: "Members", to: "/org/members" },
  { label: "Subscription", to: "/org/subscription" },
  { label: "Billing", to: "/org/billing" },
  { label: "Transactions", to: "/org/transactions" },
];

const OrgLayout = () => {
  return (
    <PanelShell
      title="Organization Admin"
      subtitle="Manage your organization profile, members, subscription, and billing."
      navItems={orgNavItems}
      rightAction={<LogoutButton />}
    >
      <Outlet />
    </PanelShell>
  );
};

export default OrgLayout;
