// src/EditProfile.jsx
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "./supabaseClient"; // แก้ path ให้ตรงของเค้ก
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    about: "",
    username: "",
  });

  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null);

  // โหลดข้อมูลโปรไฟล์จาก table profiles
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setError("ยังไม่ได้ล็อกอิน");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const { data, error } = await supabase
          .from("profiles")
          .select("email, first_name, last_name, about, username, avatar_url")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error && error.code !== "PGRST116") {
          // PGRST116 = no rows
          throw error;
        }

        setForm({
          email: data?.email ?? user.email ?? "",
          firstName: data?.first_name ?? "",
          lastName: data?.last_name ?? "",
          about: data?.about ?? "",
          username:
            data?.username ??
            user?.email?.split("@")[0] ??
            "",
        });

        setAvatarUrl(
          data?.avatar_url ||
            (user?.email
              ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
              : "")
        );
      } catch (err) {
        console.error(err);
        setError(err.message || "โหลดข้อมูลโปรไฟล์ไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    // preview ทันที
    const localUrl = URL.createObjectURL(file);
    setAvatarUrl(localUrl);
  };

  const handleReset = () => {
    // แค่ reload หน้านี้ใหม่
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let finalAvatarUrl = avatarUrl;

      // 1) ถ้ามีไฟล์รูปใหม่ → upload ก่อน
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        const safeName = (form.username || "user")
          .replace(/[^a-z0-9\-]/gi, "_")
          .toLowerCase();
        const filePath = `${user.id}/${Date.now()}_${safeName}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        finalAvatarUrl = publicUrlData.publicUrl;
      }

      // 2) upsert ลง table profiles (1 user 1 row)
      const payload = {
        user_id: String(user.id),
        email: form.email,
        first_name: form.firstName,
        last_name: form.lastName,
        about: form.about,
        username: form.username,
        avatar_url: finalAvatarUrl,
      };

      const { data, error } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "user_id" })
        .select()
        .single();

      if (error) throw error;

      setSuccess("บันทึกโปรไฟล์เรียบร้อยแล้ว");
      setAvatarUrl(data.avatar_url || finalAvatarUrl || avatarUrl);

      // อยากเด้งกลับหน้า profile ก็ได้
      // setTimeout(() => navigate("/profile"), 800);
    } catch (err) {
      console.error(err);
      setError(err.message || "บันทึกโปรไฟล์ไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "24px" }}>
        <h1>Edit Profile</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "24px" }}>
        <h1>Edit Profile</h1>
        <p>กรุณาล็อกอินก่อน</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "24px 16px 40px",
      }}
    >
      <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
        Edit Profile
      </h1>

      <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
        Keep your personal details private. Information you add here is visible
        to anyone who can view your profile.
      </p>

      {error && (
        <div
          style={{
            marginBottom: "12px",
            padding: "8px 12px",
            borderRadius: "8px",
            background: "#fee2e2",
            color: "#b91c1c",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginBottom: "12px",
            padding: "8px 12px",
            borderRadius: "8px",
            background: "#dcfce7",
            color: "#166534",
            fontSize: "14px",
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* photo */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "13px", marginBottom: "8px" }}>Photo</div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "999px",
                overflow: "hidden",
                background: "#e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "28px" }}>👤</span>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={handleAvatarClick}
                style={{
                  padding: "8px 14px",
                  borderRadius: "999px",
                  border: "none",
                  background: "#a855f7",
                  color: "white",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Change
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
            </div>
          </div>
        </div>

        {/* Email (read-only) */}
        <Field
          label="Email"
          placeholder="your@email.com"
          value={form.email}
          onChange={handleChange("email")}
          readOnly
        />

        {/* First name */}
        <Field
          label="First name"
          placeholder="First name"
          value={form.firstName}
          onChange={handleChange("firstName")}
        />

        {/* Last name */}
        <Field
          label="Last name"
          placeholder="Last name"
          value={form.lastName}
          onChange={handleChange("lastName")}
        />

        {/* About */}
        <Field
          label="About"
          placeholder="Tell your story"
          value={form.about}
          onChange={handleChange("about")}
          multiline
        />

        {/* Username */}
        <Field
          label="Username"
          placeholder="Awesome username"
          value={form.username}
          onChange={handleChange("username")}
        />

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginTop: "24px",
          }}
        >
          <button
            type="button"
            onClick={handleReset}
            style={{
              minWidth: "120px",
              padding: "10px 18px",
              borderRadius: "999px",
              border: "none",
              background: "#111827",
              color: "white",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{
              minWidth: "120px",
              padding: "10px 18px",
              borderRadius: "999px",
              border: "none",
              background: saving ? "#9ca3af" : "#111827",
              color: "white",
              cursor: saving ? "default" : "pointer",
            }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

// เล็ก ๆ เอาไว้ใช้ซ้ำสำหรับ input แต่ละช่อง
function Field({ label, placeholder, value, onChange, multiline, readOnly }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          fontSize: "13px",
          marginBottom: "6px",
          color: "#374151",
        }}
      >
        {label}
      </div>
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          style={{
            width: "100%",
            borderRadius: "999px",
            border: "1px solid #d1d5db",
            padding: "10px 14px",
            fontSize: "14px",
            resize: "vertical",
          }}
        />
      ) : (
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          style={{
            width: "100%",
            borderRadius: "999px",
            border: "1px solid #d1d5db",
            padding: "10px 14px",
            fontSize: "14px",
          }}
        />
      )}
    </div>
  );
}
