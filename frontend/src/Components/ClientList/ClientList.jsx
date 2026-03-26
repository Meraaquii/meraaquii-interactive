import { useEffect, useState } from "react";
import ExportButton from "../ExportButton/ExportButton";
import Table from "../Table/Table";
import adminService from "../../services/Adminservice";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminService
      .getClients()
      .then((data) => setRows(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="client-list">
      <div className="client-list__header">
        <h2 className="client-list__title">Client List</h2>
        <ExportButton
          data={rows}
          columns={CLIENTLIST_COLUMNS}
          filename="clients"
        />
      </div>

      {error && <p className="client-list__error">{error}</p>}

      {loading ? (
        <p className="client-list__loading">Loading clients…</p>
      ) : (
        <Table rows={rows} columns={CLIENTLIST_COLUMNS} />
      )}
    </div>
  );
}
