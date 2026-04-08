import React from "react";
import "./CustomerModal.css";

function CustomerModal({
  isOpen,
  onClose,
  formData,
  handleChange,
  handleUpdate,
}) {
  if (!isOpen) return null;

  return (
    <div className="customer-modal-overlay">
      <div className="customer-modal">
        {/* HEADER */}
        <div className="customer-modal__header">
          <h1>Edit Customer</h1>
          <p>Update customer details below</p>

          <button className="customer-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="customer-modal__form">
          <div className="customer-modal__form-group">
            <label>Name</label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
            />
          </div>

          <div className="customer-modal__form-group">
            <label>Phone</label>
            <input
              type="text"
              name="customer_phone_no"
              value={formData.customer_phone_no}
              onChange={handleChange}
            />
          </div>

          <div className="customer-modal__form-group">
            <label>Email</label>
            <input
              type="email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
            />
          </div>

          <div className="customer-modal__form-group">
            <label>Address</label>
            <input
              type="text"
              name="customer_address"
              value={formData.customer_address}
              onChange={handleChange}
            />
          </div>

          {/* BUTTONS */}
          <div className="customer-modal__buttons">
            <button className="customer-modal__btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="customer-modal__btn-primary"
              onClick={handleUpdate}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerModal;
