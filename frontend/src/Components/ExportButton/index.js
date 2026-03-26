import { LuDownload } from "react-icons/lu";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import {
  Document,
  Packer,
  Paragraph,
  Table as DocTable,
  TableRow,
  TableCell,
} from "docx";
import "./ExportButton.css";

export default function ExportButton({ data, columns, filename = "export" }) {
  const handleDownload = async () => {
    if (!data?.length) return alert("No data to export");

    const zip = new JSZip();

    // --- CSV ---
    const csvHeaders = columns.map((c) => c.label);
    const csvRows = [
      csvHeaders.join(","),
      ...data.map((row) =>
        columns
          .map(
            (col) => `"${(row[col.key] ?? "").toString().replace(/"/g, '""')}"`,
          )
          .join(","),
      ),
    ];
    zip.file(`${filename}.csv`, csvRows.join("\n"));

    // --- XLSX ---
    const xlsxData = data.map((row) => {
      const obj = {};
      columns.forEach((col) => (obj[col.label] = row[col.key] ?? ""));
      return obj;
    });
    const worksheet = XLSX.utils.json_to_sheet(xlsxData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const xlsxBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    zip.file(`${filename}.xlsx`, xlsxBuffer);

    // --- DOCX ---
    const docRows = [
      new TableRow({
        children: columns.map(
          (col) => new TableCell({ children: [new Paragraph(col.label)] }),
        ),
      }),
      ...data.map(
        (row) =>
          new TableRow({
            children: columns.map(
              (col) =>
                new TableCell({
                  children: [new Paragraph(row[col.key]?.toString() ?? "")],
                }),
            ),
          }),
      ),
    ];
    const doc = new Document({
      sections: [{ children: [new DocTable({ rows: docRows })] }],
    });
    const docBlob = await Packer.toBlob(doc);
    const docArrayBuffer = await docBlob.arrayBuffer();
    zip.file(`${filename}.docx`, docArrayBuffer);

    // --- XML ---
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<rows>\n';
    data.forEach((row) => {
      xml += "  <row>\n";
      columns.forEach((col) => {
        xml += `    <${col.key}>${row[col.key] ?? ""}</${col.key}>\n`;
      });
      xml += "  </row>\n";
    });
    xml += "</rows>";
    zip.file(`${filename}.xml`, xml);

    // --- Generate zip and save ---
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `${filename}.zip`);
  };

  return (
    <button
      className="export-btn"
      title="Export All Formats"
      onClick={handleDownload}
    >
      <LuDownload size={16} />
    </button>
  );
}
