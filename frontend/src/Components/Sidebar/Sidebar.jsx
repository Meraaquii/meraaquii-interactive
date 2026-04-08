import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { MdChevronRight, MdOutlinePerson } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { LuLayoutList, LuFilter } from "react-icons/lu";
import { LuDownload } from "react-icons/lu";
import meraaquii from "../../assets/Logo.png";
import smallLogo from "../../../public/fav-icon.jpg";
import "./Sidebar.css";

const MENU_CONFIG = {
  A: [
    {
      id: "device-list",
      name: "Device List",
      icon: <LuLayoutList className="nav-icons" />,
      path: "/admin/dashboard/device-list",
      type: "link",
    },
    {
      id: "project-list",
      name: "Project List",
      icon: <LuFilter className="nav-icons" />,
      path: "/admin/dashboard/project-list",
      type: "link",
    },
    {
      id: "client-list",
      name: "Client List",
      icon: <MdOutlinePerson className="nav-icons" />,
      path: "/admin/dashboard/client-list",
      type: "link",
    },
  ],

  C: [
    {
      id: "device-list",
      name: "Device List",
      icon: <LuLayoutList className="nav-icons" />,
      path: "/dashboard/device-list",
      type: "link",
    },
    {
      id: "project-filter",
      name: "Project Filter",
      icon: <LuFilter className="nav-icons" />,
      path: "/dashboard/project-filter",
      type: "link",
    },
    {
      id: "salesman-list",
      name: "Salesman List",
      icon: <MdOutlinePerson className="nav-icons" />,
      path: "/dashboard/salesman-list",
      type: "link",
    },
  ],

  CU: [
    {
      id: "device-list",
      name: "Device List",
      icon: <LuLayoutList className="nav-icons" />,
      path: "/customer/dashboard/device-list",
      type: "link",
    },
    {
      id: "project-filter",
      name: "Project Filter",
      icon: <LuFilter className="nav-icons" />,
      path: "/customer/dashboard/project-filter",
      type: "link",
    },
  ],

  S: [
    {
      id: "customer-list",
      name: "Customer List",
      icon: <MdOutlinePerson className="nav-icons" />,
      path: "/salesman/dashboard/customer-list",
      type: "link",
    },
    {
      id: "project-filter",
      name: "Project Filter",
      icon: <LuFilter className="nav-icons" />,
      path: "/salesman/dashboard/project-filter",
      type: "link",
    },
  ],
};

const Tooltip = ({ text, targetRef, visible }) => {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (visible && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setPos({
        top: rect.top + rect.height / 2,
        left: rect.right + 10,
      });
    }
  }, [visible, targetRef]);

  if (!visible || !text) return null;

  return createPortal(
    <div className="sidebar-tooltip" style={{ top: pos.top, left: pos.left }}>
      {text}
    </div>,
    document.body,
  );
};

const MenuItem = ({ item, isActive, isExpanded, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      className={`menu-item ${isActive ? "menu-item-active" : ""} ${
        hovered ? "menu-item-hover" : ""
      }`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="menu-item-content">
        {item.icon}
        <span className="menu-text">{item.name}</span>
      </div>
      {isActive && <div className="active-indicator" />}

      <Tooltip
        //text={item.name}
        targetRef={ref}
        visible={!isExpanded && hovered}
      />
    </div>
  );
};

const DropdownMenuItem = ({
  item,
  isActive,
  isExpanded,
  isOpen,
  onClick,
  children,
}) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  return (
    <>
      <div
        ref={ref}
        className={`menu-item ${isActive ? "menu-item-active" : ""} ${
          hovered ? "menu-item-hover" : ""
        }`}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="menu-item-content">
          {item.icon}
          <span className="menu-text">{item.name}</span>
        </div>

        <div className="table-card__toolbar">
          <button className="export-btn" title="Export">
            <LuDownload size={15} />
          </button>
        </div>

        <div className="menu-item-actions">
          {isActive && <div className="active-indicator" />}
          <RiArrowDropDownLine
            className={`dropdown-arrow ${isOpen ? "rotated" : ""}`}
          />
        </div>

        <Tooltip
          text={item.name}
          targetRef={ref}
          visible={!isExpanded && hovered}
        />
      </div>

      {children}
    </>
  );
};

const Sidebar = ({ isVisible, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSection = (section) =>
    setActiveSection((prev) => (prev === section ? null : section));

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) onToggle();
  };

  const handleItemClick = (item) => {
    if (item.type === "link") {
      handleNavigation(item.path);
    } else {
      toggleSection(item.id);
    }
  };

  const isItemActive = (path) => location.pathname === path;
  const isSubItemActive = (path) => location.pathname === path;

  const userType = localStorage.getItem("user_type") ?? "C";
  const menuItems = MENU_CONFIG[userType] ?? MENU_CONFIG["C"];

  const sidebarClass = [
    "sidebar",
    isMobile
      ? isVisible
        ? "sidebar-mobile-open"
        : ""
      : isVisible
        ? "sidebar-expanded"
        : "sidebar-collapsed",
  ]
    .filter(Boolean)
    .join(" ");

  const isExpanded = isMobile ? true : isVisible;

  return (
    <>
      {isMobile && isVisible && (
        <div className="sidebar-overlay" onClick={onToggle} />
      )}

      <nav className={sidebarClass}>
        <div className="sidebar-content">
          {/* Header */}
          <div className="sidebar-header">
            <div className="logo-container">
              <img src={meraaquii} alt="Meraaquii Logo" className="logo" />
              <div className="logo-small">
                <img src={smallLogo} alt="Meraaquii" />
              </div>
            </div>
            <button className="close-button" onClick={onToggle}>
              ✕
            </button>
          </div>

          {/* Menu */}
          <div className="sidebar-menu">
            {menuItems.map((item, index) => (
              <div
                className="menu-section"
                key={item.id}
                style={{ "--item-index": index }}
              >
                {item.type === "link" ? (
                  <MenuItem
                    item={item}
                    isActive={isItemActive(item.path)}
                    isExpanded={isExpanded}
                    onClick={() => handleItemClick(item)}
                  />
                ) : (
                  <DropdownMenuItem
                    item={item}
                    isActive={isItemActive(item.path)}
                    isExpanded={isExpanded}
                    isOpen={activeSection === item.id}
                    onClick={() => handleItemClick(item)}
                  >
                    <div
                      className={`submenu ${
                        activeSection === item.id && isExpanded
                          ? "submenu-open"
                          : ""
                      }`}
                    >
                      {(item.subItems || []).map((subItem, subIndex) => (
                        <div
                          key={subIndex}
                          className={`submenu-item ${
                            isSubItemActive(subItem.path)
                              ? "submenu-item-active"
                              : ""
                          }`}
                          style={{ "--sub-index": subIndex }}
                          onClick={() => handleNavigation(subItem.path)}
                        >
                          <MdChevronRight className="submenu-arrow" />
                          <span className="submenu-text">{subItem.name}</span>
                        </div>
                      ))}
                    </div>
                  </DropdownMenuItem>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
