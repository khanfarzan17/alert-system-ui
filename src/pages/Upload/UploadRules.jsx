import React from "react";
import "../../styles/Upload/UploadPage.css";
const rules = [
  {
    icon: "📋",
    iconBg: "#eef3ff",
    title: "Required Columns",
    desc: "Asset ID, Owner Name/ID, Risk Engineer, Due Date, Status, Email Address",
  },
  {
    icon: "📁",
    iconBg: "#f0f3f8",
    title: "Supported File Types",
    desc: "Only Excel (.xlsx, .xls) and CSV (.csv) files are accepted for upload",
  },
  {
    icon: "📏",
    iconBg: "#eef2ff",
    title: "File Size Limit",
    desc: "Maximum file size allowed is 5MB. Larger files will be rejected during upload",
  },
  {
    icon: "📅",
    iconBg: "#f0f9ff",
    title: "Date Format",
    desc: "Due Date must be in YYYY-MM-DD format to ensure correct processing",
  },
  {
    icon: "⚠️",
    iconBg: "#fef9ee",
    title: "Alert Threshold",
    desc: "Assets with due dates within 50 days will trigger weekly email alerts automatically",
  },
  {
    icon: "👤",
    iconBg: "#eefaf5",
    title: "User Mapping",
    desc: "Use Employee IDs instead of names for accurate mapping to email addresses",
  },
];
export default function UploadRules() {
  return (
    <div>
      <div className="upload-text">Required File Format</div>
      <div className="upload-rules">
        {rules.map((rule, i) => (
          <div className="rule-card" key={i}>
            <div className="rule-icon" style={{ background: rule.iconBg }}>
              <span style={{ fontSize: 18 }}>{rule.icon}</span>
            </div>
            <div className="rule-title">{rule.title}</div>
            <div className="rule-desc">{rule.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
