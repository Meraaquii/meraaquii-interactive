import { useState, useEffect } from "react";

import "./StatusUpdateConfirm.css";

export default function StatusUpdateConfirm({
  isOpen,
  onClose,
  onConfirm,
  name,
  status,
}) {
  const [loading, setLoading] = useState(false);

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

      // ONLY OPEN NEXT MODAL
      // DO NOT UPDATE STATUS HERE
      await onConfirm();

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="status-update-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div className="status-update-modal">
        <h3 className="status-update-title">
          {status === "Reserve"
            ? "Confirm Reservation"
            : "Confirm Status Update"}
        </h3>

        <p className="status-update-message">
          {status === "Reserve" ? (
            <>
              Are you sure you want to reserve <strong>{name}</strong> ?
            </>
          ) : (
            <>
              Are you sure you want to update status for <strong>{name}</strong>{" "}
              ?
            </>
          )}
        </p>

        <div className="update-actions">
          <button
            type="button"
            className="btn-update"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Loading..." : "Yes"}
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
