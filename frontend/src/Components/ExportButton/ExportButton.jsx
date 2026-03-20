import { LuDownload } from "react-icons/lu";
import "./ExportButton.css";

export default function ExportButton({ onClick }) {
  return (
    <button className="export-btn" title="Export" onClick={onClick}>
      <LuDownload size={16} />
    </button>
  );
}
