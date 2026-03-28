import React, { use, useEffect } from "react";
import Table from "../../Table/Table";
import "./CustomerList.css";
import ExportButton from "../../ExportButton/ExportButton";
import { FiEdit2, FiTrash2, FiUserPlus } from "react-icons/fi";

function CustomerList() {
  const [rows, setRows] = React.useState();

  const dummyData = [
    {
      id: 1,
      name: "Rohit Kumar",
      contact_no: "123-456-7890",
      email: "rohit.kumar@gmail.com",
      address: "Dhanbad, Jharkhand, India",
    },
    {
      id: 2,
      name: "Kajal Singh",
      contact_no: "987-654-3210",
      email: "kajal.singh@gmail.com",
      address: "Ranchi, Jharkhand, India",
    },
    {
      id: 3,
      name: "Santosh Sharma",
      contact_no: "555-123-4567",
      email: "santosh.sharma@gmail.com",
      address: "Jamshedpur, Jharkhand, India",
    },
    {
      id: 4,
      name: "Prem Verma",
      contact_no: "111-222-3333",
      email: "prem.verma@gmail.com",
      address: "Bhubaneswar, Odisha, India",
    },
  ];

  const handleEdit = (rows) => {
    console.log("Edit Customer", rows);
  };

  const handleDelete = (rows) => {
    console.log("Delete Customer", rows);
  };

  useEffect(() => {
    setRows(dummyData);
  }, []);

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
          {/* <button className="customer-list__add-btn">
            <FiUserPlus size={14} />
            Add
          </button> */}
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

      <div></div>
    </div>
  );
}

export default CustomerList;
