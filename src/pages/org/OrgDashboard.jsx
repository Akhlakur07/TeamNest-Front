import { useState } from "react";
import PanelShell from "../../components/PanelShell";
import UserCard from "../../components/UserCard";
import LogoutButton from "../../components/LogoutButton";
import apiClient from "../../utils/apiClient";
import useAuth from "../../hooks/useAuth";
import { cardClass, btnPrimary } from "../../utils/ui";

const OrgDashboard = () => {
  const { backendOrg } = useAuth();
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const isPending = backendOrg?.status === "PENDING";

  const handlePayNow = async () => {
    setPaying(true);
    setPayError("");
    try {
      const { data } = await apiClient.post("/auth/retry-checkout");
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setPayError(err?.response?.data?.message || "Could not start payment.");
      setPaying(false);
    }
  };

  return (
    <PanelShell
      title="Organization Admin"
      subtitle="Manage your organization profile, members, subscription, and billing."
      navItems={["Profile", "Members", "Subscription", "Billing", "Transactions"]}
    >
      <div className="flex items-center justify-end">
        <LogoutButton />
      </div>

      {isPending && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-amber-900">Payment pending activation</h2>
              <p className="text-sm text-amber-700 mt-0.5">
                Your organization is not active yet. Complete payment to activate your workspace.
              </p>
              {payError && <p className="text-sm text-red-600 mt-1">{payError}</p>}
            </div>
            <button type="button" className={btnPrimary} onClick={handlePayNow} disabled={paying}>
              {paying ? "Starting..." : "Complete payment"}
            </button>
          </div>
        </div>
      )}

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