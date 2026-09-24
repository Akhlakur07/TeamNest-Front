import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import Error from "../pages/Error";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import RequireAuth from "../components/RequireAuth";
import RequireRole from "../components/RequireRole";
import PlatformDashboard from "../pages/platform/PlatformDashboard";
import Plans from "../pages/platform/Plans";
import OrgDashboard from "../pages/org/OrgDashboard";
import MemberDashboard from "../pages/member/MemberDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <Error />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/forgot-password",
        Component: ForgotPassword,
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: "/admin",
            element: <RequireRole roles={["platform_admin"]} />,
            children: [
              { index: true, Component: PlatformDashboard },
              { path: "plans", Component: Plans },
            ],
          },
          {
            path: "/org",
            element: <RequireRole roles={["org_admin"]} />,
            children: [{ index: true, Component: OrgDashboard }],
          },
          {
            path: "/member",
            element: <RequireRole roles={["org_member"]} />,
            children: [{ index: true, Component: MemberDashboard }],
          },
        ],
      },
    ],
  },
]);