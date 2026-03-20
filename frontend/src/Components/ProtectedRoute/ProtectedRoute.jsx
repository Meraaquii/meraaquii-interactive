import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ role }) {
  const token = localStorage.getItem("token");
  const user_type = localStorage.getItem("user_type");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role && user_type !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
