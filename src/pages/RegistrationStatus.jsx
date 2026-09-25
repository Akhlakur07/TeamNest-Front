import { Link, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../utils/apiClient";
import { authContainer, btnPrimary, btnSecondary, cardClass } from "../utils/ui";

const RegistrationStatus = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const success = params.get("success") === "true";

  const statusQuery = useQuery({
    queryKey: ["checkout-status", sessionId],
    queryFn: () =>
      sessionId
        ? apiClient.get(`/checkout/status?session_id=${sessionId}`).then((r) => r.data)
        : null,
    enabled: Boolean(sessionId),
    refetchInterval: (query) => {
      const org = query.state?.data?.organization;
      return org?.status === "ACTIVE" ? false : 3000;
    },
  });

  const org = statusQuery.data?.organization;
  const isActive = org?.status === "ACTIVE";

  return (
    <div className={authContainer}>
      <div className={`${cardClass} max-w-md w-full text-center relative z-10`}>
        <div
          className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold shadow-lg ${
            isActive
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : success
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
          }`}
        >
          {isActive ? "✓" : success ? "…" : "!"}
        </div>

        {isActive ? (
          <>
            <h1 className="text-2xl font-bold text-white tracking-tight">Your organization is active!</h1>
            <p className="mt-2 text-sm text-slate-300">
              Your workspace is ready. You can now configure your team and start collaborating.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/org" className={btnPrimary}>
                Open organization dashboard
              </Link>
            </div>
          </>
        ) : success ? (
          <>
            <h1 className="text-2xl font-bold text-white tracking-tight">Payment received</h1>
            <p className="mt-2 text-sm text-slate-300">
              {statusQuery.isLoading
                ? "Confirming your payment with Stripe..."
                : "Activation in progress. We confirm payments with Stripe instantly — this usually takes a few seconds."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/org" className={btnPrimary}>
                Go to organization dashboard
              </Link>
              <Link to="/" className={btnSecondary}>
                Back home
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white tracking-tight">Payment not completed</h1>
            <p className="mt-2 text-sm text-slate-300">
              Your payment was not completed and your organization is not active yet. Log in
              and retry the checkout when you're ready.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/login" className={btnPrimary}>
                Log in
              </Link>
              <Link to="/" className={btnSecondary}>
                Back home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegistrationStatus;