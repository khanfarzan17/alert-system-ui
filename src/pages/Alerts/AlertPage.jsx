import React from "react";

const AlertPage = () => {
  return (
    <div style={styles.page}>
      <div style={styles.alert} role="alert">
        This is a basic alert.
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  alert: {
    padding: "16px 24px",
    borderRadius: "8px",
    backgroundColor: "#e0f7fa",
    color: "#006064",
    border: "1px solid #4dd0e1",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    fontSize: "16px",
  },
};

export default AlertPage;
