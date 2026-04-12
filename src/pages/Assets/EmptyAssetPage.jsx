import React from "react";
import { useNavigate } from "react-router-dom";
import { Hexagon, Plus } from "lucide-react";
import "../../styles/Assets/EmptyAssetPage.css";

export default function EmptyAssetPage() {
  const navigate = useNavigate();

  return (
    <div className="eap-wrapper">
      {/* Hexagon icon */}
      <div className="eap-icon-wrap">
        <Hexagon size={38} className="eap-icon" />
      </div>

      <h2 className="eap-heading">No assets found</h2>

      <p className="eap-subtext">
        Your asset register is empty. Upload a CSV or XLSX
        <br />
        file with your asset data to start tracking due dates.
      </p>

      <button className="eap-upload-btn" onClick={() => navigate("/upload")}>
        <Plus size={15} />
        Upload asset file
      </button>

      {/* Info cards */}
      <div className="eap-info-cards">
        <div className="eap-info-card">
          <span className="eap-info-label">REQUIRED COLS</span>
          <span className="eap-info-val accent">asset_id</span>
          <span className="eap-info-val accent">owner</span>
          <span className="eap-info-val accent">due_date</span>
        </div>
        <div className="eap-info-card">
          <span className="eap-info-label">FORMATS</span>
          <span className="eap-info-val">.xlsx</span>
          <span className="eap-info-val">.csv</span>
          <span className="eap-info-val">.xls</span>
        </div>
        <div className="eap-info-card">
          <span className="eap-info-label">MAX SIZE</span>
          <span className="eap-info-big">50</span>
          <span className="eap-info-unit">MB</span>
        </div>
      </div>
    </div>
  );
}
