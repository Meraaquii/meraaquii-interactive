import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function usePreventDashboardExit(setShowPopup) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = () => {
      // Only trigger popup if leaving dashboard root (not inner pages)
      if (!location.pathname.startsWith("/dashboard")) return;

      const dashboardRootPaths = [
        "/dashboard",
        "/dashboard/salesman-list",
        "/dashboard/device-list",
        "/dashboard/project-filter",
      ];

      if (!dashboardRootPaths.includes(location.pathname)) return;

      // Show popup
      setShowPopup(true);

      // Keep user on current dashboard page
      navigate(location.pathname, { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [location, navigate, setShowPopup]);
}
