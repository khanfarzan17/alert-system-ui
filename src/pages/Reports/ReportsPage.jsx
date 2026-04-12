import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import "../../styles/Reports/ReportsPage.css";
import EmptyReportPage from "./EmptyReportPage";
import { Loader } from "lucide-react";
import SkeletonLoader from "../../components/common/skeletonLoader";

const findKey = (keys, match) =>
  keys.find((k) => k.toLowerCase().replace(/\s/g, "").includes(match));

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rp-tooltip">
      {label && <p className="rp-tooltip-label">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill || p.color || p.stroke }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ─── Custom Donut Label ────────────────────────────────────────────────────────
const RADIAN = Math.PI / 180;
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (percent < 0.04) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ─── Card Head Helper ─────────────────────────────────────────────────────────
const CardHead = ({ title, sub, dotColor, badge }) => (
  <>
    <div className="rp-card-head">
      <span
        className="rp-card-dot"
        style={{ background: dotColor || "var(--accent)" }}
      />
      {title}
      {badge != null && <span className="rp-card-badge">{badge}</span>}
    </div>
    <p className="rp-card-sub">{sub}</p>
  </>
);

// ─── ReportsPage ───────────────────────────────────────────────────────────────

const ReportsPage = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/assets")
      .then((res) => res.json())
      .then((res) => {
        const finalData = Array.isArray(res) ? res : [];

        setData(finalData);

        // ✅ column mapping from backend keys
        if (finalData.length > 0) {
          const cols = Object.keys(finalData[0]).map((key) => ({
            id: key,
          }));
          setColumns(cols);
        }

        setLoading(false); // ✅ VERY IMPORTANT
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  // Define tableData before using it
  const tableData = data;

  const uploadHistory = useMemo(() => {
    const map = {};

    tableData.forEach((r) => {
      const key = r.fileName || "Unknown File";

      if (!map[key]) {
        map[key] = {
          fileName: r.fileName,
          uploadedAt: r.uploadedAt,
          rowCount: 0,
        };
      }

      map[key].rowCount++;
    });

    return Object.values(map);
  }, [tableData]);

  // Column key discovery
  const colKeys = useMemo(() => {
    return {
      owner: "owner",
      riskEngineer: "riskEngineer",
      dueDate: "dueDate",
    };
  }, []);
  // ── Summary stats ──────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    let overdue = 0,
      critical = 0,
      warning = 0,
      safe = 0;
    tableData.forEach((r) => {
      const n = Number(r.daysRemaining);
      if (isNaN(n)) return;
      if (n <= 0) overdue++;
      else if (n <= 10) critical++;
      else if (n <= 50) warning++;
      else safe++;
    });
    return { overdue, critical, warning, safe, total: tableData.length };
  }, [tableData]);

  const pct = (n) =>
    stats.total > 0 ? `${((n / stats.total) * 100).toFixed(0)}%` : "—";

  // ── Chart 1: Risk Distribution Donut ──────────────────────────────────────
  const riskDonutData = useMemo(() => {
    const entries = [
      { name: "Overdue", value: stats.overdue, color: "#dc2626" },
      { name: "Critical (1–10d)", value: stats.critical, color: "#ef4444" },
      { name: "Warning (11–50d)", value: stats.warning, color: "#f97316" },
      { name: "Safe (>50d)", value: stats.safe, color: "#22c55e" },
    ];
    return entries.filter((e) => e.value > 0);
  }, [stats]);

  // ── Chart 2: Days Remaining Histogram ─────────────────────────────────────
  const histogramData = useMemo(() => {
    const buckets = [
      { name: "Overdue", min: -Infinity, max: 0, color: "#dc2626", count: 0 },
      { name: "1–10", min: 1, max: 10, color: "#ef4444", count: 0 },
      { name: "11–20", min: 11, max: 20, color: "#f97316", count: 0 },
      { name: "21–30", min: 21, max: 30, color: "#f59e0b", count: 0 },
      { name: "31–50", min: 31, max: 50, color: "#eab308", count: 0 },
      { name: "51–90", min: 51, max: 90, color: "#84cc16", count: 0 },
      { name: ">90", min: 91, max: Infinity, color: "#22c55e", count: 0 },
    ];
    tableData.forEach((r) => {
      const n = Number(r.daysRemaining);
      if (isNaN(n)) return;
      for (const b of buckets) {
        if (n >= b.min && n <= b.max) {
          b.count++;
          break;
        }
      }
    });
    return buckets.filter((b) => b.count > 0);
  }, [tableData]);

  // ── Chart 3: Assets by Owner (stacked bar) ────────────────────────────────
  const ownerData = useMemo(() => {
    const map = {};
    tableData.forEach((r) => {
      const owner = r[colKeys.owner] || "Unknown";
      if (!map[owner])
        map[owner] = { owner, critical: 0, warning: 0, safe: 0, overdue: 0 };
      const n = Number(r.daysRemaining);
      if (isNaN(n)) return;
      if (n <= 0) map[owner].overdue++;
      else if (n <= 10) map[owner].critical++;
      else if (n <= 50) map[owner].warning++;
      else map[owner].safe++;
    });
    return Object.values(map).slice(0, 10);
  }, [tableData, colKeys]);

  // ── Chart 4: Assets by Risk Engineer ─────────────────────────────────────
  const riskEngineerData = useMemo(() => {
    const map = {};
    tableData.forEach((r) => {
      const re = r[colKeys.riskEngineer] || "Unknown";
      if (!map[re]) map[re] = { name: re, total: 0, alertable: 0 };
      map[re].total++;
      const n = Number(r.daysRemaining);
      if (!isNaN(n) && n <= 50) map[re].alertable++;
    });
    return Object.values(map).slice(0, 8);
  }, [tableData, colKeys]);

  // ── Chart 5: Monthly Due Assets (Area) ────────────────────────────────────
  const monthlyDueData = useMemo(() => {
    const map = {};
    tableData.forEach((r) => {
      const raw = r[colKeys.dueDate];
      if (!raw) return;
      const d = new Date(raw);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!map[key]) map[key] = { month: key, assets: 0 };
      map[key].assets++;
    });
    return Object.values(map);
  }, [tableData, colKeys]);

  // ── Alert Eligibility ─────────────────────────────────────────────────────
  const alertEligData = useMemo(() => {
    const alerted = stats.overdue + stats.critical + stats.warning;
    const notAlerted = stats.safe;
    return [
      { name: "Alert-Eligible (≤50d)", value: alerted, color: "#ef4444" },
      { name: "No Alert Needed (>50d)", value: notAlerted, color: "#3b82f6" },
    ].filter((e) => e.value > 0);
  }, [stats]);

  // ── Empty state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="rp-page rp-loading">
        <SkeletonLoader />
      </div>
    );
  }
  if (data.length === 0) {
    return <SkeletonLoader />;
  }

  return (
    <div className="rp-page">
      {/* ── Header ── */}
      <div className="rp-header">
        <div className="rp-header-top">
          <h1 className="rp-title">Reports &amp; Analytics</h1>
          <span className="rp-live-badge">
            <span className="rp-live-dot" />
            Live Data
          </span>
        </div>
        <p className="rp-sub">
          Real-time insights from your uploaded asset files
        </p>
      </div>

      {/* ── Summary Strip ── */}
      <div className="rp-summary">
        <div className="rp-stat rp-stat--overdue">
          <span className="rp-stat-val">{stats.overdue}</span>
          <span className="rp-stat-lbl">Overdue</span>
          <span className="rp-stat-pct">{pct(stats.overdue)} of total</span>
        </div>
        <div className="rp-stat rp-stat--critical">
          <span className="rp-stat-val">{stats.critical}</span>
          <span className="rp-stat-lbl">Critical ≤10d</span>
          <span className="rp-stat-pct">{pct(stats.critical)} of total</span>
        </div>
        <div className="rp-stat rp-stat--warning">
          <span className="rp-stat-val">{stats.warning}</span>
          <span className="rp-stat-lbl">Warning 11–50d</span>
          <span className="rp-stat-pct">{pct(stats.warning)} of total</span>
        </div>
        <div className="rp-stat rp-stat--safe">
          <span className="rp-stat-val">{stats.safe}</span>
          <span className="rp-stat-lbl">Safe &gt;50d</span>
          <span className="rp-stat-pct">{pct(stats.safe)} of total</span>
        </div>
        <div className="rp-stat rp-stat--total">
          <span className="rp-stat-val">{stats.total}</span>
          <span className="rp-stat-lbl">Total Assets</span>
          <span className="rp-stat-pct">100% portfolio</span>
        </div>
      </div>

      {/* ── Charts Grid ── */}
      <div className="rp-grid">
        {/* Card: Risk Donut */}
        <div className="rp-card">
          <CardHead
            title="Risk Distribution"
            sub="Breakdown of assets by urgency level"
            dotColor="#ef4444"
            badge={`${riskDonutData.length} risk levels`}
          />
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={riskDonutData}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {riskDonutData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Card: Alert Eligibility Donut */}
        <div className="rp-card">
          <CardHead
            title="Alert Eligibility"
            sub="Assets that trigger alerts vs safe assets"
            dotColor="#3b82f6"
            badge={`${stats.total} assets`}
          />
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={alertEligData}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {alertEligData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Card: Days Remaining Histogram */}
        <div className="rp-card rp-card--wide">
          <CardHead
            title="Days Remaining Distribution"
            sub="Number of assets in each urgency band"
            dotColor="#f97316"
            badge={`${histogramData.length} bands`}
          />
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={histogramData}
              margin={{ top: 10, right: 16, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

              <XAxis dataKey="name" tick={{ fontSize: 11 }} />

              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />

              <Tooltip content={<ChartTooltip />} />

              <Legend wrapperStyle={{ fontSize: 12 }} />

              {/* 🔥 Better Visual Bars */}
              <Bar dataKey="count" name="Assets Count" radius={[8, 8, 0, 0]}>
                {histogramData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.color}
                    stroke="#fff"
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Card: Assets by Owner */}
        {ownerData.length > 0 && (
          <div className="rp-card rp-card--wide">
            <CardHead
              title="Assets by Owner"
              sub="Top 10 owners — stacked severity breakdown"
              dotColor="#a855f7"
              badge={`${ownerData.length} owners`}
            />
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={ownerData}
                margin={{ top: 5, right: 16, left: 0, bottom: 44 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="owner"
                  tick={{ fontSize: 10 }}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="overdue"
                  name="Overdue"
                  stackId="a"
                  fill="#dc2626"
                  activeBar={false}
                />
                <Bar
                  dataKey="critical"
                  name="Critical"
                  stackId="a"
                  fill="#ef4444"
                  activeBar={false}
                />
                <Bar
                  dataKey="warning"
                  name="Warning"
                  stackId="a"
                  fill="#f97316"
                  activeBar={false}
                />
                <Bar
                  dataKey="safe"
                  name="Safe"
                  stackId="a"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  activeBar={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Card: Assets by Risk Engineer */}
        {riskEngineerData.length > 0 && (
          <div className="rp-card rp-card--wide">
            <CardHead
              title="Assets by Risk Engineer"
              sub="Total assets vs alert-eligible per risk engineer"
              dotColor="#3b82f6"
              badge={`${riskEngineerData.length} engineers`}
            />
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={riskEngineerData}
                margin={{ top: 5, right: 16, left: 0, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="total"
                  name="Total Assets"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  activeBar={false}
                />
                <Bar
                  dataKey="alertable"
                  name="Alert-Eligible"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  activeBar={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Card: Monthly Due Assets */}
        {monthlyDueData.length > 0 && (
          <div className="rp-card rp-card--wide">
            <CardHead
              title="Assets Due by Month"
              sub="How many assets expire in each calendar month"
              dotColor="#22c55e"
              badge={`${monthlyDueData.length} months`}
            />
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart
                data={monthlyDueData}
                margin={{ top: 5, right: 16, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="rpBlueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="assets"
                  name="Assets Due"
                  stroke="#3b82f6"
                  fill="url(#rpBlueGrad)"
                  strokeWidth={2}
                  dot={{
                    r: 5,
                    fill: "#3b82f6",
                    strokeWidth: 2,
                    stroke: "var(--surface)",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Card: Upload History */}
        {uploadHistory && uploadHistory.length > 0 && (
          <div className="rp-card rp-card--wide">
            <CardHead
              title="Upload History"
              sub="Recent file uploads processed through the system"
              dotColor="#22d3a3"
              badge={`${uploadHistory.length} uploads`}
            />
            <div className="rp-upload-list">
              {uploadHistory.map((item, i) => (
                <div key={i} className="rp-upload-item">
                  <div className="rp-upload-icon">📄</div>
                  <div className="rp-upload-info">
                    <div className="rp-upload-name">
                      {item.name || item.fileName || `Upload ${i + 1}`}
                    </div>
                    <div className="rp-upload-date">
                      {item.uploadedAt ? item.uploadedAt : ""}
                    </div>
                  </div>
                  {item.rowCount != null && (
                    <span className="rp-upload-num">{item.rowCount} rows</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
