import React, { useState } from "react";
import { SCHEDULE_TYPES } from "../../utils/schedulerConstants";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

const ScheduleTypeTabs = ({ schedType, setSchedType }) => {
  const [isCardHovered, setIsCardHovered] = useState(false);
  return (
    <div
      style={{
        background: "var(--surface)",
        border: `1.5px solid rgba(75,123,245, ${isCardHovered ? "0.24" : "0.12"})`,
        borderRadius: "20px",
        padding: "18px 20px",
        marginBottom: 14,
        boxShadow: isCardHovered
          ? "0 12px 36px rgba(75, 123, 245, 0.15)"
          : "0 4px 16px rgba(75, 123, 245, 0.06)",
        transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transform: isCardHovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            background: "rgba(75,123,245,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CalendarTodayRoundedIcon
            style={{ fontSize: 16, color: "#4B7BF5" }}
          />
        </div>
        <div>
          <div
            style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text1)" }}
          >
            Schedule type
          </div>
          <div style={{ fontSize: 10.5, color: "var(--text3)", marginTop: 1 }}>
            Choose how often alerts are dispatched
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 6,
          background: "var(--surface2)",
          border: "1.5px solid rgba(75,123,245,0.14)",
          borderRadius: 14,
          padding: 4,
          transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {SCHEDULE_TYPES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setSchedType(id)}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 10,
              fontSize: 11.5,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
              background:
                schedType === id
                  ? "linear-gradient(135deg, #4B7BF5 0%, #357ABD 100%)"
                  : "transparent",
              color: schedType === id ? "#fff" : "var(--text2)",
              boxShadow:
                schedType === id
                  ? "0 6px 20px rgba(75, 123, 245, 0.3)"
                  : "none",
              transform: schedType === id ? "scale(1.02)" : "scale(1)",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScheduleTypeTabs;
