export const card = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 18,
  padding: "18px 20px",
  marginBottom: 14,
  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
  transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s",
  position: "relative",
  overflow: "hidden",
  cursor: "default",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    borderColor: "var(--border2)",
  },
};

export const selectStyle = {
  background: "var(--surface2)",
  border: "1.5px solid var(--border)",
  borderRadius: 10,
  padding: "9px 32px 9px 13px",
  color: "var(--text1)",
  fontFamily: "inherit",
  fontSize: 12,
  fontWeight: 600,
  outline: "none",
  width: "100%",
  appearance: "none",
  cursor: "pointer",
  transition: "all 0.2s",
};

export const statCard = (color) => ({
  background: `linear-gradient(145deg, rgba(${hexToRgb(color)}, 0.12) 0%, var(--surface) 65%)`,
  border: `1px solid rgba(${hexToRgb(color)}, 0.22)`,
  borderRadius: 14,
  padding: "14px 16px",
  boxShadow: `0 4px 20px rgba(${hexToRgb(color)}, 0.08)`,
  position: "relative",
  overflow: "hidden",
  transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s",
  cursor: "default",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: `0 12px 36px rgba(${hexToRgb(color)}, 0.18)`,
    borderColor: `rgba(${hexToRgb(color)}, 0.38)`,
  },
});

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16,
      )}`
    : "59, 111, 232";
};

export const activeRow = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "9px 12px",
  background: "var(--surface2, rgba(0,0,0,0.12))",
  borderRadius: 8,
};

export const iconBox = (bg) => ({
  width: 26,
  height: 26,
  borderRadius: 7,
  background: bg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  fontSize: 13,
});
