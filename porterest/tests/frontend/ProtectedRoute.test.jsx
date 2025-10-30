import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProtectedRoute from "../../src/ProtectedRoute";
import { useAuth } from "../../src/AuthContext";

// mock '../../src/AuthContext' module to give a mock function useAuth
vi.mock("../../src/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// wrapper to provide router for <Navigate /> to work
function renderWithRouter(component) {
  return render(<BrowserRouter>{component}</BrowserRouter>);
}

describe("ProtectedRoute", () => {
  it("should show nothing when loading", () => {
    useAuth.mockReturnValue({ user: null, isLoading: true });

    const { container } = renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // since isLoading is true, then ProtectedRoute should return null
    expect(container.firstChild).toBeNull();
  });

  it("should redirect to login when not authenticated", () => {
    useAuth.mockReturnValue({ user: null, isLoading: false });

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // 'Navigate' redirects since user is null, so protected content won't render
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("should render children when authenticated", () => {
    useAuth.mockReturnValue({
      user: { email: "test@example.com" },
      isLoading: false,
    });

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // there is user, so the protected content should render
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
