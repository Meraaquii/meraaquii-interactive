import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleToggleDark = () => {
    setDarkMode((prev) => {
      document.body.classList.toggle("dark", !prev);
      return !prev;
    });
  };

  return (
    <div className={`layout${darkMode ? " dark-theme" : ""}`}>
      <div className="layout__inner">
        {/* Sidebar */}
        <Sidebar
          isVisible={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
        />

        {/* Right side — flex item, naturally pushes with sidebar */}
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
    </div>
  );
}
