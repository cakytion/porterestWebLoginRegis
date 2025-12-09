// src/Profile.jsx (หรือ path ที่เค้กใช้)
// ✅ ถ้า profile.jsx อยู่ใน src/ ให้ปรับ path supabase ตอน import ให้ตรง (ดูด้านล่างข้อ 2)
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import styles from "./Profile.module.css";
import { supabase } from "./supabaseClient"; // แก้ path ตรงนี้ให้ตรงของเค้ก

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [activeTab, setActiveTab] = useState("created");
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPin, setNewPin] = useState({
    title: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [viewPin, setViewPin] = useState(null); // เอาไว้เก็บ pin ที่กำลังเปิดดู


  // ---------------------------
  // ---------------------------
  // โหลด profile + portfolios จาก Supabase
  // ---------------------------
    // ---------------------------
  // โหลด profile + portfolios จาก Supabase
  // ---------------------------
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    // 1) โหลด / สร้าง profiles
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("user_id, first_name, last_name, username, about, avatar_url")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          // ถ้ายังไม่มี profile ของ user นี้ → สร้างให้เลย
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .insert({
              user_id: user.id,
              username: user.email?.split("@")[0] ?? null,
            })
            .select()
            .single();

          if (insertError) throw insertError;
          setProfile(newProfile);
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error("fetchProfile error:", err);
      }
    };

    // 2) โหลด portfolios + รูปจาก portfolio_images
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        setError("");

        const { data, error } = await supabase
          .from("portfolios")
          .select(`
            *,
            portfolio_images (
              image_url
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPortfolios(data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "โหลดผลงานไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchPortfolios();
  }, [user?.id]);




  // ---------------------------
  // สร้าง Pin ใหม่ + อัปโหลดไฟล์
  // ---------------------------
  const handleCreatePin = async (e) => {
  e.preventDefault();
  setSaving(true);
  setError("");

  try {
    if (!newPin.title) {
      throw new Error("กรอก Title ก่อน")
    }
    if (!file) {
      throw new Error("เลือกไฟล์ก่อน(รูปหรือ PDF)");
    }

    // ✅ ใช้ user จาก AuthContext ไม่ใช้ supabase.auth
    if (!user?.id) {
      throw new Error("ยังไม่ได้ล็อกอิน");
    }
    const currentUserId = user.id;

    // 1) อัปโหลดไฟล์ไป Storage bucket "pins"
    const ext = file.name.split(".").pop();
    const safeTitle = newPin.title.replace(/[^a-z0-9\-]/gi, "_");
    const filePath = `${currentUserId}/${Date.now()}_${safeTitle}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("pins")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("pins")
      .getPublicUrl(filePath);

    const fileUrl = publicUrlData.publicUrl;

    // 2) insert ลง table "portfolios"
// 2) insert ลง table "portfolios"
const { data: inserted, error: insertError } = await supabase
  .from("portfolios")
  .insert({
    owner_id: currentUserId,
    user_id: currentUserId,
    title: newPin.title,
    description: newPin.description,
    file_url: fileUrl,
    file_type: file.type,
  })
  .select()
  .single();

if (insertError) throw insertError;

// ⭐⭐⭐ ใส่โค้ดนี้ตรงนี้ ⭐⭐⭐
// 2.5) เพิ่ม record ใน portfolio_images
const { error: imgError } = await supabase
  .from("portfolio_images")
  .insert({
    portfolio_id: inserted.id,
    image_url: fileUrl,
  });

if (imgError) throw imgError;
// ⭐⭐⭐ สิ้นสุดโค้ดเพิ่ม ⭐⭐⭐




    // 3) อัปเดต state ด้านหน้า
    setPortfolios((prev) => [inserted, ...(prev || [])]);

    // 4) ปิด modal + ล้างฟอร์ม
    setIsCreateOpen(false);
    setFile(null);
    setNewPin({ title: "", description: "" });
  } catch (err) {
    console.error(err);
    setError(err.message || "สร้าง Pin ไม่สำเร็จ");
  } finally {
    setSaving(false);
  }
};


  // ---------------------------
  // UI helper
  // ---------------------------
