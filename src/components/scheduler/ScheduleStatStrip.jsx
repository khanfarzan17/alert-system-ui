import React from "react";
import { pad } from "../../utils/schedulerHelpers";
import { statCard } from "../../utils/schedulerStyles";

const ScheduleStatStrip = ({
  schedType,
  hour,
  minute,
  timezone,
  dayOfWeek,
  dayOfMonth,
  intervalDays,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 10,
        marginBottom: 14,
      }}
    >
      <div style={statCard("#4B7BF5")}>
        <div
          style={{
            fontSize: 9.5,
            color: "var(--text3)",
            fontWeight: 600,
            marginBottom: 3,
          }}
        >
          Next Run
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: "#4B7BF5",
            marginTop: 2,
          }}
        >
          {schedType === "weekly"
            ? `${dayOfWeek.slice(0, 3)} ${pad(hour)}:${pad(minute)}`
            : `${pad(hour)}:${pad(minute)}`}
        </div>
        <div style={{ fontSize: 9.5, color: "var(--text3)", marginTop: 3 }}>
          {timezone}
        </div>
      </div>

      <div style={statCard("#F97316")}>
        <div
          style={{
            fontSize: 9.5,
            color: "var(--text3)",
            fontWeight: 600,
            marginBottom: 3,
          }}
        >
          Schedule Type
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: "#F97316",
            marginTop: 2,
            textTransform: "capitalize",
          }}
        >
          {schedType}
        </div>
        <div style={{ fontSize: 9.5, color: "var(--text3)", marginTop: 3 }}>
          {schedType === "daily"
            ? "Every day"
            : schedType === "weekly"
              ? dayOfWeek
              : schedType === "monthly"
                ? `Day ${dayOfMonth}`
                : `Every ${intervalDays}d`}
        </div>
      </div>

      <div style={statCard("#F87171")}>
        <div
          style={{
            fontSize: 9.5,
            color: "var(--text3)",
            fontWeight: 600,
            marginBottom: 3,
          }}
        >
          Last Run
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: "#F87171",
            marginTop: 2,
          }}
        >
          N/A
        </div>
        <div style={{ fontSize: 9.5, color: "var(--text3)", marginTop: 3 }}>
          No run yet
        </div>
      </div>

      <div style={statCard("#10B981")}>
        <div
          style={{
            fontSize: 9.5,
            color: "var(--text3)",
            fontWeight: 600,
            marginBottom: 3,
          }}
        >
          Status
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: "var(--text3)",
            marginTop: 2,
          }}
        >
          Not Set
        </div>
        <div style={{ fontSize: 9.5, color: "var(--text3)", marginTop: 3 }}>
          Save to activate
        </div>
      </div>
    </div>
  );
};

export default ScheduleStatStrip;
