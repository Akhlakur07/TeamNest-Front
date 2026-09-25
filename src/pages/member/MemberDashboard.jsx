import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PanelShell from "../../components/PanelShell";
import UserCard from "../../components/UserCard";
import LogoutButton from "../../components/LogoutButton";
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

const MemberDashboard = () => {
  const { backendUser, fetchProfile } = useAuth();
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
      subtitle="Manage your profile and view your organization."
      navItems={["Profile", "Organization info"]}
      rightAction={<LogoutButton />}
    >
      <UserCard />

      <div className={cardClass}>
        <h2 className="text-base font-semibold text-white mb-4">Profile</h2>
        <form onSubmit={handleProfile} className="space-y-4 mb-6">
          <div>
            <label className={labelClass}>Name</label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
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

        <div className="border-t border-white/10 pt-5">
          <h3 className="text-base font-semibold text-white mb-4">Change password</h3>
          <form onSubmit={handlePassword} className="space-y-4">
            <div>
              <label className={labelClass}>Current password</label>
              <input
                className={inputClass}
                type="password"
                value={pw.currentPassword}
                onChange={setPwField("currentPassword")}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>New password</label>
                <input
                  className={inputClass}
                  type="password"
                  value={pw.newPassword}
                  onChange={setPwField("newPassword")}
                  placeholder="At least 8 characters"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Confirm new password</label>
                <input
                  className={inputClass}
                  type="password"
                  value={pw.confirmPassword}
                  onChange={setPwField("confirmPassword")}
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

      <div className={cardClass}>
        <h2 className="text-base font-semibold text-white mb-4">Organization</h2>
        {membersQuery.isLoading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : (
          <>
            <p className="text-base text-white font-semibold">{org?.name}</p>
            <p className="text-xs text-slate-400 mt-1">
              Status <span className="text-slate-300 font-medium">{org?.status}</span> • {org?.memberCount}/{org?.maxMembers} members
            </p>
            <ul className="mt-4 divide-y divide-white/10 text-sm">
              {members?.map((m) => (
                <li key={m.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <div className="text-white font-medium">{m.name}</div>
                    <div className="text-slate-400 text-xs">{m.email}</div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      m.role === "org_admin"
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
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

      <div className={cardClass}>
        <h2 className="text-base font-semibold text-white mb-4">Plan</h2>
        {billingQuery.isLoading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : billing?.plan ? (
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-slate-400 text-xs">Plan</dt>
              <dd className="text-white font-semibold mt-1">{billing.plan.name}</dd>
            </div>
            <div>
              <dt className="text-slate-400 text-xs">Price</dt>
              <dd className="text-white font-semibold mt-1">
                {formatPrice(billing.plan.priceCents, billing.plan.currency)}
                {billing.plan.billingInterval === "yearly" ? "/year" : "/month"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400 text-xs">Renews</dt>
              <dd className="text-white font-semibold mt-1">
                {billing.subscription?.currentPeriodEnd
                  ? new Date(billing.subscription.currentPeriodEnd).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-slate-400">No plan information available.</p>
        )}
      </div>
    </PanelShell>
  );
};

export default MemberDashboard;