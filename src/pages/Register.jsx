import { Link } from "react-router";
import { btnPrimary, btnSecondary, cardClass, authContainer } from "../utils/ui";

const Register = () => {
  return (
    <div className={authContainer}>
      <div className={cardClass}>
        <h1 className="text-xl font-semibold text-slate-900 mb-2">
          Register your organization
        </h1>
        <p className="text-sm text-slate-600">
          Registration is a paid onboarding. You'll pick a plan, pay with Stripe,
          and your organization becomes active automatically once payment is
          confirmed.
        </p>
        <p className="mt-4 text-sm text-slate-500">
          The registration form and checkout flow are coming in the next step.
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