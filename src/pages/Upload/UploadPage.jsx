import React, { useRef } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "../../styles/Upload/UploadPage.css";
import { parseFile } from "../../utils/fileParser";

const rules = [
  {
    iconBg: "var(--accent-soft)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#3B6FE8" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"></rect>
        <path d="M3 9h18M9 21V9"></path>
      </svg>
    ),
    title: "Required Columns",
    desc: "Asset ID, Owner Name/ID, Risk Engineer, Due Date, Status, Email Address",
  },
  {
    iconBg: "var(--accent2-soft)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#0EA578" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"></rect>
        <path d="M8 3v18M16 3v18"></path>
      </svg>
    ),
    title: "File Types Allowed",
    desc: "CSV, XLSX, XLS (Max 50MB)",
  },
  {
    iconBg: "var(--accent3-soft)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#F06A1E" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"></rect>
        <path d="M3 9h18M9 21V9M15 21V9"></path>
      </svg>
    ),
    title: "Date Format",
    desc: "Due Date should be in YYYY-MM-DD format",
  },
];

export default function UploadPage() {
  const fileInputRef = useRef();

  const handleFile = async (file) => {
    try {
      const data = await parseFile(file);

      console.log("Parsed Data:", data);
     
    } catch (error) {
      console.error(error);
      alert("Error parsing file");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) handleFile(file);
  };

  const triggerUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <div className="ph">
        <div className="ph-title">Upload Asset File</div>
        <div className="ph-sub">
          Upload your CSV or XLSX file to start monitoring due dates and
          triggering alerts
        </div>
      </div>
      <div
        className="upload-hero"
        onClick={triggerUpload}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="upload-hero-icon">
          <CloudUploadIcon style={{ width: 38, height: 38, stroke: "white" }} />
        </div>
        <div className="upload-hero-title">Drop your asset file here</div>
        <div className="upload-hero-sub">
          Drag & drop your CSV or XLSX file, or click the button below to browse
        </div>
        <div className="fmt-row">
          <span className="fmt">📊 XLSX</span>
          <span className="fmt">📄 CSV</span>
          <span className="fmt">📋 XLS</span>
          <span className="fmt">Max 50MB</span>
        </div>
        <div className="upload-divider">
          <span>or browse from your computer</span>
        </div>
        <button
          className="upload-cta"
          onClick={(e) => {
            e.stopPropagation();
            triggerUpload();
          }}
        >
          <CloudUploadIcon style={{ width: 18, height: 18, stroke: "white" }} />
          Choose File to Upload
        </button>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileInputChange}
        />
      </div>

      {/* Upload Rules Section (self-contained) */}

      <div className="upload-rules-section">
        <div className="upload-text">Required File and Field</div>
        <div className="upload-rules">
          {rules.map((rule, idx) => (
            <div className="rule-card" key={idx}>
              <div className="rule-icon" style={{ background: rule.iconBg }}>
                {rule.icon}
              </div>
              <div className="rule-title">{rule.title}</div>
              <div className="rule-desc">{rule.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
