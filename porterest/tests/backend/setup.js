import { mock } from "bun:test";

// this file will be preloaded with bun so server.js uses these mocks

// mock supabase
export const supabase = {
  from: mock(() => ({
    // from is a mock function that returns an object of mock functions
    select: mock().mockReturnThis(), // mockReturnThis will return the object itself, allows chaining
    insert: mock().mockReturnThis(),
    update: mock().mockReturnThis(),
    delete: mock().mockReturnThis(),
    eq: mock().mockReturnThis(),
    single: mock().mockResolvedValue({ data: null, error: null }), // mockResolvedValue will be the specified return value when this function is called
  })),
};

// intercept so @supabase/supabase-js imports in server.js will return a mock object instead
mock.module("@supabase/supabase-js", () => ({
  createClient: mock(() => supabase),
}));

// mock arctic
mock.module("arctic", () => ({
  Google: mock(() => ({
    validateAuthorizationCode: mock().mockResolvedValue({
      accessToken: () => "mock_access_token",
    }),
    createAuthorizationURL: mock(() => new URL("http://mock.google.auth.url/")),
  })),
  generateState: mock(() => "mock_state"),
  generateCodeVerifier: mock(() => "mock_code_verifier"),
}));
