import { Box, Typography, Paper, Button } from "@mui/material";
import NotificationsOffRoundedIcon from "@mui/icons-material/NotificationsOffRounded";

export default function EmptyAlerts({ onUploadClick }) {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          textAlign: "center",
          borderRadius: 3,
          maxWidth: 400,
          transition: "0.3s",
          bgcolor: "var(--surface)",
          color: "var(--text1)",
          "&:hover": { transform: "translateY(-4px)" },
        }}
      >
        <NotificationsOffRoundedIcon
          sx={{ fontSize: 60, color: "#9e9e9e", mb: 2 }}
        />

        <Typography variant="h5" fontWeight={600} gutterBottom>
          No Alerts
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Upload an asset file first to see alerts here.
        </Typography>

        {onUploadClick && (
          <Button
            variant="contained"
            color="success"
            onClick={onUploadClick}
            sx={{
              mt: 3,
              px: 3,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Upload File
          </Button>
        )}
      </Paper>
    </Box>
  );
}
