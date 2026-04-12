export const card = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "16px 18px",
  marginBottom: 14,
};

export const selectStyle = {
  background: "var(--surface)",
  border: "1.5px solid var(--border)",
  borderRadius: 8,
  padding: "8px 28px 8px 11px",
  color: "var(--text1)",
  fontFamily: "inherit",
  fontSize: 12,
  outline: "none",
  width: "100%",
  appearance: "none",
  cursor: "pointer",
};

export const statCard = (color) => ({
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  padding: "11px 13px",
  borderTop: `2px solid ${color}`,
});

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
