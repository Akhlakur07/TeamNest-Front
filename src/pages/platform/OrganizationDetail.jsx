import { Link, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import { formatPrice } from "../../utils/ui";
import StatusBadge from "../../components/StatusBadge";

const roleStyle = (role) =>
  role === "org_admin" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700";

const OrganizationDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const orgQuery = useQuery({
    queryKey: ["admin", "organizations", id],
    queryFn: () => apiClient.get(`/admin/organizations/${id}`).then((r) => r.data),
  });

  const toggleStatus = useMutation({
    mutationFn: (nextStatus) =>
      apiClient.patch(`/admin/organizations/${id}/status`, { status: nextStatus }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "organizations"] }),
  });

  if (orgQuery.isLoading) return <div className="p-8">Loading organization...</div>;
  if (orgQuery.isError) return <div className="p-8 text-red-600">Failed to load organization.</div>;

  const { organization: org, subscription, members, recentPayments } = orgQuery.data;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">{org.name}</h1>
            <StatusBadge status={org.status} />
          </div>
          <p className="text-sm text-slate-500 mt-1">{org.contactEmail}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/organizations" className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            ← Back
          </Link>
          {org.status !== "CANCELLED" && (
            <button
              type="button"
              className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed ${
                org.status === "SUSPENDED"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
              disabled={toggleStatus.isPending}
              onClick={() =>
                toggleStatus.mutate(org.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED")
              }
            >
              {org.status === "SUSPENDED" ? "Reactivate" : "Suspend"}
            </button>
          )}
        </div>
      </div>

      {toggleStatus.isError && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
          {toggleStatus.error?.response?.data?.message || "Could not change organization status."}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Profile</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div>
              <dt className="text-slate-500">Plan</dt>
              <dd className="text-slate-900 font-medium">{org.plan?.name || "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Contact</dt>
              <dd className="text-slate-900">{org.contactName}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Signup</dt>
              <dd className="text-slate-900">{new Date(org.signupDate).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Activated</dt>
              <dd className="text-slate-900">
                {org.activatedAt ? new Date(org.activatedAt).toLocaleDateString() : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Stripe customer</dt>
              <dd className="text-slate-900">{org.stripeCustomerId || "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Stripe subscription</dt>
              <dd className="text-slate-900">{org.stripeSubscriptionId || "—"}</dd>
            </div>
          </dl>
          {org.suspendedAt && (
            <p className="text-xs text-red-600 mt-3">
              Suspended since {new Date(org.suspendedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Subscription</h2>
          {subscription ? (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div>
                <dt className="text-slate-500">Status</dt>
                <dd className="text-slate-900 font-medium">
                  <StatusBadge status={subscription.status} />
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Period</dt>
                <dd className="text-slate-900">
                  {subscription.currentPeriodStart
                    ? `${new Date(subscription.currentPeriodStart).toLocaleDateString()} → ${new Date(
                        subscription.currentPeriodEnd
                      ).toLocaleDateString()}`
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Trial ends</dt>
                <dd className="text-slate-900">
                  {subscription.trialEnd ? new Date(subscription.trialEnd).toLocaleDateString() : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Cancels at</dt>
                <dd className="text-slate-900">
                  {subscription.canceledAt ? new Date(subscription.canceledAt).toLocaleDateString() : "—"}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-slate-500">No subscription on file.</p>
          )}
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Members ({members?.length || 0})</h2>
        <ul className="divide-y divide-slate-100 text-sm">
          {members?.map((m) => (
            <li key={m.id} className="flex items-center justify-between py-2">
              <div>
                <div className="text-slate-900 font-medium">{m.name}</div>
                <div className="text-slate-500">{m.email}</div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleStyle(m.role)}`}>
                {m.role}
              </span>
            </li>
          ))}
          {members?.length === 0 && <li className="py-2 text-slate-500">No members.</li>}
        </ul>
      </div>

      <div className="mt-4 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Recent payments</h2>
        {recentPayments?.length === 0 ? (
          <p className="text-sm text-slate-500">No payments yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {recentPayments?.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-slate-900 font-medium">{p.invoiceNumber || "Invoice"}</div>
                  <div className="text-slate-500">
                    {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "—"}
                  </div>
                </div>
                <div className="text-slate-900 font-medium">
                  {formatPrice(p.amountCents, p.currency)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrganizationDetail;