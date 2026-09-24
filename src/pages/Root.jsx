import { Link, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import LogoutButton from "../components/LogoutButton";

const Root = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            TeamNest
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {user ? (
              <>
                <span className="hidden sm:inline text-slate-500">{user.email}</span>
                <LogoutButton />
              </>
            ) : (
              <Link to="/login" className="font-medium text-slate-700 hover:text-slate-900">
                Log in
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        TeamNest — multi-tenant collaboration platform
      </footer>
    </div>
  );
};

export default Root;