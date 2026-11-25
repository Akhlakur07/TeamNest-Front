import { useState } from "react";
import { Link } from "react-router";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, KeyRound, Mail, Sparkles } from "lucide-react";
import apiClient from "../utils/apiClient";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);
    try {
      const { data } = await apiClient.post("/auth/password-reset", { email });
      setMessage(data.message);
      if (data.resetLink) {
        setMessage(`Reset link: ${data.resetLink}`);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Request failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-animated flex items-center justify-center px-4 py-12 pt-20 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="flex justify-center mb-7">
          <Link to="/" className="flex items-center gap-2.5 group" id="forgot-logo">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center shadow-lg shadow-purple-500/35 on-accent">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-[var(--text-bright)]">
              Team<span className="gradient-text">Nest</span>
            </span>
          </Link>
        </div>

        <div className="glass-card p-8">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-[var(--accent-text)]" />
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold text-[var(--text-bright)] text-center mb-1">
            Reset your password
          </h1>
          <p className="text-sm text-[var(--text-muted)] text-center mb-8">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          {message ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Check className="w-7 h-7" />
              </div>
              <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-4 py-3 break-all">
                {message}
              </p>
              <Link
                to="/login"
                id="forgot-back-login-success"
                className="btn-secondary w-full text-center mt-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="forgot-email" className="label-glass">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="forgot-email"
                    name="email"
                    type="email"
                    className="input-glass !pl-10"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                  />
                </div>
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
                id="forgot-submit-btn"
                type="submit"
                className="btn-primary w-full !py-3 text-base"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Sending…
                  </span>
                ) : (
                  <>
                    Send reset link
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  id="forgot-back-login"
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-bright)] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
