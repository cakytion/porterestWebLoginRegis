import { supabase } from "../config/index.js";

export function setupUserRoutes(app) {
  return (
    app
      // GET endpoint for getting profile data (protected)
      .get(
        "/api/profile",
        async ({ session_jwt, cookie, set }) => {
          try {
            // verify session token first
            const payload = await session_jwt.verify(cookie.session_token.value);
            if (!payload) {
              set.status = 401;
              return "Unauthorized";
            }

            // then fetch user from db
            const { data: profile, error } = await supabase
              .from("users")
              .select("id, email, full_name, avatar_url, role, created_at") // with these columns
              .eq("id", payload.userId) // only currently logged in user
              .single();

            if (error || !profile) {
              set.status = 404;
              return "User not found";
            }

            // then return the profile info
            return profile;
          } catch (e) {
            console.error("Profile access error:", e);
            set.status = 401;
            return "Unauthorized";
          }
        },
        {
          detail: {
            summary: "Get User Profile",
            description: "Retrieves the authenticated user's profile information",
            tags: ["User"],
          },
        }
      )
      // POST endpoint to facilitate logging out
      .post(
        "/api/logout",
        ({ cookie, set }) => {
          // delete the session jwt from cookie
          cookie.session_token.remove();
          set.status = 200;
          return { status: "success" };
        },
        {
          detail: {
            summary: "Logout User",
            description: "Logs out the user by removing the session token cookie",
            tags: ["User"],
          },
        }
      )
  );
}
