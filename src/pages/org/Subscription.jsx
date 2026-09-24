import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import LogoutButton from "../../components/LogoutButton";
import { btnPrimary, btnSecondary, cardClass, formatPrice } from "../../utils/ui";

const statusBadge = (status) => {
  const styles = {
    ACTIVE: "bg-emerald-100 text-emerald-700",
    PENDING: "bg-amber-100 text-amber-700",
    FAILED: "bg-red-100 text-red-700",
    CANCELLED: "bg-slate-200 text-slate-600",
    EXPIRED: "bg-slate-200 text-slate-600",
  };
  return styles[status] || "bg-slate-100 text-slate-600";
};

const Subscription = () => {
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState("");
  const [error, setError] = useState("");

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

  const changePlan = useMutation({
    mutationFn: () => apiClient.post("/billing/change-plan", { planId: selectedPlan }),
    onSuccess: () => {
      setError("");
      setSelectedPlan("");
      invalidateAll();
    },
    onError: (err) => setError(err?.response?.data?.message || "Could not change plan."),
  });

  const cancelSub = useMutation({
    mutationFn: () => apiClient.post("/billing/cancel"),
    onSuccess: () => {
      setError("");
      invalidateAll();
    },
    onError: (err) => setError(err?.response?.data?.message || "Could not cancel subscription."),
  });

  const reactivate = useMutation({
    mutationFn: () => apiClient.post("/billing/reactivate"),
    onSuccess: () => {
      setError("");
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

  if (currentQuery.isLoading) return <div className="p-8">Loading subscription...</div>;
  if (currentQuery.isError) return <div className="p-8 text-red-600">Failed to load subscription.</div>;

  const data = currentQuery.data;
  const subscription = data.subscription;
  const plan = data.plan;
  const plans = (plansQuery.data || []).filter((p) => p.id !== plan?.id);
  const cancelPending = !!subscription?.canceledAt;
  const renewingIn = subscription?.currentPeriodEnd;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Subscription & billing</h1>
        <LogoutButton />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className={cardClass}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="font-medium text-slate-900">{plan?.name || "No plan"}</h2>
            <p className="text-sm text-slate-500">
              Organization: {data.org.name} ({data.org.status})
            </p>
          </div>
          {subscription && (
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge(subscription.status)}`}>
              {subscription.status}
            </span>
          )}
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
          <div>
            <dt className="text-slate-500">Price</dt>
            <dd className="text-slate-900 font-medium">
              {plan ? `${formatPrice(plan.priceCents, plan.currency)}${plan.billingInterval === "yearly" ? "/year" : "/month"}` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Billing period</dt>
            <dd className="text-slate-900 font-medium">
              {subscription?.currentPeriodStart
                ? `${new Date(subscription.currentPeriodStart).toLocaleDateString()} → ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                : "—"}
            </dd>
          </div>
          {renewingIn && (
            <div>
              <dt className="text-slate-500">Next renewal</dt>
              <dd className="text-slate-900 font-medium">{new Date(renewingIn).toLocaleDateString()}</dd>
            </div>
          )}
          <div>
            <dt className="text-slate-500">Cancels at period end</dt>
            <dd className={`font-medium ${cancelPending ? "text-amber-600" : "text-slate-900"}`}>
              {cancelPending ? `Yes — ${new Date(subscription.canceledAt).toLocaleDateString()}` : "No"}
            </dd>
          </div>
        </dl>
        {plan?.features?.length > 0 && (
          <ul className="text-sm text-slate-600 space-y-1 mb-4">
            {plan.features.map((f, i) => (
              <li key={i}>• {f}</li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4">
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
              className={`${btnSecondary} text-red-600 hover:border-red-300`}
              onClick={() => cancelSub.mutate()}
              disabled={cancelSub.isPending}
            >
              {cancelSub.isPending ? "Cancelling..." : "Cancel at period end"}
            </button>
          )}
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Change plan</h2>
        {plans.length === 0 ? (
          <p className="text-sm text-slate-500">No alternative plans available right now.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {plans.map((p) => (
                <label
                  key={p.id}
                  className={`block cursor-pointer rounded-lg border p-4 ${
                    selectedPlan === p.id
                      ? "border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50"
                      : "border-slate-200 bg-white hover:border-indigo-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="nextPlan"
                    className="sr-only"
                    checked={selectedPlan === p.id}
                    onChange={() => setSelectedPlan(p.id)}
                  />
                  <div className="font-medium text-slate-900">{p.name}</div>
                  <div className="text-sm text-slate-600 mt-1">
                    {formatPrice(p.priceCents, p.currency)}
                    {p.billingInterval === "yearly" ? "/year" : "/month"}
                  </div>
                </label>
              ))}
            </div>
            <button
              type="button"
              className={`${btnPrimary} mt-4`}
              onClick={() => changePlan.mutate()}
              disabled={!selectedPlan || changePlan.isPending}
            >
              {changePlan.isPending ? "Changing..." : "Change plan"}
            </button>
            <p className="text-xs text-slate-400 mt-2">
              Upgrades and downgrades are applied immediately with proportional pricing and take a
              few seconds to reflect.
            </p>
          </>
        )}
      </div>

      <div className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Recent payments</h2>
        {data.recentPayments?.length === 0 ? (
          <p className="text-sm text-slate-500">No payments recorded yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {data.recentPayments.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-slate-900 font-medium">{p.invoiceNumber || "Invoice"}</div>
                  <div className="text-slate-500">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "—"}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-900 font-medium">
                    {formatPrice(p.amountCents, p.currency)}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.status === "SUCCESS"
                        ? "bg-emerald-100 text-emerald-700"
                        : p.status === "REFUNDED"
                          ? "bg-slate-200 text-slate-600"
                          : "bg-red-100 text-red-700"
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