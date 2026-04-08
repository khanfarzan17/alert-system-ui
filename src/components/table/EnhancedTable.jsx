import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { exportTableData } from "../../utils/exportcsv";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

// ── Column type detectors ────────────────────────────────────────────────────
const isAssetIdField = (id) =>
  id.toLowerCase().replace(/\s/g, "").includes("assetid");

const isDateField = (id) =>
  id.toLowerCase().replace(/\s/g, "").includes("date");

const isRiskField = (id) => {
  const n = id.toLowerCase().replace(/\s/g, "");
  return n === "risk" || (n.includes("risk") && !n.includes("engineer"));
};

// ── Date formatter ───────────────────────────────────────────────────────────
const DATE_FORMATS = [
  "YYYY-MM-DD",
  "MM/DD/YYYY",
  "M/D/YYYY",
  "MM/DD/YY",
  "M/D/YY",
  "DD/MM/YYYY",
  "D/M/YYYY",
  "DD-MM-YYYY",
  "YYYY/MM/DD",
];
const formatDate = (val) => {
  if (!val) return val;
  const str = String(val).trim();
  for (const fmt of DATE_FORMATS) {
    const d = dayjs(str, fmt, true);
    if (d.isValid()) return d.format("MMM DD, YYYY");
  }
  const fallback = dayjs(str);
  return fallback.isValid() ? fallback.format("MMM DD, YYYY") : val;
};

// ── Chip configs ─────────────────────────────────────────────────────────────
const RISK_MAP = {
  high: {
    label: "High",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.3)",
  },
  medium: {
    label: "Medium",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.3)",
  },
  low: {
    label: "Low",
    color: "#14b8a6",
    bg: "rgba(20,184,166,0.12)",
    border: "rgba(20,184,166,0.3)",
  },
};

const STATUS_MAP = {
  critical: {
    label: "Critical",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.3)",
  },
  warning: {
    label: "Warning",
    color: "#f97316",
    bg: "rgba(249,115,22,0.12)",
    border: "rgba(249,115,22,0.3)",
  },
  ontrack: {
    label: "On Track",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.3)",
  },
  safe: {
    label: "Safe",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.3)",
  },
  pending: {
    label: "Pending",
    color: "#818cf8",
    bg: "rgba(129,140,248,0.12)",
    border: "rgba(129,140,248,0.3)",
  },
};

const getChipConfig = (map, val) => {
  const key = String(val ?? "")
    .toLowerCase()
    .replace(/\s/g, "");
  return (
    map[key] ?? {
      label: String(val ?? ""),
      color: "var(--text3)",
      bg: "var(--surface2)",
      border: "var(--border)",
    }
  );
};

// ── Reusable dot chip ────────────────────────────────────────────────────────
const DotChip = ({ label, color, bg, border }) => (
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      px: "10px",
      py: "3px",
      borderRadius: "20px",
      background: bg,
      border: `1px solid ${border}`,
      fontSize: "11.5px",
      fontWeight: 700,
      color,
      whiteSpace: "nowrap",
      lineHeight: 1.6,
    }}
  >
    <Box
      component="span"
      sx={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
      }}
    />
    {label}
  </Box>
);

