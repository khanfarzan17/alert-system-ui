import React, { useState } from "react";
import SaveSharpIcon from "@mui/icons-material/SaveSharp";

const ScheduleActionButtons = ({ onSave, onReset, isSaving }) => {
  const [isSaveHovered, setIsSaveHovered] = useState(false);
  const [isResetHovered, setIsResetHovered] = useState(false);
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
      <button
        onClick={onSave}
        disabled={isSaving}
        onMouseEnter={() => setIsSaveHovered(true)}
        onMouseLeave={() => setIsSaveHovered(false)}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "10px 18px",
          borderRadius: 12,
          fontSize: 12,
          fontWeight: 700,
          border: "none",
          background: isSaving
            ? "linear-gradient(135deg, #6B7280 0%, #4B5563 100%)"
            : "linear-gradient(135deg, #4B7BF5 0%, #357ABD 100%)",
          color: "#fff",
          fontFamily: "inherit",
          cursor: isSaving ? "not-allowed" : "pointer",
          opacity: isSaving ? 0.7 : 1,
          transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: isSaving
            ? "0 4px 12px rgba(107, 114, 128, 0.3)"
            : isSaveHovered
              ? "0 12px 36px rgba(75, 123, 245, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
              : "0 6px 20px rgba(75, 123, 245, 0.3)",
          transform:
            !isSaving && isSaveHovered
              ? "scale(1.02) translateY(-2px)"
              : "scale(1)",
        }}
      >
        <SaveSharpIcon />
        {isSaving ? "Saving..." : "Save Schedule"}
      </button>
      <button
        onClick={onReset}
        onMouseEnter={() => setIsResetHovered(true)}
        onMouseLeave={() => setIsResetHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 24px",
          borderRadius: 24,
          fontSize: 12,
          fontWeight: 700,
          border: `1.5px solid rgba(75,123,245, ${isResetHovered ? "0.4" : "0.25"})`,
          background: isResetHovered ? "rgba(75,123,245,0.12)" : "transparent",
          color: "var(--text2)",
          fontFamily: "inherit",
          cursor: "pointer",
          transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: isResetHovered
            ? "0 6px 20px rgba(75, 123, 245, 0.15)"
            : "none",
          transform: isResetHovered ? "translateY(-2px)" : "translateY(0)",
        }}
      >
        ↺ Reset
      </button>
    </div>
  );
};

export default ScheduleActionButtons;
