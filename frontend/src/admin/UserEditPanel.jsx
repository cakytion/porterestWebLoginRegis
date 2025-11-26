import React, { useEffect, useState } from "react";

export default function UserEditPanel({ user, onCancel, onSave }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("student");
  const [status, setStatus] = useState("active");

  useEffect(() => {
    if (!user) return;
    setEmail(user.email || "");
    setUsername((user.full_name || "").split(" ")[0] || "");
    setUserId(String(user.id || ""));
    const [f, ...rest] = (user.full_name || "").split(" ");
    setFirstName(f || "");
    setLastName(rest.join(" ") || "");
    setRole(user.role || "student");
    setStatus(user.status || "active");
  }, [user]);

  if (!user) {
    return <div className="card edit-card placeholder">Select a user to edit</div>;
  }

  return (
    <div className="card edit-card">
      <div className="avatar-circle">👤</div>

      <label>Email</label>
      <input value={email} onChange={e=>setEmail(e.target.value)} readOnly/>

      <label>Username</label>
      <input value={username} onChange={e=>setUsername(e.target.value)} />

      <label>UserID</label>
      <input value={userId} readOnly/>

      <label>First name</label>
      <input value={firstName} onChange={e=>setFirstName(e.target.value)} />

      <label>Last name</label>
      <input value={lastName} onChange={e=>setLastName(e.target.value)} />

      <div className="row">
        <div className="col">
          <label>Role</label>
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="viewer">Viewer</option>
            <option value="administrator">Admin</option>
          </select>
        </div>
        <div className="col">
          <label>Status</label>
          <select value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="active">Active</option>
            <option value="deactivated">Deactivated</option>
          </select>
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-primary" onClick={()=>{
          onSave({
            full_name: [firstName, lastName].filter(Boolean).join(" "),
            role, status
          });
        }}>Confirm</button>
        <button className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}