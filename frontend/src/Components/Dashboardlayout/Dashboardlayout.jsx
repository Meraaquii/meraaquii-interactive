import { useState, useEffect, createContext, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import usePreventDashboardExit from "../../hooks/usePreventDashboardExit";
import "./DashboardLayout.css";

// Context for controlling layout-level states like sidebar blur
const LayoutContext = createContext(null);

export function useLayout() {
  return useContext(LayoutContext);
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return window.innerWidth > 768;
  });
  const [sidebarBlur, setSidebarBlur] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let prevIsMobile = window.innerWidth <= 768;

    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;

      if (isMobile !== prevIsMobile) {
        setSidebarOpen(!isMobile);
        prevIsMobile = isMobile;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleDark = () => {
    setDarkMode((prev) => {
      document.body.classList.toggle("dark", !prev);
      return !prev;
    });
  };

  usePreventDashboardExit(setShowLogoutPopup);

  const confirmLogout = () => {
    localStorage.clear();
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
    <LayoutContext.Provider value={{ setSidebarBlur }}>
      <div className={`layout${darkMode ? " dark-theme" : ""}`}>
        <div className="layout__inner">
          <Sidebar
            isVisible={sidebarOpen}
            onToggle={() => setSidebarOpen((v) => !v)}
            blur={sidebarBlur}
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
    </LayoutContext.Provider>
  );
}
