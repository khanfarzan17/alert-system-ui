import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/Authcontext";
import "../../styles/topbar/topbar.css";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const displayName = user?.name || user?.email || "User";

  console.log("user name", displayName);

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Upload", path: "/upload" },

    { name: "Alerts", path: "/alerts" },
    { name: "Assets", path: "/assets" },
    { name: "Scheduler", path: "/scheduler" },
    { name: "Reports", path: "/reports" },
    { name: "Users", path: "/users" },
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

        {/* Avatar with initials */}
        <Tooltip title={displayName}>
          <div className="avatar">{initials}</div>
        </Tooltip>

        {/* Logout */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
