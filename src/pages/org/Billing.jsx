import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import apiClient from "../../utils/apiClient";
import { btnPrimary, btnSecondary, cardClass, formatPrice } from "../../utils/ui";

const paymentBadge = (status) => {
  const styles = {
    SUCCESS: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    REFUNDED: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
    FAILED: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
  };
  return styles[status] || "bg-slate-500/20 text-slate-300 border border-slate-500/30";
};

const Billing = () => {
  const currentQuery = useQuery({
    queryKey: ["billing", "current"],
    queryFn: () => apiClient.get("/billing/current").then((r) => r.data),
    refetchInterval: 5000,
  });

  const openPortal = useMutation({
    mutationFn: () => apiClient.post("/billing/portal"),
    onSuccess: (res) => {
      window.location.href = res.data.url;
    },
  });

  if (currentQuery.isLoading)
    return <div className="p-8 text-slate-300">Loading billing...</div>;
  if (currentQuery.isError)
    return <div className="p-8 text-rose-400">Failed to load billing information.</div>;

  const data = currentQuery.data;
  const plan = data.plan;
  const subscription = data.subscription;
  const payments = data.recentPayments || [];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Billing & payments</h2>
      </div>

      <div className={`${cardClass} mb-6`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">Payment method</h2>
            <p className="text-sm text-slate-400 mt-1">
              Cards, invoices, and auto-renewal are managed securely by Stripe.
            </p>
          </div>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => openPortal.mutate()}
            disabled={openPortal.isPending}
          >
            {openPortal.isPending ? "Opening..." : "Manage in Stripe billing portal"}
          </button>
        </div>
      </div>

      <div className={`${cardClass} mb-6`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">{plan?.name || "No plan"}</h2>
            <p className="text-sm text-slate-300 mt-0.5">
              {plan
                ? `${formatPrice(plan.priceCents, plan.currency)}${plan.billingInterval === "yearly" ? "/year" : "/month"}`
                : "No active plan"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/org/subscription" className={btnSecondary}>
              Manage subscription
            </Link>
            <Link to="/org/transactions" className={btnPrimary}>
              Full history
            </Link>
          </div>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="text-slate-400 text-xs">Next renewal</dt>
            <dd className="text-white font-medium mt-0.5">
              {subscription?.currentPeriodEnd
                ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400 text-xs">Status</dt>
            <dd className="text-white font-medium mt-0.5">{subscription?.status || "—"}</dd>
          </div>
        </dl>
      </div>

      <div className={cardClass}>
        <h2 className="text-base font-semibold text-white mb-4">Recent payments</h2>
        {payments.length === 0 ? (
          <p className="text-sm text-slate-400">No payments recorded yet.</p>
        ) : (
          <ul className="divide-y divide-white/10 text-sm">
            {payments.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <div className="text-white font-medium">{p.invoiceNumber || "Invoice"}</div>
                  <div className="text-slate-400 text-xs">
                    {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "—"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white">
                    {formatPrice(p.amountCents, p.currency)}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${paymentBadge(p.status)}`}
                  >
                    {p.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-slate-400 mt-4">
          For every payment plus downloadable invoices, open the{" "}
          <Link to="/org/transactions" className="text-indigo-400 hover:text-indigo-300 underline">
            transactions
          </Link>{" "}
          page.
        </p>
      </div>
    </div>
  );
};

export default Billing;