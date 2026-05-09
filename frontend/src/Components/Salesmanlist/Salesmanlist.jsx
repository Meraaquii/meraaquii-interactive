import { useEffect, useState } from "react";
import { IoPersonAddOutline } from "react-icons/io5";
import Table from "../Table/Table";
import ExportButton from "../ExportButton/ExportButton";
import {
  getSalespersonData,
  deleteSalesmanData as deleteSalespersonData,
} from "../../controllers/salespersonController";
import { getTeamsController } from "../../controllers/teamController";
import AddSalesperson from "../Salesmanlist/AddSalesperson/AddSalesperson";
import UpdateSalesmanList from "../Salesmanlist/UpdateSalesmanList/UpdateSalesmanList";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { toast } from "react-hot-toast";
import DeleteConfirmModal from "../DeleteConfirmModal/DeleteConfirmModal";
import { useLayout } from "../Dashboardlayout/Dashboardlayout";
import SalesmanDetailDashboard from "../SalesmanDashboard/SalesmanDashboard";
import "./SalesmanList.css";

export default function SalesmanList() {
  const [rows, setRows] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSalesman, setSelectedSalesman] = useState(null);
  const [viewSalesman, setViewSalesman] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const clientId = user?.client_id;
  const { setSidebarBlur } = useLayout() ?? {};

  // Load Salesman
  const loadData = () => {
    if (clientId) {
      getSalespersonData(setRows, clientId);
    }
  };

  // Load Teams
  const loadTeams = async () => {
    try {
      const response = await getTeamsController();
      setTeams(response?.data || []);
    } catch (error) {
      console.error("Failed to load teams:", error);
    }
  };

  useEffect(() => {
    loadData();
    loadTeams();
  }, [clientId]);

  // Dashboard View
  if (viewSalesman) {
    return (
      <SalesmanDetailDashboard
        salesman={viewSalesman}
        onBack={() => setViewSalesman(null)}
        showBack={true}
      />
    );
  }

  // View
  const handleView = (row) => setViewSalesman(row);

  // Edit
  const handleEdit = (row) => {
    setSelectedSalesman(row);
    setShowEditModal(true);
    setSidebarBlur?.(true);
  };

  // Delete
  const handleDelete = (row) => {
    setDeleteRow(row);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    try {
      await deleteSalespersonData(deleteRow.id);
      setShowDeleteModal(false);
      setDeleteRow(null);
      loadData();
      toast.success("Salesperson deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Table Columns
  const SALESMAN_COLUMNS = [
    {
      key: "team_name",
      label: "Team",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "created_at",
      label: "Created At",
      render: (row) => {
        return row.created_at
          ? new Date(row.created_at).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              // hour: "2-digit",
              // minute: "2-digit",
            })
          : "-";
      },
    },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <div className="salesman-action-icons">
          <MdOutlineRemoveRedEye
            className="salesman-view-icon"
            title="View Dashboard"
            onClick={() => handleView(row)}
          />
          <TbEdit
            className="salesman-edit-icon"
            title="Edit"
            onClick={() => handleEdit(row)}
          />
          <RiDeleteBin6Line
            className="salesman-delete-icon"
            title="Delete"
            onClick={() => handleDelete(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="salesman-list">
      {/* Header */}
      <div className="salesman-list__header">
        <h2 className="salesman-list__title">Salesman List</h2>

        <div className="salesman-list__actions">
          {/* Export */}
          <ExportButton
            data={rows}
            columns={SALESMAN_COLUMNS}
            filename="salesmen"
          />

          {/* Add */}
          <button
            className="salesman-list__add-btn"
            onClick={() => setShowAddModal(true)}
          >
            <IoPersonAddOutline size={16} />
            Add
          </button>
        </div>
      </div>

      {/* Table */}
      <Table
        rows={rows}
        columns={SALESMAN_COLUMNS}
        showExport={false}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add Modal */}
      {showAddModal && (
        <AddSalesperson
          onClose={() => setShowAddModal(false)}
          clientId={clientId}
          refreshData={loadData}
          showTeamDropdown={true}
          teams={teams}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedSalesman && (
        <UpdateSalesmanList
          onClose={() => {
            setShowEditModal(false);
            setSelectedSalesman(null);
            setSidebarBlur?.(false);
          }}
          salesperson={selectedSalesman}
          refreshData={loadData}
        />
      )}

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        name={deleteRow?.name}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteRow(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
