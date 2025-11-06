import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FinishSignup from "../src/FinishSignup";

describe("FinishSignup", () => {
  // before each test
  beforeEach(() => {
    // set fetch to mock
    global.fetch = vi.fn();

    // delete window.location that can't be changed and create a new one
    delete window.location;
    window.location = { href: "" };

    // set backend url for env
    import.meta.env.VITE_BACKEND_URL = "http://localhost:8080";
  });

  afterEach(() => {
    // reset mocks after each test
    vi.restoreAllMocks();
  });

  it("should submit role and redirect on success", async () => {
    // mock successful fetch
    global.fetch.mockResolvedValueOnce({ ok: true });

    // render to 'screen'
    render(<FinishSignup />);

    // change role to viewer
    const select = screen.getByLabelText(/I am a/i);
    fireEvent.change(select, { target: { value: "viewer" } });

    // submit form
    const button = screen.getByRole("button", {
      name: /Complete Registration/i,
    });
    fireEvent.click(button);

    // check until fetch was called properly and redirect to dashboard happened
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/register/google-finalize",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "viewer" }),
        })
      );
      expect(window.location.href).toBe("/dashboard");
    });
  });

  it("should handle submission errors", async () => {
    // monitor console.error function, and make it do nothing so it doesn't spam test output
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // mock fetch to return failure
    global.fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => "Registration failed",
    });

    render(<FinishSignup />);

    const button = screen.getByRole("button", {
      name: /Complete Registration/i,
    });
    fireEvent.click(button);

    // wait until the error was logged
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Registration failed:", "Registration failed");
    });

    // restore the real console.error function
    consoleErrorSpy.mockRestore();
  });
});
