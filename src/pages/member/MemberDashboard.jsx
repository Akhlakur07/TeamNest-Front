import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, KeyRound, Layers, User } from "lucide-react";
import PanelShell from "../../components/PanelShell";
import UserCard from "../../components/UserCard";
import apiClient from "../../utils/apiClient";
import useAuth from "../../hooks/useAuth";
import {
  btnPrimary,
  btnSecondary,
  cardClass,
  inputClass,
  labelClass,
  formatPrice,
} from "../../utils/ui";

const memberNavItems = [
  { label: "Profile", to: "#profile", icon: User },
  { label: "Security", to: "#security", icon: KeyRound },
  { label: "Organization", to: "#organization", icon: Building2 },
  { label: "Plan", to: "#plan", icon: Layers },
];

const MemberDashboard = () => {
  const { backendUser, fetchProfile, refreshSession } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState(backendUser?.name || "");
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const membersQuery = useQuery({
    queryKey: ["members"],
    queryFn: () => apiClient.get("/members").then((r) => r.data),
  });

  const billingQuery = useQuery({
    queryKey: ["billing", "current"],
    queryFn: () => apiClient.get("/billing/current").then((r) => r.data),
  });

  const setPwField = (field) => (event) =>
    setPw((prev) => ({ ...prev, [field]: event.target.value }));

  const handleProfile = async (event) => {
    event.preventDefault();
    setProfileMsg({ type: "", text: "" });
    setSavingProfile(true);
    try {
      await apiClient.patch("/account/profile", { name });
      await fetchProfile();
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setProfileMsg({ type: "ok", text: "Profile updated." });
    } catch (err) {
      setProfileMsg({ type: "err", text: err?.response?.data?.message || "Could not update profile." });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePassword = async (event) => {
    event.preventDefault();
    setPwMsg({ type: "", text: "" });
    if (pw.newPassword !== pw.confirmPassword) {
      setPwMsg({ type: "err", text: "New passwords do not match." });
      return;
    }
    setSavingPw(true);
    try {
      await apiClient.post("/account/change-password", {
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
      });
      if (backendUser?.email) {
        try {
          await refreshSession(backendUser.email, pw.newPassword);
        } catch {
          // Password already updated; ignore silent refresh errors.
        }
      }
      setPw({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPwMsg({ type: "ok", text: "Password updated successfully." });
    } catch (err) {
      setPwMsg({ type: "err", text: err?.response?.data?.message || "Could not change password." });
    } finally {
      setSavingPw(false);
    }
  };

  const { org, members } = membersQuery.data || {};
  const billing = billingQuery.data;

  return (
    <PanelShell
      title="Organization Member"
      subtitle="Manage your personal profile, security credentials, and workspace overview."
      navItems={memberNavItems}
    >
      <UserCard />

      <div id="profile" className={`${cardClass} scroll-mt-24`}>
        <h2 className="font-display text-base font-bold text-[var(--text-bright)] mb-4">Profile</h2>
        <form onSubmit={handleProfile} className="space-y-4 mb-6">
          <div>
            <label htmlFor="member-name" className={labelClass}>Name</label>
            <input
              id="member-name"
              name="name"
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>
          {profileMsg.text && (
            <p
              role="alert"
              className={`text-sm rounded-xl border px-4 py-3 ${
                profileMsg.type === "err"
                  ? "text-rose-400 bg-rose-500/10 border-rose-500/30"
                  : "text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
              }`}
            >
              {profileMsg.text}
            </p>
          )}
          <button type="submit" className={btnPrimary} disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save profile"}
          </button>
        </form>

        <div id="security" className="border-t border-[var(--border-subtle)] pt-6 scroll-mt-24">
          <h3 className="font-display text-base font-bold text-[var(--text-bright)] mb-4">
            Change password
          </h3>
          <form onSubmit={handlePassword} className="space-y-4">
            <input
              type="email"
              name="username"
              autoComplete="username"
              value={backendUser?.email || ""}
              readOnly
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
            />
            <div>
              <label htmlFor="member-current-password" className={labelClass}>Current password</label>
              <input
                id="member-current-password"
                name="currentPassword"
                className={inputClass}
                type="password"
                value={pw.currentPassword}
                onChange={setPwField("currentPassword")}
                autoComplete="current-password"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="member-new-password" className={labelClass}>New password</label>
                <input
                  id="member-new-password"
                  name="newPassword"
                  className={inputClass}
                  type="password"
                  value={pw.newPassword}
                  onChange={setPwField("newPassword")}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  required
                />
              </div>
              <div>
                <label htmlFor="member-confirm-password" className={labelClass}>Confirm new password</label>
                <input
                  id="member-confirm-password"
                  name="confirmPassword"
                  className={inputClass}
                  type="password"
                  value={pw.confirmPassword}
                  onChange={setPwField("confirmPassword")}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
            {pwMsg.text && (
              <p
                role="alert"
                className={`text-sm rounded-xl border px-4 py-3 ${
                  pwMsg.type === "err"
                    ? "text-rose-400 bg-rose-500/10 border-rose-500/30"
                    : "text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
                }`}
              >
                {pwMsg.text}
              </p>
            )}
            <button type="submit" className={btnSecondary} disabled={savingPw}>
              {savingPw ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>
      </div>

      <div id="organization" className={`${cardClass} scroll-mt-24`}>
        <h2 className="font-display text-base font-bold text-[var(--text-bright)] mb-4">
          Organization
        </h2>
        {membersQuery.isLoading ? (
          <p className="text-sm text-[var(--text-muted)]">Loading...</p>
        ) : (
          <>
            <p className="font-display text-lg text-[var(--text-bright)] font-bold">{org?.name}</p>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
              Status <span className="text-[var(--text-bright)] font-semibold">{org?.status}</span> •{" "}
              {org?.memberCount}/{org?.maxMembers} members
            </p>
            <ul className="mt-4 divide-y divide-[var(--border-subtle)] text-sm">
              {members?.map((m) => (
                <li key={m.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-[var(--text-bright)] font-semibold">{m.name}</div>
                    <div className="text-[var(--text-muted)] font-mono text-xs">{m.email}</div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold font-mono ${
                      m.role === "org_admin"
                        ? "bg-purple-500/20 text-[var(--accent-text)] border border-purple-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {m.role}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div id="plan" className={`${cardClass} scroll-mt-24`}>
        <h2 className="font-display text-base font-bold text-[var(--text-bright)] mb-4">Plan</h2>
        {billingQuery.isLoading ? (
          <p className="text-sm text-[var(--text-muted)]">Loading...</p>
        ) : billing?.plan ? (
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="glass-inner p-4">
              <dt className="text-[var(--text-muted)] text-xs">Plan</dt>
              <dd className="font-display text-[var(--text-bright)] font-bold mt-1">
                {billing.plan.name}
              </dd>
            </div>
            <div className="glass-inner p-4">
              <dt className="text-[var(--text-muted)] text-xs">Price</dt>
              <dd className="font-mono text-[var(--text-bright)] font-bold mt-1">
                {formatPrice(billing.plan.priceCents, billing.plan.currency)}
                {billing.plan.billingInterval === "yearly" ? "/year" : "/month"}
              </dd>
            </div>
            <div className="glass-inner p-4">
              <dt className="text-[var(--text-muted)] text-xs">Renews</dt>
              <dd className="font-mono text-[var(--text-bright)] font-bold mt-1">
                {billing.subscription?.currentPeriodEnd
                  ? new Date(billing.subscription.currentPeriodEnd).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">No plan information available.</p>
        )}
      </div>
    </PanelShell>
  );
};

export default MemberDashboard;
