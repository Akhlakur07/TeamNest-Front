import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import Error from "../pages/Error";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import RegistrationStatus from "../pages/RegistrationStatus";
import InviteAccept from "../pages/InviteAccept";
import RequireAuth from "../components/RequireAuth";
import RequireRole from "../components/RequireRole";
import PlatformDashboard from "../pages/platform/PlatformDashboard";
import Plans from "../pages/platform/Plans";
import Revenue from "../pages/platform/Revenue";
import Organizations from "../pages/platform/Organizations";
import OrganizationDetail from "../pages/platform/OrganizationDetail";
import OrgDashboard from "../pages/org/OrgDashboard";
import Subscription from "../pages/org/Subscription";
import Members from "../pages/org/Members";
import Transactions from "../pages/org/Transactions";
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
        path: "/registration/status",
        Component: RegistrationStatus,
      },
      {
        path: "/invite/accept",
        Component: InviteAccept,
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
              { path: "revenue", Component: Revenue },
              { path: "organizations", Component: Organizations },
              { path: "organizations/:id", Component: OrganizationDetail },
            ],
          },
          {
            path: "/org",
            element: <RequireRole roles={["org_admin"]} />,
            children: [
              { index: true, Component: OrgDashboard },
              { path: "subscription", Component: Subscription },
              { path: "members", Component: Members },
              { path: "transactions", Component: Transactions },
            ],
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