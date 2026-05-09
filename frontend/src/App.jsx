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
import RoleBasedHome from "./Components/RoleBasedHome/RoleBasedHome";
import Teams from "./Components/Teams/Teams";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/:slug/*" element={<DashboardLayout />}>
          <Route index element={<RoleBasedHome />} />
          <Route path="dashboard" element={<RoleBasedHome />} />
          <Route path="device-list" element={<DeviceList />} />
          <Route path="project-filter" element={<ProjectFilter />} />
          <Route path="project-list" element={<ProjectFilter />} />
          <Route path="client-list" element={<ClientList />} />
          <Route path="salesman-list" element={<SalesmanList />} />
          <Route path="teams" element={<Teams />} />
          <Route path="customer-list" element={<CustomerList />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
