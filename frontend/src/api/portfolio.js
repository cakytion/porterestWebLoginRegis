// frontend/src/api/portfolio.js

// ดึงรายการ portfolio ของ user ปัจจุบัน
export async function getUserPortfolios() {
  const res = await fetch("/api/portfolios", {
    credentials: "include", // ให้ cookie ติดไปด้วย (session)
  });

  if (!res.ok) {
    throw new Error("Failed to fetch portfolios");
  }

  return res.json(); // { success: true, data: [...] }
}

// สร้าง portfolio ใหม่ (หลังจากอัปโหลดไฟล์ขึ้น Supabase แล้ว)
export async function createPortfolio({ title, description, fileUrl, fileType }) {
  const res = await fetch("/api/portfolios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      title,
      description,
      file_url: fileUrl,
      file_type: fileType,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create portfolio");
  }

  return res.json(); // { success: true, data: {...} }
}
