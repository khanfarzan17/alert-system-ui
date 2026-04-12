import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, ChevronLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* 404 */}
        <div style={styles.errorCode}>
          <span style={styles.four}>4</span>
          <span style={styles.zero}>
            <span style={styles.zeroDot} />
          </span>
          <span style={styles.four}>4</span>
        </div>

        {/* Badge */}
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          Page not found
        </div>

        {/* Heading */}
        <h1 style={styles.heading}>Looks like you're lost</h1>

        {/* Sub text */}
        <p style={styles.subtext}>
          The route you're looking for doesn't exist or was moved.
          <br />
          Check the URL or head back to safety.
        </p>

        {/* Buttons */}
        <div style={styles.buttonRow}>
          <button style={styles.primaryBtn} onClick={() => navigate("/upload")}>
            <LayoutDashboard size={16} style={{ marginRight: 8 }} />
            Go to Home
          </button>
        </div>

        {/* Footer */}
        <p style={styles.footer}>
          requested:&nbsp;
          <span style={styles.footerPath}>{location.pathname}</span>
          &nbsp;·&nbsp;AlertIQ v1.0
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    backgroundColor: "#0d0d0d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
    padding: "24px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    maxWidth: "520px",
    width: "100%",
    textAlign: "center",
  },
  errorCode: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    lineHeight: 1,
  },
  four: {
    fontSize: "160px",
    fontWeight: 900,
    color: "#2a2a2a",
    letterSpacing: "-4px",
    userSelect: "none",
  },
  zero: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    border: "14px solid #2a2a2a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    margin: "0 4px",
  },
  zeroDot: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    backgroundColor: "#ef4444",
    position: "absolute",
    bottom: "18px",
    right: "20px",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#1f1414",
    color: "#f87171",
    border: "1px solid #3d1010",
    borderRadius: "999px",
    padding: "6px 16px",
    fontSize: "13px",
    fontWeight: 500,
  },
  badgeDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#ef4444",
    flexShrink: 0,
  },
  heading: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#ffffff",
    margin: 0,
  },
  subtext: {
    fontSize: "14px",
    color: "#888888",
    lineHeight: 1.7,
    margin: 0,
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "4px",
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "11px 24px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "1px solid #333333",
    borderRadius: "8px",
    padding: "11px 24px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  footer: {
    fontSize: "12px",
    color: "#555555",
    marginTop: "8px",
  },
  footerPath: {
    color: "#777777",
  },
};

export default NotFound;
