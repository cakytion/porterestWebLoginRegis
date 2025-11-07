import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { jwtConfig } from "./config/index.js";
import { setupAuthRoutes } from "./routes/auth.js";
import { setupUserRoutes } from "./routes/user.js";

export const app = new Elysia()
  .use(
    // cors to allow frontend
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  )
  .use(cookie())
  // set up JWT to hold google profile info before finalizing registration
  .use(
    jwt({
      name: jwtConfig.temp.name,
      secret: jwtConfig.temp.secret,
      exp: jwtConfig.temp.exp,
    })
  )
  // set up JWT for logged in user sessions
  .use(
    jwt({
      name: jwtConfig.session.name,
      secret: jwtConfig.session.secret,
      exp: jwtConfig.session.exp,
    })
  );

setupAuthRoutes(app);
setupUserRoutes(app);

if (process.env.NODE_ENV !== "test") {
  app.listen(8080);
  console.log(`Elysia is running at ${process.env.BACKEND_URL}`);
}
