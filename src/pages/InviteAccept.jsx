import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import apiClient from "../utils/apiClient";
import useAuth from "../hooks/useAuth";
import {
  btnPrimary,
  cardClass,
  authContainer,
  inputClass,
  labelClass,
} from "../utils/ui";

const InviteAccept = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const { backendUser, signInUser, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  const setField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const redirectByRole = (role) =>
    navigate(role === "org_admin" ? "/org" : "/member", { replace: true });

  const handleJoin = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });
    if (form.password !== form.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await apiClient.post("/auth/join", {
        token,
        name: form.name,
        password: form.password,
      });
      await signInUser(data.user.email, form.password);
      redirectByRole(data.org.role);
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
      const { data } = await apiClient.post("/members/accept", { token });
      await fetchProfile();
      redirectByRole(data.org.role);
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
        <div className={cardClass}>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Invalid invitation link</h1>
          <p className="text-sm text-slate-600">
            This link is missing a valid invitation token. Ask your organization admin for a fresh
            invitation link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={authContainer}>
      <div className={cardClass}>
        <h1 className="text-xl font-semibold text-slate-900 mb-1">Join your team</h1>
        <p className="text-sm text-slate-600 mb-6">
          {backendUser
            ? "You are signed in. Confirm the invitation to join your organization."
            : "Create your account to accept the invitation."}
        </p>

        {message.text && (
          <p
            role="alert"
            className={`text-sm rounded-md border px-3 py-2 mb-4 ${
              message.type === "error"
                ? "text-red-600 bg-red-50 border-red-200"
                : "text-emerald-700 bg-emerald-50 border-emerald-200"
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
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 hover:underline">
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