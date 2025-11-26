// backend/routes/portfolio.js
import { supabase } from "../config/index.js";

export function setupPortfolioRoutes(app) {
  return (
    app

      // GET: ดึง portfolios ของ user ปัจจุบัน
      .get("/api/portfolios", async ({ session_jwt, cookie, set }) => {
        try {
          const payload = await session_jwt.verify(cookie.session_token.value);
          if (!payload) {
            set.status = 401;
            return "Unauthorized";
          }

          const userId = payload.userId;

          const { data, error } = await supabase
            .from("portfolios") // ← แก้ให้ตรงตารางจริง
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

          if (error) {
            set.status = 500;
            return "Database error";
          }

          return { success: true, data: data || [] };
        } catch (err) {
          console.error(err);
          set.status = 500;
          return "Unexpected error";
        }
      })

      // POST: สร้าง portfolio ใหม่
      .post("/api/portfolios", async ({ session_jwt, cookie, set, body }) => {
        try {
          const payload = await session_jwt.verify(cookie.session_token.value);
          if (!payload) {
            set.status = 401;
            return "Unauthorized";
          }

          const userId = payload.userId;
          const { title, description, file_url, file_type } = body;

          if (!title || !file_url) {
            set.status = 400;
            return "Missing required fields";
          }

          const { data, error } = await supabase
            .from("portfolios")
            .insert({
              user_id: userId,
              title,
              description,
              file_url,
              file_type,
            })
            .select()
            .single();

          if (error) {
            set.status = 500;
            return "Database error";
          }

          return { success: true, data };
        } catch (err) {
          console.error(err);
          set.status = 500;
          return "Unexpected error";
        }
      })
  );
}
