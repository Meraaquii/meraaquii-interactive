import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ role }) {
  const user_id = localStorage.getItem("user_id"); // ✅ token → user_id
  const user_type = localStorage.getItem("user_type");

  if (!user_id) {
    return <Navigate to="/" replace />;
  }

  if (role && user_type !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
