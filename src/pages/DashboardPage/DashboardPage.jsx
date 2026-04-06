import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "../../styles/Dashboard/DashboardPage.css";

const findKey = (keys, match) =>
  keys.find((k) => k.toLowerCase().replace(/\s/g, "").includes(match));

const getSeverity = (days) => {
  if (days <= 10) return "critical";
  if (days <= 50) return "warning";
  return "safe";
};

const DashboardPage = () => {
  const { tableData, tableColumns } = useSelector((state) => state.upload);
  const navigate = useNavigate();

  const total = tableData.length;

  const alertCount = useMemo(
    () =>
      tableData.filter(
        (r) => r["Days Remaining"] !== "N/A" && r["Days Remaining"] <= 50,
      ).length,
    [tableData],
  );

  const criticalCount = useMemo(
    () =>
      tableData.filter(
        (r) => r["Days Remaining"] !== "N/A" && r["Days Remaining"] <= 10,
      ).length,
    [tableData],
  );

  // Column key discovery
  const colKeys = useMemo(() => {
    if (tableColumns.length === 0) return {};
    const keys = tableColumns.map((c) => c.id);
    return {
      assetId: findKey(keys, "assetid") || findKey(keys, "asset") || keys[0],
      owner: findKey(keys, "owner"),
      dueDate: findKey(keys, "duedate"),
    };
  }, [tableColumns]);

  // Top 5 urgent rows for monitor table
  const monitorRows = useMemo(() => {
    if (!tableData || tableData.length === 0) return [];
    return [...tableData]
      .filter((r) => r["Days Remaining"] !== "N/A")
      .sort((a, b) => a["Days Remaining"] - b["Days Remaining"])
      .slice(0, 5)
      .map((row) => ({
        assetId: colKeys.assetId ? row[colKeys.assetId] : "N/A",
        owner: colKeys.owner ? row[colKeys.owner] : "N/A",
        dueDate: colKeys.dueDate ? row[colKeys.dueDate] : "N/A",
        days: row["Days Remaining"],
        severity: getSeverity(row["Days Remaining"]),
      }));
  }, [tableData, colKeys]);

  if (total === 0) {
    return (
      <div className="dashboard-page">
        <div className="dash-empty">
          <div className="dash-empty-icon">{"\uD83D\uDCCA"}</div>
          <h2>No Data Yet</h2>
          <p>Upload an asset file to see your dashboard summary.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dash-header">
        <h1>Dashboard</h1>
        <div className="dash-sub">
          <span className="dot"></span>
          Live <span className="sep">&middot;</span>
          {total} assets <span className="sep">&middot;</span>
          Last sync {dayjs().format("h:mm A")}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="dash-cards">
        <div className="dash-card blue">
          <div className="dash-card-top">
            <span className="dash-card-label">Total Assets</span>
            <div className="dash-card-icon blue">{"\uD83D\uDCE6"}</div>
          </div>
          <div className="dash-card-value blue">{total}</div>
          <div className="dash-card-footer">
            <span className="blue">+{total}</span> from last upload
          </div>
        </div>

        <div
          className="dash-card orange"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/alerts")}
        >
          <div className="dash-card-top">
            <span className="dash-card-label">Due {"\u2264"} 50 Days</span>
            <div className="dash-card-icon orange">{"\uD83D\uDD14"}</div>
          </div>
          <div className="dash-card-value orange">{alertCount}</div>
          <div className="dash-card-footer">Alerts triggered</div>
        </div>

        <div
          className="dash-card red"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/alerts")}
        >
          <div className="dash-card-top">
            <span className="dash-card-label">
              Critical ({"\u2264"}10 Days)
            </span>
            <div className="dash-card-icon red">{"\u26A0\uFE0F"}</div>
          </div>
          <div className="dash-card-value red">{criticalCount}</div>
          <div className="dash-card-footer">Immediate action</div>
        </div>
      </div>

      {/* Asset Alert Monitor */}
      <div className="dash-monitor">
        <div className="dash-monitor-head">
          <h3>Asset Alert Monitor</h3>
          <button className="btn-view-all" onClick={() => navigate("/alerts")}>
            View All &rarr;
          </button>
        </div>
        <table className="monitor-table">
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Owner</th>
              <th>Due Date</th>
              <th>Days Left</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {monitorRows.map((row, idx) => {
              const barPercent = Math.max(
                0,
                Math.min(100, (row.days / 50) * 100),
              );
              const statusLabel =
                row.severity === "critical"
                  ? "Critical"
                  : row.severity === "warning"
                    ? "Warning"
                    : "On Track";
              return (
                <tr key={idx}>
                  <td>
                    <span className={`asset-id ${row.severity}`}>
                      {row.assetId}
                    </span>
                  </td>
                  <td>{row.owner}</td>
                  <td
                    style={{
                      fontFamily: "'SF Mono','Consolas',monospace",
                      fontSize: 12.5,
                    }}
                  >
                    {row.dueDate}
                  </td>
                  <td>
                    <div className="days-left-cell">
                      <span className={`days-num ${row.severity}`}>
                        {row.days}d
                      </span>
                      <div className="days-bar">
                        <div
                          className={`days-bar-fill ${row.severity}`}
                          style={{ width: `${barPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${row.severity}`}>
                      <span className="dot"></span>
                      {statusLabel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
