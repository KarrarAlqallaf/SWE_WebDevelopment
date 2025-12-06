import { useState, useEffect } from "react";
import "./Profile.css";

const API_BASE_URL = `http://localhost:8000`;

export default function Profile({ currentUser, onUpdateUser }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (currentUser) {
      setForm({
        username: currentUser.username || "",
        email: currentUser.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setProfilePicture(currentUser.profilePicture);
      setPreviewImage(currentUser.profilePicture);
    }
  }, [currentUser]);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setMessage({ type: "error", text: "Please select an image file" });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image size must be less than 5MB" });
        return;
      }
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreviewImage(base64String);
        setProfilePicture(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = getToken();
      if (!token) {
        setMessage({ type: "error", text: "Please login first" });
        setLoading(false);
        return;
      }

      const updateData = {};
      if (form.username !== currentUser.username) {
        updateData.username = form.username;
      }
      if (form.email !== currentUser.email) {
        updateData.email = form.email;
      }
      if (profilePicture !== currentUser.profilePicture) {
        updateData.profilePicture = profilePicture;
      }

      if (Object.keys(updateData).length === 0) {
        setMessage({ type: "info", text: "No changes to save" });
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/updateProfile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message || "Profile updated successfully" });
        if (onUpdateUser && data.data?.user) {
          onUpdateUser(data.data.user);
        }
        // Clear password fields
        setForm({ ...form, currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update profile" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (form.newPassword !== form.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setLoading(false);
      return;
    }

    if (form.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters long" });
      setLoading(false);
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        setMessage({ type: "error", text: "Please login first" });
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/changePassword`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message || "Password changed successfully" });
        setForm({ ...form, currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to change password" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (!form.currentPassword) {
      setMessage({ type: "error", text: "Please enter your password to change email" });
      setLoading(false);
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        setMessage({ type: "error", text: "Please login first" });
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/changeEmail`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newEmail: form.email,
          password: form.currentPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message || "Email changed successfully" });
        if (onUpdateUser && data.data?.user) {
          onUpdateUser(data.data.user);
        }
        setForm({ ...form, currentPassword: "" });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to change email" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-screen">
      <div className="profile-avatar">
        <label htmlFor="profile-picture-input" className="avatar-upload-label">
          {previewImage ? (
            <img src={previewImage} alt="Profile" className="avatar-image" />
          ) : (
            <span>👤</span>
          )}
          <input
            type="file"
            id="profile-picture-input"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <span className="avatar-upload-hint">Click to upload</span>
        </label>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-form">
        <form onSubmit={handleUpdateProfile}>
          <div className="buttons-row">
            <div className="field" style={{ width: "220px" }}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="field" style={{ width: "220px" }}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleInputChange}
                required
              />
              <span className="icon">📧</span>
            </div>
          </div>

          <button
            type="submit"
            className="action-btn full-btn"
            disabled={loading}
            style={{ marginTop: "10px" }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <form onSubmit={handleChangeEmail} style={{ marginTop: "20px" }}>
          <div className="buttons-row">
            <div className="field" style={{ width: "220px" }}>
              <input
                type="password"
                name="currentPassword"
                placeholder="Password (to change email)"
                value={form.currentPassword}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              className="action-btn"
              disabled={loading}
            >
              Change Email
            </button>
          </div>
        </form>

        <form onSubmit={handleChangePassword} style={{ marginTop: "20px" }}>
          <div className="buttons-row">
            <div className="field" style={{ width: "220px" }}>
              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={form.currentPassword}
                onChange={handleInputChange}
              />
            </div>
            <div className="field" style={{ width: "220px" }}>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={form.newPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="buttons-row" style={{ marginTop: "10px" }}>
            <div className="field" style={{ width: "220px" }}>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={form.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button
            type="submit"
            className="action-btn full-btn"
            disabled={loading}
            style={{ marginTop: "10px" }}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}