import { useEffect, useState } from "react";
import ExportButton from "../ExportButton/ExportButton";
import { getDeviceData } from "../../controllers/deviceController";
import Table from "../Table/Table";
import "./Devicelist.css";

const DIVICELIST_COLUMNS = [
  { key: "deviceName", label: "Device Name" },
  { key: "devicePassword", label: "Device Password" },
  { key: "deviceOculasAuthId", label: "Oculas Auth ID" },
  { key: "deviceStatus", label: "Status" },
  { key: "action", label: "Action" },
];

export default function DeviceList() {
  const [rows, setRows] = useState([]);
  const handleExport = () => {
    console.log("Export clicked!");
  };

  useEffect(() => {
    getDeviceData(setRows);
  }, []);

  return (
    <div className="device-list">
      {/* Page header */}
      <div className="device-list__header">
        <h2 className="device-list__title">Device List</h2>
        <ExportButton onClick={handleExport} />
      </div>

      {/* Table */}
      <Table rows={rows} columns={DIVICELIST_COLUMNS} />
    </div>
  );
}
