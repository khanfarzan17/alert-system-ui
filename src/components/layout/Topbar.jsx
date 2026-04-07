import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../../styles/topbar/topbar.css";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

const Topbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Upload", path: "/upload" },
    { name: "Alerts", path: "/alerts" },
    { name: "Assets", path: "/assets" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="topbar">
      {/* Logo */}
      <div className="logo">
        <div className="logo-mark">⚡</div>
        <div className="logo-text">
          Alert<span>IQ</span>
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
        {/* Theme Toggle */}
        {/* <button
          className="icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button> */}

        <Tooltip
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          <IconButton
            onClick={toggleTheme}
            style={{ color: theme === "light" ? "#333" : "#f1f5f9" }}
          >
            {theme === "light" ? (
              <DarkModeRoundedIcon />
            ) : (
              <LightModeRoundedIcon />
            )}
          </IconButton>
        </Tooltip>

        {/* Notification */}
        {/* <div className="icon-btn">
          🔔
          <span className="notif-dot"></span>
        </div> */}

        {/* Avatar */}
        <div className="avatar">FK</div>

        {/* Logout */}
        <button className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default Topbar;
