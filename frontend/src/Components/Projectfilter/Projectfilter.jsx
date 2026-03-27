import { useState, useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import Table from "../Table/Table";
import ExportButton from "../ExportButton/ExportButton";
import projectService from "../../services/projectService";
import adminService from "../../services/Adminservice";
import StatusUpdateConfirm from "../Projectfilter/StatusUpdateConfirm/StatusUpdateConfirm";
import toast from "react-hot-toast";
import "./ProjectFilter.css";

const ADMIN_COLUMNS = [
  { key: "project_name", label: "Project Name" },
  { key: "client_name", label: "Client Name" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Created At" },
  { key: "action", label: "Action" },
];

const CLIENT_COLUMNS = [
  {
    key: "project_name",
    label: "Project Name",
    width: "100px",
  },
  {
    key: "tower_name",
    label: "Tower",
    width: "110px",
  },
  {
    key: "floor_name",
    label: "Floor",
    width: "110px",
  },
  {
    key: "apartment_name",
    label: "Unit Number",
    width: "110px",
  },
  {
    key: "flat_type_name",
    label: "Type of Unit",
    width: "110px",
  },
  {
    key: "appartment_available",
    label: "Availability",
    width: "110px",
  },
  {
    key: "action",
    label: "Action",
    width: "100px",
  },
];

const statusToCode = {
  Available: "Y",
  Reserve: "R",
  Booked: "N",
};

function normalizeAdminProject(p) {
  return {
    project_name: p.project_name ?? p.projectName ?? "—",
    client_name: p.client_name ?? p.clientName ?? p.client ?? "—",
    status: p.status ?? p.project_status ?? "—",
    created_at: p.created_at ?? p.createdAt ?? "—",
    action: p.action ?? "",
  };
}

function ActionCell({ status = "", onView, onChange }) {
  const statuses = ["Reserve", "Available", "Booked"];
  const active = statuses.find(
    (s) => s.toLowerCase() === (status || "").toLowerCase(),
  );

  return (
    <div className="action-cell">
      {statuses.map((s) => (
        <label key={s} className="action-cell__option">
          <input
            type="checkbox"
            className="action-cell__checkbox"
            checked={active === s}
            onChange={(e) => e.target.checked && onChange?.(s)}
          />
          <span className="action-cell__label">{s}</span>
        </label>
      ))}
      {/* <button
        type="button"
        className="action-cell__view-btn"
        onClick={onView}
        title="View details"
        aria-label="View details"
      >
        <IoEyeOutline />
      </button> */}
    </div>
  );
}

export default function ProjectFilter() {
  const [filters, setFilters] = useState({
    project: "",
    tower: "",
    floor: "",
    apartment: "",
  });

  const [projects, setProjects] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);
  const [showAvailabilityColors, setShowAvailabilityColors] = useState(true);

  const userType = localStorage.getItem("user_type");
  const isAdmin = userType === "A";

  const getApartmentStatusLabel = (status) => {
    switch (status) {
      case "Y":
        return "Available";
      case "R":
        return "Reserve";
      case "N":
        return "Booked";
      default:
        return status || "—";
    }
  };

  const getRowClassName = (status) => {
    const label = getApartmentStatusLabel(status);

    switch (label) {
      case "Available":
        return "row--available";
      case "Booked":
        return "row--booked";
      case "Reserve":
        return "row--reserve";
      default:
        return "";
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        let list = [];

        if (isAdmin) {
          const raw = await adminService.getProjects();
          list = Array.isArray(raw) ? raw.map(normalizeAdminProject) : [];
        } else {
          const storedUser = localStorage.getItem("user");
          if (!storedUser) throw new Error("User not logged in.");

          const user = JSON.parse(storedUser);
          if (!user.user_email || !user.user_type)
            throw new Error("Invalid session. Please log in again.");

          const data = await projectService.getProjects(
            user.user_email,
            user.user_type,
          );

          list = data.success && Array.isArray(data.data) ? data.data : [];

          list.forEach((row) => {
            if (!row.apart_id) console.warn("Row missing apart_id", row);
          });
        }

        setProjects(list);
        setTableRows(list);
      } catch (err) {
        setError(err.message || "Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isAdmin]);

  const adminProjectOptions = [
    ...new Set(
      projects
        .map((p) => p.project_name)
        .filter((v) => v !== "—" && Boolean(v)),
    ),
  ];

  const projectOptions = [
    ...new Set(projects.map((p) => p.project_name).filter(Boolean)),
  ];
  const towerOptions = [
    ...new Set(
      projects
        .filter((p) => !filters.project || p.project_name === filters.project)
        .map((p) => p.tower_name)
        .filter(Boolean),
    ),
  ];
  const floorOptions = [
    ...new Set(
      projects
        .filter(
          (p) =>
            (!filters.project || p.project_name === filters.project) &&
            (!filters.tower || p.tower_name === filters.tower),
        )
        .map((p) => p.floor_name)
        .filter(Boolean),
    ),
  ];
  const apartmentOptions = [
    ...new Set(
      projects
        .filter(
          (p) =>
            (!filters.project || p.project_name === filters.project) &&
            (!filters.tower || p.tower_name === filters.tower) &&
            (!filters.floor || p.floor_name === filters.floor),
        )
        .map((p) => p.apartment_name)
        .filter(Boolean),
    ),
  ];

  useEffect(() => {
    let filtered = [...projects];

    if (isAdmin) {
      if (filters.project)
        filtered = filtered.filter((r) => r.project_name === filters.project);
    } else {
      if (filters.project)
        filtered = filtered.filter((r) => r.project_name === filters.project);
      if (filters.tower)
        filtered = filtered.filter((r) => r.tower_name === filters.tower);
      if (filters.floor)
        filtered = filtered.filter((r) => r.floor_name === filters.floor);
      if (filters.apartment)
        filtered = filtered.filter(
          (r) => r.apartment_name === filters.apartment,
        );
    }

    setTableRows(filtered);
  }, [filters, projects, isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "project") {
        updated.tower = "";
        updated.floor = "";
        updated.apartment = "";
      } else if (name === "tower") {
        updated.floor = "";
        updated.apartment = "";
      } else if (name === "floor") {
        updated.apartment = "";
      }
      return updated;
    });
  };

  const handleStatusChange = (rowIndex, newStatus) => {
    const row = tableRows[rowIndex];
    setPendingChange({ row, newStatus });
    setConfirmOpen(true);

    console.log("Changing status for row index:", rowIndex);
    console.log("Apartment ID:", row.apart_id);
    console.log("Old status:", row.appartment_available);
    console.log("New status (label):", newStatus);
  };

  const confirmStatusUpdate = async () => {
    if (!pendingChange) return;

    const { row, newStatus } = pendingChange;

    if (!row.apart_id) {
      toast.error("Apartment ID missing. Cannot update.");
      setConfirmOpen(false);
      setPendingChange(null);
      return;
    }

    try {
      const response = await projectService.updateApartmentStatus({
        apartment_id: row.apart_id,
        status: newStatus,
      });

      console.log("API Response:", response);

      if (response.message) {
        toast.success(response.message || "Status updated successfully");

        const codeMap = { Available: "Y", Reserve: "R", Booked: "N" };
        const newCode = codeMap[newStatus];

        setProjects((prev) =>
          prev.map((r) =>
            r.apart_id === row.apart_id
              ? { ...r, appartment_available: newCode }
              : r,
          ),
        );

        setTableRows((prev) =>
          prev.map((r) =>
            r.apart_id === row.apart_id
              ? { ...r, appartment_available: newCode }
              : r,
          ),
        );
      } else {
        toast.error("Update failed.");
      }
    } catch (err) {
      console.error("confirmStatusUpdate error:", err);
      toast.error("Something went wrong.");
    } finally {
      setConfirmOpen(false);
      setPendingChange(null);
    }
  };

  const SelectField = ({ id, label, value, options, disabled = false }) => (
    <div className="project-filter__field">
      <label className="project-filter__label" htmlFor={id}>
        {label} <span className="required">*</span>
      </label>
      <div className="project-filter__select-wrapper">
        <select
          id={id}
          name={id}
          className="project-filter__select"
          value={value}
          onChange={handleChange}
          disabled={disabled}
        >
          <option value="">All</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="project-filter__select-arrow">
          <IoMdArrowDropdown />
        </span>
      </div>
    </div>
  );

  const enrichedRows = tableRows.map((row, idx) => ({
    ...row,
    appartment_available: getApartmentStatusLabel(row.appartment_available),

    rowClassName: showAvailabilityColors
      ? getRowClassName(row.appartment_available)
      : "",

    action: (
      <ActionCell
        status={getApartmentStatusLabel(row.appartment_available)}
        onView={() => console.log("View", row)}
        onChange={(newStatus) => handleStatusChange(idx, newStatus)}
      />
    ),
  }));

  return (
    <div className="project-filter">
      <div className="project-list__header">
        <h2 className="project-list__title">Project Filter List</h2>
        <ExportButton
          data={tableRows}
          columns={isAdmin ? ADMIN_COLUMNS : CLIENT_COLUMNS}
          filename="projects"
        />
      </div>

      {error && <p className="project-filter__error">{error}</p>}

      <div className="project-filter__fields">
        {isAdmin ? (
          <SelectField
            id="project"
            label="Project"
            value={filters.project}
            options={adminProjectOptions}
          />
        ) : (
          <>
            <SelectField
              id="project"
              label="Project"
              value={filters.project}
              options={projectOptions}
            />
            <SelectField
              id="tower"
              label="Tower"
              value={filters.tower}
              options={filters.project ? towerOptions : []}
              disabled={!filters.project}
            />
            <SelectField
              id="floor"
              label="Floor"
              value={filters.floor}
              options={filters.tower ? floorOptions : []}
              disabled={!filters.tower}
            />
            <SelectField
              id="apartment"
              label="Apartment"
              value={filters.apartment}
              options={filters.floor ? apartmentOptions : []}
              disabled={!filters.floor}
            />
          </>
        )}
      </div>

      <div className="availability-toggle">
        <label>
          <input
            type="checkbox"
            checked={showAvailabilityColors}
            onChange={() => setShowAvailabilityColors((prev) => !prev)}
          />
          Show Availability Colors
        </label>
      </div>

      {loading ? (
        <p className="project-filter__loading">Loading…</p>
      ) : (
        <div className="project-filter__table-wrapper">
          <Table
            rows={enrichedRows}
            columns={isAdmin ? ADMIN_COLUMNS : CLIENT_COLUMNS}
          />
        </div>
      )}

      <StatusUpdateConfirm
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPendingChange(null);
        }}
        onConfirm={confirmStatusUpdate}
        name={pendingChange?.row?.apartment_name || "this apartment"}
      />
    </div>
  );
}
