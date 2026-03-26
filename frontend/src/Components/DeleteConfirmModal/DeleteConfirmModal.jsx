import "./DeleteConfirmModal.css";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  name,
}) {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h3 className="delete-title">Confirm Delete</h3>
        <p className="delete-message">
          Are you sure you want to delete <strong>{name}</strong>?
        </p>

        <div className="delete-actions">
          <button className="btn-delete" onClick={onConfirm}>
            Yes
          </button>
          <button className="btn-cancel" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}
