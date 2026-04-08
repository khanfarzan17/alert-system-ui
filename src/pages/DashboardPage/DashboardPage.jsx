import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "../../styles/Dashboard/DashboardPage.css";
import DatasetIcon from "@mui/icons-material/Dataset";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import MailLockRoundedIcon from "@mui/icons-material/MailLockRounded";
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
        (r) =>
          r["Days Remaining"] !== "N/A" &&
          Number(r["Days Remaining"]) >= 0 &&
          Number(r["Days Remaining"]) <= 50,
      ).length,
    [tableData],
  );

  const criticalCount = useMemo(
    () =>
      tableData.filter(
        (r) =>
          r["Days Remaining"] !== "N/A" && Number(r["Days Remaining"]) <= 10,
      ).length,
    [tableData],
  );

  const beyondFiftyCount = useMemo(
    () =>
      tableData.filter(
        (r) =>
          r["Days Remaining"] !== "N/A" && Number(r["Days Remaining"]) > 50,
      ).length,
    [tableData],
  );

  const warningCount = useMemo(
    () =>
      tableData.filter(
        (r) =>
          r["Days Remaining"] !== "N/A" &&
          Number(r["Days Remaining"]) > 10 &&
          Number(r["Days Remaining"]) <= 50,
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
            <div className="dash-card-icon blue">
              <DatasetIcon />
            </div>
          </div>
          <div className="dash-card-value blue">{total}</div>
          <div className="dash-card-footer"> Total Assests </div>
        </div>

        <div
          className="dash-card orange"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/alerts")}
        >
          <div className="dash-card-top">
            <span className="dash-card-label">Due {"\u2264"} 50 Days</span>
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
            <span className="dash-card-label">
              Critical ({"\u2264"}10 Days)
            </span>
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
              {" "}
              <MailLockRoundedIcon />
            </div>
          </div>
          <div className="dash-card-value green">{beyondFiftyCount}</div>
          <div className="dash-card-footer">Safe assets</div>
        </div>
      </div>

      {/* Bottom Row: Monitor Table + Coverage Card */}
      <div className="dash-bottom-row">
        {/* Asset Alert Monitor */}
        <div className="dash-monitor">
          <div className="dash-monitor-head">
            <h3>Asset Alert Monitor</h3>
            <button
              className="btn-view-all"
              onClick={() => navigate("/alerts")}
            >
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

        {/* Coverage Card */}
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
      {/* end dash-bottom-row */}
    </div>
  );
};

export default DashboardPage;
