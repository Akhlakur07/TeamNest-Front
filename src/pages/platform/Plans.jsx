import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import LogoutButton from "../../components/LogoutButton";
import { btnPrimary, btnSecondary, inputClass, labelClass, cardClass, formatPrice } from "../../utils/ui";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: "", // dollars, converted to cents on submit
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

  if (plansQuery.isLoading) return <div className="p-8">Loading plans...</div>;
  if (plansQuery.isError)
    return <div className="p-8 text-red-600">Failed to load plans.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Plans management</h1>
        <LogoutButton />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900 mb-4">
          {editingId ? `Edit plan` : "Create plan"}
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
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.isEnabled}
              onChange={(event) => setForm((prev) => ({ ...prev, isEnabled: event.target.checked }))}
            />
            Enabled (available for signup)
          </label>
          <div className="flex gap-3">
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
          <div key={plan.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-slate-900">{plan.name}</h3>
                  <span className="text-xs text-slate-400">/{plan.slug}</span>
                  {!plan.isEnabled && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Disabled
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {formatPrice(plan.priceCents, plan.currency)}
                  {plan.billingInterval === "yearly" ? "/year" : "/month"}
                  {plan.stripePriceId ? " · Stripe price linked" : " · No Stripe price"}
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
                  className={plan.isEnabled ? `${btnSecondary} text-red-600` : btnPrimary}
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