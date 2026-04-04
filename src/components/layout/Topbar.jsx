import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/topbar/topbar.css";

const Topbar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Upload", path: "/upload" },
    { name: "Alerts", path: "/alerts" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="topbar">
      {/* Logo */}
      <div className="logo">
        <div className="logo-mark">⚡</div>
        <div className="logo-text">
          Alert<span>System</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="top-nav">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={location.pathname === item.path ? "active" : ""}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Right Section */}
      <div className="top-right">
        {/* Notification */}
        <div className="icon-btn">
          🔔
          <span className="notif-dot"></span>
        </div>

        {/* Avatar */}
        <div className="avatar">FK</div>

        {/* Logout */}
        <button className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default Topbar;
