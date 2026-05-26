import React, { useState } from "react";
import toast from "react-hot-toast";
import AddProjectFilterModal from "../AddProjectFilterModal/AddProjectFilterModal";
import {
  updateFlatStatusController,
  addProjectFilterController,
} from "../../../controllers/projectController";

// 1. Ensure you pass down a refresh function (e.g., fetchProjects or refreshData) from the page level
export default function ParentComponent({ flat, refreshData }) {
  const [showProjectFilterModal, setShowProjectFilterModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReserveClick = () => {
    setShowProjectFilterModal(true);
  };

  const handleFinalReserveSubmit = async (formData) => {
    try {
      setLoading(true);

      const targetApartmentId =
        flat?.apartment_id || flat?.appartment_id || flat?.id;

      // STEP 1: Save project filter log entry
      const payload = {
        apartment_id: targetApartmentId,
        team_id: formData.team,
        salesperson_id: formData.salesperson,
        date: formData.date,
        remarks: formData.remarks,
      };

      const filterResponse = await addProjectFilterController(payload);
      if (!filterResponse?.success) {
        toast.error(filterResponse?.message || "Failed to save filter");
        return false;
      }

      // STEP 2: Update flat booking status to 'N' (Unavailable/Reserved)
      const statusResponse = await updateFlatStatusController({
        apartment_id: targetApartmentId,
        status: "Reserve", // This will map to "R" or "N" in your service statusMap
      });

      if (!statusResponse?.success) {
        toast.error(statusResponse?.message || "Failed to change status");
        return false;
      }

      toast.success("Flat reserved successfully!");

      // ✅ STEP 3: THE FIX — REFRESH THE UI
      // Option A: If your parent page has a fetch function passed down:
      if (typeof refreshData === "function") {
        await refreshData();
      } else {
        // Option B: Hard fallback window reload if you haven't wired props yet
        window.location.reload();
      }

      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to process flat reservation");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={`reserve-btn ${flat?.status === "R" || flat?.status === "Reserve" ? "checked" : ""}`}
        onClick={handleReserveClick}
        disabled={loading || flat?.status === "R" || flat?.status === "Reserve"}
      >
        {flat?.status === "R" || flat?.status === "Reserve"
          ? "✓ Reserved"
          : "Reserve"}
      </button>

      <AddProjectFilterModal
        isOpen={showProjectFilterModal}
        onClose={() => setShowProjectFilterModal(false)}
        onFinalSubmit={handleFinalReserveSubmit}
      />
    </>
  );
}
