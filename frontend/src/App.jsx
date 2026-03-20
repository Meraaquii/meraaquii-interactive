// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import DashboardLayout from "./Components/Dashboardlayout/Dashboardlayout";
import DeviceList from "./Components/DeviceList/DeviceList";
import SalesmanList from "./Components/Salesmanlist/Salesmanlist";
import ProjectFilter from "./Components/ProjectFilter/ProjectFilter";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import ClientList from "./Components/ClientList/ClientList";

export default function App() {
  return (
    <Routes>
      {/* ── Public routes ─────────────────────────────────────────── */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* ── Protected routes (any logged-in user) ─────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="salesman-list" replace />} />
          <Route path="device-list" element={<DeviceList />} />
          <Route path="salesman-list" element={<SalesmanList />} />
          <Route path="project-filter" element={<ProjectFilter />} />
          <Route path="client-list" element={<ClientList />} />
        </Route>
      </Route>

      {/* ── Admin-only routes (user_type === "A") ─────────────────── */}
      {/* Uncomment when you add admin pages
      <Route element={<ProtectedRoute role="A" />}>
        <Route path="/admin/dashboard" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
        </Route>
      </Route>
      */}

      {/* ── Catch-all ─────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
