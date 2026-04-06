import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { exportTableData } from "../../utils/exportcsv";

export default function EnhancedTable({
  rows = [],
  headCells = [],
  title,
  statusColumn,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleExport = (format) => {
    setAnchorEl(null);
    exportTableData(rows, headCells, format);
  };

  if (rows.length === 0 || headCells.length === 0) return null;

  // Add unique id to each row for DataGrid
  const rowsWithId = React.useMemo(
    () => rows.map((row, index) => ({ ...row, _gridId: index })),
    [rows],
  );

  // Convert headCells ({id, label}) → DataGrid columns ({field, headerName})
  const columns = React.useMemo(
    () =>
      headCells.map((col) => {
        // "Days Remaining" column with color-coded chips
        if (col.id === "Days Remaining") {
          return {
            field: col.id,
            headerName: col.label,
            flex: 1,
            minWidth: 130,
            renderCell: (params) => {
              const days = params.value;
              if (days === "N/A" || days === undefined) {
                return (
                  <Chip
                    label="N/A"
                    size="small"
                    sx={{ fontWeight: 600, bgcolor: "#f5f5f5", color: "#999" }}
                  />
                );
              }
              const isCritical = days <= 10;
              const isWarning = days <= 50;
              return (
                <Chip
                  label={`${days} days`}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: "11.5px",
                    bgcolor: isCritical
                      ? "#ffebee"
                      : isWarning
                        ? "#fff3e0"
                        : "#e8f5e9",
                    color: isCritical
                      ? "#c62828"
                      : isWarning
                        ? "#e65100"
                        : "#2e7d32",
                    border: `1px solid ${isCritical ? "#ef9a9a" : isWarning ? "#ffcc80" : "#a5d6a7"}`,
                  }}
                />
              );
            },
          };
        }
        if (statusColumn && col.id === statusColumn) {
          return {
            field: col.id,
            headerName: col.label,
            flex: 1,
            minWidth: 130,
            renderCell: (params) => {
              const isOverdue = params.value === "Overdue";
              return (
                <Chip
                  label={params.value}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    bgcolor: isOverdue ? "#ffebee" : "#fff3e0",
                    color: isOverdue ? "#ba0606" : "#e65100",
                    border: `1px solid ${isOverdue ? "#ef9a9a" : "#ffcc80"}`,
                  }}
                />
              );
            },
          };
        }
        return {
          field: col.id,
          headerName: col.label,
          flex: 1,
          minWidth: 130,
        };
      }),
    [headCells, statusColumn],
  );

  // Row color-coding based on "Days Remaining"
  const getRowClassName = (params) => {
    const days = params.row["Days Remaining"];
    if (days === undefined || days === "N/A") return "";
    if (days <= 10) return "row-critical";
    if (days <= 50) return "row-warning";
    return "";
  };

  return (
    <Box sx={{ width: "100%", borderRadius: "5px", overflow: "hidden" }}>
      <Paper
        sx={{
          width: "100%",
          mb: 2,
          borderRadius: "5px",
          border: "1px solid #e8ecf1",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2.5,
            py: 2,
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "17px",
              color: "#1a1a2e",
              letterSpacing: "-0.3px",
            }}
            variant="h6"
            component="div"
          >
            {title || "Uploaded Data"}
          </Typography>
          <Button
            variant="outlined"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              fontSize: "11.5px",
              fontWeight: 600,
              color: "var(--accent)",
              padding: "5px 12px",
              borderRadius: "7px",
              border: "1.5px solid rgba(59, 111, 232, .25)",
              background: "var(--accent-soft)",
              textTransform: "none",
              transition: "all .15s",
              "&:hover": {
                border: "1.5px solid rgba(59, 111, 232, .5)",
                background: "var(--accent-soft)",
              },
            }}
          >
            Export ▾
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: { borderRadius: "10px", minWidth: 140, mt: 0.5 },
            }}
          >
            <MenuItem
              onClick={() => handleExport("csv")}
              sx={{ fontSize: 13, fontWeight: 600 }}
            >
              📄 Export as CSV
            </MenuItem>
            <MenuItem
              onClick={() => handleExport("xlsx")}
              sx={{ fontSize: 13, fontWeight: 600 }}
            >
              📊 Export as XLSX
            </MenuItem>
          </Menu>
        </Box>
        <DataGrid
          rows={rowsWithId}
          columns={columns}
          getRowId={(row) => row._gridId}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          getRowClassName={getRowClassName}
          sx={{
            border: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "13px",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8f9fc",
              borderBottom: "1.5px solid #e8ecf1",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 700,
              fontSize: "12px",
              color: "#555",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f2f5",
              color: "#333",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
            },
            "& .MuiDataGrid-row": {
              transition: "background 0.15s",
              "&:hover": {
                backgroundColor: "#f6f8ff",
              },
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1.5px solid #e8ecf1",
              backgroundColor: "#fafbfd",
            },
            "& .MuiCheckbox-root": {
              color: "#c0c8d8",
              "&.Mui-checked": {
                color: "var(--accent)",
              },
            },
            "& .row-critical": {
              backgroundColor: "#f88c8c",
              "&:hover": { backgroundColor: "#ffebeb !important" },
            },
            "& .row-warning": {
              backgroundColor: "#f5eacb",
              "&:hover": { backgroundColor: "#fff5e0 !important" },
            },
          }}
        />
      </Paper>
    </Box>
  );
}
