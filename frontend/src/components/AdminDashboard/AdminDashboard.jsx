import { useState, useEffect } from "react";
import "./AdminDashboard.css";

const API_BASE_URL = `http://localhost:8000`;

export default function AdminDashboard({ onSignOut }) {
  const [users, setUsers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [editingProgram, setEditingProgram] = useState(null);
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [programForm, setProgramForm] = useState({
    title: "",
    shortLabel: "",
    summary: "",
    description: "",
    tags: [],
    durationHint: "",
    type: "community",
    isPublic: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const [usersRes, programsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/admin/programs`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const usersData = await usersRes.json();
      const programsData = await programsRes.json();

      if (usersData.success) setUsers(usersData.data.users || []);
      if (programsData.success) setPrograms(programsData.data.programs || []);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/banUser/${userId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: "success", text: "User banned successfully" });
        fetchData();
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to ban user" });
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/unbanUser/${userId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: "success", text: "User unbanned successfully" });
        fetchData();
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to unban user" });
    }
  };

  const handleDeleteProgram = async (programId) => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/deleteProgram/${programId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: "success", text: "Program deleted successfully" });
        fetchData();
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete program" });
    }
  };

  const handleEditProgram = (program) => {
    setEditingProgram(program);
    setProgramForm({
      title: program.title || "",
      shortLabel: program.shortLabel || "",
      summary: program.summary || "",
      description: program.description || "",
      tags: program.tags || [],
      durationHint: program.durationHint || "",
      type: program.type || "community",
      isPublic: program.isPublic !== undefined ? program.isPublic : true,
    });
    setShowProgramForm(true);
  };

  const handleSaveProgram = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const url = editingProgram
        ? `${API_BASE_URL}/api/admin/editProgram/${editingProgram._id}`
        : `${API_BASE_URL}/api/admin/createProgram`;
      const method = editingProgram ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(programForm),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: "success", text: `Program ${editingProgram ? "updated" : "created"} successfully` });
        setShowProgramForm(false);
        setEditingProgram(null);
        fetchData();
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save program" });
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/updateUserRole/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: "success", text: "User role updated successfully" });
        fetchData();
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update user role" });
    }
  };

  // Calculate stats
  const stats = {
    totalUsers: users.length,
    totalPrograms: programs.length,
    totalWorkouts: programs.reduce((sum, p) => sum + (p.programInfo?.days?.length || 0), 0),
    totalReviews: programs.reduce((sum, p) => sum + (p.ratingCount || 0), 0),
  };

  return (
    <div className="admin-screen">
      <div style={{ position: "relative" }}>
        <h1 className="page-title">Admin Dashboard</h1>
        <button className="signout-btn" onClick={onSignOut}>
          Sign Out
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`} style={{ margin: "20px auto", maxWidth: "980px" }}>
          {message.text}
        </div>
      )}

      <div className="stats-row">
        <div className="stat">
          {stats.totalUsers}
          <br />
          Total Users
        </div>
        <div className="stat">
          {stats.totalPrograms}
          <br />
          Programs
        </div>
        <div className="stat">
          {stats.totalWorkouts}
          <br />
          Workouts
        </div>
        <div className="stat">
          {stats.totalReviews}
          <br />
          Reviews
        </div>
      </div>

      <h2 className="section-title">Manage Users</h2>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                      style={{ padding: "4px 8px", borderRadius: "4px" }}
                    >
                      <option value="guest">Guest</option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{user.isBanned ? "Banned" : "Active"}</td>
                  <td>
                    {user.isBanned ? (
                      <button
                        className="action-btn-unban"
                        onClick={() => handleUnbanUser(user._id)}
                      >
                        Unban
                      </button>
                    ) : (
                      <button
                        className="action-btn-ban"
                        onClick={() => handleBanUser(user._id)}
                      >
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Manage Programs</h2>
      <div style={{ maxWidth: "980px", margin: "0 auto 20px" }}>
        <button
          className="action-btn-create"
          onClick={() => {
            setEditingProgram(null);
            setProgramForm({
              title: "",
              shortLabel: "",
              summary: "",
              description: "",
              tags: [],
              durationHint: "",
              type: "community",
              isPublic: true,
            });
            setShowProgramForm(true);
          }}
        >
          + Add New Program
        </button>
      </div>

      {showProgramForm && (
        <div className="modal-overlay" onClick={() => setShowProgramForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingProgram ? "Edit Program" : "Create New Program"}</h3>
            <form onSubmit={handleSaveProgram}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={programForm.title}
                  onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Short Label</label>
                <input
                  type="text"
                  value={programForm.shortLabel}
                  onChange={(e) => setProgramForm({ ...programForm, shortLabel: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Summary</label>
                <textarea
                  value={programForm.summary}
                  onChange={(e) => setProgramForm({ ...programForm, summary: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={programForm.description}
                  onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={programForm.tags.join(", ")}
                  onChange={(e) =>
                    setProgramForm({
                      ...programForm,
                      tags: e.target.value.split(",").map((t) => t.trim()),
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Duration Hint</label>
                <input
                  type="text"
                  value={programForm.durationHint}
                  onChange={(e) => setProgramForm({ ...programForm, durationHint: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={programForm.isPublic}
                    onChange={(e) => setProgramForm({ ...programForm, isPublic: e.target.checked })}
                  />
                  Public
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="action-btn-save">
                  {editingProgram ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="action-btn-cancel"
                  onClick={() => {
                    setShowProgramForm(false);
                    setEditingProgram(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Program Name</th>
              <th>Creator</th>
              <th>Saves</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>Loading...</td>
              </tr>
            ) : programs.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>No programs found</td>
              </tr>
            ) : (
              programs.map((program) => (
                <tr key={program._id}>
                  <td>{program.title}</td>
                  <td>{program.authorName || "System"}</td>
                  <td>{program.savedCount || 0}</td>
                  <td>
                    ⭐ {program.rating ? program.rating.toFixed(1) : "0.0"}
                  </td>
                  <td>
                    <button
                      className="action-btn-edit"
                      onClick={() => handleEditProgram(program)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn-delete"
                      onClick={() => handleDeleteProgram(program._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
