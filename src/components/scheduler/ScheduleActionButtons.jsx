import React from "react";

const ScheduleActionButtons = ({ onSave, onReset, isSaving }) => {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
      <button
        onClick={onSave}
        disabled={isSaving}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "10px 18px",
          borderRadius: 9,
          fontSize: 12,
          fontWeight: 700,
          border: "none",
          background: isSaving ? "#6B7280" : "#4B7BF5",
          color: "#fff",
          fontFamily: "inherit",
          cursor: isSaving ? "not-allowed" : "pointer",
          opacity: isSaving ? 0.7 : 1,
          transition: "background 0.15s",
        }}
      >
        💾 {isSaving ? "Saving..." : "Save Schedule"}
      </button>
      <button
        onClick={onReset}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 16px",
          borderRadius: 9,
          fontSize: 12,
          fontWeight: 700,
          border: "1.5px solid var(--border)",
          background: "transparent",
          color: "var(--text2)",
          fontFamily: "inherit",
          cursor: "pointer",
        }}
      >
        ↺ Reset
      </button>
    </div>
  );
};

export default ScheduleActionButtons;
