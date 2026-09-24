import { Link } from "react-router";
import { btnPrimary } from "../utils/ui";

const Error = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <p className="text-5xl font-bold text-slate-300">404</p>
      <h1 className="mt-4 text-xl font-semibold text-slate-900">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        The page you're looking for doesn't exist.
      </p>
      <div className="mt-8">
        <Link to="/" className={btnPrimary}>
          Back home
        </Link>
      </div>
    </div>
  );
};

export default Error;