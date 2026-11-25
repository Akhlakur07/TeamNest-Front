import { Link, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Check, Clock } from "lucide-react";
import apiClient from "../utils/apiClient";
import { authContainer, btnPrimary, btnSecondary, cardClass } from "../utils/ui";

const RegistrationStatus = () => {
  const [params] = useSearchParams();
  const status = params.get("status");
  const orgId = params.get("orgId");
  const cancelled = status === "cancelled";

  const statusQuery = useQuery({
    queryKey: ["registration-status", orgId],
    queryFn: () =>
      apiClient.get(`/auth/registration/status?orgId=${orgId}`).then((r) => r.data),
    enabled: !cancelled && Boolean(orgId),
    refetchInterval: (query) => {
      const org = query.state?.data?.organization;
      return org?.status === "ACTIVE" ? false : 3000;
    },
  });

  const org = statusQuery.data?.organization;
  const isActive = org?.status === "ACTIVE";
  const isError = statusQuery.isError;

  return (
    <div className={authContainer}>
      <div className={`${cardClass} max-w-md w-full text-center relative z-10`}>
        <div
          className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ${
            cancelled || isError
              ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
              : isActive
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
          }`}
        >
          {cancelled || isError ? (
            <AlertTriangle className="w-7 h-7" />
          ) : isActive ? (
            <Check className="w-7 h-7" />
          ) : (
            <Clock className="w-7 h-7 animate-pulse" />
          )}
        </div>

        {cancelled ? (
          <>
            <h1 className="font-display text-2xl font-bold text-[var(--text-bright)] tracking-tight">
              Payment not completed
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Your payment was not completed and your organization is not active yet. Log in
              and retry the checkout when you&apos;re ready.
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
        ) : isActive ? (
          <>
            <h1 className="font-display text-2xl font-bold text-[var(--text-bright)] tracking-tight">
              Your organization is active!
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Your workspace is ready. You can now configure your team and start collaborating.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/org" className={btnPrimary}>
                Open organization dashboard
              </Link>
            </div>
          </>
        ) : isError ? (
          <>
            <h1 className="font-display text-2xl font-bold text-[var(--text-bright)] tracking-tight">
              We can&apos;t confirm your payment right now
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Please log in and visit your organization dashboard to continue and retry payment
              if needed.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/login" className={btnPrimary}>
                Log in
              </Link>
              <button type="button" onClick={() => statusQuery.refetch()} className={btnSecondary}>
                Try again
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold text-[var(--text-bright)] tracking-tight">
              Payment received
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
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
        )}
      </div>
    </div>
  );
};

export default RegistrationStatus;
