import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import { btnPrimary, btnSecondary, cardClass, formatPrice } from "../../utils/ui";
import StatusBadge from "../../components/StatusBadge";

const Subscription = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const checkout = searchParams.get("checkout");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const currentQuery = useQuery({
    queryKey: ["billing", "current"],
    queryFn: () => apiClient.get("/billing/current").then((r) => r.data),
    refetchInterval: 5000,
  });

  const plansQuery = useQuery({
    queryKey: ["plans"],
    queryFn: () => apiClient.get("/plans").then((r) => r.data.plans),
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["billing"] });
  };

  const confirmChange = useMutation({
    mutationFn: () => apiClient.post("/billing/confirm-change").then((r) => r.data),
    onSuccess: (data) => {
      setNotice(
        data.message || (data.success ? "Plan change confirmed." : "Payment is being confirmed.")
      );
      invalidateAll();
    },
    onError: (err) => {
      setNotice(err?.response?.data?.message || "Could not confirm plan change.");
      invalidateAll();
    },
  });

  useEffect(() => {
    if (checkout === "success") {
      confirmChange.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkout]);

  const changePlan = useMutation({
    mutationFn: () => apiClient.post("/billing/change-plan", { planId: selectedPlan }),
    onSuccess: (res) => {
      setError("");
      if (res.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
        return;
      }
      setSelectedPlan("");
      setNotice(res.data?.message || "Plan changed.");
      invalidateAll();
    },
    onError: (err) => setError(err?.response?.data?.message || "Could not change plan."),
  });

  const cancelSub = useMutation({
    mutationFn: () => apiClient.post("/billing/cancel"),
    onSuccess: () => {
      setError("");
      setNotice("Subscription will cancel at the end of the current period.");
      invalidateAll();
    },
    onError: (err) => setError(err?.response?.data?.message || "Could not cancel subscription."),
  });

  const reactivate = useMutation({
    mutationFn: () => apiClient.post("/billing/reactivate"),
    onSuccess: () => {
      setError("");
      setNotice("Subscription reactivated. It will renew automatically.");
      invalidateAll();
    },
    onError: (err) => setError(err?.response?.data?.message || "Could not reactivate subscription."),
  });

  const openPortal = useMutation({
    mutationFn: () => apiClient.post("/billing/portal"),
    onSuccess: (res) => {
      window.location.href = res.data.url;
    },
    onError: (err) => setError(err?.response?.data?.message || "Could not open billing portal."),
  });

  if (currentQuery.isLoading)
    return <div className="p-8 text-slate-300">Loading subscription...</div>;
  if (currentQuery.isError)
    return <div className="p-8 text-rose-400">Failed to load subscription.</div>;

  const data = currentQuery.data;
  const subscription = data.subscription;
  const plan = data.plan;
  const plans = (plansQuery.data || []).filter((p) => p.id !== plan?.id);
  const cancelPending = !!subscription?.canceledAt;
  const renewingIn = subscription?.currentPeriodEnd;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Subscription & billing</h2>
      </div>

      {error && (
        <p role="alert" className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 mb-6">
          {error}
        </p>
      )}

      {checkout === "cancelled" && (
        <p
          role="status"
          className="text-sm text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 mb-6"
        >
          Plan change was cancelled. No payment was taken.
        </p>
      )}

      {notice && (
        <p
          role="status"
          className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 mb-6"
        >
          {notice}
        </p>
      )}

      <div className={`${cardClass} mb-6`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">{plan?.name || "No plan"}</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Organization: <span className="text-slate-200">{data.org.name}</span> ({data.org.status})
            </p>
          </div>
          {subscription && <StatusBadge status={subscription.status} />}
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm mb-6">
          <div>
            <dt className="text-slate-400 text-xs">Price</dt>
            <dd className="text-white font-semibold text-base mt-0.5">
              {plan ? `${formatPrice(plan.priceCents, plan.currency)}${plan.billingInterval === "yearly" ? "/year" : "/month"}` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400 text-xs">Billing period</dt>
            <dd className="text-white font-medium mt-0.5">
              {subscription?.currentPeriodStart
                ? `${new Date(subscription.currentPeriodStart).toLocaleDateString()} → ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                : "—"}
            </dd>
          </div>
          {renewingIn && (
            <div>
              <dt className="text-slate-400 text-xs">Next renewal</dt>
              <dd className="text-white font-medium mt-0.5">{new Date(renewingIn).toLocaleDateString()}</dd>
            </div>
          )}
          <div>
            <dt className="text-slate-400 text-xs">Cancels at period end</dt>
            <dd className={`font-semibold mt-0.5 ${cancelPending ? "text-amber-400" : "text-slate-300"}`}>
              {cancelPending ? `Yes — ${new Date(subscription.canceledAt).toLocaleDateString()}` : "No"}
            </dd>
          </div>
        </dl>
        {plan?.features?.length > 0 && (
          <ul className="text-sm text-slate-300 space-y-1.5 mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
            {plan.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-emerald-400 text-xs">✓</span> {f}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
          <button
            type="button"
            className={btnSecondary}
            onClick={() => openPortal.mutate()}
            disabled={openPortal.isPending}
          >
            {openPortal.isPending ? "Opening..." : "Billing portal (invoices, payment method)"}
          </button>
          {cancelPending ? (
            <button
              type="button"
              className={btnPrimary}
              onClick={() => reactivate.mutate()}
              disabled={reactivate.isPending}
            >
              {reactivate.isPending ? "Reactivating..." : "Reactivate subscription"}
            </button>
          ) : (
            <button
              type="button"
              className={`${btnSecondary} !text-rose-400 !border-rose-500/30 hover:!border-rose-500/60`}
              onClick={() => cancelSub.mutate()}
              disabled={cancelSub.isPending}
            >
              {cancelSub.isPending ? "Cancelling..." : "Cancel at period end"}
            </button>
          )}
        </div>
      </div>

      <div className={`${cardClass} mb-6`}>
        <h2 className="text-base font-semibold text-white mb-4">Change plan</h2>
        {plans.length === 0 ? (
          <p className="text-sm text-slate-400">No alternative plans available right now.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {plans.map((p) => (
                <label
                  key={p.id}
                  className={`block cursor-pointer rounded-xl border p-4 transition-all ${
                    selectedPlan === p.id
                      ? "border-indigo-500 bg-indigo-500/20 ring-1 ring-indigo-500/50"
                      : "border-white/10 bg-white/5 hover:border-indigo-400/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="nextPlan"
                    className="sr-only"
                    checked={selectedPlan === p.id}
                    onChange={() => setSelectedPlan(p.id)}
                  />
                  <div className="font-semibold text-white">{p.name}</div>
                  <div className="text-sm text-slate-300 mt-1">
                    {formatPrice(p.priceCents, p.currency)}
                    {p.billingInterval === "yearly" ? "/year" : "/month"}
                  </div>
                </label>
              ))}
            </div>
            <button
              type="button"
              className={`${btnPrimary} mt-5`}
              onClick={() => changePlan.mutate()}
              disabled={!selectedPlan || changePlan.isPending}
            >
              {changePlan.isPending ? "Changing..." : "Change plan"}
            </button>
            <p className="text-xs text-slate-400 mt-2.5">
              Upgrades and downgrades are applied immediately with proportional pricing and take a
              few seconds to reflect.
            </p>
          </>
        )}
      </div>

      <div className={cardClass}>
        <h2 className="text-base font-semibold text-white mb-4">Recent payments</h2>
        {data.recentPayments?.length === 0 ? (
          <p className="text-sm text-slate-400">No payments recorded yet.</p>
        ) : (
          <ul className="divide-y divide-white/10 text-sm">
            {data.recentPayments.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-white font-medium">{p.invoiceNumber || "Invoice"}</div>
                  <div className="text-slate-400 text-xs">
                    {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "—"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold">
                    {formatPrice(p.amountCents, p.currency)}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      p.status === "SUCCESS"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : p.status === "REFUNDED"
                          ? "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Subscription;