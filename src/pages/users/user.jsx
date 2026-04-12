import React, { useEffect, useMemo, useState } from "react";
import "../../styles/users/user.css";
import { useTheme } from "../../components/context/ThemeContext";
import SkeletonLoader from "../../components/common/skeletonLoader";

// Helper
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// Avatar color generator
const getAvatarStyle = (name) => {
  const colors = [
    { bg: "#DBEAFE", text: "#1D4ED8" },
    { bg: "#EDE9FE", text: "#6D28D9" },
    { bg: "#D1FAE5", text: "#065F46" },
    { bg: "#FEF3C7", text: "#92400E" },
    { bg: "#FEE2E2", text: "#991B1B" },
  ];
  const index = name?.length % colors.length;
  return colors[index];
};
// 🔥 helper for card color type
const getCardClass = (stats) => {
  if (stats.critical > 0) return "user-big-card critical";
  if (stats.alerts > 0) return "user-big-card warning";
  if (stats.total > 0) return "user-big-card safe";
  return "user-big-card default";
};

// Card
const UserCard = ({ name, role, email, stats }) => {
  const avatar = getAvatarStyle(name);

  return (
    <div className={getCardClass(stats)}>
      <div
        className="ubig-av"
        style={{ background: avatar.bg, color: avatar.text }}
      >
        {getInitials(name)}
      </div>

      <div className="ubig-name">{name}</div>
      <div className="ubig-role">{role}</div>

      {email && <div className="ubig-email">{email}</div>}

      <div className="ubig-stats">
        <div className="ubig-stat">
          <div className="ubig-stat-val assets">{stats.total}</div>
          <div className="ubig-stat-lbl">Assets</div>
        </div>

        <div className="ubig-stat">
          <div className="ubig-stat-val critical">{stats.critical}</div>
          <div className="ubig-stat-lbl">Critical</div>
        </div>

        <div className="ubig-stat">
          <div className="ubig-stat-val alerts">{stats.alerts}</div>
          <div className="ubig-stat-lbl">Alerts</div>
        </div>
      </div>
    </div>
  );
};

// Grid
const UserGrid = ({ users }) => (
  <div className="users-grid">
    {users.map((u) => (
      <UserCard key={u.name + u.role} {...u} />
    ))}
  </div>
);

// Main Page
const UserPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/assets")
      .then((res) => res.json())
      .then((data) => {
        setAssets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Owners
  const owners = useMemo(() => {
    const map = {};

    assets.forEach((a) => {
      const key = a.owner || "Unknown";

      if (!map[key]) {
        map[key] = {
          name: key,
          role: "Asset Owner",
          email: "",
          stats: { total: 0, critical: 0, alerts: 0 },
        };
      }

      map[key].stats.total++;

      const n = Number(a.daysRemaining);
      if (!isNaN(n) && n <= 10) map[key].stats.critical++;
      if (!isNaN(n) && n <= 50) map[key].stats.alerts++;
    });

    return Object.values(map);
  }, [assets]);

  // Risk Engineers
  const riskEngineers = useMemo(() => {
    const map = {};

    assets.forEach((a) => {
      const key = a.riskEngineer || "Unknown";

      if (!map[key]) {
        map[key] = {
          name: key,
          role: "Risk Engineer",
          email: "",
          stats: { total: 0, critical: 0, alerts: 0 },
        };
      }

      map[key].stats.total++;

      const n = Number(a.daysRemaining);
      if (!isNaN(n) && n <= 10) map[key].stats.critical++;
      if (!isNaN(n) && n <= 50) map[key].stats.alerts++;
    });

    return Object.values(map);
  }, [assets]);

  return (
    <div className="page">
      {/* 🔥 Header */}
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">Users & Stakeholders</div>
          <div className="ph-sub">Manage email mappings, roles and access</div>
        </div>
      </div>

      {/* 🔥 Content */}
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div className="user-sections">
          {/* Owners */}
          <div className="user-section">
            <div className="user-section-header">
              <h2 className="user-section-title">Asset Owners</h2>
              <span className="user-section-count">{owners.length} users</span>
            </div>

            <UserGrid users={owners} />
          </div>

          {/* Risk Engineers */}
          <div className="user-section">
            <div className="user-section-header">
              <h2 className="user-section-title">Risk Engineers</h2>
              <span className="user-section-count">
                {riskEngineers.length} users
              </span>
            </div>
            <UserGrid users={riskEngineers} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
