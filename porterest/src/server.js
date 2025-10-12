import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { cookie } from "@elysiajs/cookie";
import { Google, generateState, generateCodeVerifier } from "arctic";

// the id and secret is stored in .env
// the callback is the same as the authorized redirect URIs in google cloud that you set
const redirectURL = `${process.env.BACKEND_URL}/auth/google/callback`;

const google = new Google(
  process.env.GOOGLE_CLIENT_ID || "",
  process.env.GOOGLE_CLIENT_SECRET || "",
  redirectURL,
);

new Elysia()
  .use(
    // cors to allow frontend
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    }),
  )
  .use(cookie())
  // GET endpoint to get the google auth url
  .get("/auth/google/url", ({ cookie }) => {
    const state = generateState(); // for CSRF protection
    const codeVerifier = generateCodeVerifier();

    // save state into google_oauth_state cookie
    // httpOnly prevents javascript on the browser from accessing these cookies, while still allowing server requests for those cookies for access
    // secure is set to true in production, false in development
    // set maxAge to 10 minutes since these don't need to last past the authentication flow
    cookie.google_oauth_state.set({
      value: state,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
    });

    // save codeVerifier into google_oauth_code_verifier cookie
    cookie.google_oauth_code_verifier.set({
      value: codeVerifier,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
    });

    // this is sent to the frontend, redirect to google authentication
    // we request the profile and email scope
    const url = google.createAuthorizationURL(state, codeVerifier, [
      "profile",
      "email",
    ]);

    return {
      url: url.toString(),
    };
  })
  // GET endpoint as callback from google authentication, which is the redirect URI that we specified
  .get("/auth/google/callback", async ({ query, cookie, set, redirect }) => {
    // query contains the URL query parameters attached from google
    const code = query.code;
    const state = query.state;
    // retrieved from cookies we stored earlier
    const storedState = cookie.google_oauth_state.value;
    const storedCodeVerifier = cookie.google_oauth_code_verifier.value;

    // check for valid responses, also CSRF check
    if (
      !code ||
      !state ||
      !storedState ||
      state !== storedState ||
      !storedCodeVerifier
    ) {
      set.status = 400;
      return "Invalid request";
    }

    try {
      // send to google to validate the code received with the verifier generated earlier
      // receive tokens, including access token
      const tokens = await google.validateAuthorizationCode(
        code,
        storedCodeVerifier,
      );
      // retrieve user info using access token
      const googleUserResponse = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken()}`,
          },
        },
      );
      const googleUser = await googleUserResponse.json();

      console.log("Authenticated user:", googleUser);

      // redirect to front page for now
      return redirect(process.env.FRONTEND_URL);
    } catch (e) {
      console.error("Authentication error:", e);
      set.status = 500;
      return "Authentication failed";
    }
  })
  .listen(8080);

console.log(`Elysia is running at ${process.env.BACKEND_URL}`);

