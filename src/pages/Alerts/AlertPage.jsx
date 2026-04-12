import React, { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import "../../styles/Alerts/AlertPage.css";
import EmptyAlerts from "./EmptyAlert";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SkeletonLoader from "../../components/common/skeletonLoader";

const FILTERS = ["All", "Critical", "Warning"];

const AlertPage = () => {
  const reduxData = useSelector((state) => state.upload.tableData);
  const reduxColumns = useSelector((state) => state.upload.tableColumns);

  const [data, setData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");

  // 🔥 Fetch from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/assets")
      .then((res) => res.json())
      .then((res) => {
        console.log("Alerts API:", res);
        setData(res);
      })
      .catch((err) => console.log(err));
  }, []);

  // 🔥 Use DB data, fallback Redux
  const tableData = data.length > 0 ? data : reduxData || [];

  console.log("Table data in AlertPage:", tableData);

  // 🔥 Build alert data (FIXED KEYS)
  const alertData = useMemo(() => {
    if (!tableData || tableData.length === 0) return [];

    return tableData
      .filter((row) => row.daysRemaining !== null && row.daysRemaining <= 50)
      .map((row) => ({
        ...row,
        _severity: row.daysRemaining <= 10 ? "critical" : "warning",
      }));
  }, [tableData]);

  // Counts
  const criticalCount = alertData.filter(
    (r) => r._severity === "critical",
  ).length;

  const warningCount = alertData.filter(
    (r) => r._severity === "warning",
  ).length;

  const filterCounts = {
    All: alertData.length,
    Critical: criticalCount,
    Warning: warningCount,
  };

  // Filtered list
  const filteredData = useMemo(() => {
    if (activeFilter === "All") return alertData;
    return alertData.filter((r) => r._severity === activeFilter.toLowerCase());
  }, [alertData, activeFilter]);

  // Empty state
  // if (alertData.length === 0) {
  //   return (
  //     <div className="alert-page">
  //       <div className="alert-header">
  //         <h1>Alerts</h1>
  //         <p style={{ fontSize: 13, color: "var(--text3)", margin: 0 }}>
  //           Active alerts triggered by asset due dates
  //         </p>
  //       </div>
  //       <EmptyAlerts />
  //     </div>
  //   );
  // }

  if (alertData.length === 0) {
    return <SkeletonLoader />;
  }

  return (
    <div className="alert-page">
      {/* Header */}
      <div className="alert-header">
        <h1>Alerts</h1>

        <div className="alert-summary">
          <span className="dot"></span>
          {alertData.length} active
          <span className="sep">&middot;</span>
          {criticalCount} critical
          <span className="sep">&middot;</span>
          {warningCount} warning
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="alert-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`alert-filter-btn ${activeFilter === f ? "active" : ""}`}
            onClick={() => setActiveFilter(f)}
          >
            {f} ({filterCounts[f]})
          </button>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="alert-list">
        {filteredData.map((row, idx) => {
          const isCritical = row._severity === "critical";
          const days = row.daysRemaining;

          return (
            <div
              key={idx}
              className={`alert-card ${isCritical ? "critical" : "warning"}`}
            >
              {/* Icon */}
              <div
                className={`alert-icon ${isCritical ? "critical" : "warning"}`}
              >
                {isCritical ? (
                  <WarningAmberIcon />
                ) : (
                  <NotificationsActiveIcon />
                )}
              </div>

              {/* Content */}
              <div className="alert-content">
                <div className="alert-title">
                  {row.assetId && <>{row.assetId} &mdash; </>}
                  {days <= 0 ? (
                    <span style={{ color: "#ef4444" }}>
                      Overdue by {Math.abs(days)} days
                    </span>
                  ) : (
                    <span>{days} days remaining</span>
                  )}
                </div>

                <div className="alert-meta">
                  {row.owner && <>Owner: {row.owner}</>}
                  {row.owner && row.riskEngineer && (
                    <span className="sep">&middot;</span>
                  )}
                  {row.riskEngineer && <>Risk Eng: {row.riskEngineer}</>}
                </div>
              </div>

              {/* Right */}
              <div className="alert-right">
                <span className="alert-time">{dayjs().format("h:mm A")}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertPage;
