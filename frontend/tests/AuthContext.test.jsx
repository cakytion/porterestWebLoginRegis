import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../src/AuthContext";

// component for testing
function TestComponent() {
  // get auth context
  const { user, isLoading } = useAuth();

  // displays isLoading and user email
  return (
    <div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <div data-testid="user">{user ? user.email : "null"}</div>
    </div>
  );
}

describe("AuthContext", () => {
  // before each test
  beforeEach(() => {
    // replace fetch with a mock and set env for backend url
    global.fetch = vi.fn();
    import.meta.env.VITE_BACKEND_URL = "http://localhost:8080";
  });

  afterEach(() => {
    // clean up mocks after each test
    vi.restoreAllMocks();
  });

  it("should start with isLoading true, then check session", async () => {
    // mock fetch to backend to return a successful call with email with calling .json()
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ email: "test@example.com" }),
    });

    // wrap test component with authprovider, render to 'screen'
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // check loading
    expect(screen.getByTestId("loading").textContent).toBe("true");

    // wairFor keeps checking until loading is false and email is set without taking too long
    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
      expect(screen.getByTestId("user").textContent).toBe("test@example.com");
    });
  });

  it("should set user to null on failed session check", async () => {
    // mock fetch on session check failed
    global.fetch.mockResolvedValueOnce({ ok: false });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
      expect(screen.getByTestId("user").textContent).toBe("null");
    });
  });

  it("should handle fetch errors gracefully", async () => {
    // simulate fetch failed due to network error
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
      expect(screen.getByTestId("user").textContent).toBe("null");
    });
  });
});
