import React from "react";

const LivePreview = ({ previewText, cronExpr, timezone }) => {
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgba(75,123,245,0.12), rgba(16,185,129,0.08))",
        border: "1px solid rgba(75,123,245,0.25)",
        borderRadius: 14,
        padding: "16px 18px",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#4B7BF5",
          marginBottom: 8,
        }}
      >
        👁 Live Preview
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 800,
          color: "var(--text1)",
          letterSpacing: "-0.2px",
        }}
      >
        {previewText}
      </div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 10.5,
          color: "var(--text3)",
          marginTop: 6,
          background: "rgba(0,0,0,0.2)",
          borderRadius: 6,
          padding: "4px 10px",
          display: "inline-block",
        }}
      >
        cron: {cronExpr} ({timezone})
      </div>
    </div>
  );
};

export default LivePreview;
