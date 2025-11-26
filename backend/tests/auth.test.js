import { describe, it, expect, mock } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { app } from "../src/server";
import { supabase } from "./setup";

// see https://elysiajs.com/patterns/unit-test
// we pass an elysia instance o Eden Treaty to interact with Elysia server directly without actually sending network requests
const api = treaty(app);

// 'describe' groups tests
describe("Authentication Endpoints", () => {
  describe("GET /auth/google/url", () => {
    // 'it' creates one test
    it("should return a Google auth URL and set CSRF cookies", async () => {
      // make the api call (remember we mock arctic in setup.js too)
      const { data, response, error } = await api.auth.google.url.get();

      // check for successful response
      expect(response.status).toBe(200);
      expect(error).toBe(null);
      expect(data).not.toBe(null);

      // check for valid url from data
      expect(typeof data.url).toBe("string");
      expect(data.url).toBe("http://mock.google.auth.url/");

      // check that cookies were set properly
      const cookieHeader = response.headers.get("Set-Cookie") || "";
      expect(cookieHeader).toInclude("google_oauth_state=");
      expect(cookieHeader).toInclude("google_oauth_code_verifier=");
      expect(cookieHeader).toInclude("HttpOnly");
      expect(cookieHeader).toInclude("Path=/");
      expect(cookieHeader).toInclude("SameSite=Lax");
    });
  });

  describe("GET /auth/google/callback", () => {
    it("should return 400 if state is invalid", async () => {
      // simulate a case where state in cookie is different from state from query
      const storedState = "state_in_cookie";
      const queryState = "state_in_query";

      const { data, response, error } = await api.auth.google.callback.get({
        query: {
          code: "mock_code",
          state: queryState,
        },
        headers: {
          Cookie: `google_oauth_state=${storedState}`,
        },
      });

      // expect bad request
      expect(response.status).toBe(400);
      expect(data).toBe(null);
      expect(error.value).toBe("Invalid request");
    });

    it("should redirect to dashboard for an existing user", async () => {
      // mocks 'fetch' with a mock value
      global.fetch = mock().mockResolvedValue(
        new Response(
          JSON.stringify({
            sub: "google-123",
            name: "Existing User",
            email: "existing@test.com",
          })
        )
      );

      // mock supabase to return an existing user
      const mockUser = {
        id: "user-uuid-123",
        role: "student",
        email: "existing@test.com",
      };
      supabase.from.mockReturnValue({
        select: mock().mockReturnValue({
          eq: mock().mockReturnValue({
            eq: mock().mockReturnValue({
              single: mock().mockResolvedValue({
                data: { users: mockUser },
                error: null,
              }),
            }),
          }),
        }),
      });

      const { response } = await api.auth.google.callback.get({
        query: {
          code: "mock_code",
          state: "mock_state",
        },
        headers: {
          Cookie: `google_oauth_state=mock_state; google_oauth_code_verifier=mock_code_verifier`,
        },
      });

      // check redirect (302) to dashboard
      expect(response.status).toBe(302);
      expect(response.headers.get("Location")).toBe(`${process.env.FRONTEND_URL}/dashboard`);

      // check session_token cookie
      expect(response.headers.get("Set-Cookie")).toInclude("session_token=");
    });

    it("should redirect to finish-signup for a new user", async () => {
      // mocks 'fetch' with a mock value
      global.fetch = mock().mockResolvedValue(
        new Response(
          JSON.stringify({
            sub: "google-456",
            name: "New User",
            email: "new@test.com",
          })
        )
      );

      // mock supabase to return no user
      supabase.from.mockReturnValue({
        select: mock().mockReturnValue({
          eq: mock().mockReturnValue({
            eq: mock().mockReturnValue({
              single: mock().mockResolvedValue({
                data: null,
                error: { code: "PGRST116" },
              }),
            }),
          }),
        }),
      });

      const { response } = await api.auth.google.callback.get({
        query: {
          code: "mock_code",
          state: "mock_state",
        },
        headers: {
          Cookie: `google_oauth_state=mock_state; google_oauth_code_verifier=mock_code_verifier`,
        },
      });

      // check redirect (302) to finish-signup
      expect(response.status).toBe(302);
      expect(response.headers.get("Location")).toBe(`${process.env.FRONTEND_URL}/finish-signup`);
      // check session_token cookie
      expect(response.headers.get("Set-Cookie")).toInclude("temp_token=");
    });
  });

  describe("POST /api/register/google-finalize", () => {
    // helper function to get temp_token and set up mocks
    async function getTempToken(googleProfile) {
      // we mock fetch for the callback endpoint to return a mocked return value for a google profile
      global.fetch = mock().mockResolvedValue(new Response(JSON.stringify(googleProfile)));

      // this is the case where the user doesn't exist
      // so we mock supabase so user doesn't exist
      supabase.from.mockReturnValue({
        select: mock().mockReturnValue({
          eq: mock().mockReturnValue({
            eq: mock().mockReturnValue({
              single: mock().mockResolvedValue({
                data: null,
                error: { code: "PGRST116" },
              }),
            }),
          }),
        }),
      });

      // then we call callback endpoint, which should set a temp_token in cookie
      const response = await api.auth.google.callback.get({
        query: { code: "mock_code", state: "mock_state" },
        headers: {
          Cookie: `google_oauth_state=mock_state; google_oauth_code_verifier=mock_code_verifier`,
        },
      });

      const cookieHeader = response.response.headers.get("Set-Cookie");

      // return just the temp_token value
      return cookieHeader?.match(/temp_token=([^;]+)/)?.[1];
    }

    it("should return 401 if temp_token is missing or invalid", async () => {
      // if there is no cookie for temp_token
      const { response, error } = await api.api.register["google-finalize"].post({
        role: "student",
      });

      // check for unauthorized
      expect(response.status).toBe(401);
      expect(error.value).toBe("Unauthorized: Invalid temporary token");
    });

    it("should return 400 if role is invalid", async () => {
      const tempToken = await getTempToken({
        sub: "google-123",
        name: "Test User",
        email: "test@test.com",
      });

      const { response, error } = await api.api.register["google-finalize"].post(
        { role: "admin" },
        { headers: { Cookie: `temp_token=${tempToken}` } }
      );

      expect(response.status).toBe(400);
      expect(error.value).toBe("Invalid role selected");
    });

    it("should successfully create user with valid role and set session token", async () => {
      const tempToken = await getTempToken({
        sub: "google-student",
        name: "New User",
        email: "new@test.com",
        picture: "https://example.com/avatar.jpg",
      });

      // use mockImplementation to check which table is accessed
      // this mocks successful user creation in 'users' and 'auth_identities'
      supabase.from.mockImplementation((table) => {
        if (table === "users") {
          return {
            insert: mock().mockReturnValue({
              select: mock().mockReturnValue({
                single: mock().mockResolvedValue({
                  data: {
                    id: "new-user-uuid",
                    email: "new@test.com",
                    full_name: "New User",
                    role: "student",
                  },
                  error: null,
                }),
              }),
            }),
          };
        } else if (table === "auth_identities") {
          return {
            insert: mock().mockResolvedValue({ data: null, error: null }),
          };
        }
      });

      const { data, response } = await api.api.register["google-finalize"].post(
        { role: "student" },
        { headers: { Cookie: `temp_token=${tempToken}` } }
      );

      expect(response.status).toBe(200);
      expect(data).toEqual({ status: "success" });
      expect(response.headers.get("Set-Cookie")).toInclude("session_token=");
      expect(response.headers.get("Set-Cookie")).toInclude("HttpOnly");
    });

    it("should return 500 if database error occurs", async () => {
      const tempToken = await getTempToken({
        sub: "google-error",
        name: "Error User",
        email: "error@test.com",
      });

      // mock database failure
      supabase.from.mockReturnValue({
        insert: mock().mockReturnValue({
          select: mock().mockReturnValue({
            single: mock().mockResolvedValue({
              data: null,
              error: { message: "Database error" },
            }),
          }),
        }),
      });

      const { response, error } = await api.api.register["google-finalize"].post(
        { role: "student" },
        { headers: { Cookie: `temp_token=${tempToken}` } }
      );

      expect(response.status).toBe(500);
      expect(error.value).toBe("Database error during user creation");
    });
  });

  describe("GET /api/profile", () => {
    it("should return 401 if session token is missing or invalid", async () => {
      // call endpoint without session_token cookie
      const { response, error } = await api.api.profile.get();

      expect(response.status).toBe(401);
      expect(error.value).toBe("Unauthorized");
    });

    it("should return profile data with valid session token", async () => {
      // mock fetch for callback endpoint
      global.fetch = mock().mockResolvedValue(
        new Response(
          JSON.stringify({
            sub: "google-profile-test",
            name: "Profile User",
            email: "profile@test.com",
          })
        )
      );

      // mock supabase in case of existing user
      const mockUser = {
        id: "profile-user-id",
        email: "profile@test.com",
        full_name: "Profile User",
        role: "student",
      };

      supabase.from.mockReturnValue({
        select: mock().mockReturnValue({
          eq: mock().mockReturnValue({
            eq: mock().mockReturnValue({
              single: mock().mockResolvedValue({
                data: { users: mockUser },
                error: null,
              }),
            }),
          }),
        }),
      });

      // callback would set the session_token cookie
      const callbackResponse = await api.auth.google.callback.get({
        query: { code: "mock_code", state: "mock_state" },
        headers: {
          Cookie: `google_oauth_state=mock_state; google_oauth_code_verifier=mock_code_verifier`,
        },
      });

      const cookieHeader = callbackResponse.response.headers.get("Set-Cookie");
      const sessionToken = cookieHeader?.match(/session_token=([^;]+)/)?.[1];

      // mock profile fetch from db
      supabase.from.mockReturnValue({
        select: mock().mockReturnValue({
          eq: mock().mockReturnValue({
            single: mock().mockResolvedValue({
              data: { ...mockUser, created_at: "2024-01-01" },
              error: null,
            }),
          }),
        }),
      });

      // call endpoint
      const { data, response } = await api.api.profile.get({
        headers: { Cookie: `session_token=${sessionToken}` },
      });

      expect(response.status).toBe(200);
      expect(data.email).toBe("profile@test.com");
      expect(data.role).toBe("student");
    });
  });

  describe("POST /api/logout", () => {
    it("should return 200 and clear session token", async () => {
      const { data, response } = await api.api.logout.post();

      expect(response.status).toBe(200);
      expect(data).toEqual({ status: "success" });
    });
  });
});
 