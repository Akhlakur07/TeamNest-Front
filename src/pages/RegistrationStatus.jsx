import { Link, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../utils/apiClient";
import useAuth from "../hooks/useAuth";
import { btnPrimary, btnSecondary, authContainer } from "../utils/ui";

const RegistrationStatus = () => {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const status = params.get("status");
  const success = status === "success";

  const statusQuery = useQuery({
    queryKey: ["registration", "status"],
    queryFn: () => apiClient.get("/auth/registration-status").then((r) => r.data),
    enabled: success && !!user,
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    retry: 1,
  });

  const isActive = statusQuery.data?.org?.status === "ACTIVE";

  return (
    <div className={authContainer}>
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold ${
            isActive
              ? "bg-emerald-100 text-emerald-600"
              : success
                ? "bg-amber-100 text-amber-600"
                : "bg-red-100 text-red-600"
          }`}
        >
          {isActive ? "✓" : success ? "…" : "!"}
        </div>

        {isActive ? (
          <>
            <h1 className="text-xl font-semibold text-slate-900">Your organization is active!</h1>
            <p className="mt-2 text-sm text-slate-600">
              Payment confirmed. Your workspace is ready.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/org" className={btnPrimary}>
                Open organization dashboard
              </Link>
            </div>
          </>
        ) : success ? (
          <>
            <h1 className="text-xl font-semibold text-slate-900">Payment received</h1>
            <p className="mt-2 text-sm text-slate-600">
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
            <h1 className="text-xl font-semibold text-slate-900">Payment not completed</h1>
            <p className="mt-2 text-sm text-slate-600">
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