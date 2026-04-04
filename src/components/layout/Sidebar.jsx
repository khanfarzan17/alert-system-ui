import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/sidebar/sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      section: "MAIN",
      items: [
        { name: "Dashboard", path: "/dashboard", badge: null },
        { name: "Upload", path: "/upload", badge: null },
      ],
    },
    {
      section: "MANAGEMENT",
      items: [
        { name: "Alerts", path: "/alerts", badge: "5", badgeType: "r" },
        { name: "Settings", path: "/settings", badge: null },
      ],
    },
  ];

  return (
    <div className="sidebar">
      {menuItems.map((group, index) => (
        <div className="sb-sect" key={index}>
          {/* Section Label */}
          <div className="sb-lbl">{group.section}</div>

          {/* Items */}
          {group.items.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`sb-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              {/* Icon (simple placeholder) */}
              <span>📁</span>

              {item.name}

              {/* Badge */}
              {item.badge && (
                <span className={`sb-badge ${item.badgeType}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
