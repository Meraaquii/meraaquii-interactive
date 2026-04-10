import React, { useEffect, useState } from "react";
import Table from "../../Table/Table";
import "./CustomerList.css";
import ExportButton from "../../ExportButton/ExportButton";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import {
  getCustomerData,
  deleteCustomerData,
  updateCustomerData,
} from "../../../controllers/customersController";
import CustomerModal from "../CustomerList/CustomerModal/CustomerModal";
import { useLayout } from "../../Dashboardlayout/Dashboardlayout";
import toast from "react-hot-toast";

function CustomerList() {
  const [rows, setRows] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone_no: "",
    customer_email: "",
    customer_address: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const { setSidebarBlur } = useLayout() ?? {};

  useEffect(() => {
    if (user?.user_id) {
      getCustomerData(setRows, user.user_id);
    }
  }, []);

  const handleEdit = (row) => {
    setSelectedCustomer(row);
    setFormData({
      customer_name: row.name,
      customer_phone_no: row.contact_no,
      customer_email: row.email,
      customer_address: row.address,
    });
    setIsEditOpen(true);
    setSidebarBlur?.(true); // Blur sidebar when modal opens
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (row) => {
    try {
      await deleteCustomerData(row.id);
      toast.success("Customer deleted successfully");
      getCustomerData(setRows, user.user_id);
    } catch (error) {
      console.error("Delete failed:", error.message);
      toast.error("Failed to delete customer");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateCustomerData(selectedCustomer.id, formData);
      toast.success("Customer updated successfully");
      setIsEditOpen(false);
      setSidebarBlur?.(false); // Remove blur when modal closes
      getCustomerData(setRows, user.user_id);
    } catch (error) {
      console.error("Update failed:", error.message);
      toast.error("Failed to update customer");
    }
  };

  const CUSTOMER_COLUMNS = [
    { key: "name", label: "Customer Name" },
    { key: "contact_no", label: "Contact No" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="customer-action-icons">
          <FiEdit2
            className="customer-edit-icon"
            onClick={() => handleEdit(row)}
          />
          <FiTrash2
            className="customer-delete-icon"
            onClick={() => handleDelete(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="customer-list">
      <div className="customer-list__header">
        <h1 className="customer-list__title">Customer List</h1>
        <div className="customer-list__controls">
          <ExportButton
            data={rows}
            columns={CUSTOMER_COLUMNS}
            filename="customers"
          />
        </div>
      </div>

      <div className="customer-list__table-wrapper">
        <Table rows={rows} columns={CUSTOMER_COLUMNS} />
      </div>

      <CustomerModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSidebarBlur?.(false); // Remove blur when modal closes
        }}
        formData={formData}
        handleChange={handleChange}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}

export default CustomerList;
