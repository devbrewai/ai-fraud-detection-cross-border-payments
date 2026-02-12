import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignUpForm } from "../auth/sign-up-form";

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

const mockSignUpEmail = vi.fn();
const mockSignInSocial = vi.fn();

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signUp: {
      email: (...args: unknown[]) => mockSignUpEmail(...args),
    },
    signIn: {
      social: (...args: unknown[]) => mockSignInSocial(...args),
    },
  },
}));

describe("SignUpForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignUpEmail.mockResolvedValue({ error: null });
    mockSignInSocial.mockResolvedValue({ error: null });
  });

  it("renders name, email, and password fields", () => {
    render(<SignUpForm />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders Google sign-up button", () => {
    render(<SignUpForm />);

    expect(
      screen.getByRole("button", { name: /continue with google/i })
    ).toBeInTheDocument();
  });

  it("renders create account button", () => {
    render(<SignUpForm />);

    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });

  it("shows validation error for short name", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/full name/i), "A");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/name must be at least 2 characters/i)
      ).toBeInTheDocument();
    });

    expect(mockSignUpEmail).not.toHaveBeenCalled();
  });

  it("shows validation error for short password", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/full name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "short");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument();
    });

    expect(mockSignUpEmail).not.toHaveBeenCalled();
  });

  it("calls signUp.email with form values on submit", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/full name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockSignUpEmail).toHaveBeenCalledWith({
        name: "John Doe",
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("redirects to / on successful sign up", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/full name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("shows error message on sign up failure", async () => {
    mockSignUpEmail.mockResolvedValue({
      error: { message: "Email already exists" },
    });

    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/full name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
