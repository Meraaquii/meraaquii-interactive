import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import usePreventDashboardExit from "../../hooks/usePreventDashboardExit";
import "./DashboardLayout.css";

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

  // Use refined hook
  usePreventDashboardExit(setShowLogoutPopup);

  const confirmLogout = () => {
    localStorage.clear();
    setShowLogoutPopup(false);
    navigate("/", { replace: true });
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

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

      {/* Logout Popup */}
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
