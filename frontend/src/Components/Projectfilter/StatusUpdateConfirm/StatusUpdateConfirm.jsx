import { useState, useEffect } from "react";
import "./StatusUpdateConfirm.css";

export default function StatusUpdateConfirm({
  isOpen,
  onClose,
  onConfirm,
  name,
}) {
  const [loading, setLoading] = useState(false);

  // ✅ Reset loading when modal closes
  useEffect(() => {
    if (!isOpen) {
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await onConfirm();
    } catch (err) {
      console.error("Confirm failed:", err);
    } finally {
      setLoading(false); // ✅ always reset
    }
  };

  return (
    <div
      className="status-update-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="status-update-modal">
        <h3 className="status-update-title">Confirm Status Update</h3>

        <p className="status-update-message">
          Are you sure you want to update the status for <strong>{name}</strong>
          ?
        </p>

        <div className="update-actions">
          <button
            type="button"
            className="btn-update"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Updating..." : "Yes"}
          </button>

          <button
            type="button"
            className="update-btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
