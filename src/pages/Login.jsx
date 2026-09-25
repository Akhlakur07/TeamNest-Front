import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Lottie } from "lottie-react";
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
    <div className="min-h-screen bg-gradient-animated flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="glow-orb glow-orb-1" style={{ opacity: 0.6 }} />
      <div className="glow-orb glow-orb-2" style={{ opacity: 0.4 }} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 group" id="login-logo">
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
        <div className="glass-card overflow-hidden flex flex-col lg:flex-row min-h-[520px]">

          {/* ── Left: Lottie animation ────────────────────────── */}
          <div className="hidden lg:flex flex-1 items-center justify-center p-10 relative border-r border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-purple-900/20 rounded-l-[1.25rem]" />
            <div className="relative z-10 w-full max-w-sm">
              <Lottie
                src={loginAnimation}
                animationData={loginAnimation}
                loop
                autoplay
                className="w-full drop-shadow-2xl"
                aria-label="Login illustration"
              />
              <div className="mt-6 text-center">
                <h2 className="text-xl font-bold text-white mb-2">
                  Welcome back! 👋
                </h2>
                <p className="text-sm text-slate-400">
                  Sign in to access your organization's workspace and tools.
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: Login form ─────────────────────────────── */}
          <div className="flex-1 flex flex-col justify-center p-8 lg:p-12">
            <div className="max-w-sm w-full mx-auto">
              <h1 className="text-2xl font-bold text-white mb-1 fade-in-up">
                Sign in to your account
              </h1>
              <p className="text-sm text-slate-400 mb-8 fade-in-up-1">
                Don't have an account?{" "}
                <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors" id="login-register-link">
                  Register for free
                </Link>
              </p>

              <form onSubmit={handleSubmit} className="space-y-5 fade-in-up-2" noValidate>
                {/* Email */}
                <div>
                  <label htmlFor="login-email" className="label-glass">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="login-email"
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

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="login-password" className="label-glass !mb-0">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors" id="login-forgot-link">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="login-password"
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
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

                {/* Submit */}
                <button
                  id="login-submit-btn"
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
                      Signing in…
                    </span>
                  ) : (
                    "Sign in →"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-600 mt-6">
          By signing in you agree to our{" "}
          <a href="#" className="text-indigo-500 hover:underline">Terms</a>
          {" "}and{" "}
          <a href="#" className="text-indigo-500 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;