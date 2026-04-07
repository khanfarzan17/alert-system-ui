import * as XLSX from "xlsx";

export const exportTableData = (rows, headCells, format = "csv") => {
  const exportRows = rows.map((row) => {
    const clean = {};
    headCells.forEach((col) => {
      clean[col.label] = row[col.id];
    });
    return clean;
  });

  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  if (format === "csv") {
    XLSX.writeFile(workbook, "export.csv", { bookType: "csv" });
  } else {
    XLSX.writeFile(workbook, "export.xlsx", { bookType: "xlsx" });
  }
};
