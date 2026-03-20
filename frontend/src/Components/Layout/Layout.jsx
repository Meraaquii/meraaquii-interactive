import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import "./Layout.css";

const Layout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);
  const toggleDark = () => setDarkMode((prev) => !prev);

  return (
    <div className={`admin-panel${darkMode ? " dark-theme" : ""}`}>
      <Sidebar isVisible={sidebarVisible} onToggle={toggleSidebar} />
      <div className={`main-content${sidebarVisible ? " sidebar-open" : ""}`}>
        <Navbar
          onToggleSidebar={toggleSidebar}
          onToggleDark={toggleDark}
          darkMode={darkMode}
        />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
