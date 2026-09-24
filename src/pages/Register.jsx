import { useState } from "react";
import { Link } from "react-router";
import PlanPicker from "../components/PlanPicker";
import { btnPrimary, btnSecondary, cardClass, authContainer } from "../utils/ui";

const Register = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div className={authContainer}>
      <div className={cardClass}>
        <h1 className="text-xl font-semibold text-slate-900 mb-2">
          Register your organization
        </h1>
        <p className="text-sm text-slate-600">
          Registration is a paid onboarding. Pick a plan first — the signup form
          and Stripe checkout arrive in the next step.
        </p>

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-700 mb-2">Choose a plan</p>
          <PlanPicker value={selectedPlan} onChange={setSelectedPlan} />
        </div>

        <p className="mt-6 text-sm text-slate-500">
          {selectedPlan
            ? "Plan selected. The registration form and payment step are coming next."
            : "Select a plan, then you'll complete your organization details and pay to activate it."}
        </p>

        <div className="mt-6 flex gap-3">
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

export default Register;