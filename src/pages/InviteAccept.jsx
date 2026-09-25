import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import apiClient from "../utils/apiClient";
import useAuth from "../hooks/useAuth";
import {
  authContainer,
  btnPrimary,
  cardClass,
  inputClass,
  labelClass,
} from "../utils/ui";

const InviteAccept = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const navigate = useNavigate();
  const { backendUser, fetchProfile } = useAuth();

  const [form, setForm] = useState({ name: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  const setField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleJoin = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });
    if (form.password.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters long." });
      return;
    }
    if (form.password !== form.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post("/members/accept", {
        token,
        name: form.name,
        password: form.password,
      });
      await fetchProfile();
      navigate("/member");
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Could not accept the invitation.",
      });
      setSubmitting(false);
    }
  };

  const handleAccept = async () => {
    setMessage({ type: "", text: "" });
    setSubmitting(true);
    try {
      await apiClient.post("/members/accept", { token });
      await fetchProfile();
      navigate("/member");
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Could not accept the invitation.",
      });
      setSubmitting(false);
    }
  };

  if (!token || token.length < 10) {
    return (
      <div className={authContainer}>
        <div className={`${cardClass} max-w-md w-full`}>
          <h1 className="text-xl font-bold text-white mb-2">Invalid invitation link</h1>
          <p className="text-sm text-slate-300">
            This link is missing a valid invitation token. Ask your organization admin for a fresh
            invitation link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={authContainer}>
      <div className={`${cardClass} max-w-md w-full`}>
        <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Join your team</h1>
        <p className="text-sm text-slate-300 mb-6">
          {backendUser
            ? "You are signed in. Confirm the invitation to join your organization."
            : "Create your account to accept the invitation."}
        </p>

        {message.text && (
          <p
            role="alert"
            className={`text-sm rounded-xl border px-4 py-3 mb-6 ${
              message.type === "error"
                ? "text-rose-400 bg-rose-500/10 border-rose-500/30"
                : "text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
            }`}
          >
            {message.text}
          </p>
        )}

        {backendUser ? (
          <button
            type="button"
            className={btnPrimary}
            onClick={handleAccept}
            disabled={submitting}
          >
            {submitting ? "Accepting..." : "Accept invitation"}
          </button>
        ) : (
          <form onSubmit={handleJoin} className="space-y-4" noValidate>
            <div>
              <label className={labelClass}>Your name</label>
              <input
                className={inputClass}
                value={form.name}
                onChange={setField("name")}
                placeholder="Jane Doe"
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
            <button type="submit" className={btnPrimary} disabled={submitting}>
              {submitting ? "Joining..." : "Join organization"}
            </button>
            <p className="text-sm text-slate-400 pt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 underline font-medium">
                Log in first
              </Link>
              , then reopen this link.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default InviteAccept;