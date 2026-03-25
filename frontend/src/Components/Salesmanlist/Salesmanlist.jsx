import { useEffect, useState } from "react";
import { IoPersonAddOutline } from "react-icons/io5";
import Table from "../Table/Table";
import ExportButton from "../ExportButton/ExportButton";
import { getSalesmanData } from "../../controllers/salesmanController";
import "./SalesmanList.css";

const SALESMAN_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "createdAt", label: "Created At" },
  { key: "action", label: "Action" },
];

export default function SalesmanList() {
  const [rows, setRows] = useState([]);

  const handleExport = () => {
    console.log("Export clicked!");
  };
  const user = JSON.parse(localStorage.getItem("user"));
  const clientId = user?.client_id;

  useEffect(() => {
    if (clientId) {
      getSalesmanData(setRows, clientId);
    }
  }, [clientId]);

  return (
    <div className="salesman-list">
      <div className="salesman-list__header">
        <h2 className="salesman-list__title">Salesman List</h2>

        <div className="salesman-list__actions">
          <ExportButton onClick={handleExport} />

          <span title="Add Salesman">
            <button className="salesman-list__add-btn">
              <IoPersonAddOutline size={16} />
              Add
            </button>
          </span>
        </div>
      </div>

      <Table rows={rows} columns={SALESMAN_COLUMNS} showExport={false} />
    </div>
  );
}
