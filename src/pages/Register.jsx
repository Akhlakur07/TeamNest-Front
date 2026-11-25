import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Lottie } from "lottie-react";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import apiClient from "../utils/apiClient";
import useAuth from "../hooks/useAuth";
import PlanPicker from "../components/PlanPicker";
import registerAnimation from "../assets/lottie/register.json";

const Register = () => {
  const { signInUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    organizationName: "",
    adminName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedPlan, setSelectedPlan] = useState(() => searchParams.get("plan") || null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const plansQuery = useQuery({
    queryKey: ["plans"],
    queryFn: () => apiClient.get("/plans").then((r) => r.data.plans),
  });
  const selectedPlanObj = plansQuery.data?.find((p) => p.id === selectedPlan);
  const isFreePlan = selectedPlanObj?.priceCents === 0;

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
      icon: Building2,
      autoComplete: "organization",
    },
    {
      id: "reg-admin-name",
      field: "adminName",
      label: "Your name",
      type: "text",
      placeholder: "Jane Doe",
      icon: User,
      autoComplete: "name",
    },
    {
      id: "reg-email",
      field: "email",
      label: "Email address",
      type: "email",
      placeholder: "jane@acme.com",
      icon: Mail,
      autoComplete: "email",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-animated flex items-center justify-center px-4 py-12 pt-20 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="flex justify-center mb-7">
          <Link to="/" className="flex items-center gap-2.5 group" id="reg-logo">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center shadow-lg shadow-purple-500/35 on-accent">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-[var(--text-bright)]">
              Team<span className="gradient-text">Nest</span>
            </span>
          </Link>
        </div>

        <div className="glass-card overflow-hidden flex flex-col lg:flex-row">
          {/* Left: Registration form */}
          <div className="flex-[1.2] p-8 lg:p-12 lg:border-r border-[var(--border-subtle)]">
            <h1 className="font-display text-2xl font-bold text-[var(--text-bright)] mb-1">
              Create your workspace
            </h1>
            <p className="text-sm text-[var(--text-muted)] mb-8">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[var(--accent-text)] hover:underline font-semibold"
                id="reg-login-link"
              >
                Sign in
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {fields.map(({ id, field, label, type, placeholder, icon: Icon, autoComplete }) => (
                <div key={field}>
                  <label htmlFor={id} className="label-glass">
                    {label}
                  </label>
                  <div className="relative">
                    <Icon className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id={id}
                      name={field}
                      type={type}
                      className="input-glass !pl-10"
                      value={form[field]}
                      onChange={setField(field)}
                      placeholder={placeholder}
                      required
                      autoComplete={autoComplete}
                    />
                  </div>
                </div>
              ))}

              <div>
                <label htmlFor="reg-password" className="label-glass">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="reg-password"
                    name="password"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-bright)] transition-colors cursor-pointer"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="reg-confirm-password" className="label-glass">
                  Confirm password
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="reg-confirm-password"
                    name="confirmPassword"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-bright)] transition-colors cursor-pointer"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <p className="label-glass mb-2">Choose a plan</p>
                <PlanPicker value={selectedPlan} onChange={setSelectedPlan} />
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <p className="text-sm text-rose-400">{error}</p>
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
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    {isFreePlan ? "Creating workspace…" : "Setting up payment…"}
                  </span>
                ) : (
                  <>
                    {isFreePlan ? "Create free workspace" : "Continue to payment"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Lottie illustration */}
          <div className="hidden lg:flex flex-1 items-center justify-center p-10 relative bg-gradient-to-bl from-purple-600/10 via-transparent to-violet-600/10">
            <div className="relative z-10 w-full max-w-sm">
              <Lottie
                src={registerAnimation}
                loop
                autoplay
                className="w-full drop-shadow-2xl"
                aria-label="Registration illustration"
              />
              <div className="mt-6 text-center">
                <h2 className="font-display text-xl font-bold text-[var(--text-bright)] mb-2">
                  Launch your team workspace
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  Set up an isolated multi-tenant environment in under a minute.
                </p>
                <div className="flex items-center justify-center gap-4 mt-4">
                  {["Free tier", "Stripe secured", "Cancel anytime"].map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
