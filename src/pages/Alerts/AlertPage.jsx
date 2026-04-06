import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import "../../styles/Alerts/AlertPage.css";
import EmptyAlerts from "./EmptyAlert";

// Helper: find column key case/space insensitively
const findKey = (keys, match) =>
  keys.find((k) => k.toLowerCase().replace(/\s/g, "").includes(match));

const FILTERS = ["All", "Critical", "Warning"];

const AlertPage = () => {
  const { tableData, tableColumns } = useSelector((state) => state.upload);
  console.log("Table data in AlertPage:", tableData);
  const [activeFilter, setActiveFilter] = useState("All");

  // Build alert data with severity
  const alertData = useMemo(() => {
    if (!tableData || tableData.length === 0) return [];
    return tableData
      .filter(
        (row) => row["Days Remaining"] !== "N/A" && row["Days Remaining"] <= 50,
      )
      .map((row) => {
        const days = row["Days Remaining"];
        return {
          ...row,
          _severity: days <= 10 ? "critical" : "warning",
        };
      });
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

  // Dynamically find column keys
  const colKeys = useMemo(() => {
    if (tableColumns.length === 0) return {};
    const keys = tableColumns.map((c) => c.id);
    return {
      assetId: findKey(keys, "assetid") || findKey(keys, "asset") || keys[0],
      assetName: findKey(keys, "assetname") || findKey(keys, "name") || keys[1],
      owner: findKey(keys, "owner"),
      riskEngineer: findKey(keys, "riskengineer"),
      email: findKey(keys, "email"),
    };
  }, [tableColumns]);

  if (alertData.length === 0) {
    return <EmptyAlerts />;
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
          const days = row["Days Remaining"];
          const assetId = colKeys.assetId ? row[colKeys.assetId] : "";
          const assetName = colKeys.assetName ? row[colKeys.assetName] : "";
          const owner = colKeys.owner ? row[colKeys.owner] : "";
          const riskEng = colKeys.riskEngineer ? row[colKeys.riskEngineer] : "";
          const email = colKeys.email ? row[colKeys.email] : "";

          return (
            <div
              key={idx}
              className={`alert-card ${isCritical ? "critical" : "warning"}`}
            >
              {/* Icon */}
              <div
                className={`alert-icon ${isCritical ? "critical" : "warning"}`}
              >
                {isCritical ? "\u26A0" : "\uD83D\uDD14"}
              </div>

              {/* Content */}
              <div className="alert-content">
                <div className="alert-title">
                  {assetId && <>{assetId} &mdash; </>}
                  {days <= 0 ? (
                    <span style={{ color: "#ef4444" }}>
                      Overdue by {Math.abs(days)} days
                    </span>
                  ) : (
                    <span>{days} days remaining</span>
                  )}
                </div>
                <div className="alert-meta">
                  {owner && <>Owner: {owner}</>}
                  {owner && riskEng && <span className="sep">&middot;</span>}
                  {riskEng && <>Risk Eng: {riskEng}</>}
                </div>
              </div>

              {/* Right */}
              <div className="alert-right">
                <span className="alert-time">{dayjs().format("h:mm A")}</span>
                {/* <div className="alert-actions">
                  <button className="btn-acknowledge">Acknowledge</button>
                  <button className="btn-snooze">Snooze</button>
                </div> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertPage;