const avatarUrl =
  profile?.avatar_url ||
  (user?.email
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
    : "https://via.placeholder.com/150");


  const username =
  profile?.first_name || profile?.last_name
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
    : user?.email?.split("@")[0];
  const handle = profile?.username
  ? `@${profile.username}`
  : `@${user?.email?.split("@")[0]}`;


  if (!user) {
    return (
      <div className={styles.container}>
        <p>กรุณาล็อกอินก่อนเพื่อดูโปรไฟล์</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ERROR BOX */}
      {error && (
        <div
          style={{
            marginBottom: "12px",
            padding: "8px 12px",
            borderRadius: "8px",
            background: "#fee2e2",
            color: "#e476ccff",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          <img src={avatarUrl} alt="Avatar" className={styles.avatar} />
        </div>

        <h1 className={styles.username}>{username}</h1>
        <p className={styles.handle}>{handle}</p>

        <div className={styles.stats}>
          <span>0 followers</span> • <span>0 following</span>
        </div>
<div className={styles.actions}>
  <Link to="/settings" className={styles.btnSecondary}>
    Edit Profile
  </Link>
  <button
    className={styles.btnPrimary}
    type="button"
    onClick={() => setIsCreateOpen(true)}
  >
    Create Pin
  </button>
  {user.role === 'administrator' && (
              <Link to="/admin"
                className={styles.btnPrimary}
                type="button"
              >
                Admin Panel
              </Link>
            )}
</div>

      </div>

      {/* TABS */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabItem} ${
            activeTab === "created" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("created")}
        >
          Created
        </button>
        <button
          className={`${styles.tabItem} ${
            activeTab === "saved" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("saved")}
        >
          Saved
        </button>
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : activeTab === "created" ? (
          portfolios.length > 0 ? (
            <div className={styles.masonryGrid}>
              {portfolios.map((item) => {
  const imageSrc =
    item.file_url || item.portfolio_images?.[0]?.image_url;
  const isPdf = item.file_type === "application/pdf";

  return (
    <div
      key={item.id}
      className={styles.pinItem}
      onClick={() => setViewPin(item)}    // ⬅️ คลิกการ์ดแล้วเปิด view
      style={{ cursor: "pointer" }}       // ให้เมาส์เป็นมือ
    >
      {imageSrc && !isPdf && (
        <img
          src={imageSrc}
          alt={item.title}
          className={styles.pinImage}
        />
      )}

      {isPdf && (
        <div
          style={{
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f1f5f9",
            fontSize: "12px",
            color: "#475569",
          }}
        >
          PDF file
        </div>
      )}

      <div className={styles.overlay}>
        <button
          className={styles.btnSave}
          onClick={(e) => {
            e.stopPropagation(); // ⬅️ กันไม่ให้เปิด modal ตอนกด Save
            // TODO: logic save ถ้ามีในอนาคต
          }}
        >
          Save
        </button>
      </div>

      <div style={{ padding: "8px" }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 600,
            marginBottom: "4px",
          }}
        >
          {item.title}
        </div>
        {item.description && (
          <div
            style={{
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            {item.description}
          </div>
        )}
        {item.file_url && (
          <a
            href={item.file_url}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: "12px",
              color: "#2563eb",
              textDecoration: "underline",
              marginTop: "4px",
              display: "inline-block",
            }}
            onClick={(e) => e.stopPropagation()} // ⬅️ กันไม่ให้กดลิงก์แล้วเปิด modal ซ้ำ
          >
            Open file
          </a>
        )}
      </div>
    </div>
  );
})}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Nothing to show...yet! Pins you create will live here.</p>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => setIsCreateOpen(true)}
              >
                Create Pin
              </button>
            </div>
          )
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📌</div>
            <p>You haven't saved any Pins yet</p>
          </div>
        )}
      </div>

      {/* MODAL: Create Pin */}
      {isCreateOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <h2
              style={{
                marginBottom: "12px",
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              Create new pin
            </h2>

            {error && (
              <div
                style={{
                  marginBottom: "8px",
                  color: "red",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleCreatePin}>
              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    marginBottom: "4px",
                  }}
                >
                  Title
                </label>
                <input
                  type="text"
                  value={newPin.title}
                  onChange={(e) =>
                    setNewPin((prev) => ({ ...prev, title: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    marginBottom: "4px",
                  }}
                >
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newPin.description}
                  onChange={(e) =>
                    setNewPin((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    marginBottom: "4px",
                  }}
                >
                  File (image / PDF)
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setFile(f);
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginTop: "16px",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setFile(null);
                    setNewPin({ title: "", description: "" });
                  }}
                  className={styles.btnSecondary}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Create"}
                  
                </button>
                
              </div>
            </form>
            
          </div>
        </div>
      )}
      {/* MODAL: View Pin */}
{viewPin && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 60,
    }}
    onClick={() => setViewPin(null)} // คลิกพื้นเทาเพื่อปิด
  >
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "20px",
        width: "100%",
        maxWidth: "700px",
        maxHeight: "80vh",
        overflowY: "auto",
        display: "grid",
        gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.5fr)",
        gap: "16px",
      }}
      onClick={(e) => e.stopPropagation()} // กันไม่ให้ปิดตอนคลิกข้างใน
    >
      {/* ซีกซ้าย: รูป/preview */}
      <div>
        {viewPin.file_url && !viewPin.file_type?.startsWith("application/pdf") ? (
          <img
            src={viewPin.file_url}
            alt={viewPin.title}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "12px",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f1f5f9",
              borderRadius: "12px",
              fontSize: "14px",
              color: "#475569",
            }}
          >
            {viewPin.file_type === "application/pdf"
              ? "PDF file – กด Open file เพื่อเปิดดู"
              : "ไม่มี preview"}
          </div>
        )}
      </div>

      {/* ซีกขวา: รายละเอียด */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
            {viewPin.title}
          </h2>
          <button
            onClick={() => setViewPin(null)}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {viewPin.description && (
          <p
            style={{
              fontSize: "14px",
              color: "#475569",
              whiteSpace: "pre-wrap",
            }}
          >
            {viewPin.description}
          </p>
        )}

        {viewPin.file_url && (
          <a
            href={viewPin.file_url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              marginTop: "12px",
              fontSize: "14px",
              color: "#2563eb",
              textDecoration: "underline",
            }}
          >
            Open file
          </a>
        )}
      </div>
    </div>
  </div>
)}

    </div>


  );
}
