import { useQuery } from "@tanstack/react-query";
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
          <div key={i} className="glass-inner h-24 rounded-xl shimmer" />
        ))}
      </div>
    );

  if (plansQuery.isError || !plansQuery.data?.length)
    return (
      <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
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
                ? "border-indigo-500/70 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                : "border-white/10 bg-white/5 hover:border-indigo-500/40 hover:bg-white/8"
            }`}
          >
            <input
              type="radio"
              name="plan"
              className="sr-only"
              checked={selected}
              onChange={() => onChange(plan.id)}
            />

            {/* Plan header */}
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-white text-sm">{plan.name}</div>
              {selected && (
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-0.5 mb-2">
              <span className={`text-lg font-bold ${selected ? "gradient-text" : "text-slate-300"}`}>
                {formatPrice(plan.priceCents, plan.currency)}
              </span>
              <span className="text-xs text-slate-500">
                {plan.billingInterval === "yearly" ? "/yr" : "/mo"}
              </span>
            </div>

            {/* Features */}
            {plan.features?.length > 0 && (
              <ul className="mt-1.5 space-y-1">
                {plan.features.slice(0, 3).map((feature, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <svg className="w-3 h-3 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
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