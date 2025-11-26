// src/Dashboard.jsx

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./DashboardNew.css";
import Logo from "./assets/Logo.png"; // ✅ โลโก้

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ state สำหรับ search

  // -----------------------------------------------------
  // โหลดข้อมูลโปรไฟล์ของ user (โหลด avatar จาก profiles table)
  // -----------------------------------------------------
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!error) setProfile(data);
    };

    loadProfile();
  }, [user?.id]);

  // -----------------------------------------------------
  // โหลดงานของทุกคน (Global Portfolio Feed)
  // -----------------------------------------------------
  useEffect(() => {
    const fetchAllPortfolios = async () => {
      const { data, error } = await supabase
        .from("portfolios")
        .select(
          `
          id,
          title,
          description,
          user_id,
          portfolio_images ( image_url ),
          profiles!inner (
            username,
            avatar_url
          )
        `
        )
        .order("created_at", { ascending: false });

      if (!error) setItems(data || []);
      setLoading(false);
    };

    fetchAllPortfolios();
  }, []);

  // -----------------------------------------------------
  // ไปหน้า Profile
  // -----------------------------------------------------
  const goProfile = () => navigate("/profile");

  // -----------------------------------------------------
  // ไปหน้า Portfolio Detail
  // -----------------------------------------------------
  const openPortfolio = (id) => navigate(`/portfolio/${id}`);

  // -----------------------------------------------------
  // filter ตาม title (เคสไม่สนตัวใหญ่เล็ก)
  // -----------------------------------------------------
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredItems =
    normalizedSearch === ""
      ? items
      : items.filter((item) =>
          (item.title || "")
            .toLowerCase()
            .includes(normalizedSearch)
        );

  return (
    <div className="dashboard-container">
      {/* ─────── Top Navbar ─────── */}
      <div className="topbar">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={Logo} alt="Porterest logo" className="logo-img" />
          <span className="logo-text">Porterest</span>
        </div>

        <input
          className="search"
          placeholder="Search Portfolios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // ✅ ผูกกับ state
        />

        <img
          className="avatar"
          onClick={goProfile}
          referrerPolicy="no-referrer"
          src={
            profile?.avatar_url ||
            user?.avatar_url ||
            (user?.email
              ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
              : "https://via.placeholder.com/40")
          }
          alt="avatar"
        />
      </div>

      {/* ─────── Content ─────── */}
      <div className="content">
        <h2>All Portfolios</h2>

        {loading ? (
          <p>Loading...</p>
        ) : filteredItems.length === 0 ? ( // ✅ ใช้ filteredItems
          <p>No portfolios found.</p>
        ) : (
          <div className="grid">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="card"
                onClick={() => openPortfolio(item.id)}
              >
                {/* Preview image */}
                {item.portfolio_images?.length > 0 ? (
                  <img
                    src={item.portfolio_images[0].image_url}
                    className="card-img"
                    alt={item.title}
                  />
                ) : (
                  <div className="no-img">No Image</div>
                )}

                <div className="card-info">
                  <div className="title">{item.title}</div>
                  <div className="owner">
                    by {item.profiles?.username || "Unknown"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─────── Footer ─────── */}
      <footer className="footer">© 2025 Porterest. All rights reserved.</footer>
    </div>
  );
}
