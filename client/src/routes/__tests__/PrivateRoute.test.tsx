import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import PrivateRoute from "@/routes/PrivateRoute";

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

const MockComponent = () => <div>Protected Component</div>;

describe("PrivateRoute", () => {
  beforeEach(() => jest.clearAllMocks());

  test("redirects to login if user is not authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
      logout: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={<PrivateRoute component={MockComponent} />}
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });

  test("renders the component if user is authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: "123", email: "test@example.com" },
      loading: false,
      isAuthenticated: true,
      logout: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={<PrivateRoute component={MockComponent} />}
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Protected Component/i)).toBeInTheDocument();
  });
});
