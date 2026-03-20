import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdTask,
  MdFolder,
  MdChevronRight,
  MdOutlinePerson,
} from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { RiArrowDropDownLine } from "react-icons/ri";
import { LuLayoutList, LuFilter } from "react-icons/lu";
import meraaquii from "../../assets/Logo.png";
import smallLogo from "../../assets/small_logo.png";
import "./Sidebar.css";

const Sidebar = ({ isVisible, onToggle }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [lastClickedItem, setLastClickedItem] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(isVisible);
  }, [isVisible]);

  const toggleSection = (section, itemId) => {
    setActiveSection((prev) => (prev === section ? null : section));
    setLastClickedItem(itemId);
  };

  const isItemActive = (itemId) => lastClickedItem === itemId;
  const isSubItemActive = (subItemPath) => lastClickedItem === subItemPath;

  const handleNavigation = (path, itemId = null) => {
    setLastClickedItem(itemId || path);
    navigate(path);
    if (window.innerWidth <= 768) onToggle();
  };

  const handleItemClick = (item) => {
    if (item.type === "link") {
      handleNavigation(item.path, item.id);
    } else {
      toggleSection(item.id, item.id);
    }
  };

  const handleSubItemClick = (subItemPath, parentItem) => {
    setLastClickedItem(parentItem.id);
    handleNavigation(subItemPath);
  };

  const menuItems = [
    {
      id: "device-list",
      name: "Device List",
      icon: <LuLayoutList className="nav-icons" />,
      path: "/dashboard/device-list",
      type: "link",
    },
    {
      id: "customer-list",
      name: "Customer List",
      icon: <GoPeople className="nav-icons" />,
      path: "/dashboard/customer-list",
      type: "link",
    },
    {
      id: "salesman-list",
      name: "Salesman List",
      icon: <MdOutlinePerson className="nav-icons" />,
      path: "/dashboard/salesman-list",
      type: "link",
    },
    {
      id: "project-filter",
      name: "Project Filter",
      icon: <LuFilter className="nav-icons" />,
      path: "/dashboard/project-filter",
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
                    className={`menu-item ${isItemActive(item.id) ? "menu-item-active" : ""} ${hoveredItem === item.id ? "menu-item-hover" : ""}`}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    title={!isExpanded ? item.name : ""}
                  >
                    <div className="menu-item-content">
                      {item.icon}
                      <span className="menu-text">{item.name}</span>
                    </div>
                    {isItemActive(item.id) && (
                      <div className="active-indicator" />
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      className={`menu-item ${isItemActive(item.id) ? "menu-item-active" : ""} ${hoveredItem === item.id ? "menu-item-hover" : ""}`}
                      onClick={() => handleItemClick(item)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      title={!isExpanded ? item.name : ""}
                    >
                      <div className="menu-item-content">
                        {item.icon}
                        <span className="menu-text">{item.name}</span>
                      </div>
                      <div className="menu-item-actions">
                        {isItemActive(item.id) && (
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
                          onClick={() => handleSubItemClick(subItem.path, item)}
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
