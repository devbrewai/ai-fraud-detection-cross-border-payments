import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginPage } from "../auth/login-page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("next/image", () => ({
  default: (props: { alt: string; src: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={props.alt} src={props.src} />
  ),
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: vi.fn().mockResolvedValue({ error: null }),
      social: vi.fn().mockResolvedValue({ error: null }),
    },
    signUp: {
      email: vi.fn().mockResolvedValue({ error: null }),
    },
  },
}));

describe("LoginPage", () => {
  it("renders Sign in and Sign up tabs", () => {
    render(<LoginPage />);

    expect(screen.getByRole("tab", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /sign up/i })).toBeInTheDocument();
  });

  it("renders welcome heading", () => {
    render(<LoginPage />);

    expect(screen.getByText(/welcome to sentinel/i)).toBeInTheDocument();
  });

  it("renders Sentinel branding content", () => {
    render(<LoginPage />);

    expect(
      screen.getByText(/ai-powered fraud detection & sanctions screening/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Fraud detection")).toBeInTheDocument();
    expect(screen.getByText("Sanctions screening")).toBeInTheDocument();
    expect(screen.getByText("Sub-200ms latency")).toBeInTheDocument();
    expect(screen.getByText("Explainable AI")).toBeInTheDocument();
  });

  it("shows sign-in form by default", () => {
    render(<LoginPage />);

    expect(screen.getByRole("tab", { name: /sign in/i })).toHaveAttribute(
      "data-state",
      "active"
    );
    expect(
      screen.getByRole("button", { name: /^sign in$/i })
    ).toBeInTheDocument();
  });

  it("switches to sign-up form when Sign up tab is clicked", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole("tab", { name: /sign up/i }));

    expect(screen.getByRole("tab", { name: /sign up/i })).toHaveAttribute(
      "data-state",
      "active"
    );
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });
});
