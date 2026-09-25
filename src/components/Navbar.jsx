import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import LogoutButton from "./LogoutButton";

import roleHome from "../utils/roles";

const Navbar = () => {
  const { user, backendUser } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const dashboardPath = roleHome(backendUser?.role);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "navbar-glass shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" id="nav-logo">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
            <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5 text-white" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Team<span className="gradient-text">Nest</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm" id="nav-desktop">
          {!isAuthPage && (
            <>
              <a href="#features" className="text-slate-400 hover:text-white transition-colors duration-200">Features</a>
              <a href="#pricing" className="text-slate-400 hover:text-white transition-colors duration-200">Pricing</a>
              <a href="#about" className="text-slate-400 hover:text-white transition-colors duration-200">About</a>
            </>
          )}
          {user ? (
            <div className="flex items-center gap-4 ml-2">
              <Link
                to={dashboardPath}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Dashboard
              </Link>
              <span className="hidden lg:block text-xs text-slate-500 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                {user.email}
              </span>
              <LogoutButton className="btn-secondary !py-1.5 !px-4 !text-xs" />
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-2">
              <Link to="/login" id="nav-login" className="text-slate-300 hover:text-white font-medium transition-colors">
                Log in
              </Link>
              <Link to="/register" id="nav-register" className="btn-primary !py-1.5 !px-4 !text-xs">
                Get started
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          id="nav-mobile-toggle"
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-slate-300 rounded transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-slate-300 rounded transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-slate-300 rounded transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        } navbar-glass border-t border-white/10`}
      >
        <div className="px-4 py-4 flex flex-col gap-3 text-sm" id="nav-mobile">
          {!isAuthPage && (
            <>
              <a href="#features" className="text-slate-300 hover:text-white py-1 transition-colors">Features</a>
              <a href="#pricing" className="text-slate-300 hover:text-white py-1 transition-colors">Pricing</a>
              <a href="#about" className="text-slate-300 hover:text-white py-1 transition-colors">About</a>
            </>
          )}
          {user ? (
            <>
              <Link
                to={dashboardPath}
                className="text-indigo-400 hover:text-indigo-300 font-semibold py-1 transition-colors flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Dashboard
              </Link>
              <span className="text-xs text-slate-500 py-1">{user.email}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link to="/login" id="nav-mobile-login" className="text-slate-300 hover:text-white py-1 font-medium">Log in</Link>
              <Link to="/register" id="nav-mobile-register" className="btn-primary text-center mt-1">Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
