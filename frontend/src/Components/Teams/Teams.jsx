import React, { useEffect, useState } from "react";
import Table from "../Table/Table";
import { TbEdit } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoPersonAddOutline } from "react-icons/io5";
import { toast } from "react-hot-toast";
import DeleteConfirmation from "../DeleteConfirmModal/DeleteConfirmModal";

import "./Teams.css";

import ExportButton from "../ExportButton/ExportButton";
import AddTeam from "../Teams/AddTeam/AddTeam";
import TeamView from "./TeamView/TeamView";
import TeamUpdate from "../Teams/TeamUpdate/TeamUpdate";

import {
  getTeamsController,
  deleteTeamController,
} from "../../controllers/teamController";

function Teams() {
  const [showModal, setShowModal] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTeam, setDeleteTeam] = useState(null);

  // View Modal
  const [showViewModal, setShowViewModal] = useState(false);

  // Update Modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [selectedTeam, setSelectedTeam] = useState(null);

  // Fetch Teams
  const fetchTeams = async () => {
    try {
      setLoading(true);

      const response = await getTeamsController();

      console.log("Teams API Response:", response);

      const teamData = response?.data || [];

      const formattedData = teamData.map((item) => ({
        id: item.id,
        team_id: item.id,
        team_name: item.team_name,

        teamName: item.team_name,

        createdAt: new Date(item.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      }));

      console.log("Formatted Teams:", formattedData);

      setRows(formattedData);
    } catch (error) {
      console.log("Fetch Teams Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // View
  const handleView = (row) => {
    console.log("Clicked Team Row:", row);

    setSelectedTeam(row);
    setShowViewModal(true);
  };

  // Edit
  const handleEdit = (row) => {
    console.log("Edit:", row);

    setSelectedTeam(row);
    setShowUpdateModal(true);
  };

  // Open Delete Modal
  const handleDelete = (row) => {
    setDeleteTeam(row);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const confirmDeleteTeam = async () => {
    try {
      await deleteTeamController(deleteTeam.team_id);

      toast.success("Team deleted successfully");

      fetchTeams();

      setShowDeleteModal(false);
      setDeleteTeam(null);
    } catch (error) {
      console.log("Delete Error:", error);

      toast.error(error?.response?.data?.message || "Failed to delete team");
    }
  };

  // Table Columns
  const TEAM_COLUMNS = [
    {
      key: "teamName",
      label: "Team Name",
    },

    {
      key: "createdAt",
      label: "Created At",
    },

    {
      key: "action",
      label: "Action",

      render: (row) => (
        <div className="teams-action-icons">
          {/* View */}
          <MdOutlineRemoveRedEye
            className="teams-view-icon"
            title="View"
            onClick={() => handleView(row)}
          />

          {/* Edit */}
          <TbEdit
            className="teams-edit-icon"
            title="Edit"
            onClick={() => handleEdit(row)}
          />

          {/* Delete */}
          <RiDeleteBin6Line
            className="teams-delete-icon"
            title="Delete"
            onClick={() => handleDelete(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="teams-list">
      {/* Header */}
      <div className="teams-list__header">
        <h2 className="teams-list__title">Teams</h2>

        <div className="teams-header-actions">
          {/* Add Team */}
          <button className="add-team-btn" onClick={() => setShowModal(true)}>
            <IoPersonAddOutline size={16} />
            Add
          </button>

          {/* Export */}
          <ExportButton data={rows} columns={TEAM_COLUMNS} filename="teams" />
        </div>
      </div>

      {/* Table */}
      <Table rows={rows} columns={TEAM_COLUMNS} loading={loading} />

      {/* Add Team Modal */}
      {showModal && (
        <AddTeam onClose={() => setShowModal(false)} refreshData={fetchTeams} />
      )}

      {/* Update Team Modal */}
      {showUpdateModal && selectedTeam && (
        <TeamUpdate
          team={selectedTeam}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedTeam(null);
          }}
          refreshData={fetchTeams}
        />
      )}

      {/* Team View Modal */}
      {showViewModal && selectedTeam && (
        <TeamView
          team={selectedTeam}
          onClose={() => {
            setShowViewModal(false);
            setSelectedTeam(null);
          }}
        />
      )}

      {/* Delete Modal */}
      <DeleteConfirmation
        isOpen={showDeleteModal}
        name={deleteTeam?.teamName}
        onConfirm={confirmDeleteTeam}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTeam(null);
        }}
      />
    </div>
  );
}

export default Teams;
