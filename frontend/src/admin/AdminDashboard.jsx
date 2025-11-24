import React, { useEffect, useMemo, useState } from "react";
import "./indexadmin.css";
import SearchBar from "./SearchBar";
import UserTable from "./UserTable";
import UserEditPanel from "./UserEditPanel";
import Pagination from "./Pagination";

// ⬇⬇⬇ เพิ่มบรรทัดนี้ (ปรับ path ตามที่เก็บโลโก้จริง)
// ถ้าไฟล์ AdminDashboard.jsx อยู่ที่ src/admin/ และ Logo.png อยู่ที่ src/assets/Logo.png
// ใช้แบบนี้:
import Logo from "../assets/Logo.png";
// ถ้าโลโก้อยู่โฟลเดอร์เดียวกับ Login.jsx (src/) ใช้: import Logo from "../assets/Logo.png";
// ถ้าเหมือนหน้า Login (./assets/Logo.png) อยู่ข้าง ๆ AdminDashboard.jsx ให้ใช้ path นั้นแทน

// ===== Mock service...
async function fetchUsers({ query = "", page = 1, pageSize = 10 }) {
  const all = [
    { id: 896723, email: "admin1@porterest.com", full_name: "Admin One", role: "administrator", status: "active" },
    { id: 456868, email: "user1@testmail.com", full_name: "User One", role: "student", status: "active" },
    { id: 165789, email: "user2@testmail.com", full_name: "User Two", role: "student", status: "active" },
    { id: 987874, email: "user3@testmail.com", full_name: "User Three", role: "viewer", status: "active" },
    { id: 234987, email: "user4@testmail.com", full_name: "User Four", role: "student", status: "deactivated" },
  ];
  const q = query.trim().toLowerCase();
  const filtered = q ? all.filter(u => (u.email + u.full_name).toLowerCase().includes(q)) : all;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);
  return { data, total: filtered.length, page, pageSize };
}

export default function AdminDashboard() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const { data, total } = await fetchUsers({ query, page, pageSize });
    setRows(data);
    setTotal(total);
    setLoading(false);
  }

  useEffect(() => { load(); }, [page]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  return (
    <>
      {/* ⬇⬇⬇ เพิ่มหัวแบบหน้า Login: แถบชมพู + โลโก้ซ้าย + ข้อความกลาง */}
      <div className="admin-header">
        <div className="admin-header-left">
          <img src={Logo} alt="logo" className="admin-logo" />
          <h1 className="admin-brand">Porterest</h1>
        </div>
        <h2 className="admin-center-title">Admin Dashboard</h2>
        <div className="admin-header-right" />
      </div>
      {/* ⬆⬆⬆ จบส่วนที่เพิ่ม */}

      <div className="admin-page">
        <h1 className="title">User management</h1>

        <div className="top-row">
          <SearchBar value={query} onChange={setQuery} onSearch={() => { setPage(1); load(); }} />
        </div>

        <div className="content-grid">
          <div className="left-pane">
            <UserTable rows={rows} loading={loading} onEdit={(u) => setSelected(u)} />
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage(p => Math.max(1, p - 1))}
              onNext={() => setPage(p => Math.min(totalPages, p + 1))}
            />
          </div>

          <div className="right-pane">
            <UserEditPanel
              user={selected}
              onCancel={() => setSelected(null)}
              onSave={(v) => {
                if (!selected) return;
                const updated = { ...selected, ...v };
                setSelected(updated);
                setRows(rs => rs.map(r => (r.id === updated.id ? updated : r)));
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
