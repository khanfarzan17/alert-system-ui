import React, { useRef } from "react";
import { Box, Typography, Button, Paper, Stack } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function UploadPage() {
  const fileInputRef = useRef();

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleFile = (file) => {
    // TODO: Add file validation and parsing logic here
    alert(`File selected: ${file.name}`);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) handleFile(file);
  };

  const triggerUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Upload Asset File
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Upload your CSV or XLSX file to start monitoring due dates and
          triggering alerts
        </Typography>

        <Box
          sx={{
            border: "2px dashed #90caf9",
            borderRadius: 2,
            p: 4,
            my: 3,
            cursor: "pointer",
            bgcolor: "#f5faff",
            transition: "background 0.2s",
            "&:hover": { bgcolor: "#e3f2fd" },
          }}
          onClick={triggerUpload}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: "#90caf9" }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Drop your asset file here
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Drag & drop your CSV or XLSX file, or click the button below to
            browse
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mb: 2 }}
          >
            <span role="img" aria-label="xlsx">
              📊 XLSX
            </span>
            <span role="img" aria-label="csv">
              📄 CSV
            </span>
            <span role="img" aria-label="xls">
              📋 XLS
            </span>
            <span>Max 50MB</span>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            or browse from your computer
          </Typography>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={(e) => {
              e.stopPropagation();
              triggerUpload();
            }}
          >
            Choose File to Upload
          </Button>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileInputChange}
          />
        </Box>
      </Paper>
    </Box>
  );
}
