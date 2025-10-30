import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { cookie } from "@elysiajs/cookie";
import { Google, generateState, generateCodeVerifier } from "arctic";
import { createClient } from "@supabase/supabase-js";
import { jwt } from "@elysiajs/jwt";

// create supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "" // for RLS
);

// the id and secret is stored in .env
// the callback is the same as the authorized redirect URIs in google cloud that you set
const redirectURL = `${process.env.BACKEND_URL}/auth/google/callback`;

const google = new Google(
  process.env.GOOGLE_CLIENT_ID || "",
  process.env.GOOGLE_CLIENT_SECRET || "",
  redirectURL
);

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
      name: "temp_jwt",
      secret: process.env.JWT_SECRET || "",
      exp: "10m",
    })
  )
  // set up JWT for logged in user sessions
  .use(
    jwt({
      name: "session_jwt",
      secret: process.env.JWT_SECRET || "",
      exp: "7d",
    })
  )
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
    const url = google.createAuthorizationURL(state, codeVerifier, ["profile", "email"]);

    return {
      url: url.toString(),
    };
  })
  // GET endpoint as callback from google authentication, which is the redirect URI that we specified
  .get("/auth/google/callback", async ({ query, cookie, set, redirect, temp_jwt, session_jwt }) => {
    // query contains the URL query parameters attached from google
    const code = query.code;
    const state = query.state;
    // retrieved from cookies we stored earlier
    const storedState = cookie.google_oauth_state.value;
    const storedCodeVerifier = cookie.google_oauth_code_verifier.value;

    // check for valid responses, also CSRF check
    if (!code || !state || !storedState || state !== storedState || !storedCodeVerifier) {
      set.status = 400;
      return "Invalid request";
    }

    try {
      // send to google to validate the code received with the verifier generated earlier
      // receive tokens, including access token
      const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
      // retrieve user info using access token
      const googleUserResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`,
        },
      });
      const googleUser = await googleUserResponse.json();

      // attempt to find user in the database
      const { data: identity, error: identityError } = await supabase
        .from("auth_identities") // auth_identities table
        .select("*, users(*)") // perform left outer join, all columns from auth_identities + matching, all columns from users table
        .eq("provider", "google") // filter google auth
        .eq("provider_id", googleUser.sub) // filter for one specific user, .sub is unique for every google account
        .single(); // return an object instead of an array of objects

      if (identityError && identityError.code !== "PGRST116") {
        // PGRST116 means no rows found, which indicates a new user.
        console.error("error finding identity:", identityError);
        set.status = 500;
        return "Database error";
      }

      let user = identity?.users;

      if (!user) {
        // if new user, then create temp jwt with google profile info
        const tempToken = await temp_jwt.sign({
          googleProfile: {
            sub: googleUser.sub,
            name: googleUser.name,
            email: googleUser.email,
            picture: googleUser.picture,
          },
        });

        // then save the token to a cookie
        cookie.temp_token.set({
          value: tempToken,
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });

        // then redirect to finish signup to get role information
        return redirect(`${process.env.FRONTEND_URL}/finish-signup`);
      }

      // if the user exists, create a session jwt
      const sessionToken = await session_jwt.sign({
        userId: user.id,
        role: user.role, // store this to be used for future authorization backend logic w/o having to query the db frequently
      });

      // then save to cookie
      cookie.session_token.set({
        value: sessionToken,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      console.log("Authenticated existing user:", user.email);

      // redirect to dashboard page
      return redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (e) {
      console.error("Authentication error:", e);
      set.status = 500;
      return "Authentication failed";
    }
  })
  // POST endpoint for finalizing google registration
  .post("/api/register/google-finalize", async ({ body, cookie, set, temp_jwt, session_jwt }) => {
    try {
      // verify temp token from cookie
      const tempAuth = await temp_jwt.verify(cookie.temp_token.value);
      if (!tempAuth || !tempAuth.googleProfile) {
        set.status = 401;
        return "Unauthorized: Invalid temporary token";
      }
      const { googleProfile } = tempAuth;

      // get role from request body
      const { role } = body;
      if (role !== "student" && role !== "viewer") {
        set.status = 400;
        return "Invalid role selected";
      }

      // create user profile in db
      const { data: newUser, error: newUserError } = await supabase
        .from("users") // in users table
        .insert({
          email: googleProfile.email,
          full_name: googleProfile.name,
          avatar_url: googleProfile.picture,
          role: role,
        })
        .select() // retrieve inserted data
        .single();

      if (newUserError) {
        console.error("error creating user:", newUserError);
        set.status = 500;
        return "Database error during user creation";
      }

      // create new auth identity specific to google for this user
      const { error: newIdentityError } = await supabase.from("auth_identities").insert({
        user_id: newUser.id,
        provider: "google",
        provider_id: googleProfile.sub,
      });

      if (newIdentityError) {
        // this could cause leftover data for users table, need to implement rollback, maybe use transaction in the future
        console.error("error creating identity:", newIdentityError);
        set.status = 500;
        return "Database error during identity creation";
      }

      // create session jwt for the new user
      const sessionToken = await session_jwt.sign({
        userId: newUser.id,
        role: newUser.role,
      });

      // then save to cookie
      cookie.session_token.set({
        value: sessionToken,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      // clean up temp jwt from cookie
      cookie.temp_token.remove();

      return { status: "success" };
    } catch (e) {
      console.error("Finalization error:", e);
      set.status = 500;
      return "An unexpected error occurred";
    }
  })
  // GET endpoint for getting profile data (protected)
  .get("/api/profile", async ({ session_jwt, cookie, set }) => {
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
  })
  // POST endpoint to facilitate logging out
  .post("/api/logout", ({ cookie, set }) => {
    // delete the session jwt from cookie
    cookie.session_token.remove();
    set.status = 200;
    return { status: "success" };
  });

if (process.env.NODE_ENV !== "test") {
  app.listen(8080);
  console.log(`Elysia is running at ${process.env.BACKEND_URL}`);
}
