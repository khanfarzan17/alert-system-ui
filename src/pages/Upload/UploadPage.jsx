import React, { useRef, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "../../styles/Upload/UploadPage.css";
import { parseFile } from "../../utils/fileParser";
import dayjs from "dayjs";
import UploadList from "./UploadList";
import UploadRules from "./UploadRules";
import { useDispatch, useSelector } from "react-redux";
import {
  setUploadData,
  addUploadHistory,
} from "../../redux/slice/uploadSlice.js";
import { sendAlerts } from "../../utils/sendAlerts.js";
import { Button, Box, Snackbar, Alert, AlertTitle, Slide } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

export default function UploadPage() {
  const fileInputRef = useRef();
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const uploadHistory = useSelector((state) => state.upload.uploadHistory);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    title: "",
    message: "",
  });
  const dispatch = useDispatch();

  const showSnackbar = (severity, title, message) => {
    setSnackbar({ open: true, severity, title, message });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

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
        dispatch(
          addUploadHistory({
            name: file.name,
            uploadedAt: dayjs().format("DD MMM YYYY, hh:mm A"),
          }),
        );

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
      showSnackbar(
        "error",
        "Upload Failed",
        "Error parsing file. Please check the format.",
      );
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

  const handleSendAlerts = async () => {
    const result = await sendAlerts(tableData, tableColumns);
    showSnackbar(result.status, result.title, result.message);
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

      {/* Upload Rules - only when no file uploaded */}
      {!fileUploaded && <UploadRules />}

      {/* Alert Banner - show only when data exists */}

      {tableData.length > 0 &&
        (() => {
          const overdueCount = tableData.filter(
            (r) => r["Days Remaining"] !== "N/A" && r["Days Remaining"] <= 0,
          ).length;
          const dueSoonCount = tableData.filter(
            (r) =>
              r["Days Remaining"] !== "N/A" &&
              r["Days Remaining"] > 0 &&
              r["Days Remaining"] <= 50,
          ).length;
          return (
            <Box
              sx={{
                mt: 3,
                mb: 1,
                background:
                  "linear-gradient(135deg, #166534 0%, #16a34a 50%,  #166534 100%)",
                borderRadius: "14px",
                padding: "16px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 4px 20px rgba(27, 94, 32, 0.3)",
              }}
            >
              {/* Left: icon + text */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <NotificationsActiveIcon
                    sx={{ color: "#ffffff", fontSize: 22 }}
                  />
                </Box>
                <Box>
                  <Box sx={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
                    File ready — send your alerts now
                  </Box>
                  <Box
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: 12,
                      mt: 0.25,
                    }}
                  >
                    {uploadedFileName} · {tableData.length} assets detected
                  </Box>
                </Box>
              </Box>

              {/* Right: badges + button */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "10px",
                    px: 2,
                    py: 0.8,
                    textAlign: "center",
                    minWidth: 56,
                  }}
                >
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: 18,
                      lineHeight: 1,
                    }}
                  >
                    {overdueCount}
                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontSize: 10,
                      fontWeight: 600,
                      mt: 0.3,
                    }}
                  >
                    overdue
                  </Box>
                </Box>
                <Box
                  sx={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "10px",
                    px: 2,
                    py: 0.8,
                    textAlign: "center",
                    minWidth: 56,
                  }}
                >
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: 18,
                      lineHeight: 1,
                    }}
                  >
                    {dueSoonCount}
                  </Box>
                  <Box
                    sx={{
                      color: "#ffffff",
                      fontSize: 10,
                      fontWeight: 600,
                      mt: 0.3,
                    }}
                  >
                    due soon
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  onClick={handleSendAlerts}
                  sx={{
                    background: "#fff",
                    color: "#1B5E20",
                    fontWeight: 800,
                    fontSize: 11,
                    textTransform: "none",
                    borderRadius: 2,
                    px: 1.75,
                    py: 0.75,
                    letterSpacing: 0.3,
                    flexShrink: 0,
                    "&:hover": { background: "#F1F8F1" },
                  }}
                >
                  Send Alerts
                </Button>
              </Box>
            </Box>
          );
        })()}

      {/* Upload History */}
      <div style={{ marginTop: 32 }}>
        <UploadList uploads={uploadHistory} />
      </div>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          elevation={6}
          sx={{
            minWidth: 320,
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            fontSize: 13,
            "& .MuiAlertTitle-root": {
              fontWeight: 800,
              fontSize: 15,
            },
          }}
        >
          <AlertTitle>{snackbar.title}</AlertTitle>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
