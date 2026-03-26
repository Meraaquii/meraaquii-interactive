// components/ProtectedRoute/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const ROLE_HOME = {
  A: "/admin/dashboard",
  C: "/dashboard",
  CU: "/customer/dashboard",
  S: "/salesman/dashboard",
};

export default function ProtectedRoute({ role }) {
  // ✅ Guard on token — always present after login
  //    (user_id can be empty string if backend field name differs)
  const token = localStorage.getItem("token");
  const user_type = localStorage.getItem("user_type");

  console.log(
    `[ProtectedRoute] token=${!!token} | user_type="${user_type}" | required="${role}"`,
  );

  // 1️⃣ Not logged in
  if (!token) {
    console.log("[ProtectedRoute] No token → /");
    return <Navigate to="/" replace />;
  }

  // 2️⃣ Role mismatch
  if (role) {
    const allowed = Array.isArray(role) ? role : [role];
    if (!allowed.includes(user_type)) {
      const home = ROLE_HOME[user_type] ?? "/";
      console.log(`[ProtectedRoute] Mismatch → ${home}`);
      return <Navigate to={home} replace />;
    }
  }

  return <Outlet />;
}
