import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import { btnPrimary, btnSecondary, inputClass, labelClass, cardClass, formatPrice } from "../../utils/ui";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  billingInterval: "monthly",
  features: "",
  isEnabled: true,
};

const toForm = (plan) => ({
  name: plan.name,
  slug: plan.slug,
  description: plan.description,
  price: (plan.priceCents / 100).toString(),
  billingInterval: plan.billingInterval,
  features: (plan.features || []).join("\n"),
  isEnabled: plan.isEnabled,
});

const Plans = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const plansQuery = useQuery({
    queryKey: ["plans", "manage"],
    queryFn: () => apiClient.get("/plans/manage").then((r) => r.data.plans),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["plans"] });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        priceCents: Math.round(Number(form.price || 0) * 100),
        billingInterval: form.billingInterval,
        features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
        isEnabled: form.isEnabled,
      };
      if (editingId) {
        await apiClient.patch(`/plans/${editingId}`, payload);
      } else {
        await apiClient.post("/plans", payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      invalidate();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not save plan.");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (plan) => {
    setEditingId(plan.id);
    setForm(toForm(plan));
    setError("");
  };

  const toggleEnabled = async (plan) => {
    try {
      await apiClient.patch(`/plans/${plan.id}`, { isEnabled: !plan.isEnabled });
      invalidate();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not update plan.");
    }
  };

  const setField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  if (plansQuery.isLoading)
    return <div className="p-8 text-slate-300">Loading plans...</div>;
  if (plansQuery.isError)
    return <div className="p-8 text-rose-400">Failed to load plans.</div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Plans management</h2>
      </div>

      {error && (
        <p role="alert" className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 mb-6">
          {error}
        </p>
      )}

      <div className={cardClass}>
        <h2 className="text-base font-semibold text-white mb-4">
          {editingId ? "Edit plan" : "Create new plan"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name</label>
              <input className={inputClass} value={form.name} onChange={setField("name")} required />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input className={inputClass} value={form.slug} onChange={setField("slug")} required />
            </div>
            <div>
              <label className={labelClass}>Price (USD)</label>
              <input
                className={inputClass}
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={setField("price")}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Billing interval</label>
              <select
                className={inputClass}
                value={form.billingInterval}
                onChange={setField("billingInterval")}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea className={inputClass} rows={2} value={form.description} onChange={setField("description")} />
          </div>
          <div>
            <label className={labelClass}>Features (one per line)</label>
            <textarea className={inputClass} rows={4} value={form.features} onChange={setField("features")} />
          </div>
          <label className="flex items-center gap-2.5 text-sm text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              className="accent-indigo-500 rounded"
              checked={form.isEnabled}
              onChange={(event) => setForm((prev) => ({ ...prev, isEnabled: event.target.checked }))}
            />
            Enabled (available for signup)
          </label>
          <div className="flex gap-3 pt-2">
            <button type="submit" className={btnPrimary} disabled={submitting}>
              {submitting ? "Saving..." : editingId ? "Save changes" : "Create plan"}
            </button>
            {editingId && (
              <button
                type="button"
                className={btnSecondary}
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-6 space-y-3">
        {plansQuery.data.map((plan) => (
          <div key={plan.id} className="glass-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-semibold text-white">{plan.name}</h3>
                  <span className="text-xs text-slate-400">/{plan.slug}</span>
                  {!plan.isEnabled && (
                    <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-xs font-semibold text-amber-300">
                      Disabled
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-300 mt-1">
                  <span className="font-semibold text-white">
                    {formatPrice(plan.priceCents, plan.currency)}
                  </span>
                  {plan.billingInterval === "yearly" ? "/year" : "/month"}
                  <span className="text-slate-400">
                    {plan.stripePriceId ? " · Stripe linked" : " · No Stripe price"}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => startEdit(plan)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={plan.isEnabled ? `${btnSecondary} !text-rose-400 !border-rose-500/30 hover:!border-rose-500/60` : btnPrimary}
                  onClick={() => toggleEnabled(plan)}
                >
                  {plan.isEnabled ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;