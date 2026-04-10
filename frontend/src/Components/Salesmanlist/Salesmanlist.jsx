import { useEffect, useState, useCallback } from "react";
import { IoPersonAddOutline } from "react-icons/io5";
import Table from "../Table/Table";
import ExportButton from "../ExportButton/ExportButton";
import {
  getSalesmanData,
  deleteSalesmanData,
} from "../../controllers/salesmanController";
import AddSalesman from "../Salesmanlist/AddSalesman/AddSalesman";
import UpdateSalesmanList from "../Salesmanlist/UpdateSalesmanList/UpdateSalesmanList";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { toast } from "react-hot-toast";
import DeleteConfirmModal from "../DeleteConfirmModal/DeleteConfirmModal";
import { useLayout } from "../Dashboardlayout/Dashboardlayout";
import "./SalesmanList.css";

export default function SalesmanList() {
  const [rows, setRows] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSalesman, setSelectedSalesman] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const clientId = user?.client_id;
  const { setSidebarBlur } = useLayout() ?? {};

  const loadData = () => {
    if (clientId) {
      getSalesmanData(setRows, clientId);
    }
  };

  useEffect(() => {
    loadData();
  }, [clientId]);

  const handleEdit = (row) => {
    setSelectedSalesman(row);
    setShowEditModal(true);
    setSidebarBlur?.(true); // Blur sidebar when modal opens
  };

  const handleDelete = (row) => {
    setDeleteRow(row);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteSalesmanData(deleteRow.id);
      setShowDeleteModal(false);
      setDeleteRow(null);
      loadData();
      toast.success("Salesman deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const SALESMAN_COLUMNS = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "createdAt", label: "Created At" },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <div className="salesman-action-icons">
          <TbEdit
            className="salesman-edit-icon"
            onClick={() => handleEdit(row)}
          />
          <RiDeleteBin6Line
            className="salesman-delete-icon"
            onClick={() => handleDelete(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="salesman-list">
      <div className="salesman-list__header">
        <h2 className="salesman-list__title">Salesman List</h2>
        <div className="salesman-list__actions">
          <ExportButton
            data={rows}
            columns={SALESMAN_COLUMNS}
            filename="salesmen"
          />
          <button
            className="salesman-list__add-btn"
            onClick={() => setShowAddModal(true)}
          >
            <IoPersonAddOutline size={16} />
            Add
          </button>
        </div>
      </div>

      <Table
        rows={rows}
        columns={SALESMAN_COLUMNS}
        showExport={false}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add Modal */}
      {showAddModal && (
        <AddSalesman
          onClose={() => setShowAddModal(false)}
          clientId={clientId}
          refreshData={loadData}
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
          salesman={selectedSalesman}
          refreshData={loadData}
        />
      )}

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
