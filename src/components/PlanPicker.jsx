import { useQuery } from "@tanstack/react-query";
import apiClient from "../utils/apiClient";
import { formatPrice } from "../utils/ui";

const PlanPicker = ({ value, onChange }) => {
  const plansQuery = useQuery({
    queryKey: ["plans"],
    queryFn: () => apiClient.get("/plans").then((r) => r.data.plans),
  });

  if (plansQuery.isLoading) return <p className="text-sm text-slate-500">Loading plans...</p>;
  if (plansQuery.isError || !plansQuery.data?.length)
    return <p className="text-sm text-red-600">No plans available yet.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {plansQuery.data.map((plan) => (
        <label
          key={plan.id}
          className={`block cursor-pointer rounded-lg border p-4 ${
            value === plan.id
              ? "border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50"
              : "border-slate-200 bg-white hover:border-indigo-300"
          }`}
        >
          <input
            type="radio"
            name="plan"
            className="sr-only"
            checked={value === plan.id}
            onChange={() => onChange(plan.id)}
          />
          <div className="font-medium text-slate-900">{plan.name}</div>
          <div className="text-sm text-slate-600 mt-1">
            {formatPrice(plan.priceCents, plan.currency)}
            {plan.billingInterval === "yearly" ? "/year" : "/month"}
          </div>
          {plan.features?.length > 0 && (
            <ul className="mt-2 text-xs text-slate-500 space-y-0.5">
              {plan.features.slice(0, 3).map((feature, i) => (
                <li key={i}>• {feature}</li>
              ))}
            </ul>
          )}
        </label>
      ))}
    </div>
  );
};

export default PlanPicker;