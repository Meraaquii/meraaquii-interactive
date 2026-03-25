import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import usePreventDashboardExit from "../../hooks/usePreventDashboardExit";
import "./DashboardLayout.css";
import { useEffect } from "react";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const navigate = useNavigate();

  const handleToggleDark = () => {
    setDarkMode((prev) => {
      document.body.classList.toggle("dark", !prev);
      return !prev;
    });
  };

  usePreventDashboardExit(setShowLogoutPopup);

  const confirmLogout = () => {
    localStorage.clear(); // wipes token, user_id, user_type, user
    setShowLogoutPopup(false);
    navigate("/", { replace: true });
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div className={`layout${darkMode ? " dark-theme" : ""}`}>
      <div className="layout__inner">
        <Sidebar
          isVisible={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
        />

        <div className="layout__right">
          <Navbar
            darkMode={darkMode}
            onToggleDark={handleToggleDark}
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
          />

          <main className="layout__main">
            <Outlet />
          </main>
        </div>
      </div>

      {showLogoutPopup && (
        <div className="logout-overlay">
          <div className="logout-modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="logout-actions">
              <button className="cancel-btn" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="logout-btn" onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
