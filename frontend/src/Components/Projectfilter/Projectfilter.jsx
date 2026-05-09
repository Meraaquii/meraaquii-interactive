import { useState, useEffect, useMemo } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import Table from "../Table/Table";
import ExportButton from "../ExportButton/ExportButton";
import projectService from "../../services/projectService";
import adminService from "../../services/Adminservice";
import { fetchSalesman } from "../../services/salesmanService";
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
  { key: "project_name", label: "Project Name", width: "100px" },
  { key: "tower_name", label: "Tower", width: "110px" },
  { key: "floor_name", label: "Floor", width: "110px" },
  { key: "apartment_name", label: "Unit Number", width: "110px" },
  { key: "flat_type_name", label: "Type of Unit", width: "110px" },
  { key: "appartment_available", label: "Availability", width: "110px" },
  { key: "action", label: "Action", width: "100px" },
];

const SALESMAN_COLUMNS = [
  { key: "project_name", label: "Project Name", width: "110px" },
  { key: "tower_name", label: "Tower", width: "110px" },
  { key: "floor_name", label: "Floor", width: "110px" },
  { key: "apartment_name", label: "Unit Number", width: "110px" },
  { key: "flat_type_name", label: "Type of Unit", width: "110px" },
];

// ─── Parse user ONCE outside the component ─────────────────────────────────
function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function normalizeAdminProject(p) {
  return {
    project_name: p.project_name ?? p.projectName ?? "—",
    client_name: p.client_name ?? p.clientName ?? p.client ?? "—",
    status: p.status ?? p.project_status ?? "—",
    created_at: p.created_at ?? p.createdAt ?? "—",
    action: p.action ?? "",
  };
}

function ActionCell({ status = "", onChange }) {
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
    </div>
  );
}

const STATUS_CODE_TO_LABEL = { Y: "Available", R: "Reserve", N: "Booked" };
const STATUS_LABEL_TO_CODE = { Available: "Y", Reserve: "R", Booked: "N" };

function getApartmentStatusLabel(code) {
  return STATUS_CODE_TO_LABEL[code] ?? code ?? "—";
}

function getRowClassName(label) {
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
}

