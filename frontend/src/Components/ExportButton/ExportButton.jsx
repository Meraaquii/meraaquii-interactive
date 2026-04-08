import { LuDownload } from "react-icons/lu";
import { saveAs } from "file-saver";
import "./ExportButton.css";
import toast from "react-hot-toast";

export default function ExportButton({ data, columns, filename = "export" }) {
  const handleDownload = () => {
    if (!data?.length) return toast.error("No data to export");

    const exportColumns = columns.filter(
      (col) =>
        col.key &&
        !col.key.toLowerCase().includes("action") &&
        typeof col.render !== "function",
    );

    const cleanedData = data.map((row) => {
      const newRow = {};
      exportColumns.forEach((col) => {
        newRow[col.key] = row[col.key];
      });
      return newRow;
    });

    let html = `<table border="1" style="border-collapse: collapse;">`;

    html += "<thead><tr>";
    exportColumns.forEach((col) => {
      html += `<th>${col.label}</th>`;
    });
    html += "</tr></thead><tbody>";

    cleanedData.forEach((row) => {
      html += "<tr>";
      exportColumns.forEach((col) => {
        html += `<td>${row[col.key] ?? ""}</td>`;
      });
      html += "</tr>";
    });

    html += "</tbody></table>";

    const blob = new Blob([html], {
      type: "application/vnd.ms-excel",
    });

    saveAs(blob, `${filename}.xls`);
  };

  return (
    <button
      className="export-btn"
      title="Export Excel"
      onClick={handleDownload}
    >
      <LuDownload size={16} />
    </button>
  );
}
