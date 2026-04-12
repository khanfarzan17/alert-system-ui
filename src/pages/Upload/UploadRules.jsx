import React from "react";
import "../../styles/Upload/UploadPage.css";

import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

const rules = [
  {
    icon: ViewColumnRoundedIcon,
    iconBg: "var(--accent-soft)",
    iconColor: "var(--accent)",
    title: "Required Columns",
    desc: "Asset ID, Owner Name/ID, Risk Engineer, Due Date, Status, Email Address",
  },
  {
    icon: FolderRoundedIcon,
    iconBg: "var(--accent3-soft)",
    iconColor: "var(--accent3)",
    title: "Supported File Types",
    desc: "Only Excel (.xlsx, .xls) and CSV (.csv) files are accepted for upload",
  },
  {
    icon: StraightenRoundedIcon,
    iconBg: "var(--accent4-soft)",
    iconColor: "var(--accent4)",
    title: "File Size Limit",
    desc: "Maximum file size allowed is 5MB. Larger files will be rejected during upload",
  },
  {
    icon: DateRangeRoundedIcon,
    iconBg: "var(--accent2-soft)",
    iconColor: "var(--accent2)",
    title: "Date Format",
    desc: "Due Date must be in YYYY-MM-DD format to ensure correct processing",
  },
  {
    icon: WarningAmberRoundedIcon,
    iconBg: "var(--warn-soft)",
    iconColor: "var(--warn)",
    title: "Alert Threshold",
    desc: "Assets with due dates within 50 days will trigger weekly email alerts automatically",
  },
  {
    icon: PersonRoundedIcon,
    iconBg: "var(--success-soft)",
    iconColor: "var(--success)",
    title: "User Mapping",
    desc: "Use Employee IDs instead of names for accurate mapping to email addresses",
  },
];

export default function UploadRules() {
  return (
    <div>
      <div
        className="upload-text"
        style={{
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: "-0.3px",
          background:
            "linear-gradient(135deg, var(--accent) 0%, var(--accent4) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: 14,
        }}
      >
        Required File Format
      </div>

      <div className="upload-rules">
        {rules.map((rule, i) => {
          const Icon = rule.icon;

          return (
            <div className="rule-card" key={i}>
              <div
                className="rule-icon"
                style={{
                  background: rule.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon style={{ fontSize: 22, color: rule.iconColor }} />
              </div>

              <div className="rule-title">{rule.title}</div>
              <div className="rule-desc">{rule.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
