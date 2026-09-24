import { useState } from "react";
import { Link } from "react-router";
import apiClient from "../utils/apiClient";
import { btnPrimary, inputClass, labelClass, cardClass, authContainer } from "../utils/ui";

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
    <div className={authContainer}>
      <div className={cardClass}>
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Reset password</h1>
        <p className="text-sm text-slate-600 mb-6">
          Enter your email and we'll send you a link to set a new password.
        </p>
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
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          {message && <p className="text-sm text-emerald-700">{message}</p>}
          <button type="submit" className={`${btnPrimary} w-full`} disabled={submitting}>
            {submitting ? "Sending..." : "Send reset link"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          <Link to="/login" className="text-indigo-600 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;