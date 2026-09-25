import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UserCard from "../../components/UserCard";
import apiClient from "../../utils/apiClient";
import useAuth from "../../hooks/useAuth";
import { cardClass, btnPrimary } from "../../utils/ui";

const OrgDashboard = () => {
  const { backendOrg, fetchProfile } = useAuth();
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const isPending = backendOrg?.status === "PENDING";

  const statusQuery = useQuery({
    queryKey: ["registration", "status"],
    queryFn: () => apiClient.get("/auth/registration-status").then((r) => r.data),
    enabled: isPending,
    refetchInterval: isPending ? 3000 : false,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (isPending && statusQuery.data?.org?.status === "ACTIVE") {
      fetchProfile();
    }
  }, [isPending, statusQuery.data?.org?.status, fetchProfile]);

  const handlePayNow = async () => {
    setPaying(true);
    setPayError("");
    try {
      const { data } = await apiClient.post("/auth/retry-checkout");
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setPaying(false);
        await fetchProfile();
      }
    } catch (err) {
      setPayError(err?.response?.data?.message || "Could not start payment.");
      setPaying(false);
    }
  };

  return (
    <div className="space-y-6">
      {isPending && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Payment pending activation
              </h2>
              <p className="text-sm text-amber-400/80 mt-0.5">
                Your organization is not active yet. Complete payment to activate your workspace.
              </p>
              {payError && <p className="text-sm text-red-400 mt-1">{payError}</p>}
            </div>
            <button type="button" className={btnPrimary} onClick={handlePayNow} disabled={paying}>
              {paying ? "Starting..." : "Complete payment"}
            </button>
          </div>
        </div>
      )}

      <UserCard />

      <div className={cardClass}>
        <h2 className="text-base font-semibold text-white mb-3">Getting started</h2>
        <ul className="space-y-2.5">
          {[
            "Profile is ready — edit org contact info and billing email in the Profile tab",
            "Members management is ready — open the Members tab above",
            "Subscription management is ready — open the Subscription tab above",
            "Billing and payment history is ready — open the Billing tab above",
            "Transaction history with CSV export is ready — open the Transactions tab above",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
              <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrgDashboard;