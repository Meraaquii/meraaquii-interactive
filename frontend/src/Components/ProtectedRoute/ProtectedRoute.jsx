import { Navigate, Outlet, useLocation } from "react-router-dom";

const ROLE_HOME = {
  A: "/admin/dashboard",
  C: "/dashboard",
  CU: "/customer/dashboard",
  S: "/salesman/dashboard",
};

export default function ProtectedRoute({ role }) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const user_type = localStorage.getItem("user_type")?.trim().toUpperCase();

  console.log(
    `[ProtectedRoute] token=${!!token} | user_type="${user_type}" | required="${role}" | path="${location.pathname}"`,
  );

  if (!token) {
    console.log("[ProtectedRoute] No token → redirect to login");
    return <Navigate to="/" replace />;
  }

  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];

    const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

    if (!normalizedAllowed.includes(user_type)) {
      const redirectPath = ROLE_HOME[user_type] || "/";
      console.log(
        `[ProtectedRoute] Role mismatch → redirect to ${redirectPath}`,
      );
      return <Navigate to={redirectPath} replace />;
    }
  }

  console.log("[ProtectedRoute] Access granted");
  return <Outlet />;
}
