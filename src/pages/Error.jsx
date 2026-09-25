import { Link, useRouteError } from "react-router";

const Error = () => {
  const routeError = useRouteError();
  const is404 = !routeError || routeError?.status === 404;

  return (
    <div className="min-h-screen bg-gradient-animated flex items-center justify-center px-4 relative overflow-hidden">
      {/* Blobs */}
      <div className="glow-orb glow-orb-1" style={{ opacity: 0.5 }} />
      <div className="glow-orb glow-orb-2" style={{ opacity: 0.35 }} />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Glowing number */}
        <div className="relative inline-block mb-6">
          <p
            className="text-[10rem] font-extrabold leading-none select-none"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 40px rgba(99,102,241,0.3))",
            }}
          >
            {is404 ? "404" : "500"}
          </p>
          {/* Glow underneath */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 rounded-full bg-indigo-500/10 filter blur-3xl" />
          </div>
        </div>

        {/* Broken link icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center border-indigo-500/30">
            {is404 ? (
              <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3 fade-in-up">
          {is404 ? "Page not found" : "Something went wrong"}
        </h1>
        <p className="text-slate-400 mb-2 fade-in-up-1">
          {is404
            ? "The page you're looking for doesn't exist or has been moved."
            : "An unexpected error occurred. Our team has been notified."}
        </p>

        {routeError?.statusText && (
          <p className="text-sm text-slate-600 mb-6 glass-inner inline-block px-4 py-2 rounded-full">
            {routeError.statusText}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 fade-in-up-2">
          <Link to="/" id="error-home-btn" className="btn-primary !py-3 !px-8">
            ← Back to home
          </Link>
          <button
            id="error-back-btn"
            onClick={() => window.history.back()}
            className="btn-secondary !py-3 !px-8"
          >
            Go back
          </button>
        </div>

        {/* Decorative dots */}
        <div className="flex items-center justify-center gap-2 mt-12">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-indigo-500/40"
              style={{ opacity: 1 - i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Error;