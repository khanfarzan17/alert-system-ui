import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import { Box, Button, Chip, Typography, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 3;

function getStatusChip(status) {
  if (!status || status === "sent") {
    return (
      <Chip
        label="Sent"
        size="small"
        sx={{
          background: "var(--success-soft)",
          color: "var(--success)",
          fontWeight: 700,
          fontSize: 10,
          height: 22,
          borderRadius: "100px",
        }}
      />
    );
  }
  return (
    <Chip
      label="Pending"
      size="small"
      sx={{
        background: "var(--warn-soft)",
        color: "var(--warn)",
        fontWeight: 700,
        fontSize: 10,
        height: 22,
        borderRadius: "100px",
      }}
    />
  );
}

export default function UploadList({ uploads = [] }) {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  if (uploads.length === 0) return null;

  const visible = showAll ? uploads : uploads.slice(0, PAGE_SIZE);

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 3,
        border: "1px solid var(--border)",
        overflow: "hidden",
        bgcolor: "var(--surface)",
        boxShadow: "var(--shadow)",
      }}
    >
      {/* ── Dark green header strip ── */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #166534 0%, #16a34a 50%,  #166534 100%)",
          px: 2.5,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              background: "rgba(255,255,255,0.14)",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FolderOpenIcon sx={{ color: "#fff", fontSize: 18 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.2,
              }}
            >
              Recent Uploads
            </Typography>
            <Typography
              sx={{ fontSize: 10, color: "rgba(255,255,255,0.6)", mt: 0.25 }}
            >
              {uploads.length} file{uploads.length !== 1 ? "s" : ""} uploaded
            </Typography>
          </Box>
        </Box>

        <Button
          onClick={() => navigate("/dashboard")}
          size="small"
          startIcon={
            <SpaceDashboardOutlinedIcon sx={{ fontSize: "14px !important" }} />
          }
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
          Dashboard
        </Button>
      </Box>

      {/* ── File rows ── */}
      <List disablePadding>
        {visible.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem
              alignItems="center"
              sx={{
                px: 2.5,
                py: 1.25,
                "&:hover": { bgcolor: "var(--surface2)" },
                transition: "background 0.15s",
              }}
            >
              <ListItemIcon sx={{ minWidth: 46 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,

                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <InsertDriveFileIcon
                    sx={{ color: "#1388a9", fontSize: 18 }}
                  />
                </Box>
              </ListItemIcon>

              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text1)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                    }}
                    title={item.name}
                  >
                    {item.name}
                  </Typography>
                }
                secondary={
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.25,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{ fontSize: 10, color: "var(--text3)" }}
                    >
                      {item.uploadedAt}
                    </Typography>
                    {item.size && (
                      <>
                        <Box
                          component="span"
                          sx={{
                            width: 3,
                            height: 3,
                            borderRadius: "50%",
                            background: "var(--text4)",
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          component="span"
                          sx={{ fontSize: 10, color: "var(--text3)" }}
                        >
                          {item.size}
                        </Typography>
                      </>
                    )}
                  </Box>
                }
              />
            </ListItem>

            {index < visible.length - 1 && (
              <Divider sx={{ mx: 2.5, borderColor: "var(--border)" }} />
            )}
          </React.Fragment>
        ))}
      </List>

      {/* ── Footer ── */}
      <Box
        sx={{
          background: "var(--surface2)",
          borderTop: "1px solid var(--border)",
          px: 2.5,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontSize: 11, color: "var(--text3)" }}>
          Showing {visible.length} of {uploads.length} upload
          {uploads.length !== 1 ? "s" : ""}
        </Typography>
        {uploads.length > PAGE_SIZE && (
          <Button
            size="small"
            onClick={() => setShowAll((p) => !p)}
            sx={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--accent)",
              textTransform: "none",
              p: 0,
              minWidth: 0,
              "&:hover": {
                background: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            {showAll ? "Show less" : "See all →"}
          </Button>
        )}
      </Box>
    </Box>
  );
}
