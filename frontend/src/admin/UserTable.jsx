import React from "react";

export default function UserTable({ rows, loading, onEdit }) {
  return (
    <div className="card table-card">
      <table className="table">
        <thead>
          <tr>
            <th style={{width:32}}><input type="checkbox" /></th>
            <th>Username</th>
            <th>Email</th>
            <th>UserID</th>
            <th>Role</th>
            <th>Status</th>
            <th style={{width:80}}></th>
          </tr>
        </thead>
        <tbody>
          {!loading && rows.map(u => (
            <tr key={u.id}>
              <td><input type="checkbox" /></td>
              <td>{u.full_name}</td>
              <td>{u.email}</td>
              <td>{u.id}</td>
              <td className={`tag role-${u.role}`}>{u.role}</td>
              <td className={`tag status-${u.status}`}>{u.status}</td>
              <td><button className="btn btn-sm" onClick={()=>onEdit(u)}>Edit</button></td>
            </tr>
          ))}
          {loading && (
            <tr><td colSpan={7} style={{textAlign:"center"}}>Loading...</td></tr>
          )}
          {!loading && rows.length === 0 && (
            <tr><td colSpan={7} style={{textAlign:"center"}}>No data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}