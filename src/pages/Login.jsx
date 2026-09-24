import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import roleHome from "../utils/roles";
import { btnPrimary, inputClass, labelClass, cardClass, authContainer } from "../utils/ui";

const Login = () => {
  const { signInUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className={authContainer}>
      <div className={cardClass}>
        <h1 className="text-xl font-semibold text-slate-900 mb-6">Log in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className={inputClass}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className={inputClass}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <button type="submit" className={`${btnPrimary} w-full`} disabled={submitting}>
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>
        <div className="mt-4 space-y-1 text-sm text-slate-600">
          <p>
            <Link to="/forgot-password" className="text-indigo-600 hover:underline">
              Forgot password?
            </Link>
          </p>
          <p>
            <Link to="/register" className="text-indigo-600 hover:underline">
              Register a new organization
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;