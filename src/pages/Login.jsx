import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Lottie } from "lottie-react";
import { AlertTriangle, ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import useAuth from "../hooks/useAuth";
import roleHome from "../utils/roles";
import loginAnimation from "../assets/lottie/Login.json";

const Login = () => {
  const { signInUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const firebaseMessage = (code) => {
    const map = {
      "auth/invalid-credential": "Invalid email or password.",
      "auth/wrong-password": "Invalid email or password.",
      "auth/user-not-found": "Invalid email or password.",
      "auth/too-many-requests": "Too many attempts. Please try again later.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/network-request-failed": "Network error. Please try again.",
    };
    return map[code] || "Login failed. Please try again.";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const profile = await signInUser(email, password);
      const from = location.state?.from?.pathname;
      navigate(from || roleHome(profile.role), { replace: true });
    } catch (err) {
      const firebaseCode = err?.code;
      const serverMessage = err?.response?.data?.message;
      setError(serverMessage || firebaseMessage(firebaseCode) || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-animated flex items-center justify-center px-4 py-12 pt-20 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="flex justify-center mb-7">
          <Link to="/" className="flex items-center gap-2.5 group" id="login-logo">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center shadow-lg shadow-purple-500/35 on-accent">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-[var(--text-bright)]">
              Team<span className="gradient-text">Nest</span>
            </span>
          </Link>
        </div>

        <div className="glass-card overflow-hidden flex flex-col lg:flex-row min-h-[520px]">
          {/* Left: Lottie illustration */}
          <div className="hidden lg:flex flex-1 items-center justify-center p-10 relative border-r border-[var(--border-subtle)] bg-gradient-to-br from-purple-600/10 via-transparent to-violet-600/10">
            <div className="relative z-10 w-full max-w-sm">
              <Lottie
                src={loginAnimation}
                loop
                autoplay
                className="w-full drop-shadow-2xl"
                aria-label="Login illustration"
              />
              <div className="mt-6 text-center">
                <h2 className="font-display text-xl font-bold text-[var(--text-bright)] mb-2">
                  Welcome back
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  Sign in to access your organization&apos;s workspace, members, and billing.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Login form */}
          <div className="flex-1 flex flex-col justify-center p-8 lg:p-12">
            <div className="max-w-sm w-full mx-auto">
              <h1 className="font-display text-2xl font-bold text-[var(--text-bright)] mb-1">
                Sign in to your account
              </h1>
              <p className="text-sm text-[var(--text-muted)] mb-8">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="text-[var(--accent-text)] hover:underline font-semibold"
                  id="login-register-link"
                >
                  Register for free
                </Link>
              </p>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="login-email" className="label-glass">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      className="input-glass !pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="login-password" className="label-glass !mb-0">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-[var(--accent-text)] hover:underline font-medium"
                      id="login-forgot-link"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="input-glass !pl-10 !pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      id="login-toggle-password"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-bright)] transition-colors cursor-pointer"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
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
                  id="login-submit-btn"
                  type="submit"
                  className="btn-primary w-full !py-3 text-base mt-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Signing in…
                    </span>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
