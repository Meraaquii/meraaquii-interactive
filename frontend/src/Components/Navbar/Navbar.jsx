import { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Menu,
  Maximize,
  Minimize,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import navbarController from "../../controllers/navbarController";

export default function Navbar({ onToggleSidebar, onToggleDark, darkMode }) {
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Read user display name from controller (sourced from localStorage)
  const username = navbarController.getUserDisplayName();

  const wrapRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleFullscreen = () => {
    navbarController.handleFullscreen(isFullscreen, setIsFullscreen);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    setDropdownOpen(false);

    await navbarController.handleLogout(
      () => {
        toast.success("Logged out successfully");
        navigate("/");
      },
      (message) => {
        setLoggingOut(false);
        toast.error(message || "Logout failed");
      },
    );
  };

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button
          className="navbar__hamburger"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="navbar__right">
        {/* Fullscreen toggle */}
        <button
          className="navbar__icon-btn"
          aria-label="Fullscreen"
          onClick={handleFullscreen}
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>

        {/* Dark mode toggle */}
        <button
          className="navbar__icon-btn"
          onClick={onToggleDark}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Profile dropdown */}
        <div className="navbar__profile-wrap" ref={wrapRef}>
          <button
            className="navbar__profile-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="navbar__avatar">
              <User size={16} />
            </div>
            {/* Username comes from controller → service → localStorage */}
            <span className="navbar__username">{username}</span>
          </button>

          <div
            className={`navbar__dropdown navbar__dropdown--${
              dropdownOpen ? "visible" : "hidden"
            }`}
          >
            <button className="navbar__dropdown-item">
              <User size={15} />
              My Profile
            </button>
            <button className="navbar__dropdown-item">
              <Settings size={15} />
              Settings
            </button>
            <div className="navbar__dropdown-divider" />
            <button
              className="navbar__dropdown-item navbar__dropdown-item--logout"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <LogOut size={15} />
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
