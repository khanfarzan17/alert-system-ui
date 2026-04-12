import React, { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext";
import { getScheduler } from "../../Services/schedulerService";
import { pad } from "../../utils/schedulerHelpers";
import dayjs from "dayjs";

const ScheduleStatStrip = ({
  schedType,
  hour,
  minute,
  timezone,
  dayOfWeek,
  dayOfMonth,
  intervalDays,
}) => {
  const { token } = useAuth();
  const [savedSchedule, setSavedSchedule] = useState(null);
  const [hoveredStatCard, setHoveredStatCard] = useState(null);

  useEffect(() => {
    if (!token) return;
    getScheduler(token).then((data) => {
      if (data) setSavedSchedule(data);
    });
  }, [token]);

  const lastRunAt = savedSchedule?.lastRunAt;
  const updatedAt = savedSchedule?.updatedAt;
  const isActive = !!savedSchedule;

  const lastRunDisplay = lastRunAt
    ? dayjs(lastRunAt).format("DD MMM, HH:mm")
    : null;

  const lastRunSub = lastRunAt
    ? dayjs(lastRunAt).fromNow?.() || dayjs(lastRunAt).format("DD MMM YYYY")
    : updatedAt
      ? `Saved ${dayjs(updatedAt).format("DD MMM, HH:mm")}`
      : "No run yet";

  const getStatCardStyle = (colorHex, cardKey) => {
    const isHovered = hoveredStatCard === cardKey;
    const rgbMap = {
      "#4B7BF5": "75,123,245",
      "#F97316": "249,115,22",
      "#F87171": "248,113,113",
      "#10B981": "16,185,129",
    };
    const rgb = rgbMap[colorHex] || "75,123,245";
    return {
      background: `linear-gradient(135deg, rgba(${rgb}, 0.12) 0%, rgba(${rgb}, 0.06) 100%)`,
      border: `1.5px solid rgba(${rgb}, ${isHovered ? "0.38" : "0.22"})`,
      borderRadius: "16px",
      padding: "12px 14px",
      boxShadow: isHovered
        ? `0 12px 36px rgba(${rgb}, 0.18)`
        : `0 4px 16px rgba(${rgb}, 0.08)`,
      transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
      cursor: "default",
      transform: isHovered ? "translateY(-3px)" : "translateY(0)",
    };
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 10,
        marginBottom: 14,
      }}
    >
      <div
        style={getStatCardStyle("#4B7BF5", "nextRun")}
        onMouseEnter={() => setHoveredStatCard("nextRun")}
        onMouseLeave={() => setHoveredStatCard(null)}
      >
        <div
          style={{
            fontSize: 10,
            color: "var(--text3)",
            fontWeight: 700,
            marginBottom: 3,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Next Run
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 900,
            background: "linear-gradient(135deg, #4B7BF5 0%, #357ABD 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginTop: 2,
          }}
        >
          {schedType === "weekly"
            ? `${dayOfWeek.slice(0, 3)} ${pad(hour)}:${pad(minute)}`
            : `${pad(hour)}:${pad(minute)}`}
        </div>
        <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 3 }}>
          {timezone}
        </div>
      </div>

      <div
        style={getStatCardStyle("#F97316", "scheduleType")}
        onMouseEnter={() => setHoveredStatCard("scheduleType")}
        onMouseLeave={() => setHoveredStatCard(null)}
      >
        <div
          style={{
            fontSize: 10,
            color: "var(--text3)",
            fontWeight: 700,
            marginBottom: 3,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Schedule Type
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 900,
            background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginTop: 2,
            textTransform: "capitalize",
          }}
        >
          {schedType}
        </div>
        <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 3 }}>
          {schedType === "daily"
            ? "Every day"
            : schedType === "weekly"
              ? dayOfWeek
              : schedType === "monthly"
                ? `Day ${dayOfMonth}`
                : `Every ${intervalDays}d`}
        </div>
      </div>

      <div
        style={getStatCardStyle("#F87171", "lastRun")}
        onMouseEnter={() => setHoveredStatCard("lastRun")}
        onMouseLeave={() => setHoveredStatCard(null)}
      >
        <div
          style={{
            fontSize: 10,
            color: "var(--text3)",
            fontWeight: 700,
            marginBottom: 3,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Last Run
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 900,
            background: "linear-gradient(135deg, #F87171 0%, #EF4444 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginTop: 2,
          }}
        >
          {lastRunDisplay || "N/A"}
        </div>
        <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 3 }}>
          {lastRunSub}
        </div>
      </div>

      <div
        style={getStatCardStyle("#10B981", "status")}
        onMouseEnter={() => setHoveredStatCard("status")}
        onMouseLeave={() => setHoveredStatCard(null)}
      >
        <div
          style={{
            fontSize: 10,
            color: "var(--text3)",
            fontWeight: 700,
            marginBottom: 3,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Status
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 900,
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginTop: 2,
          }}
        >
          {isActive ? "Active" : "Not Set"}
        </div>
        <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 3 }}>
          {isActive ? "Cron running" : "Save to activate"}
        </div>
      </div>
    </div>
  );
};

export default ScheduleStatStrip;
