import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignInForm } from "../auth/sign-in-form";

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

const mockSignInEmail = vi.fn();
const mockSignInSocial = vi.fn();

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: (...args: unknown[]) => mockSignInEmail(...args),
      social: (...args: unknown[]) => mockSignInSocial(...args),
    },
  },
}));

describe("SignInForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignInEmail.mockResolvedValue({ error: null });
    mockSignInSocial.mockResolvedValue({ error: null });
  });

  it("renders email and password fields", () => {
    render(<SignInForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders Google sign-in button", () => {
    render(<SignInForm />);

    expect(
      screen.getByRole("button", { name: /continue with google/i })
    ).toBeInTheDocument();
  });

  it("renders sign-in submit button", () => {
    render(<SignInForm />);

    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("does not submit with empty email", async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSignInEmail).not.toHaveBeenCalled();
    });
  });

  it("shows validation error for empty password", async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    expect(mockSignInEmail).not.toHaveBeenCalled();
  });

  it("calls signIn.email with form values on submit", async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSignInEmail).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("redirects to / on successful sign in", async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("shows error message on sign in failure", async () => {
    mockSignInEmail.mockResolvedValue({
      error: { message: "Invalid credentials" },
    });

    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("calls signIn.social for Google sign in", async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.click(
      screen.getByRole("button", { name: /continue with google/i })
    );

    expect(mockSignInSocial).toHaveBeenCalledWith({
      provider: "google",
      callbackURL: "/",
    });
  });
});
