import { Link, useSearchParams } from "react-router";
import { btnPrimary, btnSecondary, authContainer } from "../utils/ui";

const RegistrationStatus = () => {
  const [params] = useSearchParams();
  const status = params.get("status");
  const success = status === "success";

  return (
    <div className={authContainer}>
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold ${
            success ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
          }`}
        >
          {success ? "✓" : "!"}
        </div>
        <h1 className="text-xl font-semibold text-slate-900">
          {success ? "Payment received" : "Payment not completed"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {success
            ? "Your organization is being activated. We confirm payments with Stripe instantly — check your workspace in a few seconds."
            : "Your payment was not completed and your organization is not active yet. Log in and retry the checkout when you're ready."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/login" className={btnPrimary}>
            Log in
          </Link>
          <Link to="/" className={btnSecondary}>
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationStatus;