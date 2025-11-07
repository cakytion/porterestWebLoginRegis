import { Google } from "arctic";
import { createClient } from "@supabase/supabase-js";

// create supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "" // for RLS
);

// the id and secret is stored in .env
// the callback is the same as the authorized redirect URIs in google cloud that you set
const redirectURL = `${process.env.BACKEND_URL}/auth/google/callback`;

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID || "",
  process.env.GOOGLE_CLIENT_SECRET || "",
  redirectURL
);

export const jwtConfig = {
  temp: {
    name: "temp_jwt",
    secret: process.env.JWT_SECRET || "",
    exp: "10m",
  },
  session: {
    name: "session_jwt",
    secret: process.env.JWT_SECRET || "",
    exp: "7d",
  },
};
