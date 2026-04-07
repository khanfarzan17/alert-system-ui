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
                    sx={{
                      fontWeight: 600,
                      bgcolor: "var(--surface2)",
                      color: "var(--text3)",
                    }}
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
                      ? "var(--danger-soft)"
                      : isWarning
                        ? "var(--warn-soft)"
                        : "var(--success-soft)",
                    color: isCritical
                      ? "var(--danger)"
                      : isWarning
                        ? "var(--warn)"
                        : "var(--success)",
                    border: `1px solid`,
                    borderColor: isCritical
                      ? "var(--danger)"
                      : isWarning
                        ? "var(--warn)"
                        : "var(--success)",
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
                    bgcolor: isOverdue
                      ? "var(--danger-soft)"
                      : "var(--warn-soft)",
                    color: isOverdue ? "var(--danger)" : "var(--warn)",
                    border: `1px solid`,
                    borderColor: isOverdue ? "var(--danger)" : "var(--warn)",
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
          minWidth: 110,
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
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
          overflow: "hidden",
          bgcolor: "var(--surface)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1.5,
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "15px",
              color: "var(--text1)",
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
              sx: {
                borderRadius: "10px",
                minWidth: 140,
                mt: 0.5,
                bgcolor: "var(--surface)",
                color: "var(--text1)",
              },
            }}
          >
            <MenuItem
              onClick={() => handleExport("csv")}
              sx={{ fontSize: 13, fontWeight: 600 }}
            >
              Export as CSV
            </MenuItem>
            <MenuItem
              onClick={() => handleExport("xlsx")}
              sx={{ fontSize: 13, fontWeight: 600 }}
            >
              Export as XLSX
            </MenuItem>
          </Menu>
        </Box>
        <DataGrid
          rows={rowsWithId}
          columns={columns}
          getRowId={(row) => row._gridId}
          density="compact"
          rowHeight={40}
          columnHeaderHeight={42}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          getRowClassName={getRowClassName}
          sx={{
            border: 0,
            bgcolor: "var(--surface)",
            color: "var(--text1)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "13px",
            "& .MuiDataGrid-main": {
              bgcolor: "var(--surface)",
            },
            "& .MuiDataGrid-virtualScroller": {
              bgcolor: "var(--surface)",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "var(--surface2)",
              borderBottom: "1.5px solid var(--border)",
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "var(--surface2)",
              color: "var(--text2)",
              "&:focus, &:focus-within": {
                outline: "none",
              },
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 700,
              fontSize: "11px",
              color: "var(--text2)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid var(--border)",
              color: "var(--text2)",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              py: 0,
              bgcolor: "transparent",
            },
            "& .MuiDataGrid-row": {
              bgcolor: "var(--surface)",
              transition: "background 0.15s",
              "&:hover": {
                backgroundColor: "var(--surface2) !important",
              },
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1.5px solid var(--border)",
              backgroundColor: "var(--surface2)",
              color: "var(--text2)",
            },
            "& .MuiCheckbox-root": {
              color: "var(--text4)",
              transition: "color 0.2s ease",
              "&:hover": {
                backgroundColor: "var(--accent-soft)",
              },
              "&.Mui-checked": {
                color: "var(--accent)",
              },
              "&.MuiCheckbox-indeterminate": {
                color: "var(--accent)",
              },
            },
            "& .MuiTablePagination-root": {
              color: "var(--text2)",
            },
            "& .MuiTablePagination-selectIcon": {
              color: "var(--text3)",
            },
            "& .MuiIconButton-root": {
              color: "var(--text3)",
            },
            "& .MuiDataGrid-columnSeparator": {
              color: "var(--border)",
            },
            "& .MuiDataGrid-menuIcon button": {
              color: "var(--text3)",
            },
            "& .MuiDataGrid-sortIcon": {
              color: "var(--text3)",
            },
            "& .MuiDataGrid-overlay": {
              bgcolor: "var(--surface)",
              color: "var(--text2)",
            },
            "& .MuiDataGrid-filler": {
              bgcolor: "var(--surface)",
            },
            "& .MuiDataGrid-row.row-critical": {
              backgroundColor: "var(--danger-soft)",
              "&:hover": { backgroundColor: "var(--danger-soft) !important" },
            },
            "& .MuiDataGrid-row.row-warning": {
              backgroundColor: "var(--warn-soft)",
              "&:hover": { backgroundColor: "var(--warn-soft) !important" },
            },
          }}
        />
      </Paper>
    </Box>
  );
}
