import { Outlet, useLocation } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SmoothScroll from "../components/SmoothScroll";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

const Root = () => {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(pathname);
  const isDashboard =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/org" ||
    pathname.startsWith("/org/") ||
    pathname === "/member" ||
    pathname.startsWith("/member/");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-animated">
      <SmoothScroll />
      {isDashboard ? (
        <Outlet />
      ) : (
        <>
          <Navbar />
          <main className={`flex-1 ${isAuthPage ? "" : "pt-16"}`}>
            <Outlet />
          </main>
          {!isAuthPage && <Footer />}
        </>
      )}
    </div>
  );
};

export default Root;
