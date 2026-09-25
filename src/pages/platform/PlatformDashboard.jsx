import UserCard from "../../components/UserCard";
import { cardClass } from "../../utils/ui";

const PlatformDashboard = () => {
  return (
    <div className="space-y-6">
      <UserCard />

      <div className={cardClass}>
        <h2 className="text-base font-semibold text-white mb-4">Ready to use</h2>
        <ul className="list-disc pl-5 text-sm text-slate-300 space-y-2">
          <li>Organizations list with search and filtering — open the Organizations tab above</li>
          <li>Organization detail (profile, members, subscription, payments) with suspend/reactivate</li>
          <li>Plans management — open the Plans tab above</li>
          <li>Revenue overview — open the Revenue tab above</li>
          <li>All transactions across every organization — open the Transactions tab above</li>
          <li>Stats & overview — open the Stats & overview tab above</li>
        </ul>
      </div>
    </div>
  );
};

export default PlatformDashboard;