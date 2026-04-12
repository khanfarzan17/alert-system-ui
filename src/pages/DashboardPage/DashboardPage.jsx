import React, { useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "../../styles/Dashboard/DashboardPage.css";
import DatasetIcon from "@mui/icons-material/Dataset";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import MailLockRoundedIcon from "@mui/icons-material/MailLockRounded";
import CronSchedulerCard from "../../components/scheduler/CronSchedulerCard";
import NodataDashboard from "./NodataDashboard";
import SkeletonLoader from "../../components/common/skeletonLoader";

const getSeverity = (days) => {
  if (days <= 10) return "critical";
  if (days <= 50) return "warning";
  return "safe";
};

const DashboardPage = () => {
  const reduxData = useSelector((state) => state.upload.tableData);
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  // 🔥 Fetch from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/assets")
      .then((res) => res.json())
      .then((res) => {
        console.log("API DATA:", res);
        setData(res);
      })
      .catch((err) => console.log(err));
  }, []);

  // 🔥 Use DB data, fallback Redux
  const tableData = data.length > 0 ? data : reduxData || [];

  const total = tableData.length;

  const alertCount = useMemo(
    () =>
      tableData.filter(
        (r) =>
          r.daysRemaining !== null &&
          r.daysRemaining >= 0 &&
          r.daysRemaining <= 50,
      ).length,
    [tableData],
  );

  const criticalCount = useMemo(
    () =>
      tableData.filter((r) => r.daysRemaining !== null && r.daysRemaining <= 10)
        .length,
    [tableData],
  );

  const beyondFiftyCount = useMemo(
    () =>
      tableData.filter((r) => r.daysRemaining !== null && r.daysRemaining > 50)
        .length,
    [tableData],
  );

  const warningCount = useMemo(
    () =>
      tableData.filter(
        (r) =>
          r.daysRemaining !== null &&
          r.daysRemaining > 10 &&
          r.daysRemaining <= 50,
      ).length,
    [tableData],
  );

  // 🔥 Top 5 urgent rows
  const monitorRows = useMemo(() => {
    if (!tableData || tableData.length === 0) return [];

    return [...tableData]
      .filter((r) => r.daysRemaining !== null)
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
      .slice(0, 5)
      .map((row) => ({
        assetId: row.assetId || "N/A",
        owner: row.owner || "N/A",
        dueDate: row.dueDate || "N/A",
        days: row.daysRemaining,
        severity: getSeverity(row.daysRemaining),
      }));
  }, [tableData]);

  if (total === 0) {
    return <SkeletonLoader />;
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
            <div className="dash-card-icon blue">
              <DatasetIcon />
            </div>
          </div>
          <div className="dash-card-value blue">{total}</div>
          <div className="dash-card-footer"> Total Assets </div>
        </div>

        <div
          className="dash-card orange"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/alerts")}
        >
          <div className="dash-card-top">
            <span className="dash-card-label">Due ≤ 50 Days</span>
            <div className="dash-card-icon orange">
              <NotificationsActiveIcon />
            </div>
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
            <span className="dash-card-label">Critical (≤10 Days)</span>
            <div className="dash-card-icon red">
              <WarningAmberIcon />
            </div>
          </div>
          <div className="dash-card-value red">{criticalCount}</div>
          <div className="dash-card-footer">Immediate action</div>
        </div>

        <div className="dash-card green">
          <div className="dash-card-top">
            <span className="dash-card-label">Beyond 50 Days</span>
            <div className="dash-card-icon green">
              <MailLockRoundedIcon />
            </div>
          </div>
          <div className="dash-card-value green">{beyondFiftyCount}</div>
          <div className="dash-card-footer">Safe assets</div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="dash-bottom-row">
        {/* Monitor Table */}
        <div className="dash-monitor">
          <div className="dash-monitor-head">
            <h3>Asset Alert Monitor</h3>
            <button
              className="btn-view-all"
              onClick={() => navigate("/alerts")}
            >
              View All →
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
                    <td>{row.dueDate}</td>
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

        {/* Sidebar */}
        <div className="dash-sidebar">
          <CronSchedulerCard />

          <div className="dash-coverage">
            <h3 className="dash-coverage-title">Coverage</h3>

            <div className="dash-coverage-items">
              {[
                { label: "Critical", count: criticalCount, cls: "critical" },
                { label: "Warning", count: warningCount, cls: "warning" },
                { label: "On Track", count: beyondFiftyCount, cls: "safe" },
              ].map(({ label, count, cls }) => (
                <div className="dash-cov-item" key={cls}>
                  <div className="dash-cov-row">
                    <span className="dash-cov-label">{label}</span>
                    <span className={`dash-cov-count ${cls}`}>{count}</span>
                  </div>

                  <div className="dash-cov-bar">
                    <div
                      className={`dash-cov-bar-fill ${cls}`}
                      style={{
                        width:
                          total > 0
                            ? `${Math.round((count / total) * 100)}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
