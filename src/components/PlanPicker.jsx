import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Check } from "lucide-react";
import apiClient from "../utils/apiClient";
import { formatPrice } from "../utils/ui";

const PlanPicker = ({ value, onChange }) => {
  const plansQuery = useQuery({
    queryKey: ["plans"],
    queryFn: () => apiClient.get("/plans").then((r) => r.data.plans),
  });

  if (plansQuery.isLoading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-inner h-28 rounded-xl shimmer" />
        ))}
      </div>
    );

  if (plansQuery.isError || !plansQuery.data?.length)
    return (
      <div className="flex items-center gap-2 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-xl px-4 py-3">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        No plans available yet.
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {plansQuery.data.map((plan) => {
        const selected = value === plan.id;
        return (
          <label
            key={plan.id}
            className={`block cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
              selected
                ? "border-purple-500 bg-purple-500/15 shadow-[0_0_24px_rgba(139,92,246,0.22)]"
                : "border-[var(--border-subtle)] bg-[var(--bg-subtle)] hover:border-purple-500/45"
            }`}
          >
            <input
              type="radio"
              name="plan"
              className="sr-only"
              checked={selected}
              onChange={() => onChange(plan.id)}
            />

            <div className="flex items-center justify-between mb-2">
              <div className="font-display font-bold text-[var(--text-bright)] text-sm">
                {plan.name}
              </div>
              {selected && (
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center flex-shrink-0 on-accent">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-0.5 mb-2">
              <span
                className={`font-mono text-lg font-bold ${
                  selected ? "gradient-text" : "text-[var(--text-primary)]"
                }`}
              >
                {formatPrice(plan.priceCents, plan.currency)}
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                {plan.billingInterval === "yearly" ? "/yr" : "/mo"}
              </span>
            </div>

            {plan.features?.length > 0 && (
              <ul className="mt-1.5 space-y-1">
                {plan.features.slice(0, 3).map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]"
                  >
                    <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </label>
        );
      })}
    </div>
  );
};

export default PlanPicker;
