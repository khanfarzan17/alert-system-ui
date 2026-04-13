import React, { useEffect, useMemo, useState } from "react";
import "../../styles/users/user.css";
import SkeletonLoader from "../../components/common/skeletonLoader";

/* 🔥 Helpers */
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const getCardClass = (stats) => {
  // Normalize values to numbers to avoid string/null bugs
  const total = Number(stats?.total) || 0;
  const critical = Number(stats?.critical) || 0;
  const alerts = Number(stats?.alerts) || 0;
  // Debug: check what is coming in
  console.log("getCardClass stats:", stats, { total, critical, alerts });
  if (critical > 0) return "user-card critical";
  if (alerts > 0) return "user-card warning";
  if (total > 0) return "user-card safe";
  return "user-card default";
};

/* 🔥 CARD */
const UserCard = ({ name, role, email, stats }) => {
  return (
    <div className={getCardClass(stats)}>
      {/* TOP
      <div className="uc-top">
        <div className="uc-avatar">{getInitials(name)}</div>
        <div className="uc-role">{role}</div>
      </div> */}
      {/* NAME */}
      <div className="uc-name">{name}</div>
      {/* EMAIL */}
      {email && <div className="uc-email">{email}</div>}
      {/* STATS */}
      <div className="uc-stats">
        <div className="uc-stat">
          <span className="uc-val">{stats.total}</span>
          <span className="uc-lbl">Assets</span>
        </div>

        <div className="uc-stat">
          <span className="uc-val critical">{stats.critical}</span>
          <span className="uc-lbl">Critical</span>
        </div>

        <div className="uc-stat">
          <span className="uc-val alerts">{stats.alerts}</span>
          <span className="uc-lbl">Alerts</span>
        </div>
      </div>
    </div>
  );
};

/* 🔥 GRID */
const UserGrid = ({ users }) => (
  <div className="users-grid">
    {users.map((u) => (
      <UserCard key={u.name + u.role} {...u} />
    ))}
  </div>
);

/* 🔥 MAIN */
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
      {/* HEADER */}
      <div className="ph">
        <div>
          <div className="ph-title">Users & Stakeholders</div>
          <div className="ph-sub">Manage email mappings, roles and access</div>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader />
      ) : (
        <div className="user-sections">
          <div className="user-section">
            <div className="user-section-header">
              <h2>Asset Owners</h2>
              <span>{owners.length} users</span>
            </div>
            <UserGrid users={owners} />
          </div>

          <div className="user-section">
            <div className="user-section-header">
              <h2>Risk Engineers</h2>
              <span>{riskEngineers.length} users</span>
            </div>
            <UserGrid users={riskEngineers} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
