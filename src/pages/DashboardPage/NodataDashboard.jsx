import React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Plus } from "lucide-react";
import "../../styles/Dashboard/NodataDashboard.css";

const NodataDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="nd-wrapper">
      {/* Skeleton stat cards */}
      <div className="nd-skeleton-cards">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="nd-skeleton-card">
            <div className="nd-skel nd-skel-line nd-skel-w70" />
            <div className="nd-skel nd-skel-rect" />
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="nd-empty">
        <div className="nd-icon-wrap">
          <LayoutDashboard size={36} className="nd-icon" />
        </div>

        <h2 className="nd-heading">No data yet</h2>
        <p className="nd-subtext">
          Upload an asset file to populate your dashboard
          <br />
          with live stats, alerts, and asset coverage.
        </p>

        <button className="nd-upload-btn" onClick={() => navigate("/upload")}>
          <Plus size={16} />
          Upload your first file
        </button>

        {/* Steps */}
        <div className="nd-steps">
          <div className="nd-step">
            <span className="nd-step-num">01</span>
            <span className="nd-step-label">Upload CSV or XLSX</span>
          </div>
          <div className="nd-step">
            <span className="nd-step-num">02</span>
            <span className="nd-step-label">Parse &amp; validate</span>
          </div>
          <div className="nd-step">
            <span className="nd-step-num">03</span>
            <span className="nd-step-label">View dashboard</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodataDashboard;
