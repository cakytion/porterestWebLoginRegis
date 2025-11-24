import { Google } from "arctic";
import { createClient } from "@supabase/supabase-js";
import { Elysia } from "elysia";
import portfolioRoutes from "./routes/portfolio";

// create supabase client
export const supabase = createClient(
process.env.SUPABASE_URL || "",
process.env.SUPABASE_SERVICE_ROLE_KEY || "" // for RLS
);

// the id and secret is stored in .env
// the callback is the same as the authorized redirect URIs in Google Cloud
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

// initialize Elysia app
const app = new Elysia()
.use(portfolioRoutes)
.listen(3000);

console.log("Backend running on [http://localhost:3000](http://localhost:3000)");
