import React from "react";
import { useTheme } from "../../components/context/ThemeContext";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <div className="ph">
        <div className="ph-title">Settings</div>
        <div className="ph-sub">Manage your application preferences</div>
      </div>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "20px 24px",
          maxWidth: 480,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text1)",
                marginBottom: 4,
              }}
            >
              Dark Mode
            </div>
            <div style={{ fontSize: 12.5, color: "var(--text3)" }}>
              Switch between light and dark theme
            </div>
          </div>
          <button
            onClick={toggleTheme}
            style={{
              width: 48,
              height: 26,
              borderRadius: 13,
              border: "none",
              background: theme === "dark" ? "var(--accent)" : "var(--border2)",
              position: "relative",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 3,
                left: theme === "dark" ? 25 : 3,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "white",
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
