import { Link } from "react-router";
import useAuth from "../hooks/useAuth";
import roleHome from "../utils/roles";
import { btnPrimary, btnSecondary } from "../utils/ui";

const Home = () => {
  const { user, backendUser, loading } = useAuth();

  const dashboardTarget = backendUser
    ? roleHome(backendUser.role)
    : user
      ? "/"
      : "/login";

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-slate-900">
        A workspace for your whole organization
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        TeamNest gives every organization an isolated space with its own
        members, subscription, and payment history.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {loading ? null : user ? (
          <Link to={dashboardTarget} className={btnPrimary}>
            Go to dashboard
          </Link>
        ) : (
          <>
            <Link to="/register" className={btnPrimary}>
              Register your organization
            </Link>
            <Link to="/login" className={btnSecondary}>
              Log in
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;