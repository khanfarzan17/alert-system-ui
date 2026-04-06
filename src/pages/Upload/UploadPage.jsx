import React, { useRef, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "../../styles/Upload/UploadPage.css";
import { parseFile } from "../../utils/fileParser";
import EnhancedTable from "../../components/table/EnhancedTable";
import dayjs from "dayjs";
import UploadList from "./UploadList";
import { useDispatch } from "react-redux";
import { setUploadData } from "../../redux/slice/uploadSlice.js";

export default function UploadPage() {
  const fileInputRef = useRef();
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [uploadHistory, setUploadHistory] = useState([]);
  const dispatch = useDispatch();

  // Reset upload state
  const handleCancelUpload = () => {
    setUploadedFileName("");
    setFileUploaded(false);
    setTableData([]);
    setTableColumns([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = async (file) => {
    try {
      setUploadedFileName(file.name);
      setFileUploaded(true);
      const data = await parseFile(file);
      if (data && data.length > 0) {
        // Find the due date column key (handles "Due Date", "due date", "DueDate", etc.)
        console.log("Parsed data:", data);
        const dueDateKey = Object.keys(data[0]).find((key) =>
          key.toLowerCase().replace(/\s/g, "").includes("duedate"),
        );

        // Add "Days Remaining" to each row
        const enrichedData = data.map((row) => ({
          ...row,
          "Days Remaining": dueDateKey
            ? getDaysRemaining(row[dueDateKey])
            : "N/A",
        }));

        setTableData(enrichedData);
        setTableColumns([
          ...Object.keys(data[0]).map((key) => ({
            id: key,
            label: key,
          })),
          { id: "Days Remaining", label: "Days Remaining" },
        ]);

        // Add to upload history
        setUploadHistory((prev) => [
          {
            name: file.name,
            uploadedAt: dayjs().format("DD MMM YYYY, hh:mm A"),
          },
          ...prev,
        ]);

        // Dispatch upload data to Redux
        // Store in Redux for Alerts page
        dispatch(
          setUploadData({
            tableData: enrichedData,
            tableColumns: [
              ...Object.keys(data[0]).map((key) => ({ id: key, label: key })),
              { id: "Days Remaining", label: "Days Remaining" },
            ],
          }),
        );
      }
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

  const getDaysRemaining = (dueDate) => {
    return dayjs(dueDate).diff(dayjs(), "day");
  };

  const handleSendAlerts = () => {
    const alertRows = tableData.filter((row) => row["Days Remaining"] <= 50);

    if (alertRows.length === 0) {
      alert("No assets need alerts right now.");
      return;
    }

    // Find column keys dynamically (case/space insensitive)
    const keys = Object.keys(tableData[0]);
    const ownerKey = keys.find((k) =>
      k.toLowerCase().replace(/\s/g, "").includes("owner"),
    );
    const riskEngineerKey = keys.find((k) =>
      k.toLowerCase().replace(/\s/g, "").includes("riskengineer"),
    );

    alertRows.forEach((item) => {
      const daysLeft = item["Days Remaining"];
      const assetName = item[tableColumns[0]?.id] || "Unknown";
      const owner = ownerKey ? item[ownerKey] : "N/A";
      const riskEngineer = riskEngineerKey ? item[riskEngineerKey] : "N/A";

      console.log(
        `⚠️ Alert sent for: ${assetName} | Days Remaining: ${daysLeft} | Owner: ${owner} | Risk Engineer: ${riskEngineer}`,
      );
    });

    alert(`Alerts processed! ${alertRows.length} asset(s) notified.`);
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
        onClick={!fileUploaded ? triggerUpload : undefined}
        onDrop={!fileUploaded ? handleDrop : undefined}
        onDragOver={!fileUploaded ? handleDragOver : undefined}
        style={{ cursor: fileUploaded ? "default" : "pointer" }}
      >
        {!fileUploaded ? (
          <>
            <div className="upload-hero-icon">
              <CloudUploadIcon
                style={{ width: 38, height: 38, stroke: "white" }}
              />
            </div>
            <div className="upload-hero-title">Drop your asset file here</div>
            <div className="upload-hero-sub">
              Drag & drop your CSV or XLSX file, or click the button below to
              browse
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
              <CloudUploadIcon
                style={{ width: 18, height: 18, stroke: "white" }}
              />
              Choose File to Upload
            </button>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileInputChange}
            />
          </>
        ) : (
          <div
            className="uploaded-file-row"
            style={{ justifyContent: "center", marginTop: 24 }}
          >
            <span className="uploaded-file-name-basic">{uploadedFileName}</span>
            <button
              className="cancel-upload-btn-basic"
              onClick={handleCancelUpload}
              title="Cancel Upload"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Send Alerts Button - show only when data exists */}
      {tableData.length > 0 && (
        <div
          style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}
        >
          <button
            onClick={handleSendAlerts}
            style={{
              background: "linear-gradient(135deg, #e53935, #d32f2f)",
              color: "white",
              border: "none",
              padding: "10px 24px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(229, 57, 53, 0.3)",
            }}
          >
            🔔 Send Alerts
          </button>
        </div>
      )}

      {/* Upload History */}
      <div style={{ marginTop: 32 }}>
        <UploadList uploads={uploadHistory} />
      </div>

      {/* Table Section - shows parsed sheet data */}
      {tableData.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <EnhancedTable
            rows={tableData}
            headCells={tableColumns}
            title="Uploaded Asset Data"
          />
        </div>
      )}
    </div>
  );
}
