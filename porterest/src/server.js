import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

new Elysia()
  .use(
    // cors to allow frontend
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    }),
  )
  .get("/auth/google/url", () => ({
    url: "https://accounts.google.com",
  }))
  // listens on port 8080
  .listen(8080);

console.log(`Elysia is running at http://localhost:8080`);
