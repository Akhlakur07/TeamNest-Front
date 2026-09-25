import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import apiClient from "../../utils/apiClient";
import { btnPrimary, cardClass, inputClass, labelClass } from "../../utils/ui";

const OrgProfile = () => {
  const { backendUser, backendOrg, fetchProfile } = useAuth();
  const [name, setName] = useState(() => backendUser?.name || "");
  const [form, setForm] = useState(() => ({
    contactName: backendOrg?.contactName || "",
    contactEmail: backendOrg?.contactEmail || "",
    phone: backendOrg?.phone || "",
    billingEmail: backendOrg?.billingEmail || "",
  }));
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  const setField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMsg({ type: "", text: "" });
    setSaving(true);
    try {
      if (name && name !== backendUser?.name) {
        await apiClient.patch("/account/profile", { name });
      }
      await apiClient.patch("/account/organization-profile", form);
      await fetchProfile();
      setMsg({ type: "ok", text: "Organization profile updated." });
    } catch (err) {
      setMsg({ type: "err", text: err?.response?.data?.message || "Could not update profile." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Organization profile</h2>
      </div>

      {msg.text && (
        <p
          role="alert"
          className={`text-sm rounded-xl border px-4 py-3 mb-6 ${
            msg.type === "err"
              ? "text-rose-400 bg-rose-500/10 border-rose-500/30"
              : "text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
          }`}
        >
          {msg.text}
        </p>
      )}

      <div className={cardClass}>
        <h2 className="text-base font-semibold text-white mb-4">Edit details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Your name</label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Organization contact name</label>
              <input
                className={inputClass}
                value={form.contactName}
                onChange={setField("contactName")}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Organization contact email</label>
              <input
                className={inputClass}
                type="email"
                value={form.contactEmail}
                onChange={setField("contactEmail")}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                className={inputClass}
                value={form.phone}
                onChange={setField("phone")}
                placeholder="Optional"
              />
            </div>
            <div>
              <label className={labelClass}>Billing email</label>
              <input
                className={inputClass}
                type="email"
                value={form.billingEmail}
                onChange={setField("billingEmail")}
                placeholder="Used for invoices and receipts"
              />
            </div>
          </div>
          <div className="pt-2">
            <button type="submit" className={btnPrimary} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrgProfile;