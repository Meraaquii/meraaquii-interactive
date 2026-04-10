import { useEffect, useState, useCallback } from "react";
import ExportButton from "../ExportButton/ExportButton";
import { getDeviceData } from "../../controllers/deviceController";
import adminService from "../../services/Adminservice";
import { TbEdit } from "react-icons/tb";
import Table from "../Table/Table";
import "./Devicelist.css";
import UpdateDeviceModal from "../Devicelist/UpdateDeviceModal/UpdateDeviceModal";
import { useLayout } from "../Dashboardlayout/Dashboardlayout";

const DEVICELIST_COLUMNS = [
  { key: "deviceName", label: "Device Name" },
  { key: "devicePassword", label: "Device Password" },
  { key: "deviceOculasAuthId", label: "Oculas Auth ID" },
  { key: "deviceStatus", label: "Status" },
  { key: "action", label: "Action" },
];

export default function DeviceList() {
  const [rows, setRows] = useState([]);
  const [rawDevices, setRawDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const { setSidebarBlur } = useLayout() ?? {};

  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const userType = localStorage.getItem("user_type");
  const clientId = user?.client_id;
  const isAdmin = userType === "A";

  const handleEdit = useCallback(
    (device) => {
      const fullDevice = {
        ...device,
        clientId: device.client_id ?? device.clientId ?? null,
      };
      console.log("DEVICE FOR MODAL:", fullDevice);
      console.log("RAW DEVICE:", JSON.stringify(device));
      setSelectedDevice(fullDevice);
      setIsModalOpen(true);
      setSidebarBlur?.(true); // Blur sidebar when modal opens
      console.log("[DeviceList] Sidebar blur set to TRUE");
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
    (rawDevice) => ({
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
    }),
    [handleEdit],
  );
  console.log("clientId:", clientId, "user:", user);

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
        console.log("Raw devices received in component:", data);
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

  const handleModalSubmit = useCallback(
    (updatedData) => {
      console.log("Updated:", updatedData);

      const updatedList = rawDevices.map((d) =>
        (d.device_id || d.id) ===
        (selectedDevice?.device_id || selectedDevice?.id)
          ? { ...d, ...updatedData }
          : d,
      );

      setRawDevices(updatedList);
      setRows(updatedList.map(normalizeDevice));
      setIsModalOpen(false);
      setSidebarBlur?.(false);
      console.log("[DeviceList] Sidebar blur set to FALSE (submit)");
    },
    [rawDevices, selectedDevice, normalizeDevice, setSidebarBlur],
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSidebarBlur?.(false);
    console.log("[DeviceList] Sidebar blur set to FALSE (close)");
  }, [setSidebarBlur]);

  return (
    <div className="device-list">
      <div className="device-list__header">
        <h2 className="device-list__title">Device List</h2>
        <ExportButton
          data={rows}
          columns={DEVICELIST_COLUMNS}
          filename="devices"
        />
      </div>

      {error && <p className="device-list__error">{error}</p>}

      {loading ? (
        <p className="device-list__loading">Loading devices…</p>
      ) : (
        <Table rows={rows} columns={DEVICELIST_COLUMNS} />
      )}

      <UpdateDeviceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        device={selectedDevice}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
