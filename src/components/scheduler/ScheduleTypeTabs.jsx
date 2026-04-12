import React from "react";
import { SCHEDULE_TYPES } from "../../utils/schedulerConstants";
import { card } from "../../utils/schedulerStyles";

const ScheduleTypeTabs = ({ schedType, setSchedType }) => {
  return (
    <div style={card}>
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
            borderRadius: 8,
            background: "rgba(75,123,245,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          📅
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
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: 4,
        }}
      >
        {SCHEDULE_TYPES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setSchedType(id)}
            style={{
              flex: 1,
              padding: "7px 10px",
              borderRadius: 7,
              fontSize: 11.5,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
              background: schedType === id ? "#4B7BF5" : "transparent",
              color: schedType === id ? "#fff" : "var(--text2)",
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
