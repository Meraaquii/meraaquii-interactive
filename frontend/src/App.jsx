import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import DashboardLayout from "./Components/Dashboardlayout/Dashboardlayout";
import DeviceList from "./Components/DeviceList/DeviceList";
import SalesmanList from "./Components/Salesmanlist/Salesmanlist";
import ProjectFilter from "./Components/Projectfilter/Projectfilter";
import ClientList from "./Components/ClientList/ClientList";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import CustomerList from "./Components/Salesmanlist/CustomerList/CustomerList";
import ClientDashboard from "./Components/ClientDashboard/ClientDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/*Admin  (user_type = "A")*/}
      <Route element={<ProtectedRoute role="A" />}>
        <Route path="/admin/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<Navigate to="device-list" replace />} />
          <Route path="device-list" element={<DeviceList />} />
          <Route path="project-list" element={<ProjectFilter />} />
          <Route path="client-list" element={<ClientList />} />
        </Route>
      </Route>

      {/*Client (user_type = "C")*/}
      <Route element={<ProtectedRoute role="C" />}>
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<ClientDashboard />} />
          <Route path="device-list" element={<DeviceList />} />
          <Route path="salesman-list" element={<SalesmanList />} />
          <Route path="project-filter" element={<ProjectFilter />} />
        </Route>
      </Route>

      {/* ── Customer (user_type = "CU") — uncomment when ready ───── */}
      {/*
      <Route element={<ProtectedRoute role="CU" />}>
        <Route path="/customer/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="device-list" replace />} />
          <Route path="device-list"    element={<DeviceList />} />
          <Route path="project-filter" element={<ProjectFilter />} />
        </Route>
      </Route>
      */}

      {/*Salesman (user_type = "S")*/}

      <Route element={<ProtectedRoute role="S" />}>
        <Route path="/salesman/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<Navigate to="customer-list" replace />} />
          <Route path="customer-list" element={<CustomerList />} />
          <Route path="project-filter" element={<ProjectFilter />} />
        </Route>
      </Route>

      {/*Catch-all*/}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
