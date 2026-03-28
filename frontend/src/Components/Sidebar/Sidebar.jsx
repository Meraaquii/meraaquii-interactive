import React, { useState, useEffect } from "react";
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
    // {
    //   id: "project-filter",
    //   name: "Project Filter",
    //   icon: <LuFilter className="nav-icons" />,
    //   path: "/salesman/dashboard/project-filter",
    //   type: "link",
    // },
  ],
};

const Sidebar = ({ isVisible, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Track mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  const handleNavigation = (path) => {
    navigate(path);
    // Close sidebar on mobile after navigation
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
      {/* Overlay — mobile only, shown when sidebar is open */}
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

            {/* Close button — mobile only */}
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
                  <div
                    className={`menu-item ${
                      isItemActive(item.path) ? "menu-item-active" : ""
                    } ${hoveredItem === item.id ? "menu-item-hover" : ""}`}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    title={!isExpanded ? item.name : ""}
                  >
                    <div className="menu-item-content">
                      {item.icon}
                      <span className="menu-text">{item.name}</span>
                    </div>
                    {isItemActive(item.path) && (
                      <div className="active-indicator" />
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      className={`menu-item ${
                        isItemActive(item.path) ? "menu-item-active" : ""
                      } ${hoveredItem === item.id ? "menu-item-hover" : ""}`}
                      onClick={() => handleItemClick(item)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      title={!isExpanded ? item.name : ""}
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
                        {isItemActive(item.path) && (
                          <div className="active-indicator" />
                        )}
                        <RiArrowDropDownLine
                          className={`dropdown-arrow ${
                            activeSection === item.id ? "rotated" : ""
                          }`}
                        />
                      </div>
                    </div>

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
                  </>
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
