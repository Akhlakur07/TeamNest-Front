import { useState } from "react";
import { Link } from "react-router";
import { Lottie } from "lottie-react";
import apiClient from "../utils/apiClient";
import useAuth from "../hooks/useAuth";
import PlanPicker from "../components/PlanPicker";
import registerAnimation from "../assets/lottie/register.json";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        window.location.href = `/registration/status?status=success&orgId=${data.orgId}`;
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
      setSubmitting(false);
    }
  };

  const fields = [
    {
      id: "reg-org-name",
      field: "organizationName",
      label: "Organization name",
      type: "text",
      placeholder: "Acme Inc.",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
    {
      id: "reg-admin-name",
      field: "adminName",
      label: "Your name",
      type: "text",
      placeholder: "Jane Doe",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      id: "reg-email",
      field: "email",
      label: "Email address",
      type: "email",
      placeholder: "jane@acme.com",
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
  ];

  const EyeIcon = ({ open }) =>
    open ? (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    );

  return (
    <div className="min-h-screen bg-gradient-animated flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="glow-orb glow-orb-1" style={{ opacity: 0.5 }} />
      <div className="glow-orb glow-orb-2" style={{ opacity: 0.4 }} />
      <div className="glow-orb glow-orb-3" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 group" id="reg-logo">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">
              Team<span className="gradient-text">Nest</span>
            </span>
          </Link>
        </div>

        {/* Main card */}
        <div className="glass-card overflow-hidden flex flex-col lg:flex-row">

          {/* ── Left: Registration form ───────────────────────── */}
          <div className="flex-[1.2] p-8 lg:p-12 lg:border-r border-white/10">
            <h1 className="text-2xl font-bold text-white mb-1 fade-in-up">
              Create your workspace
            </h1>
            <p className="text-sm text-slate-400 mb-8 fade-in-up-1">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors" id="reg-login-link">
                Sign in
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 fade-in-up-2" noValidate>
              {/* Text fields */}
              {fields.map(({ id, field, label, type, placeholder, icon }) => (
                <div key={field}>
                  <label htmlFor={id} className="label-glass">{label}</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                      </svg>
                    </div>
                    <input
                      id={id}
                      type={type}
                      className="input-glass !pl-10"
                      value={form[field]}
                      onChange={setField(field)}
                      placeholder={placeholder}
                      required
                      autoComplete={type === "email" ? "email" : "off"}
                    />
                  </div>
                </div>
              ))}

              {/* Password */}
              <div>
                <label htmlFor="reg-password" className="label-glass">Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    className="input-glass !pl-10 !pr-10"
                    value={form.password}
                    onChange={setField("password")}
                    placeholder="At least 8 characters"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    id="reg-toggle-password"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="reg-confirm-password" className="label-glass">Confirm password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="input-glass !pl-10 !pr-10"
                    value={form.confirmPassword}
                    onChange={setField("confirmPassword")}
                    placeholder="Repeat password"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    id="reg-toggle-confirm-password"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    <EyeIcon open={showConfirmPassword} />
                  </button>
                </div>
              </div>

              {/* Plan picker */}
              <div>
                <p className="label-glass mb-2">Choose a plan</p>
                <PlanPicker value={selectedPlan} onChange={setSelectedPlan} />
              </div>

              {/* Error */}
              {error && (
                <div role="alert" className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                id="reg-submit-btn"
                type="submit"
                className="btn-primary w-full !py-3 text-base mt-2"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Setting up payment…
                  </span>
                ) : (
                  "Continue to payment →"
                )}
              </button>
            </form>
          </div>

          {/* ── Right: Lottie animation ───────────────────────── */}
          <div className="hidden lg:flex flex-1 items-center justify-center p-10 relative">
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-900/30 to-indigo-900/20 rounded-r-[1.25rem]" />
            <div className="relative z-10 w-full max-w-sm">
              <Lottie
                src={registerAnimation}
                animationData={registerAnimation}
                loop
                autoplay
                className="w-full drop-shadow-2xl"
                aria-label="Registration illustration"
              />
              <div className="mt-6 text-center">
                <h2 className="text-xl font-bold text-white mb-2">
                  Join thousands of teams 🚀
                </h2>
                <p className="text-sm text-slate-400">
                  Set up your organization's workspace in under a minute and start collaborating.
                </p>
                <div className="flex items-center justify-center gap-4 mt-4">
                  {["✓ Free trial", "✓ No credit card", "✓ Cancel anytime"].map((item) => (
                    <span key={item} className="text-xs text-emerald-400 font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-600 mt-6">
          By registering you agree to our{" "}
          <a href="#" className="text-indigo-500 hover:underline">Terms</a>
          {" "}and{" "}
          <a href="#" className="text-indigo-500 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default Register;