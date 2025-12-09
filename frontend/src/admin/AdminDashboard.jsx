import React, { useEffect, useMemo, useState } from "react";
import "./indexadmin.css";
import SearchBar from "./SearchBar";
import UserTable from "./UserTable";
import UserEditPanel from "./UserEditPanel";
import Pagination from "./Pagination";
import Logo from "../assets/Logo.png"; 

// 1. Import your Supabase client
import { supabase } from "../supabaseClient"; 

// 2. Refactored Fetch Function
async function fetchUsersFromSupabase({ query = "", page = 1, pageSize = 10 }) {
  try {
    // Calculate range for pagination (0-based index)
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Start building the query
    let supabaseQuery = supabase
      .from("users") // <--- MAKE SURE THIS MATCHES YOUR TABLE NAME
      .select("*", { count: "exact" })
      .range(from, to)
      .order("id", { ascending: true });

    // Apply search filter if query exists
    if (query) {
      // Searches both email and full_name (case-insensitive)
      supabaseQuery = supabaseQuery.or(`email.ilike.%${query}%,full_name.ilike.%${query}%`);
    }

    const { data, count, error } = await supabaseQuery;

    if (error) throw error;

    return { data: data || [], total: count || 0 };
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return { data: [], total: 0 };
  }
}

export default function AdminDashboard() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load Data
  async function load() {
    setLoading(true);
    const { data, total } = await fetchUsersFromSupabase({ query, page, pageSize });
    setRows(data);
    setTotal(total);
    setLoading(false);
  }

  // Reload when page changes
  useEffect(() => { load(); }, [page]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  // 3. New Save Handler (Updates Supabase)
  const handleSave = async (updatedFields) => {
    if (!selected) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("users")
        .update(updatedFields)
        .eq("id", selected.id);

      if (error) throw error;

      // Update success: refresh local data and close panel
      await load(); 
      setSelected(null);
      alert("User updated successfully!");

    } catch (error) {
      console.error("Error updating user:", error.message);
      alert("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="admin-header">
        <div className="admin-header-left">
          <img src={Logo} alt="logo" className="admin-logo" />
          <h1 className="admin-brand">Porterest</h1>
        </div>
        <h2 className="admin-center-title">Admin Dashboard</h2>
        <div className="admin-header-right" />
      </div>

      <div className="admin-page">
        <h1 className="title">User management</h1>

        <div className="top-row">
          <SearchBar 
            value={query} 
            onChange={setQuery} 
            onSearch={() => { setPage(1); load(); }} 
          />
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
              onSave={handleSave} 
            />
          </div>
        </div>
      </div>
    </>
  );
}