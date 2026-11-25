import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ChevronRight,
  ExternalLink,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  X,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import LogoutButton from "./LogoutButton";
import ThemeToggle from "./ThemeToggle";
import StatusBadge from "./StatusBadge";

const PanelShell = ({ title, subtitle, navItems = [], rightAction, children }) => {
  const { pathname } = useLocation();
  const { backendUser, backendOrg } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpenPath, setMobileOpenPath] = useState(null);
  const mobileOpen = mobileOpenPath === pathname;

  const activeNav = navItems.find((item) => {
    if (typeof item !== "object" || !item.to || item.to.startsWith("#")) return false;
    const isRoot = item.to === "/admin" || item.to === "/org" || item.to === "/member";
    return isRoot ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`);
  });

  const initials = backendUser?.name
    ? backendUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "TN";

  const renderNavItems = (isCollapsed = false, closeDrawer = false) =>
    navItems.map((item) => {
      const obj = typeof item === "string" ? { label: item } : item;
      const Icon = obj.icon;

      if (obj.to && obj.to.startsWith("#")) {
        return (
          <a
            key={obj.to}
            href={obj.to}
            onClick={() => closeDrawer && setMobileOpenPath(null)}
            title={isCollapsed ? obj.label : undefined}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-subtle)] hover:text-[var(--text-bright)] ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            {Icon && (
              <Icon className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-colors group-hover:text-purple-400" />
            )}
            {!isCollapsed && <span className="truncate">{obj.label}</span>}
          </a>
        );
      }

      if (obj.to) {
        const isRoot = obj.to === "/admin" || obj.to === "/org" || obj.to === "/member";
        const isActive = isRoot
          ? pathname === obj.to
          : pathname === obj.to || pathname.startsWith(`${obj.to}/`);

        return (
          <Link
            key={obj.to}
            to={obj.to}
            onClick={() => closeDrawer && setMobileOpenPath(null)}
            title={isCollapsed ? obj.label : undefined}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors duration-150 ${
              isCollapsed ? "justify-center" : ""
            } ${
              isActive
                ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-500/25 on-accent"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-bright)]"
            }`}
          >
            {Icon && (
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  isActive ? "text-white" : "text-[var(--text-muted)] group-hover:text-purple-400"
                }`}
              />
            )}
            {!isCollapsed && <span className="truncate">{obj.label}</span>}
          </Link>
        );
      }

      return (
        <span
          key={obj.label}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-muted)]"
        >
          {Icon && <Icon className="h-4 w-4 shrink-0" />}
          {!isCollapsed && <span className="truncate">{obj.label}</span>}
        </span>
      );
    });

  return (
    <div className="min-h-screen flex bg-gradient-animated relative">
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 sticky top-0 h-screen dashboard-sidebar z-30 transition-[width] duration-200 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div
          className={`h-16 flex items-center border-b border-[var(--border-subtle)] px-4 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center shadow-md shadow-purple-500/30 on-accent">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="leading-none">
                <span className="font-display text-base font-bold text-[var(--text-bright)]">
                  Team<span className="gradient-text">Nest</span>
                </span>
                <span className="block text-[10px] font-medium uppercase tracking-widest text-[var(--text-muted)] mt-0.5">
                  {backendOrg ? backendOrg.name : "Console"}
                </span>
              </div>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:border-purple-500/50 hover:text-[var(--text-bright)] transition-colors cursor-pointer"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1.5">
          {!collapsed && (
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Workspace
            </p>
          )}
          <nav className="space-y-1" aria-label="Dashboard navigation">
            {renderNavItems(collapsed, false)}
          </nav>
        </div>

        <div className="border-t border-[var(--border-subtle)] p-3 space-y-2.5">
          <Link
            to="/"
            title={collapsed ? "Public site" : undefined}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-bright)] transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            {!collapsed && <span>Back to public site</span>}
          </Link>

          {backendUser && (
            <div
              className={`flex items-center gap-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] p-2.5 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center text-white text-xs font-bold shrink-0 on-accent">
                {initials}
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-[var(--text-bright)] truncate">
                    {backendUser.name}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] truncate">
                    {backendUser.email}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className={collapsed ? "flex justify-center" : ""}>
            <LogoutButton
              compact={collapsed}
              className={
                collapsed
                  ? "p-2 rounded-xl hover:bg-rose-500/10"
                  : "w-full justify-start px-3 py-2 rounded-xl hover:bg-rose-500/10"
              }
            />
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileOpenPath(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <aside className="relative z-10 w-72 max-w-[85vw] h-full dashboard-sidebar flex flex-col">
            <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border-subtle)]">
              <Link
                to="/"
                onClick={() => setMobileOpenPath(null)}
                className="flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center on-accent">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-display text-base font-bold text-[var(--text-bright)]">
                  Team<span className="gradient-text">Nest</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpenPath(null)}
                aria-label="Close navigation menu"
                className="h-8 w-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
              {renderNavItems(false, true)}
            </nav>
            <div className="border-t border-[var(--border-subtle)] p-4 space-y-3">
              <Link
                to="/"
                onClick={() => setMobileOpenPath(null)}
                className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-bright)]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Back to public site
              </Link>
              <LogoutButton id="mobile-logout-btn" className="w-full justify-start" />
            </div>
          </aside>
        </div>
      )}

      {/* Main Workspace Column */}
      <div className="flex-1 min-w-0 flex flex-col relative z-10">
        <header className="sticky top-0 z-20 h-16 dashboard-topbar px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpenPath(pathname)}
              aria-label="Open navigation menu"
              className="lg:hidden h-9 w-9 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--text-primary)]"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <span className="truncate font-medium">{title}</span>
                {activeNav && (
                  <>
                    <ChevronRight className="h-3 w-3 shrink-0" />
                    <span className="text-[var(--accent-text)] font-semibold truncate">
                      {activeNav.label}
                    </span>
                  </>
                )}
              </div>
              {subtitle && (
                <p className="hidden sm:block text-xs text-[var(--text-muted)] truncate mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {backendOrg && (
              <div className="hidden md:flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3 py-1">
                <span className="text-xs font-semibold text-[var(--text-bright)] max-w-[140px] truncate">
                  {backendOrg.name}
                </span>
                <StatusBadge status={backendOrg.status} />
              </div>
            )}
            <ThemeToggle id="dashboard-theme-toggle" showLabel />
            {rightAction}
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
          <div className="mb-7">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-bright)] tracking-tight">
              {activeNav ? activeNav.label : title}
            </h1>
            {subtitle && (
              <p className="text-sm text-[var(--text-muted)] mt-1">{subtitle}</p>
            )}
          </div>

          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default PanelShell;
