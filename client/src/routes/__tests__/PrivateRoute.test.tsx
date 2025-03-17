import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { useAuth } from "@/context/AuthContext";
import PrivateRoute from "@/routes/PrivateRoute";

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const MockComponent = () => <div>Protected Component</div>;

describe("PrivateRoute", () => {
  beforeEach(() => jest.clearAllMocks());

  test("redirects to login if user is not authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, logout: jest.fn() });

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
      user: { id: "123" },
      logout: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={<PrivateRoute component={MockComponent} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Protected Component/i)).toBeInTheDocument();
  });
});
