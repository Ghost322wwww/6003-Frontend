import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Profile: React.FC = () => {
  const { user, setUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState(
    user?.avatar ? `http://localhost:5000${user.avatar}` : "/default-avatar.png"
  );
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }
    console.log('user:', user);
    console.log('imgUrl:', imgUrl);
  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImgFile(e.target.files[0]);
      setImgUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username);
      if (password) formData.append("password", password);
      if (imgFile) formData.append("avatar", imgFile);

      const res = await api.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data.user);
      setImgUrl(
        res.data.user.avatar
          ? `http://localhost:5000${res.data.user.avatar}`
          : "/default-avatar.png"
      );
      alert("Profile updated!");
      setEditMode(false);
    } catch (err) {
      alert("Update failed");
    }
    setLoading(false);
  };

  return (
    <div className="profile-container">
      <h2 style={{ textAlign: "center", fontSize: "2.2rem" }}>User Profile</h2>
      <div className="profile-card">
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <img
            src={imgUrl}
            alt="avatar"
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
          />
        </div>
        {!editMode ? (
          <>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <button className="detail-btn" onClick={() => setEditMode(true)}>
              Edit
            </button>
          </>
        ) : (
          <div style={{ textAlign: "left" }}>
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <label>Avatar</label>
            <input type="file" accept="image/*" onChange={handleImgChange} />
            <div style={{ marginTop: 16 }}>
              <button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
              <button style={{ marginLeft: 8 }} onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