// ── Main component ───────────────────────────────────────────────────────────
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

  const rowsWithId = React.useMemo(
    () => rows.map((row, index) => ({ ...row, _gridId: index })),
    [rows],
  );

  const columns = React.useMemo(
    () =>
      headCells.map((col) => {
        const id = col.id;

        // ── Days Remaining ──────────────────────────────────────────────────
        if (id === "Days Remaining") {
          return {
            field: id,
            headerName: col.label,
            flex: 1,
            minWidth: 120,
            renderCell: (params) => {
              const days = params.value;
              if (days === "N/A" || days === undefined || days === null) {
                return (
                  <Box
                    sx={{
                      fontSize: "12px",
                      color: "var(--text4)",
                      fontWeight: 600,
                    }}
                  >
                    N/A
                  </Box>
                );
              }
              const n = Number(days);
              const color =
                n <= 10 ? "#ef4444" : n <= 50 ? "#f97316" : "#22c55e";
              return (
                <Box
                  sx={{
                    fontWeight: 800,
                    fontSize: "14px",
                    color,
                    fontFamily: "'SF Mono','Consolas',monospace",
                    letterSpacing: "-0.3px",
                  }}
                >
                  {n}d
                </Box>
              );
            },
          };
        }

        // ── Asset ID ────────────────────────────────────────────────────────
        if (isAssetIdField(id)) {
          return {
            field: id,
            headerName: col.label,
            flex: 1,
            minWidth: 130,
            renderCell: (params) => (
              <Box
                sx={{
                  px: "8px",
                  py: "3px",
                  borderRadius: "6px",

                  fontFamily: "'SF Mono','Consolas',monospace",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  color: "#60a5fa",
                  letterSpacing: "0.4px",
                  whiteSpace: "nowrap",
                }}
              >
                {params.value}
              </Box>
            ),
          };
        }

        // ── Date columns ────────────────────────────────────────────────────
        if (isDateField(id)) {
          return {
            field: id,
            headerName: col.label,
            flex: 1,
            minWidth: 140,
            renderCell: (params) => (
              <Box
                sx={{
                  fontFamily: "'SF Mono','Consolas',monospace",
                  fontSize: "12.5px",
                  color: "var(--text2)",
                  letterSpacing: "0.2px",
                }}
              >
                {formatDate(params.value)}
              </Box>
            ),
          };
        }

        // ── Risk column ─────────────────────────────────────────────────────
        if (isRiskField(id)) {
          return {
            field: id,
            headerName: col.label,
            flex: 1,
            minWidth: 120,
            renderCell: (params) => {
              const cfg = getChipConfig(RISK_MAP, params.value);
              return <DotChip {...cfg} />;
            },
          };
        }

        // ── Status column ───────────────────────────────────────────────────
        if (statusColumn && id === statusColumn) {
          return {
            field: id,
            headerName: col.label,
            flex: 1,
            minWidth: 130,
            renderCell: (params) => {
              const cfg = getChipConfig(STATUS_MAP, params.value);
              return <DotChip {...cfg} />;
            },
          };
        }

        // ── Default ─────────────────────────────────────────────────────────
        return {
          field: id,
          headerName: col.label,
          flex: 1,
          minWidth: 120,
        };
      }),
    [headCells, statusColumn],
  );

  const getRowClassName = (params) => {
    const days = params.row["Days Remaining"];
    if (days === undefined || days === "N/A") return "";
    if (days <= 10) return "row-critical";
    if (days <= 50) return "row-warning";
    return "";
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        sx={{
          width: "100%",
          mb: 2,
          borderRadius: "12px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
          overflow: "hidden",
          bgcolor: "var(--surface)",
        }}
      >
        {/* ── Toolbar ── */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            py: 2,
            borderBottom: "1.5px solid var(--border)",
            bgcolor: "var(--surface)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "15px",
              color: "var(--text1)",
              letterSpacing: "-0.3px",
            }}
          >
            {title || "Uploaded Data"}
          </Typography>

          <Button
            variant="outlined"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#60a5fa",
              padding: "6px 16px",
              borderRadius: "8px",
              border: "1.5px solid rgba(96,165,250,0.35)",
              background: "rgba(59,130,246,0.08)",
              textTransform: "none",
              letterSpacing: "0.2px",
              transition: "all .15s",
              "&:hover": {
                border: "1.5px solid rgba(96,165,250,0.6)",
                background: "rgba(59,130,246,0.14)",
              },
            }}
          >
            Export CSV ↗
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                borderRadius: "10px",
                minWidth: 150,
                mt: 0.5,
                bgcolor: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                color: "var(--text1)",
              },
            }}
          >
            <MenuItem
              onClick={() => handleExport("csv")}
              sx={{
                fontSize: 13,
                fontWeight: 600,
                gap: 1,
                "&:hover": { bgcolor: "var(--surface2)" },
              }}
            >
              📄 Export as CSV
            </MenuItem>
            <MenuItem
              onClick={() => handleExport("xlsx")}
              sx={{
                fontSize: 13,
                fontWeight: 600,
                gap: 1,
                "&:hover": { bgcolor: "var(--surface2)" },
              }}
            >
              📊 Export as XLSX
            </MenuItem>
          </Menu>
        </Box>

        {/* ── DataGrid ── */}
        <DataGrid
          rows={rowsWithId}
          columns={columns}
          getRowId={(row) => row._gridId}
          density="standard"
          rowHeight={48}
          columnHeaderHeight={44}
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

            // ── Scrollbar ──────────────────────────────────────────────────
            "& ::-webkit-scrollbar": { width: 6, height: 6 },
            "& ::-webkit-scrollbar-track": { background: "transparent" },
            "& ::-webkit-scrollbar-thumb": {
              background: "var(--border)",
              borderRadius: 3,
            },

            // ── Column headers ─────────────────────────────────────────────
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "var(--surface2)",
              borderBottom: "1.5px solid var(--border)",
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "var(--surface2)",
              "&:focus, &:focus-within": { outline: "none" },
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 700,
              fontSize: "10.5px",
              color: "var(--text3)",
              textTransform: "uppercase",
              letterSpacing: "0.7px",
            },

            // ── Cells ──────────────────────────────────────────────────────
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid var(--border)",
              color: "var(--text2)",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              bgcolor: "transparent",
              "&:focus, &:focus-within": { outline: "none" },
            },

            // ── Rows ───────────────────────────────────────────────────────
            "& .MuiDataGrid-row": {
              bgcolor: "var(--surface)",
              transition: "background 0.12s",
              "&:hover": { backgroundColor: "var(--surface2) !important" },
            },
            "& .MuiDataGrid-row.row-critical": {
              backgroundColor: "rgba(239,68,68,0.06)",
              "&:hover": { backgroundColor: "rgba(239,68,68,0.10) !important" },
            },
            "& .MuiDataGrid-row.row-warning": {
              backgroundColor: "rgba(249,115,22,0.06)",
              "&:hover": {
                backgroundColor: "rgba(249,115,22,0.10) !important",
              },
            },

            // ── Footer ─────────────────────────────────────────────────────
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1.5px solid var(--border)",
              backgroundColor: "var(--surface2)",
              color: "var(--text2)",
              minHeight: 48,
            },

            // ── Misc ───────────────────────────────────────────────────────
            "& .MuiDataGrid-main, & .MuiDataGrid-virtualScroller": {
              bgcolor: "var(--surface)",
            },
            "& .MuiCheckbox-root": {
              color: "var(--text4)",
              "&:hover": { backgroundColor: "rgba(59,130,246,0.08)" },
              "&.Mui-checked, &.MuiCheckbox-indeterminate": {
                color: "#3b82f6",
              },
            },
            "& .MuiTablePagination-root": { color: "var(--text2)" },
            "& .MuiTablePagination-selectIcon, & .MuiIconButton-root": {
              color: "var(--text3)",
            },
            "& .MuiDataGrid-columnSeparator": { color: "var(--border)" },
            "& .MuiDataGrid-menuIcon button, & .MuiDataGrid-sortIcon": {
              color: "var(--text3)",
            },
            "& .MuiDataGrid-overlay": {
              bgcolor: "var(--surface)",
              color: "var(--text2)",
            },
            "& .MuiDataGrid-filler": { bgcolor: "var(--surface)" },
            "& .MuiDataGrid-selectedRowCount": {
              color: "var(--text3)",
              fontSize: 12,
            },
          }}
        />
      </Paper>
    </Box>
  );
}
