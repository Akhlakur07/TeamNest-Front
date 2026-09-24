import { useState } from "react";
import { Link } from "react-router";
import apiClient from "../utils/apiClient";
import useAuth from "../hooks/useAuth";
import PlanPicker from "../components/PlanPicker";
import { btnPrimary, cardClass, authContainer, inputClass, labelClass } from "../utils/ui";

const Register = () => {
  const { signInUser } = useAuth();
  const [form, setForm] = useState({
    organizationName: "",
    adminName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const setField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!selectedPlan) {
      setError("Select a plan to continue.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await apiClient.post("/auth/register", {
        organizationName: form.organizationName,
        adminName: form.adminName,
        email: form.email,
        password: form.password,
        planId: selectedPlan,
      });
      try {
        await signInUser(form.email, form.password);
      } catch {
        // Signed-in is optional; checkout works regardless of session.
      }
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className={authContainer}>
      <div className={cardClass}>
        <h1 className="text-xl font-semibold text-slate-900 mb-1">Register your organization</h1>
        <p className="text-sm text-slate-600 mb-6">
          Pick a plan, add your details, then pay to activate your workspace.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className={labelClass}>Organization name</label>
            <input
              className={inputClass}
              value={form.organizationName}
              onChange={setField("organizationName")}
              placeholder="Acme Inc."
              required
            />
          </div>
          <div>
            <label className={labelClass}>Your name</label>
            <input
              className={inputClass}
              value={form.adminName}
              onChange={setField("adminName")}
              placeholder="Jane Doe"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              className={inputClass}
              type="email"
              value={form.email}
              onChange={setField("email")}
              placeholder="jane@acme.com"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input
              className={inputClass}
              type="password"
              value={form.password}
              onChange={setField("password")}
              placeholder="At least 8 characters"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Confirm password</label>
            <input
              className={inputClass}
              type="password"
              value={form.confirmPassword}
              onChange={setField("confirmPassword")}
              required
            />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Choose a plan</p>
            <PlanPicker value={selectedPlan} onChange={setSelectedPlan} />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button type="submit" className={btnPrimary} disabled={submitting}>
            {submitting ? "Setting up payment..." : "Continue to payment"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;