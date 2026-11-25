import { Link, useRouteError } from "react-router";
import { AlertTriangle, ArrowLeft, Link2Off } from "lucide-react";

const Error = () => {
  const routeError = useRouteError();
  const is404 = !routeError || routeError?.status === 404;

  return (
    <div className="min-h-screen bg-gradient-animated flex items-center justify-center px-4 relative overflow-hidden">
      <div className="relative z-10 text-center max-w-lg mx-auto">
        <p className="font-mono text-[8rem] sm:text-[10rem] font-extrabold leading-none select-none gradient-text opacity-45 mb-2">
          {is404 ? "404" : "500"}
        </p>

        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center border-purple-500/30">
            {is404 ? (
              <Link2Off className="w-7 h-7 text-[var(--accent-text)]" />
            ) : (
              <AlertTriangle className="w-7 h-7 text-rose-400" />
            )}
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold text-[var(--text-bright)] mb-3">
          {is404 ? "Page not found" : "Something went wrong"}
        </h1>
        <p className="text-[var(--text-secondary)] mb-2">
          {is404
            ? "The page you're looking for doesn't exist or has been moved."
            : "An unexpected error occurred. Please try again."}
        </p>

        {routeError?.statusText && (
          <p className="text-xs font-mono text-[var(--text-muted)] mb-6 glass-inner inline-block px-4 py-2 rounded-full">
            {routeError.statusText}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8">
          <Link to="/" id="error-home-btn" className="btn-primary !py-2.5 !px-7">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <button
            id="error-back-btn"
            type="button"
            onClick={() => window.history.back()}
            className="btn-secondary !py-2.5 !px-7"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;
