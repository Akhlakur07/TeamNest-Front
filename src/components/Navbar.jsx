import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { LayoutDashboard, Sparkles } from "lucide-react";
import useAuth from "../hooks/useAuth";
import LogoutButton from "./LogoutButton";
import ThemeToggle from "./ThemeToggle";
import roleHome from "../utils/roles";

const Navbar = () => {
  const { user, backendUser } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpenPath, setMobileOpenPath] = useState(null);
  const mobileOpen = mobileOpenPath === location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const dashboardPath = roleHome(backendUser?.role);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "navbar-glass shadow-lg shadow-black/15" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" id="nav-logo">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow on-accent">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-display text-lg font-bold text-[var(--text-bright)] tracking-tight">
            Team<span className="gradient-text">Nest</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm" id="nav-desktop">
          {!isAuthPage && (
            <div className="flex items-center gap-6 mr-2">
              <a
                href="/#features"
                className="text-[var(--text-secondary)] hover:text-[var(--text-bright)] font-medium transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="/#pricing"
                className="text-[var(--text-secondary)] hover:text-[var(--text-bright)] font-medium transition-colors duration-200"
              >
                Pricing
              </a>
              <a
                href="/#about"
                className="text-[var(--text-secondary)] hover:text-[var(--text-bright)] font-medium transition-colors duration-200"
              >
                About
              </a>
            </div>
          )}

          <ThemeToggle id="nav-theme-toggle" showLabel />

          {user && backendUser ? (
            <div className="flex items-center gap-3">
              <Link
                to={dashboardPath}
                className="inline-flex items-center gap-2 rounded-xl border border-purple-500/35 bg-purple-500/15 px-3.5 py-1.5 text-xs font-semibold text-[var(--accent-text)] hover:bg-purple-500/25 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              <span className="hidden lg:block font-mono text-xs text-[var(--text-muted)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-full px-3 py-1.5">
                {user.email}
              </span>
              <LogoutButton className="btn-secondary !py-1.5 !px-3.5 !text-xs" />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                id="nav-login"
                className="text-[var(--text-secondary)] hover:text-[var(--text-bright)] font-semibold transition-colors px-2 py-1"
              >
                Log in
              </Link>
              <Link to="/register" id="nav-register" className="btn-primary !py-2 !px-4 !text-xs">
                Get started
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle id="nav-mobile-theme-toggle" />
          <button
            id="nav-mobile-toggle"
            type="button"
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)] transition-colors"
            onClick={() =>
              setMobileOpenPath((p) => (p === location.pathname ? null : location.pathname))
            }
            aria-label="Toggle menu"
          >
            <span
              className={`block w-4.5 h-0.5 bg-[var(--text-primary)] rounded transition-all duration-200 ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-4.5 h-0.5 bg-[var(--text-primary)] rounded transition-all duration-200 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-4.5 h-0.5 bg-[var(--text-primary)] rounded transition-all duration-200 ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } navbar-glass border-t border-[var(--border-subtle)]`}
      >
        <div className="px-4 py-4 flex flex-col gap-3 text-sm" id="nav-mobile">
          {!isAuthPage && (
            <>
              <a
                href="/#features"
                onClick={() => setMobileOpenPath(null)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-bright)] py-1 font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="/#pricing"
                onClick={() => setMobileOpenPath(null)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-bright)] py-1 font-medium transition-colors"
              >
                Pricing
              </a>
              <a
                href="/#about"
                onClick={() => setMobileOpenPath(null)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-bright)] py-1 font-medium transition-colors"
              >
                About
              </a>
            </>
          )}
          {user && backendUser ? (
            <>
              <Link
                to={dashboardPath}
                onClick={() => setMobileOpenPath(null)}
                className="text-[var(--accent-text)] font-semibold py-1 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <span className="font-mono text-xs text-[var(--text-muted)] py-1">{user.email}</span>
              <LogoutButton id="mobile-nav-logout-btn" />
            </>
          ) : (
            <>
              <Link
                to="/login"
                id="nav-mobile-login"
                onClick={() => setMobileOpenPath(null)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-bright)] py-1 font-semibold"
              >
                Log in
              </Link>
              <Link
                to="/register"
                id="nav-mobile-register"
                onClick={() => setMobileOpenPath(null)}
                className="btn-primary text-center mt-1"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
