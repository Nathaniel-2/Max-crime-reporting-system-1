import { createBrowserRouter } from "react-router";
import { ThemeProvider } from "@figma/astraui";
import { Outlet } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { AuthLayout, Login, Register, PoliceLogin, AdminLogin } from "./pages/Auth";
import { CitizenLayout, CitizenDashboard, ReportCrime, CitizenCrimeMap, MyReports, CitizenNotifications, CitizenProfile, CitizenSettings } from "./pages/Citizen";
import { PoliceLayout, PoliceDashboard, CaseManagement, IncidentMap, OfficerManagement, PoliceReports } from "./pages/Police";
import { AdminLayout, AdminDashboard, UserManagement, CrimeCategories, AdminReports, Analytics, SystemSettings } from "./pages/Admin";

function RootLayout() {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      {
        path: "auth",
        Component: AuthLayout,
        children: [
          { path: "login", Component: Login },
          { path: "register", Component: Register },
          { path: "police-login", Component: PoliceLogin },
          { path: "admin-login", Component: AdminLogin },
        ],
      },
      {
        path: "citizen",
        Component: CitizenLayout,
        children: [
          { index: true, Component: CitizenDashboard },
          { path: "report", Component: ReportCrime },
          { path: "map", Component: CitizenCrimeMap },
          { path: "reports", Component: MyReports },
          { path: "notifications", Component: CitizenNotifications },
          { path: "profile", Component: CitizenProfile },
          { path: "settings", Component: CitizenSettings },
        ],
      },
      {
        path: "police",
        Component: PoliceLayout,
        children: [
          { index: true, Component: PoliceDashboard },
          { path: "cases", Component: CaseManagement },
          { path: "map", Component: IncidentMap },
          { path: "officers", Component: OfficerManagement },
          { path: "reports", Component: PoliceReports },
        ],
      },
      {
        path: "admin",
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminDashboard },
          { path: "users", Component: UserManagement },
          { path: "categories", Component: CrimeCategories },
          { path: "reports", Component: AdminReports },
          { path: "analytics", Component: Analytics },
          { path: "settings", Component: SystemSettings },
        ],
      },
    ],
  },
]);