import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserMenu } from "../auth/user-menu";

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

const mockSignOut = vi.fn();
let mockSessionData: {
  data: { user: { name: string; email: string; image?: string | null } } | null;
  isPending: boolean;
};

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: () => mockSessionData,
    signOut: (...args: unknown[]) => mockSignOut(...args),
  },
}));

describe("UserMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignOut.mockResolvedValue(undefined);
    mockSessionData = {
      data: {
        user: {
          name: "John Doe",
          email: "john@example.com",
          image: null,
        },
      },
      isPending: false,
    };
  });

  it("renders nothing when session is loading", () => {
    mockSessionData = { data: null, isPending: true };
    const { container } = render(<UserMenu />);

    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when no session", () => {
    mockSessionData = { data: null, isPending: false };
    const { container } = render(<UserMenu />);

    expect(container.innerHTML).toBe("");
  });

  it("renders user initials when no image", () => {
    render(<UserMenu />);

    const button = screen.getByRole("button", { name: /user menu/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("JD");
  });

  it("renders user avatar when image is available", () => {
    mockSessionData.data!.user.image = "https://example.com/avatar.jpg";
    render(<UserMenu />);

    const avatar = screen.getByAltText("John Doe");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  it("shows popover with user info on click", async () => {
    const user = userEvent.setup();
    render(<UserMenu />);

    await user.click(screen.getByRole("button", { name: /user menu/i }));

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign out/i })
      ).toBeInTheDocument();
    });
  });

  it("calls signOut when sign out is clicked", async () => {
    const user = userEvent.setup();
    render(<UserMenu />);

    await user.click(screen.getByRole("button", { name: /user menu/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /sign out/i })
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /sign out/i }));

    expect(mockSignOut).toHaveBeenCalled();
  });
});
