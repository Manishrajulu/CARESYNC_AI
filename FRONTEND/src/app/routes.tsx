import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Dashboard } from "./components/Dashboard";
import { PatientAdmission } from "./components/PatientAdmission";
import { PatientsList } from "./components/PatientsList";
import { PatientDetail } from "./components/PatientDetail";
import { Alerts } from "./components/Alerts";
import { Analytics } from "./components/Analytics";
import { Settings } from "./components/Settings";
import { WhatIfSimulator } from "./components/WhatIfSimulator";
import { ShiftReport } from "./components/ShiftReport";
import { ErrorBoundary } from "./components/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorBoundary,
    children: [
      { index: true, Component: Dashboard, ErrorBoundary: ErrorBoundary },
      { path: "admission", Component: PatientAdmission, ErrorBoundary: ErrorBoundary },
      { path: "patients", Component: PatientsList, ErrorBoundary: ErrorBoundary },
      { path: "patients/:id", Component: PatientDetail, ErrorBoundary: ErrorBoundary },
      { path: "alerts", Component: Alerts, ErrorBoundary: ErrorBoundary },
      { path: "analytics", Component: Analytics, ErrorBoundary: ErrorBoundary },
      { path: "settings", Component: Settings, ErrorBoundary: ErrorBoundary },
      { path: "simulator", Component: WhatIfSimulator, ErrorBoundary: ErrorBoundary },
      { path: "simulator/:id", Component: WhatIfSimulator, ErrorBoundary: ErrorBoundary },
      { path: "shift-report", Component: ShiftReport, ErrorBoundary: ErrorBoundary },
    ],
  },
]);


