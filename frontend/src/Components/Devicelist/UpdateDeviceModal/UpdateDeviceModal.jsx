import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import "./UpdateDeviceModal.css";
import adminService from "../../../services/Adminservice.js";
import { updateDevice } from "../../../services/deviceService";
import projectService from "../../../services/projectService.js";
import toast from "react-hot-toast";

function UpdateDeviceModal({ isOpen, onClose, device, onSubmit }) {
  const [formData, setFormData] = useState({
    deviceName: "",
    devicePassword: "",
    deviceOculasAuthId: "",
    deviceStatus: "",
    projectId: "",
  });

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!isOpen || !device) return;

    const fetchProjects = async () => {
      try {
        const clientId = device.clientId ?? device.client_id;
        if (!clientId) {
          setProjects([]);
          return;
        }

        const allClients = await adminService.getClients();
        const matchedClient = allClients.find(
          (c) => String(c.client_id ?? c.user_id ?? c.id) === String(clientId),
        );
        if (!matchedClient) {
          setProjects([]);
          return;
        }

        const clientEmail =
          matchedClient.client_email ??
          matchedClient.user_email ??
          matchedClient.email;
        if (!clientEmail) {
          setProjects([]);
          return;
        }

        const clientType =
          matchedClient.client_type ?? matchedClient.user_type ?? "C";
        const res = await projectService.getProjects(clientEmail, clientType);

        const projectArray =
          (res.data && Array.isArray(res.data) ? res.data : []) ||
          (res.projects && Array.isArray(res.projects) ? res.projects : []);

        const normalized = projectArray.map((p) => ({
          id: p.id ?? p.project_id,
          name: p.name ?? p.project_name,
        }));

        const uniqueProjects = Array.from(
          new Map(normalized.map((p) => [p.id, p])).values(),
        );

        setProjects(uniqueProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      }
    };

    fetchProjects();
  }, [isOpen, device]);

  useEffect(() => {
    if (!isOpen || !device) return;

    const rawStatus = device.deviceStatus ?? device.device_status ?? "";
    const deviceStatus =
      rawStatus === "A" ? "Active" : rawStatus === "I" ? "Inactive" : rawStatus;

    const deviceProjectId = device.projectId ?? device.project_id ?? null;
    const matched =
      deviceProjectId !== null && projects.length > 0
        ? projects.find(
            (p) => String(p.id).trim() === String(deviceProjectId).trim(),
          )
        : null;

    const resolvedProjectId = matched
      ? String(matched.id)
      : projects.length > 0
        ? String(projects[0].id)
        : "";

    setFormData({
      deviceName: device.deviceName ?? device.device_name ?? "",
      devicePassword: device.devicePassword ?? device.device_password ?? "",
      deviceOculasAuthId:
        device.deviceOculasAuthId ?? device.oculas_auth_id ?? "",
      deviceStatus: deviceStatus,
      projectId: resolvedProjectId,
    });
  }, [isOpen, device, projects]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        device_id: device.deviceId ?? device.device_id,
        client_id: device.clientId ?? device.client_id,
        salesman_id: device.salesmanId ?? device.salesman_id ?? null,
        device_name: formData.deviceName,
        device_password: formData.devicePassword,
        oculas_auth_id: formData.deviceOculasAuthId,
        device_status:
          formData.deviceStatus === "Active"
            ? "A"
            : formData.deviceStatus === "Inactive"
              ? "I"
              : formData.deviceStatus,
        project_id: formData.projectId,
      };
      await updateDevice(payload);
      toast.success("Device updated successfully");
      onSubmit(payload);
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update device");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="udm-overlay">
      <div className="udm-modal">
        <div className="udm-header">
          <h1>Edit Device</h1>
          <p>Device information</p>
          <button className="udm-close" onClick={onClose}>
            <IoClose size={18} />
          </button>
        </div>

        <form className="udm-form" onSubmit={handleSubmit}>
          <div className="udm-form-grid">
            <div className="udm-form-group">
              <label>Device Name</label>
              <input
                type="text"
                name="deviceName"
                value={formData.deviceName}
                onChange={handleChange}
              />
            </div>

            <div className="udm-form-group">
              <label>Device Password</label>
              <input
                type="text"
                name="devicePassword"
                value={formData.devicePassword}
                onChange={handleChange}
              />
            </div>

            <div className="udm-form-group">
              <label>Oculus Id</label>
              <input
                type="text"
                name="deviceOculasAuthId"
                value={formData.deviceOculasAuthId}
                onChange={handleChange}
              />
            </div>

            <div className="udm-form-group">
              <label>Select Project</label>
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
              >
                <option value="">Select Project</option>
                {projects.map((proj) => (
                  <option key={proj.id} value={String(proj.id)}>
                    {proj.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="udm-form-group">
              <label>Status</label>
              <select
                name="deviceStatus"
                value={formData.deviceStatus}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="udm-buttons">
            <button type="submit" className="udm-btn-primary">
              Submit
            </button>
            <button
              type="button"
              className="udm-btn-secondary"
              onClick={onClose}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateDeviceModal;
