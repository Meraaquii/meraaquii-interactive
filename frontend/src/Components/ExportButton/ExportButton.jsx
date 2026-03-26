import { LuDownload } from "react-icons/lu";
import { saveAs } from "file-saver";
import "./ExportButton.css";

export default function ExportButton({ data, columns, filename = "export" }) {
  const handleDownload = () => {
    if (!data?.length) return alert("No data to export");

    let html = `<table border="1" style="border-collapse: collapse;">`;
    html += "<thead><tr>";
    columns.forEach((col) => {
      html += `<th>${col.label}</th>`;
    });
    html += "</tr></thead><tbody>";
    data.forEach((row) => {
      html += "<tr>";
      columns.forEach((col) => {
        html += `<td>${row[col.key] ?? ""}</td>`;
      });
      html += "</tr>";
    });
    html += "</tbody></table>";

    const blob = new Blob([html], { type: "application/vnd.ms-excel" });

    saveAs(blob, `${filename}.xls`);
  };

  return (
    <button
      className="export-btn"
      title="Export Excel & Word"
      onClick={handleDownload}
    >
      <LuDownload size={16} />
    </button>
  );
}