export default function ProjectFilter() {
  // ── Read user data once; stable across renders ──────────────────────────
  const user = useMemo(() => getStoredUser(), []);
  const userType = user?.user_type ?? "";
  const isAdmin = userType === "A";
  const isSalesman = userType === "S";

  const activeColumns = isAdmin
    ? ADMIN_COLUMNS
    : isSalesman
      ? SALESMAN_COLUMNS
      : CLIENT_COLUMNS;

  // ── State ─────────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    project: "",
    tower: "",
    floor: "",
    apartment: "",
  });
  const [projects, setProjects] = useState([]);
  const [allProjectNames, setAllProjectNames] = useState([]); // ALL project names including those with no apartments
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);
  const [showAvailabilityColors, setShowAvailabilityColors] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      console.log("=== LOAD CALLED ===", {
        userType,
        user_id: user?.user_id,
        isAdmin,
        isSalesman,
      });

      try {
        let list = [];

        if (isAdmin) {
          const raw = await adminService.getProjects();
          list = Array.isArray(raw) ? raw.map(normalizeAdminProject) : [];
          if (!cancelled)
            setAllProjectNames([
              ...new Set(list.map((p) => p.project_name).filter(Boolean)),
            ]);
        } else if (isSalesman) {
          const user_id = user?.user_id;
          if (!user_id) throw new Error("user_id missing for salesman.");

          const data = await fetchSalesman({ user_type: "S", user_id });
          list = Array.isArray(data)
            ? data.map((item) => ({
                project_name: item.project_name || "—",
                tower_name: item.tower_name || "—",
                floor_name: item.floor_name || "—",
                apartment_name: item.apartment_name || "—",
                flat_type_name: item.flat_type_name || "—",
                appartment_available: item.appartment_available || "Y",
                apart_id: item.apart_id || null,
              }))
            : [];
          if (!cancelled)
            setAllProjectNames([
              ...new Set(list.map((p) => p.project_name).filter(Boolean)),
            ]);
        } else {
          const client_id = user?.client_id;
          if (!client_id) throw new Error("client_id missing for client.");

          const response = await projectService.getProjects(
            client_id,
            userType,
          );

          console.log("Client raw response:", response);

          const rawArray =
            response?.success && Array.isArray(response.data)
              ? response.data
              : Array.isArray(response)
                ? response
                : [];

          console.log("Client rawArray length:", rawArray.length);

          const uniqueProjectNames = [
            ...new Set(
              rawArray.map((item) => item.project_name).filter(Boolean),
            ),
          ];

          if (!cancelled) setAllProjectNames(uniqueProjectNames);

          list = rawArray
            .filter((item) => item.apart_id != null)
            .map((item) => ({
              project_name: item.project_name || "—",
              client_name: item.client_name || "—",
              tower_name: item.tower_name || "—",
              floor_name: item.floor_name || "—",
              floor_id: item.floor_id ?? null,
              apart_id: item.apart_id ?? null,
              apartment_name: item.apartment_name || "—",
              appartment_available: item.appartment_available ?? "Y",
              flat_type_name: item.flat_type_name || "—",
            }));

          console.log("Client normalised list length:", list.length);
          if (list.length > 0) console.log("Sample row:", list[0]);
        }

        if (!cancelled) {
          setProjects(list);
          setTableRows(list);
          console.log("=== DONE — projects set:", list.length, "rows ===");
        }
      } catch (err) {
        console.error("=== FETCH ERROR ===", err);
        if (!cancelled) {
          setError(err.message || "Failed to fetch projects.");
          setProjects([]);
          setTableRows([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, isSalesman, user?.user_id]);

  const projectOptions = useMemo(() => allProjectNames, [allProjectNames]);

  const towerOptions = useMemo(
    () => [
      ...new Set(
        projects
          .filter((p) => !filters.project || p.project_name === filters.project)
          .map((p) => p.tower_name)
          .filter(Boolean),
      ),
    ],
    [projects, filters.project],
  );

  const floorOptions = useMemo(
    () => [
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
    ],
    [projects, filters.project, filters.tower],
  );

  const apartmentOptions = useMemo(
    () => [
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
    ],
    [projects, filters.project, filters.tower, filters.floor],
  );

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
      const next = { ...prev, [name]: value };
      if (name === "project") {
        next.tower = "";
        next.floor = "";
        next.apartment = "";
      } else if (name === "tower") {
        next.floor = "";
        next.apartment = "";
      } else if (name === "floor") {
        next.apartment = "";
      }
      return next;
    });
  };

  const handleStatusChange = (rowIndex, newStatus) => {
    const row = tableRows[rowIndex];
    console.log("Status change →", {
      rowIndex,
      apart_id: row?.apart_id,
      newStatus,
    });
    setPendingChange({ row, newStatus });
    setConfirmOpen(true);
  };

  const confirmStatusUpdate = async () => {
    if (!pendingChange) return;
    const { row, newStatus } = pendingChange;

    if (!row?.apart_id) {
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

      if (response?.message) {
        toast.success(response.message || "Status updated successfully");

        const newCode = STATUS_LABEL_TO_CODE[newStatus];

        const updater = (prev) =>
          prev.map((r) =>
            r.apart_id === row.apart_id
              ? { ...r, appartment_available: newCode }
              : r,
          );
        setProjects(updater);
        setTableRows(updater);
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

  const enrichedRows = useMemo(
    () =>
      tableRows.map((row, idx) => {
        // For admin rows there is no appartment_available field
        const rawCode = row.appartment_available;
        const statusLabel = getApartmentStatusLabel(rawCode);

        return {
          ...row,
          appartment_available: statusLabel,
          rowClassName:
            !isSalesman && showAvailabilityColors
              ? getRowClassName(statusLabel)
              : "",
          action: (
            <ActionCell
              status={statusLabel}
              onChange={(newStatus) => handleStatusChange(idx, newStatus)}
            />
          ),
        };
      }),
    [tableRows, isSalesman, showAvailabilityColors],
  );

  const getExportFileName = () => {
    const parts = [];
    if (filters.project) parts.push(filters.project);
    if (filters.tower) parts.push(filters.tower);
    if (filters.floor) parts.push("floor", filters.floor);
    if (filters.apartment) parts.push("apartment", filters.apartment);
    return parts.length > 0 ? parts.join(" - ") : "All Projects";
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

  return (
    <div className="project-filter">
      <div className="project-list__header">
        <h2 className="project-list__title">Project Filter List</h2>
        <ExportButton
          data={tableRows}
          columns={activeColumns}
          filename={getExportFileName()}
        />
      </div>

      {error && <p className="project-filter__error">{error}</p>}

      <div className="project-filter__fields">
        {isAdmin ? (
          <SelectField
            id="project"
            label="Project"
            value={filters.project}
            options={projectOptions}
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

      {!isSalesman && (
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
      )}

      {loading ? (
        <p className="project-filter__loading">Loading…</p>
      ) : (
        <div className="project-filter__table-wrapper">
          <Table rows={enrichedRows} columns={activeColumns} />
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
