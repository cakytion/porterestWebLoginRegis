import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { openapi } from "@elysiajs/openapi";
import { jwtConfig } from "./config/index.js";
import { setupAuthRoutes } from "./routes/auth.js";
import { setupUserRoutes } from "./routes/user.js";

export const app = new Elysia();

// enable OpenAPI docs in development only
if (process.env.NODE_ENV !== "production") {
  app.use(
    openapi({
      documentation: {
        info: {
          title: "Porterest API",
          version: "1.0.0",
          description: "API for Porterest",
        },
        tags: [
          { name: "Auth", description: "Authentication endpoints" },
          { name: "User", description: "User-related endpoints" },
        ],
      },
    })
  );
}

app
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
