import { useEffect, useState } from "react";
import ExportButton from "../ExportButton/ExportButton";
import Table from "../Table/Table";
import "./ClientList.css";

const CLIENTLIST_COLUMNS = [
  { key: "clientName", label: "Client Name" },
  { key: "clientMobNo", label: "Client Mob No" },
  { key: "clientEmail", label: "Client Email" },
  { key: "clientStatus", label: "Status" },
  { key: "action", label: "Action" },
];

export default function ClientList() {
  const [rows, setRows] = useState([]);
  const handleExport = () => {
    console.log("Export clicked!");
  };

  //   useEffect(() => {
  //     getDeviceData(setRows);
  //   }, []);

  return (
    <div className="client-list">
      {/* Page header */}
      <div className="client-list__header">
        <h2 className="client-list__title">Client List</h2>
        <ExportButton onClick={handleExport} />
      </div>

      {/* Table */}
      <Table rows={rows} columns={CLIENTLIST_COLUMNS} />
    </div>
  );
}
