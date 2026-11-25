import { Moon, Sun } from "lucide-react";
import useTheme from "../hooks/useTheme";

const ThemeToggle = ({ className = "", showLabel = false, id = "theme-toggle-btn" }) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      id={id}
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-subtle)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text-primary)] transition-colors duration-200 hover:border-purple-500/60 hover:bg-purple-500/15 cursor-pointer ${className}`}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
        {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5 text-amber-500" />}
      </span>
      {showLabel && (
        <span className="pr-1 tracking-wide">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
