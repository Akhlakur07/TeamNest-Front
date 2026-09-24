import { statusStyle } from "../utils/ui";

const StatusBadge = ({ status }) => (
  <span
    className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle[status] || "bg-slate-100 text-slate-600"}`}
  >
    {status}
  </span>
);

export default StatusBadge;