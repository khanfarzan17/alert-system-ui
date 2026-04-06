import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import EnhancedTable from "../../components/table/EnhancedTable";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const StatCard = ({ icon, label, value, color }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      bgcolor: "#fff",
      border: "1px solid #e0e0e0",
      borderRadius: 2,
      px: 2.5,
      py: 2,
      minWidth: 180,
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}
  >
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: `${color}18`,
        color,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Box sx={{ fontSize: 22, fontWeight: 800, lineHeight: 1, color }}>
        {value}
      </Box>
      <Box sx={{ fontSize: 12, color: "#888", mt: 0.3 }}>{label}</Box>
    </Box>
  </Box>
);

const AlertPage = () => {
  const { tableData, tableColumns } = useSelector((state) => state.upload);

  // Filter only rows where Days Remaining <= 50
  const alertData = useMemo(
    () =>
      tableData
        .filter(
          (row) =>
            row["Days Remaining"] !== "N/A" && row["Days Remaining"] <= 50,
        )
        .map((row) => ({
          ...row,
          Status: row["Days Remaining"] <= 0 ? "Overdue" : "Upcoming",
        })),
    [tableData],
  );

  const overdueCount = alertData.filter((r) => r.Status === "Overdue").length;
  const upcomingCount = alertData.filter((r) => r.Status === "Upcoming").length;

  // Add Status column to the headCells
  const alertColumns = useMemo(() => {
    if (tableColumns.length === 0) return [];
    return [...tableColumns, { id: "Status", label: "Status" }];
  }, [tableColumns]);

  if (alertData.length === 0) {
    return (
      <Box
        sx={{
          p: 6,
          textAlign: "center",
          color: "#999",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <NotificationsActiveIcon sx={{ fontSize: 48, color: "#ccc" }} />
        <Box sx={{ fontSize: 20, fontWeight: 700, color: "#666" }}>
          No Alerts
        </Box>
        <Box sx={{ fontSize: 14 }}>
          Upload an asset file first to see alerts here.
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 2.5 }}>
        <Box
          sx={{
            fontSize: 22,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          Alerts
        </Box>
        <Box sx={{ fontSize: 13, color: "#888", mt: 0.5 }}>
          Showing assets with due dates within 50 days or overdue
        </Box>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <StatCard
          icon={<NotificationsActiveIcon fontSize="small" />}
          label="Total Alerts"
          value={alertData.length}
          color="#1976d2"
        />
        <StatCard
          icon={<ErrorIcon fontSize="small" />}
          label="Overdue"
          value={overdueCount}
          color="#d32f2f"
        />
        <StatCard
          icon={<WarningAmberIcon fontSize="small" />}
          label="Upcoming"
          value={upcomingCount}
          color="#ed6c02"
        />
      </Box>

      {/* Table */}
      <EnhancedTable
        rows={alertData}
        headCells={alertColumns}
        title="Alert Assets"
        statusColumn="Status"
      />
    </Box>
  );
};

export default AlertPage;
