import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdChevronRight, MdOutlinePerson } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { LuLayoutList, LuFilter } from "react-icons/lu";
import { LuDownload } from "react-icons/lu";
import meraaquii from "../../assets/Logo.png";
import smallLogo from "../../../public/fav-icon.jpg";
import "./Sidebar.css";

const Sidebar = ({ isVisible, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(isVisible);
  }, [isVisible]);

  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) onToggle();
  };

  const handleItemClick = (item) => {
    if (item.type === "link") {
      handleNavigation(item.path);
    } else {
      toggleSection(item.id);
    }
  };

  const handleSubItemClick = (subItemPath) => {
    handleNavigation(subItemPath);
  };

  const isItemActive = (path) => location.pathname === path;
  const isSubItemActive = (path) => location.pathname === path;

  const menuItems = [
    {
      id: "salesman-list",
      name: "Salesman List",
      icon: <MdOutlinePerson className="nav-icons" />,
      path: "/dashboard/salesman-list",
      type: "link",
    },
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
      id: "client-list",
      name: "Client List",
      icon: <MdOutlinePerson className="nav-icons" />,
      path: "/dashboard/client-list",
      type: "link",
    },
  ];

  const sidebarClass = [
    "sidebar",
    isExpanded ? "sidebar-expanded" : "sidebar-collapsed",
    "sidebar-visible",
  ]
    .join(" ")
    .trim();

  return (
    <>
      {isVisible && window.innerWidth <= 768 && (
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
                          onClick={() => handleSubItemClick(subItem.path)}
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
