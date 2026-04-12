import React from "react";
import { useNavigate } from "react-router-dom";
import { BarChart2, Plus, PieChart, TrendingUp, FileText } from "lucide-react";
import "../../styles/Reports/EmptyReportPage.css";

const EmptyReportPage = () => {
  const navigate = useNavigate();

  return (
    <div className="erp-wrapper">
      {/* Icon */}
      <div className="erp-icon-wrap">
        <BarChart2 size={38} className="erp-icon" />
      </div>

      <h2 className="erp-heading">No reports yet</h2>

      <p className="erp-subtext">
        Upload an asset file to generate analytics,
        <br />
        charts, and due-date reports.
      </p>

      <button className="erp-upload-btn" onClick={() => navigate("/upload")}>
        <Plus size={15} />
        Upload asset file
      </button>

      {/* Preview cards */}
      <div className="erp-preview-cards">
        <div className="erp-preview-card">
          <PieChart size={20} className="erp-preview-icon" />
          <span className="erp-preview-label">
            Severity
            <br />
            Breakdown
          </span>
        </div>
        <div className="erp-preview-card">
          <TrendingUp size={20} className="erp-preview-icon" />
          <span className="erp-preview-label">
            Expiry
            <br />
            Timeline
          </span>
        </div>
        <div className="erp-preview-card">
          <FileText size={20} className="erp-preview-icon" />
          <span className="erp-preview-label">
            Export
            <br />
            CSV / PDF
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmptyReportPage;
