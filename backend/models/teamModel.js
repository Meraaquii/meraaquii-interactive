const pool = require("../config/database.js");

const createTeam = async (team_name) => {
  const query = `
    INSERT INTO teams (team_name)
    VALUES (?)
  `;

  const [result] = await pool.query(query, [team_name]);
  return result;
};

const updateTeam = async (team_id, team_name) => {
  const query = `UPDATE teams SET team_name = ? WHERE id = ?`;

  const [result] = await pool.query(query, [team_name, team_id]);
  return result;
};

const getTeams = async () => {
  const query = `
    SELECT * FROM teams
  `;

  const [rows] = await pool.query(query);
  return rows;
};

const getSalespersonsByTeamId = async (team_id) => {
  const query = `
    SELECT s.*
    FROM mr_salesperson s
    JOIN teams t ON s.team_name = t.team_name
    WHERE t.id = ?
  `;

  const [rows] = await pool.query(query, [team_id]);
  return rows;
};

const deleteTeam = async (team_id) => {
  const query = `DELETE FROM teams WHERE id = ?`;
  const [result] = await pool.query(query, [team_id]);
  return result;
};

module.exports = {
  createTeam,
  updateTeam,
  getTeams,
  getSalespersonsByTeamId,
  deleteTeam,
};
