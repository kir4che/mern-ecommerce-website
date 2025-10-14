import { render, screen, waitFor } from "@testing-library/react";
import AdminGate from "@/components/organisms/AdminGate";
import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/context/AlertContext";

const mockNavigate = jest.fn();
const mockLocation = { pathname: "/admin" };

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/context/AlertContext", () => ({
  useAlert: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;
const mockUseAlert = useAlert as jest.Mock;
const mockShowAlert = jest.fn();

describe("AdminGate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockReset();
    mockShowAlert.mockReset();
    mockUseAlert.mockReturnValue({ showAlert: mockShowAlert });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  test("renders loading indicator while auth is loading", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      isAuthenticated: false,
    });

    render(
      <AdminGate>
        <div>Admin Content</div>
      </AdminGate>,
    );

    expect(screen.getByTestId("loading-container")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("redirects unauthenticated users to login", async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
    });

    render(
      <AdminGate>
        <div>Admin Content</div>
      </AdminGate>,
    );

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/login", {
        replace: true,
        state: { from: mockLocation },
      }),
    );
    expect(mockShowAlert).not.toHaveBeenCalled();
  });

  test("blocks non-admin users and navigates home after showing alert", () => {
    jest.useFakeTimers();

    mockUseAuth.mockReturnValue({
      user: { email: "user@example.com", role: "user" },
      loading: false,
      isAuthenticated: true,
    });

    render(
      <AdminGate>
        <div>Admin Content</div>
      </AdminGate>,
    );

    expect(mockShowAlert).toHaveBeenCalledWith({
      variant: "error",
      message: "沒有權限進入此頁面！",
      dismissTimeout: 1500,
    });
    expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();

    jest.advanceTimersByTime(750);

    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  test("renders children for authenticated admin users", () => {
    mockUseAuth.mockReturnValue({
      user: { email: "admin@example.com", role: "admin" },
      loading: false,
      isAuthenticated: true,
    });

    render(
      <AdminGate>
        <div>Admin Content</div>
      </AdminGate>,
    );

    expect(screen.getByText("Admin Content")).toBeInTheDocument();
    expect(mockShowAlert).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
