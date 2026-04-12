import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Clock } from "lucide-react";
import "../../styles/Alerts/EmptyAlert.css";

export default function EmptyAlerts() {
  const navigate = useNavigate();

  return (
    <div className="ea-wrapper">
      {/* Bell icon with red dot */}
      <div className="ea-icon-wrap">
        <span className="ea-bell-dot" />
        <span className="ea-bell">🔔</span>
      </div>

      <h2 className="ea-heading">No alerts yet</h2>

      <p className="ea-subtext">
        Alerts appear here when assets are approaching or
        <br />
        past their due dates. Upload an asset file first.
      </p>

      <button className="ea-upload-btn" onClick={() => navigate("/upload")}>
        <Plus size={15} />
        Upload asset file
      </button>

      {/* Info strip */}
      <div className="ea-info-strip">
        <div className="ea-info-icon">
          <Clock size={16} />
        </div>
        <p className="ea-info-text">
          Alerts auto-trigger via{" "}
          <span className="ea-info-link">node-cron</span> every Monday at
          <br />
          08:00 once assets are loaded.
        </p>
      </div>
    </div>
  );
}
