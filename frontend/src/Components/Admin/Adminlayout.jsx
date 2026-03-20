// Components/Admin/AdminLayout.jsx

import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Users,
  FolderOpen,
  Monitor,
  UserCheck,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Sun,
  Moon,
  User,
  Settings,
  Maximize,
  Minimize,
} from "lucide-react";
import "./AdminLayout.css";
import navbarController from "../../controllers/navbarController";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Client List", path: "/admin/dashboard/client-list", icon: Users },
  {
    label: "Project List",
    path: "/admin/dashboard/project-list",
    icon: FolderOpen,
  },
  { label: "Device List", path: "/admin/dashboard/device-list", icon: Monitor },
  {
    label: "Salesman List",
    path: "/admin/dashboard/salesman-list",
    icon: UserCheck,
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const username = navbarController.getUserDisplayName();

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await navbarController.handleLogout(
      () => {
        toast.success("Logged out");
        navigate("/");
      },
      (msg) => toast.error(msg),
    );
  };

  return (
    <div className={`admin-root ${darkMode ? "dark" : ""}`}>
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className={`admin-sidebar ${collapsed ? "admin-sidebar--collapsed" : ""}`}
      >
        <div className="admin-sidebar__header">
          {!collapsed && (
            <span className="admin-sidebar__menu-label">MENU</span>
          )}
          <button
            className="admin-sidebar__collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/admin/dashboard"}
              className={({ isActive }) =>
                `admin-sidebar__item ${isActive ? "admin-sidebar__item--active" : ""}`
              }
            >
              <Icon size={18} className="admin-sidebar__icon" />
              {!collapsed && (
                <span className="admin-sidebar__label">{label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout at bottom of sidebar */}
        <button className="admin-sidebar__logout" onClick={handleLogout}>
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* ── Main area ───────────────────────────────────────────── */}
      <div className="admin-main">
        {/* Navbar */}
        <header className="admin-navbar">
          <div className="admin-navbar__left">
            <button
              className="admin-navbar__icon-btn"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="admin-navbar__right">
            <button
              className="admin-navbar__icon-btn"
              onClick={handleFullscreen}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
            <button
              className="admin-navbar__icon-btn"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="admin-navbar__profile-wrap">
              <button
                className="admin-navbar__profile-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="admin-navbar__avatar">
                  <User size={15} />
                </div>
                <span className="admin-navbar__username">{username}</span>
              </button>

              {dropdownOpen && (
                <div className="admin-navbar__dropdown">
                  <button className="admin-navbar__dropdown-item">
                    <User size={14} /> My Profile
                  </button>
                  <button className="admin-navbar__dropdown-item">
                    <Settings size={14} /> Settings
                  </button>
                  <div className="admin-navbar__divider" />
                  <button
                    className="admin-navbar__dropdown-item admin-navbar__dropdown-item--logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
