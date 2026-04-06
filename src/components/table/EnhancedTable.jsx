import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

export default function EnhancedTable({
  rows = [],
  headCells = [],
  title,
  statusColumn,
}) {
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
                    color: isOverdue ? "#d32f2f" : "#e65100",
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
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Typography sx={{ p: 2, fontWeight: 700 }} variant="h6" component="div">
          {title || "Uploaded Data"}
        </Typography>
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
            "& .row-critical": {
              backgroundColor: "#ffcccc",
              "&:hover": { backgroundColor: "#ffb3b3" },
            },
            "& .row-warning": {
              backgroundColor: "#fff3cd",
              "&:hover": { backgroundColor: "#ffe69c" },
            },
          }}
        />
      </Paper>
    </Box>
  );
}
