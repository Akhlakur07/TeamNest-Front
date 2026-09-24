import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import LogoutButton from "../../components/LogoutButton";
import StatusBadge from "../../components/StatusBadge";
import { btnSecondary, cardClass, inputClass, statusStyle } from "../../utils/ui";

const Organizations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const page = Number(searchParams.get("page") || 1);
  const [draft, setDraft] = useState(search);

  const orgsQuery = useQuery({
    queryKey: ["admin", "organizations", { search, status, page }],
    queryFn: () =>
      apiClient
        .get("/admin/organizations", { params: { search, status, page, limit: 10 } })
        .then((r) => r.data),
  });

  const applyFilter = (next) => {
    if (next.status) {
      setSearchParams({ search: next.search || "", status: next.status, page: "1" });
    } else if (next.search !== undefined) {
      setSearchParams({ search: next.search, status, page: "1" });
    }
  };

  if (orgsQuery.isLoading) return <div className="p-8">Loading organizations...</div>;
  if (orgsQuery.isError)
    return <div className="p-8 text-red-600">Failed to load organizations.</div>;

  const { total, organizations } = orgsQuery.data;
  const pageCount = Math.max(1, Math.ceil(total / 10));

  const goToPage = (nextPage) =>
    setSearchParams({ search, status, page: String(nextPage) });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Organizations</h1>
        <LogoutButton />
      </div>

      <form
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          applyFilter({ search: draft, status });
        }}
      >
        <input
          className={inputClass}
          placeholder="Search name or email"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <select
          className={inputClass}
          value={status}
          onChange={(e) => applyFilter({ status: e.target.value })}
        >
          <option value="">All statuses</option>
          {Object.keys(statusStyle).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit" className={btnSecondary}>
          Search
        </button>
      </form>

      <div className={cardClass}>
        <p className="text-xs text-slate-400 mb-3">{total} organization(s)</p>
        {organizations.length === 0 ? (
          <p className="text-sm text-slate-500">No organizations found.</p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {organizations.map((org) => (
              <li key={org.id}>
                <Link
                  to={`/admin/organizations/${org.id}`}
                  className="flex flex-wrap items-center gap-3 py-3 hover:bg-slate-50 rounded px-1 -mx-1"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-slate-900 truncate">{org.name}</div>
                    <div className="text-slate-500 truncate">{org.contactEmail}</div>
                  </div>
                  <StatusBadge status={org.status} />
                  <span className="text-xs text-slate-500">{org.plan?.slug || "no plan"}</span>
                  <span className="text-xs text-slate-500">{org.memberCount} member(s)</span>
                  <span className="ml-auto text-xs text-slate-400">
                    {org.subscriptionStatus || "no subscription"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-slate-400">
            Page {page} of {pageCount}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className={btnSecondary}
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              className={btnSecondary}
              disabled={page >= pageCount}
              onClick={() => goToPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organizations;