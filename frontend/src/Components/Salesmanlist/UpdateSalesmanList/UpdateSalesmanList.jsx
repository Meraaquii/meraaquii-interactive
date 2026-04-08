import React, { useState, useEffect } from "react";
import { TbEdit } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";
import "./UpdateSalesmanList.css";
import { updateSalesman } from "../../../services/salesmanService";

function UpdateSalesmanList({ onClose, salesman, refreshData }) {
  const [formData, setFormData] = useState({
    salesman_name: "",
    salesman_phone_no: "",
    salesman_email: "",
  });

  useEffect(() => {
    if (!salesman) return;

    console.log("Prefilling salesman:", salesman);

    setFormData({
      salesman_name: salesman.name ?? "",
      salesman_phone_no: salesman.phone ?? "",
      salesman_email: salesman.email ?? "",
    });
  }, [salesman]);

  if (!salesman) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Updating:", formData);

      await updateSalesman(salesman.id, formData);

      toast.success("Salesman updated successfully!");

      refreshData();
      onClose();
    } catch (error) {
      console.error("Error updating salesman:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update salesman",
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" key={salesman.id}>
        <button className="modal-close" onClick={onClose}>
          <IoClose size={22} />
        </button>

        <div className="modal-header">
          <h1>
            <TbEdit /> Update Salesman
          </h1>
          <p>Edit Salesman Information</p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="salesman_name"
              value={formData.salesman_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="salesman_phone_no"
              value={formData.salesman_phone_no}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="salesman_email"
              value={formData.salesman_email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-buttons">
            <button type="submit" className="btn-primary">
              Update
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateSalesmanList;
