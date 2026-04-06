import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ListItemIcon from "@mui/material/ListItemIcon";

export default function UploadList({ uploads = [] }) {
  if (uploads.length === 0) return null;

  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        position: "relative",
        overflow: "auto",
        maxHeight: 300,
        borderRadius: 2,
        border: "1px solid #e0e7ef",
        "& ul": { padding: 0 },
      }}
      subheader={<li />}
    >
      <li>
        <ul>
          <ListSubheader
            sx={{
              fontWeight: 700,
              fontSize: 14,
              borderBottom: "1px solid #e0e7ef",
            }}
          >
            Recent Uploads
          </ListSubheader>
          {uploads.map((item, index) => (
            <ListItem key={index}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <InsertDriveFileIcon sx={{ color: "#0ea578" }} />
              </ListItemIcon>
              <ListItemText primary={item.name} secondary={item.uploadedAt} />
            </ListItem>
          ))}
        </ul>
      </li>
    </List>
  );
}
