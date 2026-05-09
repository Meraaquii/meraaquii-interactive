import { useEffect, useState, useCallback } from "react";
import ExportButton from "../ExportButton/ExportButton";
import { getDeviceData } from "../../controllers/deviceController";
import { getSalesmanData } from "../../controllers/salesmanController";
import adminService from "../../services/Adminservice";
import { TbEdit } from "react-icons/tb";
import { IoPersonAddOutline } from "react-icons/io5";
import Table from "../Table/Table";
import "./Devicelist.css";
import UpdateDeviceModal from "../Devicelist/UpdateDeviceModal/UpdateDeviceModal";
import AddSalesman from "../Salesmanlist/AddSalesman/AddSalesman";
import { useLayout } from "../Dashboardlayout/Dashboardlayout";

const DEVICELIST_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  // { key: "email", label: "Email" },
  { key: "deviceName", label: "Login Id" },
  { key: "devicePassword", label: "Login Password" },
  { key: "deviceOculasAuthId", label: "Oculas Auth ID" },
  { key: "deviceStatus", label: "Status" },
  { key: "action", label: "Action" },
];

export default function DeviceList() {
  const [rows, setRows] = useState([]);
  const [rawDevices, setRawDevices] = useState([]);
  const [salesmanRows, setSalesmanRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [showAddSalesman, setShowAddSalesman] = useState(false);

  const { setSidebarBlur } = useLayout() ?? {};

  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const userType = localStorage.getItem("user_type");
  const clientId = user?.client_id;
  const isAdmin = userType === "A";

  const loadSalesmanData = useCallback(() => {
    if (clientId) {
      getSalesmanData(setSalesmanRows, clientId);
    }
  }, [clientId]);

  useEffect(() => {
    loadSalesmanData();
  }, [loadSalesmanData]);

  const handleEdit = useCallback(
    (device) => {
      setSelectedDevice({
        ...device,
        clientId: device.client_id ?? device.clientId ?? null,
      });
      setIsModalOpen(true);
      setSidebarBlur?.(true);
    },
    [setSidebarBlur],
  );

  const getStatusLabel = (status) => {
    switch (status) {
      case "A":
        return "Active";
      case "I":
        return "Inactive";
      default:
        return "—";
    }
  };

  const normalizeDevice = useCallback(
    (rawDevice) => {
      const salesman = salesmanRows.find(
        (s) => s.id === (rawDevice.salesman_id ?? rawDevice.salesmanId),
      );

      return {
        name: salesman?.name ?? "—",
        phone: salesman?.phone ?? "—",
        // email: salesman?.email ?? "—",
        deviceName: rawDevice.device_name ?? rawDevice.deviceName ?? "—",
        devicePassword:
          rawDevice.device_password ?? rawDevice.devicePassword ?? "—",
        deviceOculasAuthId:
          rawDevice.oculas_auth_id ?? rawDevice.deviceOculasAuthId ?? "—",
        deviceStatus: getStatusLabel(
          rawDevice.device_status ?? rawDevice.deviceStatus,
        ),
        action: (
          <button
            className="edit-btn"
            onClick={() => handleEdit(rawDevice)}
            title="Edit Device"
          >
            <TbEdit size={22} />
          </button>
        ),
      };
    },
    [salesmanRows, handleEdit],
  );

  useEffect(() => {
    if (isAdmin) {
      adminService
        .getDevices()
        .then((data) => {
          setRawDevices(data);
          setRows(data.map(normalizeDevice));
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      if (!clientId) {
        setError("User ID not found. Please log in again.");
        setLoading(false);
        return;
      }
      getDeviceData((data) => {
        if (!data || data.length === 0) {
          setError("No devices found for this account.");
          setLoading(false);
          return;
        }
        setRawDevices(data);
        setRows(data.map(normalizeDevice));
        setLoading(false);
      }, clientId).catch((err) => {
        console.error("getDeviceData failed:", err);
        setError("Failed to load devices. Please try again.");
        setLoading(false);
      });
    }
  }, [isAdmin, clientId, normalizeDevice]);

  useEffect(() => {
    if (rawDevices.length > 0) {
      setRows(rawDevices.map(normalizeDevice));
    }
  }, [salesmanRows, rawDevices, normalizeDevice]);

  const handleModalSubmit = useCallback(
    (updatedData) => {
      const updatedList = rawDevices.map((d) =>
        (d.device_id ?? d.id) ===
        (selectedDevice?.device_id ?? selectedDevice?.id)
          ? { ...d, ...updatedData }
          : d,
      );
      setRawDevices(updatedList);
      setRows(updatedList.map(normalizeDevice));
      setIsModalOpen(false);
      setSidebarBlur?.(false);
    },
    [rawDevices, selectedDevice, normalizeDevice, setSidebarBlur],
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSidebarBlur?.(false);
  }, [setSidebarBlur]);

  const handleOpenAddSalesman = () => {
    setShowAddSalesman(true);
    setSidebarBlur?.(true);
  };

  const handleCloseAddSalesman = () => {
    setShowAddSalesman(false);
    setSidebarBlur?.(false);
  };

  return (
    <div className="device-list">
      <div className="device-list__header">
        <h2 className="device-list__title">User List</h2>
        <div className="device-list__actions">
          <ExportButton
            data={rows}
            columns={DEVICELIST_COLUMNS}
            filename="devices"
          />
          <button
            className="salesman-list__add-btn"
            onClick={handleOpenAddSalesman}
          >
            <IoPersonAddOutline size={16} />
            Add
          </button>
        </div>
      </div>

      {error && <p className="device-list__error">{error}</p>}

      {loading ? (
        <p className="device-list__loading">Loading devices…</p>
      ) : (
        <Table rows={rows} columns={DEVICELIST_COLUMNS} />
      )}

      {/* Device edit modal */}
      <UpdateDeviceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        device={selectedDevice}
        onSubmit={handleModalSubmit}
      />

      {/* Add Salesman modal */}
      {showAddSalesman && (
        <AddSalesman
          onClose={handleCloseAddSalesman}
          clientId={clientId}
          refreshData={loadSalesmanData}
        />
      )}
    </div>
  );
}
