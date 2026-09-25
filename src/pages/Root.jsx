import { Outlet, useLocation } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Routes that render their own full-page layout (auth pages)
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

const Root = () => {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-animated">
      <Navbar />

      <main className={`flex-1 ${isAuthPage ? "" : "pt-16"}`}>
        <Outlet />
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
};

export default Root;