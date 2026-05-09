import { useEffect, useState } from "react";
import { getSalespersonsByTeamController } from "../../../controllers/teamController";
import "./TeamView.css";

function TeamView({ team, onClose }) {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // Fetch Team Members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Selected Team:", team);

        console.log("Team ID:", team?.id);

        const response = await getSalespersonsByTeamController(team.id);

        console.log("Members API Response:", response);

        // IMPORTANT
        setMembers(response.data || []);
      } catch (err) {
        console.log("Fetch Members Error:", err);

        setError("Failed to load team members.");
      } finally {
        setLoading(false);
      }
    };

    if (team?.id) {
      fetchMembers();
    }
  }, [team]);

  // Select Member
  const handleSelectMember = (member) => {
    setSelectedMember((prev) =>
      prev?.salesperson_id === member.salesperson_id ? null : member,
    );
  };

  // Initials
  const initials = (name) => {
    return name
      ?.split(" ")
      ?.map((word) => word[0])
      ?.join("")
      ?.slice(0, 2)
      ?.toUpperCase();
  };

  // Format Date
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format Time
  const formatTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="tv-overlay" onClick={onClose}>
      <div className="tv-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="tv-modal-header">
          <div className="tv-modal-title-group">
            <div className="tv-modal-icon">🏢</div>

            <div>
              <h2 className="tv-modal-title">{team?.teamName}</h2>

              <p className="tv-modal-sub">
                {loading
                  ? "Loading members..."
                  : `${members.length} member${
                      members.length !== 1 ? "s" : ""
                    }`}
              </p>
            </div>
          </div>

          <button className="tv-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="tv-modal-body">
          {/* Loading */}
          {loading && (
            <div className="tv-state">
              <p>Loading team members...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="tv-error">
              <p>{error}</p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && members.length === 0 && (
            <div className="tv-empty">
              <p>No team members found.</p>
            </div>
          )}

          {/* Members Grid */}
          {!loading && members.length > 0 && (
            <div className="tv-members-grid">
              {members.map((member) => (
                <div
                  key={member.salesperson_id}
                  className={`tv-card ${
                    selectedMember?.salesperson_id === member.salesperson_id
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleSelectMember(member)}
                >
                  <div className="tv-card-top">
                    <div className="tv-avatar">
                      {initials(member.salesperson_name)}
                    </div>

                    <div>
                      <div className="tv-card-name">
                        {member.salesperson_name}
                      </div>

                      <div className="tv-card-team">{member.team_name}</div>
                    </div>
                  </div>

                  <div className="tv-card-email">
                    {member.salesperson_email}
                  </div>

                  <div className="tv-card-email">
                    {member.salesperson_phone}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected Member Detail */}
          {selectedMember && (
            <div className="tv-detail">
              <div className="tv-detail-header">
                <div className="tv-detail-avatar">
                  {initials(selectedMember.salesperson_name)}
                </div>

                <div>
                  <h3>{selectedMember.salesperson_name}</h3>

                  <span className="tv-detail-badge">
                    {selectedMember.team_name}
                  </span>
                </div>

                <button
                  className="tv-detail-close"
                  onClick={() => setSelectedMember(null)}
                >
                  ✕
                </button>
              </div>

              <div className="tv-detail-rows">
                <div className="tv-detail-cell">
                  <div className="tv-detail-label">📞 Phone</div>

                  <div className="tv-detail-value">
                    {selectedMember.salesperson_phone}
                  </div>
                </div>

                <div className="tv-detail-cell">
                  <div className="tv-detail-label">✉️ Email</div>

                  <div className="tv-detail-value">
                    {selectedMember.salesperson_email}
                  </div>
                </div>

                <div className="tv-detail-cell">
                  <div className="tv-detail-label">🆔 Salesperson ID</div>

                  <div className="tv-detail-value">
                    #{selectedMember.salesperson_id}
                  </div>
                </div>

                <div className="tv-detail-cell">
                  <div className="tv-detail-label">🏢 Client ID</div>

                  <div className="tv-detail-value">
                    #{selectedMember.client_id}
                  </div>
                </div>

                <div className="tv-detail-cell">
                  <div className="tv-detail-label">👤 User ID</div>

                  <div className="tv-detail-value">
                    #{selectedMember.user_id}
                  </div>
                </div>

                <div className="tv-detail-cell">
                  <div className="tv-detail-label">📅 Created At</div>

                  <div className="tv-detail-value">
                    {formatDate(selectedMember.created_at)} ·{" "}
                    {formatTime(selectedMember.created_at)}
                  </div>
                </div>

                <div className="tv-detail-cell">
                  <div className="tv-detail-label">🔄 Last Modified</div>

                  <div className="tv-detail-value">
                    {formatDate(selectedMember.dom)} ·{" "}
                    {formatTime(selectedMember.dom)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamView;
